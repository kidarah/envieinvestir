/* ═══════════════════════════════════════════════
   calculateur.js — EnvieInvestir
   ═══════════════════════════════════════════════ */

'use strict';

/* ── FORMATTERS ── */
const fmt = n =>
  new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

const fmtShort = n => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' M€';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + ' k€';
  return fmt(n);
};

/* ── CHART INSTANCES ── */
let chartEvol = null;
let chartRep  = null;

/* ── ANIMATION STAT ── */
function flashStat(el) {
  el.classList.remove('updating');
  void el.offsetWidth; /* force reflow */
  el.classList.add('updating');
  el.addEventListener('animationend', () => el.classList.remove('updating'), { once: true });
}

function setStat(id, value, formatter) {
  const el = document.getElementById(id);
  const newText = formatter ? formatter(value) : String(value);
  if (el.textContent !== newText) {
    el.textContent = newText;
    flashStat(el);
  }
}

/* ── CALCUL PRINCIPAL ── */
function compute() {
  const capital   = Math.max(0, parseFloat(document.getElementById('capital').value)   || 0);
  const mensuel   = Math.max(0, parseFloat(document.getElementById('mensuel').value)   || 0);
  const rendement = Math.max(0, parseFloat(document.getElementById('rendement').value) || 0) / 100;
  const duree     = Math.max(1, parseInt(document.getElementById('duree').value, 10)   || 1);
  const inflation = document.getElementById('toggle-inflation').checked ? 0.02 : 0;

  const r = rendement / 12;
  const n = duree * 12;

  const labels       = [];
  const dataCapital  = [];
  const dataVerse    = [];
  const dataInterets = [];
  const dataReel     = [];

  let valeur = capital;

  for (let mois = 1; mois <= n; mois++) {
    valeur = valeur * (1 + r) + mensuel;
    const totalVerse = capital + mensuel * mois;
    const interets   = valeur - totalVerse;
    const reel       = valeur / Math.pow(1 + inflation, mois / 12);

    if (mois % 12 === 0) {
      labels.push('An ' + mois / 12);
      dataCapital.push(Math.round(valeur));
      dataVerse.push(Math.round(totalVerse));
      dataInterets.push(Math.round(interets));
      dataReel.push(Math.round(reel));
    }
  }

  const finalCapital  = dataCapital.at(-1)  ?? 0;
  const finalVerse    = dataVerse.at(-1)    ?? 0;
  const finalInterets = dataInterets.at(-1) ?? 0;
  const finalReel     = dataReel.at(-1)     ?? 0;
  const ratio         = finalVerse > 0 ? Math.round((finalInterets / finalVerse) * 100) : 0;

  /* — Stats — */
  setStat('res-final',    finalCapital,  fmtShort);
  setStat('res-verse',    finalVerse,    fmtShort);
  setStat('res-interets', finalInterets, fmtShort);

  document.getElementById('res-final-reel').textContent =
    inflation ? 'Valeur réelle : ' + fmtShort(finalReel) : '';
  document.getElementById('res-ratio').textContent =
    finalVerse > 0 ? 'Soit +' + ratio + '% de ton capital versé' : '—';
  document.getElementById('table-label').textContent =
    rendement > 0
      ? 'Rendement ' + (rendement * 100).toFixed(1) + '% · ' + duree + ' an' + (duree > 1 ? 's' : '')
      : duree + ' an' + (duree > 1 ? 's' : '');

  /* — Graphique évolution — */
  renderEvolution(labels, dataCapital, dataVerse, dataInterets, duree);

  /* — Graphique répartition — */
  renderRepartition(capital, finalVerse, finalInterets);

  /* — Tableau — */
  renderTable(labels, dataCapital, dataVerse, dataInterets, dataReel, duree, inflation);
}

/* ── GRAPHIQUE ÉVOLUTION ── */
function renderEvolution(labels, dataCapital, dataVerse, dataInterets, duree) {
  const ctx = document.getElementById('chart-evolution').getContext('2d');
  if (chartEvol) chartEvol.destroy();

  chartEvol = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Capital total',
          data: dataCapital,
          borderColor: '#D4A84B',
          backgroundColor: 'rgba(212,168,75,0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: duree <= 15 ? 3 : 0,
          pointHoverRadius: 5,
        },
        {
          label: 'Intérêts',
          data: dataInterets,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76,175,80,0.06)',
          borderWidth: 1.5,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderDash: [4, 3],
        },
        {
          label: 'Versements',
          data: dataVerse,
          borderColor: '#555',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          fill: false,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderDash: [2, 4],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400, easing: 'easeOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#131416',
          borderColor: 'rgba(255,255,255,0.07)',
          borderWidth: 1,
          titleColor: '#F0EDE8',
          bodyColor: '#8A8580',
          padding: 10,
          callbacks: {
            label: ctx => '  ' + ctx.dataset.label + ' : ' + fmt(ctx.raw),
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8A8580', font: { size: 11 }, maxTicksLimit: 8 },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8A8580', font: { size: 11 }, callback: v => fmtShort(v) },
        },
      },
    },
  });
}

/* ── GRAPHIQUE RÉPARTITION ── */
function renderRepartition(capital, finalVerse, finalInterets) {
  const ctx = document.getElementById('chart-repartition').getContext('2d');
  if (chartRep) chartRep.destroy();

  const versements = Math.max(0, finalVerse - capital);
  const interets   = Math.max(0, finalInterets);
  const allZero    = capital === 0 && versements === 0 && interets === 0;

  chartRep = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Capital initial', 'Versements mensuels', 'Intérêts générés'],
      datasets: [{
        data: allZero ? [1, 0, 0] : [Math.max(0, capital), versements, interets],
        backgroundColor: [
          'rgba(212,168,75,0.7)',
          'rgba(212,168,75,0.3)',
          'rgba(76,175,80,0.6)',
        ],
        borderColor: ['#D4A84B', 'rgba(212,168,75,0.5)', '#4CAF50'],
        borderWidth: 1,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#8A8580',
            font: { size: 12 },
            padding: 16,
            boxWidth: 10,
            boxHeight: 10,
          },
        },
        tooltip: {
          backgroundColor: '#131416',
          borderColor: 'rgba(255,255,255,0.07)',
          borderWidth: 1,
          titleColor: '#F0EDE8',
          bodyColor: '#8A8580',
          callbacks: {
            label: ctx => allZero ? ' — ' : '  ' + ctx.label + ' : ' + fmt(ctx.raw),
          },
        },
      },
    },
  });
}

/* ── TABLEAU ANNUEL ── */
function renderTable(labels, dataCapital, dataVerse, dataInterets, dataReel, duree, inflation) {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';

  const step = duree <= 20 ? 1 : duree <= 30 ? 2 : 5;

  for (let i = 0; i < labels.length; i++) {
    const annee = i + 1;
    if (annee % step !== 0 && annee !== duree) continue;

    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td>${labels[i]}</td>` +
      `<td>${fmt(dataVerse[i])}</td>` +
      `<td class="green-val">${fmt(dataInterets[i])}</td>` +
      `<td class="highlight">${fmt(dataCapital[i])}</td>` +
      `<td>${inflation ? fmt(dataReel[i]) : '—'}</td>`;
    tbody.appendChild(tr);
  }
}

/* ── STEPPERS ── */
document.querySelectorAll('.input-stepper button').forEach(btn => {
  btn.addEventListener('click', () => {
    const group  = btn.closest('.input-group');
    const input  = group.querySelector('input[type="number"]');
    const step   = parseFloat(input.step)  || 1;
    const min    = parseFloat(input.min);
    const max    = parseFloat(input.max);
    const isUp   = btn.dataset.dir === 'up';
    let val      = (parseFloat(input.value) || 0) + (isUp ? step : -step);

    if (!isNaN(min)) val = Math.max(min, val);
    if (!isNaN(max)) val = Math.min(max, val);

    /* Arrondi pour éviter les dérives float */
    const decimals = (String(step).split('.')[1] || '').length;
    input.value = parseFloat(val.toFixed(decimals));
    compute();
  });
});

/* ── ÉVÉNEMENTS INPUTS ── */
['capital', 'mensuel', 'rendement', 'duree'].forEach(id => {
  document.getElementById(id).addEventListener('input', compute);
});

document.getElementById('toggle-inflation').addEventListener('change', compute);

/* ── INIT ── */
compute();
