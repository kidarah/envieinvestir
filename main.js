/* ══════════════════════════════════════════
   EnvieInvestir — main.js
   ══════════════════════════════════════════ */
'use strict';

const API_URL = 'ticker.php';

/* Faits financiers généraux — ticker statique */
const FINANCE_FACTS = [
  { name: 'Règle des 72',        value: '÷ taux = années pour doubler' },
  { name: 'DCA',                 value: 'investir régulièrement réduit le risque' },
  { name: 'Diversification',     value: 'clé pour limiter la volatilité' },
  { name: 'Horizon long terme',  value: '+10 ans recommandé en bourse' },
  { name: 'Frais de gestion',    value: '1% de frais = −20% sur 30 ans' },
  { name: 'Effet du temps',      value: '100 € à 7%/an = 761 € en 30 ans' },
  { name: 'ETF vs fonds actifs', value: '80% des fonds actifs sous-performent' },
  { name: 'Rééquilibrage',       value: 'ajuster son portefeuille 1×/an' },
  { name: 'Fonds d\'urgence',    value: '3 à 6 mois de dépenses en réserve' },
  { name: 'Intérêts composés',   value: 'le temps est ton meilleur allié' },
];

/* ════════ UTILITAIRES ════════ */
const fmt = (n, d = 2) =>
  new Intl.NumberFormat('fr-BE', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const sign = n => n >= 0 ? '+' : '';


/* ════════ FETCH API ════════ */
async function fetchMarket() {
  try {
    const res = await fetch(API_URL, { cache: 'default' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    return json.data || null;
  } catch (e) {
    console.warn('[EI] ticker fetch:', e.message);
    return null;
  }
}


/* ════════ TICKER ════════ */
function buildTicker(market) {
  const wrap = document.getElementById('ticker-inner');
  if (!wrap) return;

  const items = [];

  const symbols = [
    { sym: '^GSPC',    cur: '$', dec: 0 },
    { sym: 'URTH',     cur: '$', dec: 2 },
    { sym: '^IXIC',    cur: '$', dec: 0 },
    { sym: '^GDAXI',   cur: '€', dec: 0 },
    { sym: 'BTC-USD',  cur: '$', dec: 0 },
    { sym: 'GC=F',     cur: '$', dec: 0 },
    { sym: 'EURUSD=X', cur: '',  dec: 4 },
    { sym: 'NVDA',     cur: '$', dec: 2 },
    { sym: 'AAPL',     cur: '$', dec: 2 },
    { sym: 'MSFT',     cur: '$', dec: 2 },
    { sym: 'AMZN',     cur: '$', dec: 2 },
    { sym: 'META',     cur: '$', dec: 2 },
  ];

  if (market) {
    for (const s of symbols) {
      const d = market[s.sym];
      if (!d || !d.price) continue;

      const priceStr  = s.cur + fmt(d.price, s.dec);
      const hasChange = Math.abs(d.change) > 0.001;

      let changeHtml;
      if (hasChange) {
        const dir   = d.up ? 'up' : 'down';
        const arrow = d.up ? '▲' : '▼';
        const pct   = sign(d.change) + fmt(Math.abs(d.change), 2) + '%';
        changeHtml = `<span class="ticker-${dir}">${arrow} ${pct}</span>`;
      } else {
        changeHtml = `<span class="ticker-closed">—</span>`;
      }

      items.push(`
        <div class="ticker-item">
          <span class="ticker-name">${d.label}</span>
          <span class="ticker-sep">·</span>
          <span class="ticker-price">${priceStr}</span>
          ${changeHtml}
        </div>`);
    }
  }

  for (const f of FINANCE_FACTS) {
    items.push(`
      <div class="ticker-item">
        <span class="ticker-fact"><strong>${f.name}</strong> — ${f.value}</span>
      </div>`);
  }

  const html = items.join('');
  wrap.innerHTML = html + html;

  const speed = Math.max(45, items.length * 5);
  wrap.style.animationDuration = speed + 's';
}


/* ════════ BULLES ════════ */
function updateBubbles(market) {
  if (!market) return;

  const map = {
    '^GSPC':  { val: 'bv-sp',     sub: 'bs-sp'     },
    'URTH':   { val: 'bv-msci',   sub: 'bs-msci'   },
    '^IXIC':  { val: 'bv-nasdaq', sub: 'bs-nasdaq'  },
    'BTC-USD':{ val: 'bv-btc',    sub: 'bs-btc'     },
    'NVDA':   { val: 'bv-nvda',   sub: 'bs-nvda'    },
    'AAPL':   { val: 'bv-aapl',   sub: 'bs-aapl'    },
  };

  for (const [sym, ids] of Object.entries(map)) {
    const d   = market[sym];
    const elV = document.getElementById(ids.val);
    const elS = document.getElementById(ids.sub);
    if (!d || !elV || !elS) continue;

    const hasChange = Math.abs(d.change) > 0.001;
    const dec = (sym === 'BTC-USD' || sym === '^GSPC' || sym === '^IXIC') ? 0
              : sym === 'EURUSD=X' ? 4
              : 2;

    /* Valeur principale : prix */
    elV.className   = 'b-val gold';
    elV.textContent = fmt(d.price, dec) + (d.currency ? ' ' + d.currency : '');

    /* Sous-titre : variation */
    if (hasChange) {
      const arrow = d.up ? '▲' : '▼';
      const pct   = sign(d.change) + fmt(Math.abs(d.change), 2) + '%';
      elS.innerHTML = `<span style="color:${d.up ? 'var(--green)' : 'var(--red)'}">${arrow} ${pct}</span> aujourd'hui`;
    } else {
      elS.textContent = 'marché fermé';
    }
  }
}


/* ════════ ROTATING TEXT ════════ */
function initRotating() {
  const words   = document.querySelectorAll('.rotating-word');
  const wrapper = document.getElementById('rotating-wrap');
  if (!words.length || !wrapper) return;

  /* Largeur du mot le plus long */
  let maxW = 0;
  words.forEach(w => {
    w.style.cssText = 'position:static;opacity:1;transform:none;transition:none';
    maxW = Math.max(maxW, w.offsetWidth);
    w.style.cssText = '';
  });
  wrapper.style.width = (maxW + 4) + 'px';

  let idx = 0;
  setInterval(() => {
    const prev = idx;
    idx = (idx + 1) % words.length;
    words[prev].classList.remove('active');
    words[prev].classList.add('exit');
    setTimeout(() => words[prev].classList.remove('exit'), 520);
    words[idx].classList.add('active');
  }, 2600);
}


/* ════════ SCROLL REVEAL ════════ */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('is-visible'), +e.target.dataset.delay || 0);
      obs.unobserve(e.target);
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}


/* ════════ COUNTERS ════════ */
function initCounters() {
  const els = document.querySelectorAll('[data-counter]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const tgt = parseFloat(el.dataset.counter);
      const sfx = el.dataset.suffix || '';
      const dur = 1600, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        const v = tgt % 1 ? (( 1 - Math.pow(1-p,3)) * tgt).toFixed(1) : Math.round((1-Math.pow(1-p,3))*tgt);
        el.textContent = v + sfx;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: .6 });
  els.forEach(el => obs.observe(el));
}


/* ════════ CARD STAGGER ════════ */
function initCards() {
  const cards = document.querySelectorAll('.article-card');
  if (!cards.length) return;
  cards.forEach((c, i) => {
    c.style.cssText = `opacity:0;transform:translateY(20px);transition:opacity .55s ease ${i*.13}s,transform .55s cubic-bezier(.16,1,.3,1) ${i*.13}s`;
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      obs.unobserve(e.target);
    });
  }, { threshold: .08 });
  cards.forEach(c => obs.observe(c));
}


/* ════════ NAV SCROLL ════════ */
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const fn = () => nav.classList.toggle('nav-scrolled', scrollY > 30);
  addEventListener('scroll', fn, { passive: true });
  fn();
}


/* ════════ SMOOTH SCROLL ════════ */
function initSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
    });
  });
}


/* ════════ EXTRAS ════════ */
function initExtras() {
  /* Ticker pause au survol */
  const inner = document.getElementById('ticker-inner');
  if (inner) {
    inner.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
    inner.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
  }

  /* Bulles parallax subtil */
  const bubbles = document.querySelectorAll('.bubble');
  if (bubbles.length) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        bubbles.forEach((b, i) => { b.style.transform = `translateY(${-y * (.025 + (i%3)*.01)}px)`; });
        ticking = false;
      });
    }, { passive: true });
  }
}


/* ════════ INIT ════════ */
document.addEventListener('DOMContentLoaded', async () => {
  initRotating();
  initReveal();
  initCounters();
  initCards();
  initNav();
  initSmooth();
  initExtras();

  /* Données marché en async */
  const market = await fetchMarket();
  buildTicker(market);
  updateBubbles(market);
});
