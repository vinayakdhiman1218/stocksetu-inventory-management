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
    """Say a slow rate like a shopkeeper would: 'har 2 din me ~1 piece'."""
    if rate <= 0.01:
        return "abhi clear nahi"
    singular = unit[:-1] if unit.endswith("s") else unit
    if rate < 1:
        per_day = max(1, round(1 / rate))
        word = unit if per_day > 1 else singular
        return f"har ~{per_day} din me 1 {word}"
    return f"~{rate:.1f} {unit} roz"


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
        warnings.append("Stock khatam ho chuka hai. Sale ruk sakta hai.")
    elif quantity <= min_stock:
        warnings.append(f"Sirf {quantity} {unit} bache hain — reorder level ({min_stock}) ke neeche.")

    if stock_days_left is not None and stock_days_left <= 15 and quantity > 0:
        warnings.append(f"Aag ki maang ke hisaab se stock ~{int(stock_days_left)} din ka hai.")

    if cost_price > 0 and selling_price < cost_price:
        warnings.append(
            f"Bechne ka daam ({_amount_inr(selling_price)}) kharid price ({_amount_inr(cost_price)}) se kam hai — har piece par loss."
        )
    elif margin_pct is not None and margin_pct < 10:
        warnings.append(f"Fayda margin sirf {margin_pct:.0f}% hai — dhamaka kam ho sakta hai.")
    if cost_price == 0:
        warnings.append("Kharid price record nahi hai — margin sahi nahi nikal payega.")
    if selling_price == 0:
        warnings.append("Bechne ka daam set nahi hai — invoice ke time confusion ho sakti hai.")
    if sold_30d > 0 and sold_7d / 7 > 2 * (sold_30d / 30):
        warnings.append("Pichle 7 din ki maang pichle 30 din se double hai — thoda zyada bacha lena theek rahega.")
    if not sales and quantity > 0:
        warnings.append("Is product ka koi bikri record nahi mila — salah me thoda sandeh ho sakta hai.")

    verdict_text = {
        "out_of_stock": ("Out of stock", "low"),
        "no_demand": ("Abhi maang nahi", ""),
        "reorder_now": ("Aaj order karo", "low"),
        "buy_this_month": ("Is mahine kharido", "low"),
        "overstock": ("Zyada stock hai", ""),
        "healthy": ("Stock theek hai", ""),
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
    parts = [f"{name}: abhi {ctx['quantity']} {unit} stock me hain."]
    if ctx["dates_available"]:
        if ctx["sold_30d"] or ctx["sold_7d"]:
            parts.append(
                f"Pichle 30 din me {ctx['sold_30d']} {unit} biki"
                + (f" (7 din me {ctx['sold_7d']})" if ctx["sold_7d"] else "")
                + "."
            )
        else:
            parts.append("Pichle 30 din me bikri record nahi mili.")
    else:
        parts.append(f"Ab tak total {ctx['total_sold']} {unit} biki hain.")
    if rate > 0.01:
        parts.append(f"Maang {_rate_text(rate, unit)}.")
        if days_left is not None:
            parts.append(f"Is tarah se stock ~{int(round(days_left))} din chalega.")
    parts.append(f"Verdict: {ctx['verdict_text']}.")
    return " ".join(parts)


def _build_advice(**ctx):
    verdict = ctx["verdict"]
    unit = ctx["unit"]
    rate = ctx["daily_rate"]
    lines = []
    if verdict == "out_of_stock":
        lines.append("Aaj hi supplier ko order kar do — bikri ruk sakti hai.")
    elif verdict == "no_demand":
        lines.append("Abhi kharidne ki koi jaldi nahi. Pehle thodi bikri record karo.")
    elif verdict == "reorder_now":
        lines.append(f"Order abhi karo: {ctx['suggested_order']} {unit} safe rehta hai.")
    elif verdict == "buy_this_month":
        lines.append(f"Is mahine ke andar {ctx['suggested_order']} {unit} order kar dena behtar rahega.")
    elif verdict == "overstock":
        lines.append("Filhaal naya stock nahi — pehle ye zyada maal bikwao.")
    else:
        lines.append("Stock level theek hai. 45 din ke hisaab se agla order plan karo.")

    if rate > 0.01:
        lines.append(f"Agle mahine ki expected maang ~{ctx['monthly_forecast']} {unit}.")
    if ctx["margin_pct"] is not None:
        sign = "+" if ctx["margin_per_piece"] >= 0 else ""
        lines.append(f"Har piece par {sign}{_amount_inr(ctx['margin_per_piece'])} fayda ({ctx['margin_pct']:.0f}%).")
    if not ctx["dates_available"] and ctx["total_purchased"]:
        lines.append(f"Record ke mutabiq ab tak {ctx['total_purchased']} {unit} kharida gaya hai.")
    return lines


def ask(question, analysis):
    """Route a shopkeeper's Hinglish question to the right part of the analysis."""
    q = (question or "").strip().lower()

    if any(word in q for word in ("galti", "galat", "problem", "mistake", "warning", "issue", "dhyan", "check", "sahi")):
        if analysis["warnings"]:
            return "Dhyaan dein:\n" + "\n".join(f"- {line}" for line in analysis["warnings"])
        return f"Badhiya! {analysis['name']} ke records me abhi koi badi galti nahi dikhti. Stock level {analysis['verdict_label'].lower()} hai."

    if any(word in q for word in ("khatam", "kab", "kitne din", "sell", "bik", "bach", "expire", "kab tak")):
        days = analysis["stock_days_left"]
        rate = analysis["daily_rate"]
        if days is None:
            return f"{analysis['name']} ka abhi reliable demand nahi pata — pehle kuch bikri record karo. Abhi stock {analysis['quantity']} {analysis['unit']} hai."
        return (
            f"{analysis['name']}: {analysis['quantity']} {analysis['unit']} bache aur maang {_rate_text(rate, analysis['unit'])}. "
            f"Matlab stock ~{days} din chalega. Uske baad reorder zaroori ho jayega."
        )

    if any(word in q for word in ("kharid", "purchase", "order", "mahin", "month", "reorder", "replenish", "buy")):
        return (
            f"{analysis['name']} ke liye salah: abhi {analysis['quantity']} {analysis['unit']} hain. "
            f"{analysis['verdict_label']}"
            + (f" — suggested order {analysis['suggested_order']} {analysis['unit']}." if analysis["suggested_order"] else ".")
            + " Poora readout niche hai."
        )

    if any(word in q for word in ("margin", "profit", "fayda", "kamai", "price", "daam", "rate")):
        if analysis["margin_pct"] is None:
            return "Margin nahi nikal paya — product me kharid price ya bechne ka daam missing hai. Wo pehle set kar do."
        return (
            f"{analysis['name']} par har piece {_amount_inr(analysis['margin_per_piece'])} fayda hai "
            f"(~{analysis['margin_pct']:.0f}% margin). Bechne ka daam vs kharid price check kar lena."
        )

    return analysis["summary"] + ("\n" + "\n".join(f"- {line}" for line in analysis["advice"]) if analysis["advice"] else "")
