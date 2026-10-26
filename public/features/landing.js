/* landing feature module. */
function brandPageHome() {
  root.innerHTML = `
    <div class="scroll-progress" aria-hidden="true"></div>
    <header class="launch-nav"><div class="launch-nav-inner">${brand()}
      <nav class="nav-links" id="site-nav" aria-label="Main navigation"><a href="#capabilities">What you can do</a><a href="#workflow">How it works</a><a href="#why-stocksetu">Why StockSetu</a></nav>
      <div class="launch-actions"><button class="launch-theme" id="home-theme-toggle" type="button" aria-label="Switch to ${document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'} mode" aria-pressed="${document.documentElement.dataset.theme === 'dark'}">${icon(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon')}</button><a class="launch-login" href="#/login">Log in</a><a class="launch-cta" href="#/register">Get started ${icon('arrow')}</a><button class="menu-toggle" id="menu-toggle" aria-label="Open navigation">${icon('menu')}</button></div>
    </div></header>
    <main class="launch-page">
      <section class="hero launch-hero"><div class="launch-grain" aria-hidden="true"></div><div class="launch-hero-inner container">
        <div class="launch-copy"><div class="launch-kicker"><i></i> A clearer way to run your shop</div>
          <h1>Know your stock.<br><em>Own your day.</em></h1>
          <p>Purchases, sales, invoices and stock in one calm workspace. See what needs attention and get back to running your business.</p>
          <div class="launch-hero-actions"><a class="launch-primary" href="#/register">Create your workspace ${icon('arrow')}</a><a class="launch-secondary" href="#capabilities">Explore StockSetu <span>↓</span></a></div>
          <div class="launch-caption"><span class="launch-caption-mark">${icon('check')}</span><span>Set up in minutes <i>·</i> Keep your daily records together</span></div>
        </div>
        <div class="hero-art launch-scene" aria-label="Illustration of the StockSetu business dashboard">
          <div class="launch-halo" aria-hidden="true"></div><div class="launch-orbit launch-orbit-one" aria-hidden="true"></div><div class="launch-orbit launch-orbit-two" aria-hidden="true"></div>
          <div class="launch-window"><div class="launch-window-top"><div class="launch-window-brand"><i>${icon('mark')}</i><b>stocksetu</b></div><div class="launch-window-path"><span>Workspace</span>${icon('chevron')}<b>Overview</b></div><div class="launch-window-avatar">${initials('Vinayak')}</div></div>
            <div class="launch-window-body"><div class="launch-dash-heading"><div><small>${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long' }).toUpperCase()}</small><h2>Good morning, Vinayak <span>✳</span></h2><p>Here’s your business at a glance.</p></div><a href="#/login" class="launch-date">This week ${icon('chevron')}</a></div>
              <div class="launch-metrics"><article><span>Sales recorded</span><strong>—</strong><small>No sales recorded yet</small></article><article><span>Products added</span><strong>—</strong><small>Your inventory appears here</small></article><article><span>Outstanding balance</span><strong>—</strong><small>Updates from your records</small></article></div>
              <div class="launch-dash-lower"><div class="launch-sales-panel"><div class="launch-panel-head"><span><b>Sales overview</b><small>Trend appears after your first sale</small></span></div><div class="launch-empty-chart"><div class="empty-chart-grid"><i></i><i></i><i></i></div><span>${icon('chart')}<b>Your sales chart will appear here</b><small>Record a sale to start building your overview.</small></span></div></div>
                <div class="launch-stock-panel"><div class="launch-panel-head"><span><b>Your inventory</b><small>Products you add will appear here</small></span></div><div class="launch-empty-stock"><i>${icon('box')}</i><b>No products added yet</b><small>Add products in your workspace to see stock levels.</small><a href="#/login">Open workspace ${icon('arrow')}</a></div></div></div>
              <div class="launch-window-foot"><span><i></i> Workspace preview</span><span>StockSetu · Inventory and daily accounts</span></div>
            </div>
          </div><div class="launch-float launch-float-left"><i>${icon('receipt')}</i><span><b>Your records</b><small>Ready when you are</small></span><strong>✓</strong></div><div class="launch-float launch-float-right"><i>${icon('box')}</i><span><b>Start with products</b><small>Add stock to your workspace</small></span></div>
        </div>
      </div><div class="launch-scroll-cue"><span></span> SCROLL TO EXPLORE</div></section>
      <section class="launch-capabilities" id="capabilities"><div class="container"><div class="launch-section-intro reveal"><span class="launch-overline">One workspace, all in sync</span><h2>Everything your shop needs.<br><em>Nothing in your way.</em></h2><p>Small daily tasks add up. Keep the moving parts connected and easy to find.</p></div>
        <div class="launch-bento"><article class="launch-bento-card launch-inventory reveal"><div class="launch-card-top"><span class="launch-icon mint">${icon('box')}</span><span class="launch-index">01 / INVENTORY</span></div><h3>Know what’s on the shelf.</h3><p>See quantities, prices and low-stock items without digging through old notes.</p><div class="launch-mini-empty"><i>${icon('box')}</i><b>Your product list starts here</b><small>Add products to keep stock levels in view.</small><a href="#/login">Open inventory ${icon('arrow')}</a></div></article>
          <article class="launch-bento-card launch-billing reveal"><div class="launch-card-top"><span class="launch-icon peach">${icon('receipt')}</span><span class="launch-index">02 / SALES</span></div><h3>Billing that stays tidy.</h3><p>Create an invoice, record payments and find the details later.</p><div class="launch-invoice-art"><div class="invoice-paper"><div class="invoice-paper-top"><i>${icon('mark')}</i><span>INVOICE PREVIEW</span></div><div class="invoice-lines"><i></i><i></i><i></i></div><div class="invoice-paper-total"><span>Your invoice total</span><b>—</b></div></div></div></article>
          <article class="launch-bento-card launch-purchases reveal"><div class="launch-card-top"><span class="launch-icon lavender">${icon('truck')}</span><span class="launch-index">03 / PURCHASES</span></div><h3>Purchases flow into stock.</h3><p>Keep supplier orders and incoming quantities connected to your inventory.</p><div class="launch-flow"><span>Supplier</span><i>${icon('arrow')}</i><span>Purchase</span><i>${icon('arrow')}</i><span>Stock</span></div></article>
          <article class="launch-bento-card launch-insights reveal"><div class="launch-card-top"><span class="launch-icon blue">${icon('chart')}</span><span class="launch-index">04 / REPORTS</span></div><h3>A clearer view of the day.</h3><p>Understand sales, pending balances and products that need attention.</p><div class="launch-insight-empty"><i>${icon('chart')}</i><b>Reports grow with your records</b><small>Record sales to see your business trends.</small></div></article>
        </div></div></section>
      <section class="launch-workflow" id="workflow"><div class="container launch-workflow-grid"><div class="launch-workflow-copy reveal"><span class="launch-overline">Simple from the first day</span><h2>Start with what you have.<br><em>Grow from there.</em></h2><p>Add your products, record the day as it happens, and use one clear view to decide what comes next.</p><a class="launch-text-link" href="#/register">Set up your workspace ${icon('arrow')}</a></div><div class="launch-steps"><article class="launch-step reveal"><span>01</span><i>${icon('tag')}</i><div><h3>Add your products</h3><p>Bring in names, prices and what’s already on your shelves.</p></div><b>→</b></article><article class="launch-step reveal"><span>02</span><i>${icon('receipt')}</i><div><h3>Record sales and purchases</h3><p>Keep stock and daily transactions moving together.</p></div><b>→</b></article><article class="launch-step reveal"><span>03</span><i>${icon('spark')}</i><div><h3>See what needs attention</h3><p>Check today’s sales, balances and restock reminders.</p></div><b>✓</b></article></div></div></section>
      <section class="launch-why" id="why-stocksetu"><div class="container launch-why-card reveal"><div class="launch-why-orb" aria-hidden="true"><span>${icon('mark')}</span><i class="why-ring ring-a"></i><i class="why-ring ring-b"></i><i class="why-ring ring-c"></i></div><div class="launch-why-copy"><span class="launch-overline">Made for everyday business</span><h2>Less searching.<br><em>More certainty.</em></h2><p>StockSetu brings the important details closer, so your records are easier to keep up with and easier to trust.</p><div class="launch-why-points"><span>${icon('check')} A clear home for daily records</span><span>${icon('check')} Helpful stock reminders</span><span>${icon('check')} Your business, at a glance</span></div></div><div class="launch-why-glass">${icon('check')}<span><b>Everything accounted for</b><small>Products · Purchases · Sales</small></span></div></div></section>
      <section class="launch-final"><div class="container"><div class="launch-final-card reveal"><div><span class="launch-overline">Your business, a little clearer</span><h2>Make space for the work<br>that moves you forward.</h2><p>Bring your products, purchases and sales into one workspace.</p></div><a class="launch-primary" href="#/register">Create your workspace ${icon('arrow')}</a><div class="launch-final-glow" aria-hidden="true"></div></div></div></section>
    </main>
    <footer class="launch-footer"><div class="container launch-footer-inner"><div>${brand()}<span>Stock sambhalo. Hisaab saaf rakho.</span></div><nav><a href="#capabilities">Features</a><a href="#workflow">How it works</a><a href="#/login">Log in</a><a href="#/register">Create account</a></nav><small>© 2026 StockSetu · Inventory and billing for everyday business</small></div></footer>`;
  const nav = document.querySelector('#site-nav');
  document.querySelector('#menu-toggle')?.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  document.querySelector('#home-theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('stocksetu-theme', next);
    document.querySelector('#home-theme-toggle').innerHTML = icon(next === 'dark' ? 'sun' : 'moon');
    document.querySelector('#home-theme-toggle').setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} mode`);
    document.querySelector('#home-theme-toggle').setAttribute('aria-pressed', String(next === 'dark'));
  });
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  initLandingCamera();
  runReveal();
}

function initLandingCamera() {
  const hero = document.querySelector('.hero');
  const art = hero?.querySelector('.hero-art');
  landingCameraController?.abort();
  if (!hero || !art || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  landingCameraController = new AbortController();
  const { signal } = landingCameraController;

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const paint = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      const scrollY = (scrollProgress - .5) * 12;
      art.style.setProperty('--camera-x', `${pointerX * -9}px`);
      art.style.setProperty('--camera-y', `${pointerY * -7 + scrollY}px`);
      art.style.setProperty('--camera-rotate-x', `${pointerY * -1.3}deg`);
      art.style.setProperty('--camera-rotate-y', `${pointerX * 1.7}deg`);
    });
  };
  if (finePointer) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      pointerX = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
      pointerY = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
      paint();
    }, { passive: true, signal });
    hero.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; paint(); }, { passive: true, signal });
  }
  window.addEventListener('scroll', paint, { passive: true, signal });
  window.addEventListener('resize', paint, { passive: true, signal });
  paint();
}

function updateScrollProgress() {
  const bar = document.querySelector('.scroll-progress'); if (!bar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}
