/* ══════════════════════════════════════════
   EnvieInvestir — apprendre-bourse.js
   ══════════════════════════════════════════ */
'use strict';

/* ════════ 1. SCROLL REVEAL ════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ════════ 2. GRAPHIQUE ANIMÉ ════════ */
function initChart() {
  const svg = document.getElementById('stock-svg');
  const priceEl = document.getElementById('chart-price');
  const changeEl = document.getElementById('chart-change');
  if (!svg || !priceEl) return;

  const W = svg.viewBox.baseVal.width || 360;
  const H = svg.viewBox.baseVal.height || 100;

  /* Génère une courbe réaliste */
  function generatePath(points = 60, volatility = 0.015, trend = 0.002) {
    const prices = [100];
    for (let i = 1; i < points; i++) {
      const change = (Math.random() - 0.48) * volatility + trend;
      prices.push(prices[prices.length - 1] * (1 + change));
    }
    return prices;
  }

  let prices = generatePath();
  let basePrice = 182.50;

  function pricesToPath(arr) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min || 1;
    const pad = 8;

    const pts = arr.map((v, i) => {
      const x = (i / (arr.length - 1)) * W;
      const y = pad + (1 - (v - min) / range) * (H - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    /* Ligne */
    const line = `M${pts.join('L')}`;

    /* Zone remplie */
    const lastX = ((arr.length - 1) / (arr.length - 1)) * W;
    const area = `${line}L${lastX},${H}L0,${H}Z`;

    return { line, area, last: arr[arr.length - 1], first: arr[0] };
  }

  function render(arr, animated = false) {
    const { line, area, last, first } = pricesToPath(arr);
    const up = last >= first;
    const color = up ? '#4CAF50' : '#E57373';

    svg.innerHTML = `
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#grad)"/>
      <path d="${line}" fill="none" stroke="${color}" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"
            ${animated ? 'style="stroke-dasharray:1000;stroke-dashoffset:1000;animation:drawLine 1.5s ease forwards"' : ''}/>
    `;

    const pct = ((last - first) / first * 100).toFixed(2);
    const sign = up ? '+' : '';
    const currentPrice = (basePrice * last / 100).toFixed(2);
    priceEl.textContent = '$' + currentPrice;
    changeEl.className = up ? 'chart-change-up' : 'chart-change-down';
    changeEl.textContent = (up ? '▲ +' : '▼ ') + Math.abs(pct) + '%';
  }

  /* Ajoute keyframe CSS */
  if (!document.getElementById('draw-kf')) {
    const style = document.createElement('style');
    style.id = 'draw-kf';
    style.textContent = '@keyframes drawLine{to{stroke-dashoffset:0}}';
    document.head.appendChild(style);
  }

  render(prices, true);

  /* Mise à jour toutes les 3s avec une légère variation */
  setInterval(() => {
    const last = prices[prices.length - 1];
    const change = (Math.random() - 0.48) * 0.02 + 0.001;
    prices.push(last * (1 + change));
    if (prices.length > 80) prices.shift();
    render(prices, false);
  }, 3000);
}

/* ════════ 3. BARRES DE RISQUE ════════ */
function initRiskBars() {
  const bars = document.querySelectorAll('.risk-bar-fill[data-width]');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.width = e.target.dataset.width + '%';
      obs.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  bars.forEach(b => obs.observe(b));
}

/* ════════ 4. COMPTEURS ════════ */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dec    = el.dataset.dec ? parseInt(el.dataset.dec) : 0;
      const dur    = 1800;
      const t0     = performance.now();

      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const v = (ease * target).toFixed(dec);
        el.textContent = prefix + v + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });

  els.forEach(el => obs.observe(el));
}

/* ════════ 5. TABLE DES MATIÈRES ACTIVE ════════ */
function initActiveTOC() {
  const links = document.querySelectorAll('.sidebar-toc a');
  const sections = document.querySelectorAll('h2[id]');
  if (!links.length || !sections.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.sidebar-toc a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-20% 0px -75% 0px' });

  sections.forEach(s => obs.observe(s));
}

/* ════════ 6. NAV SCROLL ════════ */
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('nav-scrolled', scrollY > 30), { passive: true });
}

/* ════════ 7. SMOOTH SCROLL ════════ */
function initSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' });
    });
  });
}

/* ════════ INIT ════════ */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initChart();
  initRiskBars();
  initCounters();
  initActiveTOC();
  initNav();
  initSmooth();
});
