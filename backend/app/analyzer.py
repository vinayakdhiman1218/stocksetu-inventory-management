"""StockSathi: rule-based inventory advisor built on real records.

No external calls. Every number comes from the shop's own product, sale and
purchase rows, so the advice stays grounded in what actually happened.
"""

from datetime import datetime, timedelta, timezone
import math


def _now():
    return datetime.now(timezone.utc)


def _normalise(value):
    """SQLite hands back naive datetimes; treat them as UTC."""
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _number(value):
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def _amount_inr(value):
    return f"\u20b9{round(_number(value)):,}"


def _rate_text(rate, unit):
    """Say a slow rate plainly: 'about 1 piece every 2 days'."""
    if rate <= 0.01:
        return "not clear yet"
    singular = unit[:-1] if unit.endswith("s") else unit
    if rate < 1:
        per_day = max(1, round(1 / rate))
        return f"about 1 {singular} every {per_day} day{'s' if per_day != 1 else ''}"
    return f"about {rate:.1f} {unit} per day"


def _dated_quantity(rows, attr="created_at"):
    """[(datetime, quantity)] pairs with a usable timestamp."""
    pairs = []
    for row in rows:
        when = _normalise(getattr(row, attr, None))
        if when is not None:
            pairs.append((when, _number(getattr(row, "quantity", 0))))
    return pairs


def _window_quantity(pairs, days, now):
    cutoff = now - timedelta(days=days)
    return sum(qty for when, qty in pairs if when >= cutoff)


def _daily_rate(pairs, days, now):
    return _window_quantity(pairs, days, now) / days


def analyze_product(product, sales, purchases):
    """Build the full StockSathi read on one product.

    `sales`/`purchases` are rows already scoped to the owner and product.
    """
    now = _now()
    quantity = int(_number(getattr(product, "quantity", 0)))
    min_stock = int(_number(getattr(product, "min_stock", 0) or 0))
    unit = getattr(product, "unit", "pieces") or "pieces"
    name = getattr(product, "name", "Product")
    sku = getattr(product, "sku", "") or ""
    cost_price = _number(getattr(product, "cost_price", 0))
    selling_price = _number(getattr(product, "selling_price", 0))

    sales = list(sales or [])
    purchases = list(purchases or [])

    total_sold = int(sum(_number(getattr(sale, "quantity", 0)) for sale in sales))
    total_purchased = int(sum(_number(getattr(purchase, "quantity", 0)) for purchase in purchases))

    sale_pairs = _dated_quantity(sales)
    purchase_pairs = _dated_quantity(purchases)
    dates_available = bool(sale_pairs or purchase_pairs)

    sold_7d = int(_window_quantity(sale_pairs, 7, now))
    sold_30d = int(_window_quantity(sale_pairs, 30, now))

    # Fallback rate when timestamps are missing (older records): spread total
    # sales over the time the product has existed, capped to a sane window.
    fallback_rate = 0.0
    if total_sold > 0 and not sale_pairs:
        created = _normalise(getattr(product, "created_at", None))
        span_days = max(1, (now - created).days + 1) if created else 30
        span_days = min(span_days, 90)
        fallback_rate = total_sold / span_days

    daily_rate = (_daily_rate(sale_pairs, 30, now) if sale_pairs else 0.0)
    if daily_rate <= 0:
        daily_rate = fallback_rate

    monthly_forecast = daily_rate * 30
    stock_days_left = quantity / daily_rate if daily_rate > 0.01 else None
    target_days = 45
    desired = max(monthly_forecast * (target_days / 30), min_stock * 2)
    suggested_order = max(0, int(math.ceil(desired - quantity))) if daily_rate > 0.01 else 0

    margin_per_piece = selling_price - cost_price
    margin_pct = (margin_per_piece / cost_price * 100) if cost_price > 0 else None

    warnings = []
    if quantity <= 0:
        verdict = "out_of_stock"
    elif daily_rate <= 0.01:
        verdict = "no_demand"
    elif stock_days_left is not None and stock_days_left <= 15:
        verdict = "reorder_now"
    elif stock_days_left is not None and stock_days_left <= 45:
        verdict = "buy_this_month"
    elif stock_days_left is not None and stock_days_left >= 90 and quantity > monthly_forecast * 2.5:
        verdict = "overstock"
    else:
        verdict = "healthy"

    if quantity <= 0:
        warnings.append("Stock is finished. Sales may stop.")
    elif quantity <= min_stock:
        warnings.append(f"Only {quantity} {unit} left — below the reorder level ({min_stock}).")

    if stock_days_left is not None and stock_days_left <= 15 and quantity > 0:
        warnings.append(f"At current demand, stock will last about {int(stock_days_left)} days.")

    if cost_price > 0 and selling_price < cost_price:
        warnings.append(
            f"Selling price ({_amount_inr(selling_price)}) is below the purchase price ({_amount_inr(cost_price)}) — a loss on every piece."
        )
    elif margin_pct is not None and margin_pct < 10:
        warnings.append(f"Profit margin is only {margin_pct:.0f}% — there is little room to discount.")
    if cost_price == 0:
        warnings.append("Purchase price is missing — margin cannot be calculated correctly.")
    if selling_price == 0:
        warnings.append("Selling price is not set — this can cause confusion while billing.")
    if sold_30d > 0 and sold_7d / 7 > 2 * (sold_30d / 30):
        warnings.append("Demand in the last 7 days is double the 30-day average — keep a little extra in stock.")
    if not sales and quantity > 0:
        warnings.append("No sales recorded for this product yet — the advice may be less reliable.")

    verdict_text = {
        "out_of_stock": ("Out of stock", "low"),
        "no_demand": ("No demand yet", ""),
        "reorder_now": ("Order today", "low"),
        "buy_this_month": ("Buy this month", "low"),
        "overstock": ("Overstocked", ""),
        "healthy": ("Stock is healthy", ""),
    }[verdict]

    advice = _build_advice(
        verdict=verdict,
        name=name,
        unit=unit,
        quantity=quantity,
        daily_rate=daily_rate,
        stock_days_left=stock_days_left,
        monthly_forecast=monthly_forecast,
        suggested_order=suggested_order,
        sold_30d=sold_30d,
        sold_7d=sold_7d,
        total_sold=total_sold,
        total_purchased=total_purchased,
        cost_price=cost_price,
        selling_price=selling_price,
        margin_per_piece=margin_per_piece,
        margin_pct=margin_pct,
        dates_available=dates_available,
    )

    summary = _build_summary(
        name=name,
        sku=sku,
        unit=unit,
        quantity=quantity,
        daily_rate=daily_rate,
        stock_days_left=stock_days_left,
        sold_30d=sold_30d,
        sold_7d=sold_7d,
        total_sold=total_sold,
        total_purchased=total_purchased,
        dates_available=dates_available,
        verdict_text=verdict_text[0],
    )

    return {
        "name": name,
        "sku": sku,
        "unit": unit,
        "quantity": quantity,
        "min_stock": min_stock,
        "total_sold": total_sold,
        "total_purchased": total_purchased,
        "sold_7d": sold_7d,
        "sold_30d": sold_30d,
        "daily_rate": round(daily_rate, 2),
        "monthly_forecast": int(round(monthly_forecast)),
        "stock_days_left": int(round(stock_days_left)) if stock_days_left is not None else None,
        "suggested_order": suggested_order,
        "margin_per_piece": round(margin_per_piece, 2),
        "margin_pct": round(margin_pct, 1) if margin_pct is not None else None,
        "verdict": verdict,
        "verdict_label": verdict_text[0],
        "verdict_tone": verdict_text[1],
        "summary": summary,
        "advice": advice,
        "warnings": warnings,
        "dates_available": dates_available,
    }


def _build_summary(**ctx):
    name = ctx["name"]
    unit = ctx["unit"]
    rate = ctx["daily_rate"]
    days_left = ctx["stock_days_left"]
    parts = [f"{name}: {ctx['quantity']} {unit} in stock right now."]
    if ctx["dates_available"]:
        if ctx["sold_30d"] or ctx["sold_7d"]:
            parts.append(
                f"{ctx['sold_30d']} {unit} sold in the last 30 days"
                + (f" ({ctx['sold_7d']} in the last 7 days)" if ctx["sold_7d"] else "")
                + "."
            )
        else:
            parts.append("No sales recorded in the last 30 days.")
    else:
        parts.append(f"{ctx['total_sold']} {unit} sold so far in total.")
    if rate > 0.01:
        parts.append(f"Demand is {_rate_text(rate, unit)}.")
        if days_left is not None:
            parts.append(f"At this rate, stock will last about {int(round(days_left))} days.")
    parts.append(f"Verdict: {ctx['verdict_text']}.")
    return " ".join(parts)


def _build_advice(**ctx):
    verdict = ctx["verdict"]
    unit = ctx["unit"]
    rate = ctx["daily_rate"]
    lines = []
    if verdict == "out_of_stock":
        lines.append("Order from your supplier today — sales may stop otherwise.")
    elif verdict == "no_demand":
        lines.append("There is no rush to buy. Record a few sales first.")
    elif verdict == "reorder_now":
        lines.append(f"Order now: {ctx['suggested_order']} {unit} keeps you safe.")
    elif verdict == "buy_this_month":
        lines.append(f"It is better to order {ctx['suggested_order']} {unit} within this month.")
    elif verdict == "overstock":
        lines.append("Do not buy new stock yet — sell down the extra stock first.")
    else:
        lines.append("Stock level is fine. Plan the next order for the coming 45 days.")

    if rate > 0.01:
        lines.append(f"Expected demand next month is about {ctx['monthly_forecast']} {unit}.")
    if ctx["margin_pct"] is not None:
        sign = "+" if ctx["margin_per_piece"] >= 0 else ""
        lines.append(f"Profit of {sign}{_amount_inr(ctx['margin_per_piece'])} per piece ({ctx['margin_pct']:.0f}%).")
    if not ctx["dates_available"] and ctx["total_purchased"]:
        lines.append(f"Records show {ctx['total_purchased']} {unit} purchased so far.")
    return lines


OWNER_DEFAULT = "Vinayak Dhiman"


def converse(question, owner_name=OWNER_DEFAULT, product_count=0):
    """Handle normal chatbot small talk."""
    q = (question or "").strip().lower()
    if not q:
        return None

    greetings = {"hey", "hi", "hello", "namaste", "hii", "hiii", "hey there", "hello there", "yo", "hola", "नमस्ते", "हाय", "हेलो"}
    if q in greetings or q.startswith("hey ") or q.startswith("hi ") or q.startswith("hello ") or q.startswith("namaste"):
        return (
            f"Hey! I am StockSathi — the AI assistant for {owner_name}'s shop. "
            "Type a product name and I will answer from its stock, purchase and sales records."
        )

    if any(phrase in q for phrase in ("how are you", "kaise ho", "kya haal", "how r u", "how are u", "कैसे हो", "क्या हाल")):
        return "I am doing well! I am ready to read your records. What would you like to ask?"

    if any(phrase in q for phrase in ("your name", "tumhara naam", "who are you", "kaun ho", "what are you", "tu kaun", "तुम्हारा नाम", "कौन हो", "तू कौन")):
        return f"I am StockSathi — the AI assistant for {owner_name}'s shop. My job is to give advice from your inventory records."

    if any(phrase in q for phrase in ("owner", "malik", "shop owner", "owner name", "malik ka naam", "मालिक", "owner")):
        return f"The owner of this shop is {owner_name}."

    if any(phrase in q for phrase in ("help", "kya kar", "what can", "capabilities", "madad", "sahayata", "मदद", "क्या कर")):
        return (
            "I can tell you how long a product's stock will last, whether to buy this month, "
            "its margin, any mistakes, and a reorder suggestion. Type a product name and ask, "
            "for example 'Tell me about the Cotton Shirt'."
        )

    if q in {"thanks", "thank you", "shukriya", "dhanyavad", "thank u", "thx", "धन्यवाद", "शुक्रिया"}:
        return "Happy to help! Ask me anything else whenever you need."

    if q in {"bye", "goodbye", "alvida", "exit", "quit", "band karo", "बाय", "अलविदा"}:
        return "Bye! Take care of the shop. See you again."

    if any(phrase in q for phrase in ("who made you", "kisne banaya", "creator", "developer", "किसने बनाया", "creator")):
        return f"I was built for {owner_name} — StockSathi, the AI assistant inside StockSetu."

    return None


def ask(question, analysis, owner_name=OWNER_DEFAULT):
    """Route a shopkeeper's question to the right part of the analysis.

    Keywords accept both English and Hindi/Hinglish input, but every answer is
    written in English.
    """
    q = (question or "").strip().lower()

    # Mistakes / warnings
    if any(word in q for word in ("galti", "galat", "problem", "mistake", "warning", "issue", "dhyan", "check", "sahi", "गलती", "समस्या", "ध्यान")):
        if analysis["warnings"]:
            return "Please note:\n" + "\n".join(f"- {line}" for line in analysis["warnings"])
        return f"Good news! No major issues in {analysis['name']}'s records right now. Stock level is {analysis['verdict_label'].lower()}."

    # Stock duration
    if any(word in q for word in ("khatam", "kab", "kitne din", "sell", "bik", "bach", "expire", "kab tak", "last", "how long", "खत्म", "कब", "कितने दिन", "बिक", "बच")):
        days = analysis["stock_days_left"]
        rate = analysis["daily_rate"]
        if days is None:
            return f"{analysis['name']} has no reliable demand yet — record a few sales first. Current stock is {analysis['quantity']} {analysis['unit']}."
        return (
            f"{analysis['name']}: {analysis['quantity']} {analysis['unit']} left and demand is {_rate_text(rate, analysis['unit'])}. "
            f"That means stock will last about {days} days. After that a reorder will be necessary."
        )

    # Buy / reorder
    if any(word in q for word in ("kharid", "purchase", "order", "mahin", "month", "reorder", "replenish", "buy", "खरीद", "ऑर्डर", "महीना", "reorder")):
        return (
            f"Advice for {analysis['name']}: {analysis['quantity']} {analysis['unit']} in stock. "
            f"{analysis['verdict_label']}"
            + (f" — suggested order {analysis['suggested_order']} {analysis['unit']}." if analysis["suggested_order"] else ".")
            + " The full readout is below."
        )

    # Margin / price
    if any(word in q for word in ("margin", "profit", "fayda", "kamai", "price", "daam", "rate", "मार्जिन", "profit", "फायदा", "कमाई", "दाम", "कीमत")):
        if analysis["margin_pct"] is None:
            return "Margin could not be calculated — the purchase price or selling price is missing. Please set both first."
        return (
            f"{analysis['name']} earns {_amount_inr(analysis['margin_per_piece'])} profit per piece "
            f"(~{analysis['margin_pct']:.0f}% margin). Check the selling price against the purchase price."
        )

    return analysis["summary"] + ("\n" + "\n".join(f"- {line}" for line in analysis["advice"]) if analysis["advice"] else "")
