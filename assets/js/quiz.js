/* ══════════════════════════════════════════
   EnvieInvestir — quiz.js
   Quiz investissement — 30 questions, 3 niveaux
   ══════════════════════════════════════════ */
'use strict';

/* ════════ QUESTIONS ════════ */
const QUESTIONS = {
  debutant: [
    {
      category: 'Les bases',
      q: "Qu'est-ce qu'une action en bourse ?",
      options: ["Un prêt accordé à une entreprise", "Une part de propriété dans une entreprise", "Un contrat d'assurance financière", "Un dépôt d'épargne garanti"],
      answer: 1,
      explanation: "Une action représente une part de propriété dans une entreprise. En achetant une action Apple, tu deviens copropriétaire d'Apple à hauteur de ta part."
    },
    {
      category: 'ETF',
      q: "Que signifie ETF ?",
      options: ["Exchange Transaction Fund", "Exchange Traded Fund", "Equity Transfer Finance", "Euro Trading Foundation"],
      answer: 1,
      explanation: "ETF signifie 'Exchange Traded Fund' — un fonds indiciel coté en bourse. C'est un panier d'actions que tu achètes en une seule transaction."
    },
    {
      category: 'Les bases',
      q: "Qu'est-ce qu'un dividende ?",
      options: ["Une taxe sur les transactions boursières", "Une partie des bénéfices versée aux actionnaires", "Un type d'obligation d'État", "Les frais de gestion d'un ETF"],
      answer: 1,
      explanation: "Un dividende est une partie des bénéfices qu'une entreprise distribue à ses actionnaires. C'est comme un loyer sur ton investissement."
    },
    {
      category: 'Fiscalité',
      q: "Qu'est-ce qu'une plus-value boursière ?",
      options: ["La commission prélevée par le courtier", "Le gain réalisé lors de la vente d'un actif à un prix supérieur à son coût d'achat", "Les dividendes versés par une entreprise", "Les frais de gestion annuels d'un ETF"],
      answer: 1,
      explanation: "Une plus-value est le profit réalisé quand tu vends un actif plus cher que son prix d'achat. Sa fiscalité varie selon les pays : flat tax de 30 % en France, généralement exonérée pour les particuliers en Belgique, aussi exonérée en Suisse (hors activité professionnelle), et imposée à 50 % au Canada."
    },
    {
      category: 'Stratégie',
      q: "Qu'est-ce que le DCA (Dollar Cost Averaging) ?",
      options: ["Vendre quand le marché monte", "Investir toute son épargne d'un coup", "Investir des montants réguliers à intervalles fixes", "Diversifier uniquement dans les crypto-monnaies"],
      answer: 2,
      explanation: "Le DCA consiste à investir régulièrement (ex: 100€ chaque mois) peu importe le cours. Cette stratégie permet de lisser le prix d'achat et de réduire le risque lié au timing."
    },
    {
      category: 'Les bases',
      q: "Quel est l'indice boursier américain qui regroupe les 500 plus grandes entreprises américaines ?",
      options: ["Nasdaq 100", "Dow Jones", "S&P 500", "Russell 2000"],
      answer: 2,
      explanation: "Le S&P 500 regroupe les 500 plus grandes entreprises américaines cotées en bourse. C'est l'un des indices les plus suivis au monde."
    },
    {
      category: 'Risque',
      q: "Qu'est-ce que la diversification en investissement ?",
      options: ["Mettre tout son argent dans la meilleure action", "Répartir ses investissements sur plusieurs actifs pour réduire le risque", "Investir uniquement dans son pays d'origine", "Changer d'actions chaque semaine"],
      answer: 1,
      explanation: "La diversification consiste à répartir ses investissements sur différents actifs, secteurs et zones géographiques pour ne pas dépendre d'un seul placement."
    },
    {
      category: 'ETF',
      q: "Qu'est-ce que le MSCI World ?",
      options: ["Un indice de 500 entreprises américaines", "Un fonds qui investit uniquement en Europe", "Un indice regroupant ~1500 entreprises de 23 pays développés", "Une cryptomonnaie mondiale"],
      answer: 2,
      explanation: "Le MSCI World est un indice boursier qui suit environ 1500 grandes et moyennes capitalisations dans 23 pays développés. Il couvre ~85% de la capitalisation boursière mondiale."
    },
    {
      category: 'Les bases',
      q: "Qu'est-ce qu'un marché 'bear' (baissier) ?",
      options: ["Un marché en forte hausse", "Un marché où les prix baissent d'au moins 20%", "Un marché très volatil", "Un marché exclusivement réservé aux professionnels"],
      answer: 1,
      explanation: "Un marché 'bear' (ours) désigne un marché en baisse de 20% ou plus depuis son dernier sommet. L'opposé est le marché 'bull' (taureau) qui désigne un marché haussier."
    },
    {
      category: 'Fiscalité',
      q: "Qu'est-ce que la flat tax (Prélèvement Forfaitaire Unique) en France ?",
      options: ["Une taxe fixe à l'achat de chaque action", "Un taux unique de 30 % sur les revenus du capital (dividendes, intérêts, plus-values)", "Les frais annuels fixes d'un ETF", "Une taxe sur les virements bancaires internationaux"],
      answer: 1,
      explanation: "La flat tax française (PFU) de 30 % se décompose en 12,8 % d'impôt sur le revenu + 17,2 % de prélèvements sociaux. Elle s'applique aux dividendes, intérêts et plus-values. Chaque pays a son propre mécanisme : précompte mobilier en Belgique, impôt anticipé en Suisse, retenue à la source au Canada."
    }
  ],

  intermediaire: [
    {
      category: 'Analyse',
      q: "Qu'est-ce que le ratio P/E (Price-to-Earnings) ?",
      options: ["Le rapport entre le prix de l'action et son dividende", "Le rapport entre le prix de l'action et le bénéfice par action", "Le pourcentage de hausse annuelle d'une action", "Les frais de gestion d'un ETF"],
      answer: 1,
      explanation: "Le ratio P/E compare le prix d'une action à son bénéfice par action (EPS). Un P/E de 20 signifie que tu paies 20€ pour chaque euro de bénéfice. Plus il est élevé, plus l'action est 'chère'."
    },
    {
      category: 'ETF',
      q: "Quelle est la différence entre un ETF capitalisant et distribuant ?",
      options: ["L'ETF capitalisant réinvestit les dividendes, le distribuant les verse", "L'ETF capitalisant est plus risqué", "L'ETF distribuant suit uniquement des actions américaines", "Il n'y a aucune différence fiscale"],
      answer: 0,
      explanation: "Un ETF capitalisant réinvestit automatiquement les dividendes, profitant des intérêts composés. Un ETF distribuant verse les dividendes en cash. Fiscalement, les ETF capitalisants sont souvent avantageux : en France, ils différent l'imposition ; en Belgique, ils évitent le précompte mobilier sur dividendes."
    },
    {
      category: 'Risque',
      q: "Qu'est-ce que la volatilité d'un actif ?",
      options: ["Son rendement moyen annuel", "L'amplitude des variations de prix dans le temps", "Le volume d'échanges quotidiens", "La liquidité de l'actif"],
      answer: 1,
      explanation: "La volatilité mesure l'amplitude des variations de prix d'un actif. Un actif très volatil peut monter ou descendre fortement en peu de temps. C'est une mesure du risque à court terme."
    },
    {
      category: 'Stratégie',
      q: "Qu'est-ce que le rééquilibrage de portefeuille ?",
      options: ["Vendre tous ses actifs en période de crise", "Ajuster la répartition de son portefeuille pour revenir à son allocation cible", "Dupliquer son portefeuille sur plusieurs courtiers", "Investir uniquement dans des actifs qui ont baissé"],
      answer: 1,
      explanation: "Le rééquilibrage consiste à vendre les actifs surpondérés et acheter les sous-pondérés pour revenir à son allocation initiale. Ex: si tu vises 70% actions / 30% obligations, tu rééquilibres si la proportion change."
    },
    {
      category: 'Analyse',
      q: "Que mesure le ratio de Sharpe ?",
      options: ["La capitalisation boursière d'une entreprise", "Le rendement d'un investissement ajusté du risque", "Le niveau d'endettement d'une entreprise", "La liquidité d'un marché"],
      answer: 1,
      explanation: "Le ratio de Sharpe mesure le rendement d'un portefeuille par unité de risque pris. Plus il est élevé, meilleur est le rendement par rapport au risque. Un ratio > 1 est généralement considéré comme bon."
    },
    {
      category: 'Marchés',
      q: "Qu'est-ce qu'une IPO (Initial Public Offering) ?",
      options: ["La première vente d'actions d'une entreprise au public", "Un indice boursier international", "Un type de fonds d'investissement privé", "Une obligation émise par l'État"],
      answer: 0,
      explanation: "Une IPO est l'entrée en bourse d'une entreprise — elle vend pour la première fois des actions au grand public. Cela lui permet de lever des fonds pour se développer."
    },
    {
      category: 'ETF',
      q: "Qu'est-ce que le TER (Total Expense Ratio) d'un ETF ?",
      options: ["Le rendement total de l'ETF sur un an", "Les frais annuels totaux prélevés par l'ETF", "Le nombre de pays couverts par l'ETF", "La différence entre l'ETF et son indice de référence"],
      answer: 1,
      explanation: "Le TER représente les frais annuels totaux d'un ETF, exprimés en pourcentage. Un ETF MSCI World a souvent un TER de 0,12% à 0,20%. Plus il est bas, mieux c'est pour l'investisseur."
    },
    {
      category: 'Fiscalité',
      q: "Qu'est-ce qu'une retenue à la source sur les dividendes étrangers ?",
      options: ["Des frais de conversion de devises prélevés par le courtier", "Un impôt prélevé par le pays d'origine sur les dividendes versés à des investisseurs étrangers", "La commission du courtier sur chaque dividende reçu", "Un remboursement automatique d'impôt sur les dividendes"],
      answer: 1,
      explanation: "Quand une entreprise américaine verse un dividende à un investisseur européen, les États-Unis prélèvent généralement 15 % à la source (selon les traités fiscaux). Ce montant peut être partiellement récupéré via la déclaration fiscale selon ton pays : formulaire 2042 en France, déclaration annuelle en Belgique, formulaire DA-1 en Suisse."
    },
    {
      category: 'Analyse',
      q: "Qu'est-ce que la capitalisation boursière d'une entreprise ?",
      options: ["Son chiffre d'affaires annuel", "Ses bénéfices après impôts", "Le prix de l'action multiplié par le nombre total d'actions", "La valeur de ses actifs immobiliers"],
      answer: 2,
      explanation: "La capitalisation boursière = Prix de l'action × Nombre total d'actions. Elle représente la valeur totale que le marché attribue à l'entreprise. Apple dépasse les 3 000 milliards de dollars."
    },
    {
      category: 'Stratégie',
      q: "Qu'est-ce qu'un fonds actif par opposition à un fonds passif (ETF) ?",
      options: ["Un fonds qui investit uniquement dans des marchés émergents", "Un fonds géré par des analystes qui cherchent à battre le marché", "Un fonds qui achète et vend des actions chaque jour", "Un fonds qui ne facture pas de frais"],
      answer: 1,
      explanation: "Un fonds actif est géré par des analystes qui sélectionnent les actifs avec l'objectif de faire mieux que le marché. Les frais sont plus élevés qu'un ETF passif. Historiquement, la majorité des fonds actifs sous-performent leur indice de référence sur le long terme."
    }
  ],

  expert: [
    {
      category: 'Analyse avancée',
      q: "Qu'est-ce que le ratio PEG (Price/Earnings to Growth) ?",
      options: ["Le P/E divisé par le taux de croissance des bénéfices", "Le prix de l'action divisé par ses actifs nets", "Le rapport entre dividendes et cours de bourse", "Le rendement d'une action ajusté de l'inflation"],
      answer: 0,
      explanation: "Le PEG = P/E ÷ taux de croissance annuel des bénéfices. Un PEG < 1 suggère qu'une action est potentiellement sous-évaluée. Il est plus utile que le P/E seul car il intègre la croissance attendue."
    },
    {
      category: 'Macro',
      q: "Qu'est-ce que la courbe des taux inversée et pourquoi est-elle surveillée ?",
      options: ["Quand les actions montent et les obligations descendent simultanément", "Quand les taux courts sont supérieurs aux taux longs, souvent précurseur de récession", "Quand l'inflation dépasse les taux directeurs", "Quand les marchés émergents surperforment les marchés développés"],
      answer: 1,
      explanation: "La courbe des taux est inversée quand les obligations court terme rapportent plus que les obligations long terme. Historiquement, cette inversion a précédé la plupart des récessions américaines dans les 6 à 18 mois suivants."
    },
    {
      category: 'Analyse avancée',
      q: "Qu'est-ce que le free cash flow (FCF) d'une entreprise ?",
      options: ["Le bénéfice net après impôts", "Les liquidités générées par l'activité après déduction des investissements", "La trésorerie disponible dans les comptes bancaires", "Le dividende versé aux actionnaires"],
      answer: 1,
      explanation: "Le FCF = Flux de trésorerie opérationnel - dépenses d'investissement (CAPEX). C'est l'argent réellement disponible après avoir maintenu et développé l'outil de production. Beaucoup d'investisseurs le considèrent plus révélateur que le bénéfice net."
    },
    {
      category: 'Marchés',
      q: "Qu'est-ce que la prime de risque actions (Equity Risk Premium) ?",
      options: ["Les frais supplémentaires payés pour les actions à forte volatilité", "Le rendement supplémentaire attendu des actions par rapport aux obligations sans risque", "La prime versée lors d'une OPA", "L'écart de performance entre grandes et petites capitalisations"],
      answer: 1,
      explanation: "La prime de risque actions représente le rendement supplémentaire que les investisseurs exigent pour investir en actions plutôt qu'en obligations 'sans risque' (ex: bons du Trésor). Elle compense le risque plus élevé des marchés actions."
    },
    {
      category: 'ETF avancé',
      q: "Qu'est-ce que le 'tracking error' d'un ETF ?",
      options: ["Les erreurs de saisie dans le prospectus de l'ETF", "L'écart de performance entre l'ETF et son indice de référence", "Les frais cachés d'un ETF", "La différence entre le prix de marché et la valeur liquidative"],
      answer: 1,
      explanation: "Le tracking error mesure à quel point un ETF s'écarte de son indice de référence dans le temps. Un ETF bien géré a un tracking error faible. Il est différent du tracking difference qui mesure l'écart de performance total."
    },
    {
      category: 'Macro',
      q: "Qu'est-ce que l'effet des taux d'intérêt sur les valorisations boursières ?",
      options: ["Des taux élevés augmentent la valeur des actions car les entreprises empruntent plus", "Des taux élevés baissent les valorisations car les flux futurs sont davantage actualisés", "Les taux n'ont aucun impact direct sur les actions", "Des taux faibles font baisser les marchés actions"],
      answer: 1,
      explanation: "En finance, la valeur d'une action = somme des flux futurs actualisés. Quand les taux montent, le taux d'actualisation monte, ce qui réduit la valeur présente des bénéfices futurs. C'est pourquoi les marchés actions baissent souvent quand les banques centrales remontent les taux."
    },
    {
      category: 'Analyse avancée',
      q: "Qu'est-ce que la marge EBITDA ?",
      options: ["Le bénéfice net divisé par le chiffre d'affaires", "L'EBITDA (résultat avant intérêts, impôts, dépréciations) divisé par le CA", "Le rapport entre dettes et fonds propres", "La rentabilité des capitaux propres"],
      answer: 1,
      explanation: "La marge EBITDA = EBITDA ÷ Chiffre d'affaires. Elle mesure la rentabilité opérationnelle avant les effets comptables et financiers. Une marge EBITDA > 20% est souvent considérée comme saine selon les secteurs."
    },
    {
      category: 'Stratégie',
      q: "Qu'est-ce que le 'factor investing' (investissement factoriel) ?",
      options: ["Investir uniquement dans un seul secteur économique", "Cibler des caractéristiques spécifiques (value, momentum, qualité) pour surperformer", "Utiliser l'effet de levier pour amplifier les rendements", "Investir en fonction des prévisions macro-économiques"],
      answer: 1,
      explanation: "Le factor investing consiste à cibler des facteurs identifiés comme sources de rendement supplémentaire : value (actions décotées), momentum (tendances), quality (entreprises de qualité), size (petites caps). Des ETF factoriels permettent d'y accéder facilement."
    },
    {
      category: 'Fiscalité avancée',
      q: "Qu'est-ce qu'un PEA (Plan d'Épargne en Actions) ?",
      options: ["Un fonds indiciel créé par l'AMF française", "Une enveloppe fiscale française permettant d'investir en actions européennes avec exonération d'impôt après 5 ans", "Un compte épargne réglementé garanti par l'État", "Un ETF spécialisé dans les actions du CAC 40"],
      answer: 1,
      explanation: "Le PEA est une enveloppe fiscale disponible en France : après 5 ans, les gains et dividendes sont exonérés d'impôt sur le revenu (seuls les prélèvements sociaux de 17,2 % restent dus). Plafonné à 150 000 €. Des équivalents existent ailleurs : le compte-titres ordinaire en Belgique, le 3e pilier en Suisse, le CELI au Canada."
    },
    {
      category: 'Analyse avancée',
      q: "Qu'est-ce que le DCF (Discounted Cash Flow) utilisé en valorisation ?",
      options: ["Un ratio comparant le cours d'une action à ses actifs nets", "Une méthode qui valorise une entreprise en actualisant ses flux de trésorerie futurs", "Un indice de liquidité des marchés obligataires", "Le coût moyen pondéré du capital d'une entreprise"],
      answer: 1,
      explanation: "Le DCF est une méthode d'évaluation qui estime la valeur intrinsèque d'une entreprise en actualisant ses flux de trésorerie futurs estimés. La valeur dépend fortement des hypothèses de croissance et du taux d'actualisation utilisés."
    }
  ]
};

/* ════════ CONFIG ════════ */
const TIMER_SEC    = 20;
const STREAK_BONUS = 50;
const BASE_POINTS  = 100;
const TIME_BONUS   = 50;

const SPEECHES = {
  intro:   ["Prêt à tester tes connaissances ?", "Allez, montre ce que tu sais !", "C'est parti !"],
  correct: ["Exact ! Bien joué 🎯", "Parfait ! Tu assures !", "Bravo, bonne réponse !", "Excellent !"],
  wrong:   ["Pas tout à fait... Lis l'explication !", "Oups ! À retenir pour la prochaine fois.", "Ce n'était pas ça, mais tu vas apprendre !"],
  streak:  ["🔥 Streak x", "🔥 En feu ! x", "🔥 Impressionnant ! x"],
  timeout: ["Le temps est écoulé ! ⏰", "Trop lent cette fois ! ⏰", "Temps dépassé ! ⏰"],
};

/* ════════ STATE ════════ */
let state = {
  level: 'debutant',
  questions: [],
  current: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correct: 0,
  timer: null,
  timerLeft: TIMER_SEC,
  answered: false,
};

/* ════════ DOM ════════ */
const $ = id => document.getElementById(id);
const screens = {
  home:   $('screen-home'),
  quiz:   $('screen-quiz'),
  result: $('screen-result'),
};

/* ════════ MASCOT SVG ════════ */
function getMascotSVG(mood = 'neutral', size = 100) {
  const faces = {
    neutral: { mouth:'M 40 65 Q 50 70 60 65', eyes:'M 36 50 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 54 50 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0' },
    happy:   { mouth:'M 35 63 Q 50 78 65 63', eyes:'M 36 48 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 54 48 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0' },
    sad:     { mouth:'M 35 70 Q 50 58 65 70', eyes:'M 36 52 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 M 54 52 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0' },
    wow:     { mouth:'M 42 62 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0', eyes:'M 33 46 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0 M 53 46 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0' },
    star:    { mouth:'M 35 63 Q 50 78 65 63', eyes:'M 36 46 l 3 6 l 6 1 l -4 4 l 1 6 l -6 -3 l -6 3 l 1 -6 l -4 -4 l 6 -1 z M 54 46 l 3 6 l 6 1 l -4 4 l 1 6 l -6 -3 l -6 3 l 1 -6 l -4 -4 l 6 -1 z' },
  };
  const f = faces[mood] || faces.neutral;
  return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <radialGradient id="bodyGrad${mood}" cx="45%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#2A2208"/>
        <stop offset="100%" stop-color="#1A1406"/>
      </radialGradient>
    </defs>
    <!-- Corps -->
    <ellipse cx="50" cy="75" rx="28" ry="22" fill="url(#bodyGrad${mood})" stroke="rgba(212,168,75,.3)" stroke-width="1.5"/>
    <!-- Tête -->
    <circle cx="50" cy="42" r="32" fill="url(#bodyGrad${mood})" stroke="rgba(212,168,75,.4)" stroke-width="1.5"/>
    <!-- Brillance -->
    <ellipse cx="42" cy="30" rx="10" ry="6" fill="rgba(212,168,75,.12)" transform="rotate(-20 42 30)"/>
    <!-- Yeux -->
    <path d="${f.eyes}" fill="#D4A84B" opacity=".9"/>
    <!-- Bouche -->
    <path d="${f.mouth}" fill="none" stroke="#D4A84B" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Oreilles -->
    <circle cx="18" cy="38" r="8" fill="url(#bodyGrad${mood})" stroke="rgba(212,168,75,.3)" stroke-width="1"/>
    <circle cx="82" cy="38" r="8" fill="url(#bodyGrad${mood})" stroke="rgba(212,168,75,.3)" stroke-width="1"/>
    <!-- Détails intérieur oreilles -->
    <circle cx="18" cy="38" r="4" fill="rgba(212,168,75,.15)"/>
    <circle cx="82" cy="38" r="4" fill="rgba(212,168,75,.15)"/>
    <!-- Joues -->
    <circle cx="28" cy="55" r="7" fill="rgba(212,100,75,.12)"/>
    <circle cx="72" cy="55" r="7" fill="rgba(212,100,75,.12)"/>
    <!-- Pièce d'or sur le corps -->
    <circle cx="50" cy="78" r="8" fill="rgba(212,168,75,.2)" stroke="rgba(212,168,75,.4)" stroke-width="1"/>
    <text x="50" y="82" text-anchor="middle" font-size="8" fill="#D4A84B" font-weight="bold">€</text>
  </svg>`;
}

/* ════════ PARTICLES ════════ */
function initParticles() {
  const container = document.querySelector('.bg-particles');
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 30 + Math.random() * 80;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${8 + Math.random() * 12}s;
      animation-delay:${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

/* ════════ SHOW SCREEN ════════ */
function showScreen(name) {
  Object.entries(screens).forEach(([k, el]) => {
    if (!el) return;
    el.style.display = k === name ? 'block' : 'none';
  });
}

/* ════════ SPEECH ════════ */
function setSpeech(txt) {
  const el = $('speech-text');
  if (!el) return;
  el.innerHTML = txt;
}

function randSpeech(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ════════ MASCOT ════════ */
function setMascot(mood, animate = '') {
  const el = $('quiz-mascot');
  if (!el) return;
  el.innerHTML = getMascotSVG(mood, 70);
  if (animate) {
    el.classList.remove('bounce', 'shake');
    void el.offsetWidth;
    el.classList.add(animate);
    setTimeout(() => el.classList.remove(animate), 500);
  }
}

/* ════════ TIMER ════════ */
function startTimer() {
  state.timerLeft = TIMER_SEC;
  updateTimerUI();

  clearInterval(state.timer);
  state.timer = setInterval(() => {
    state.timerLeft--;
    updateTimerUI();
    if (state.timerLeft <= 0) {
      clearInterval(state.timer);
      onTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timer);
}

function updateTimerUI() {
  const num = $('timer-num');
  const fill = $('timer-fill');
  if (!num || !fill) return;

  num.textContent = state.timerLeft;
  const pct = state.timerLeft / TIMER_SEC;
  const dashOffset = 126 * (1 - pct);
  fill.style.strokeDashoffset = dashOffset;

  const urgent = state.timerLeft <= 5;
  fill.classList.toggle('urgent', urgent);
  num.classList.toggle('urgent', urgent);
}

function onTimeout() {
  if (state.answered) return;
  state.answered = true;
  state.streak = 0;
  updateStreakUI();
  revealAnswer(-1);
  setSpeech(randSpeech(SPEECHES.timeout));
  setMascot('sad', 'shake');
  showToast(randSpeech(SPEECHES.timeout), 'wrong-toast');
  showNextBtn();
}

/* ════════ RENDER QUESTION ════════ */
function renderQuestion() {
  const q = state.questions[state.current];
  if (!q) return;

  state.answered = false;

  /* Progress */
  const pct = (state.current / state.questions.length) * 100;
  const fill = document.querySelector('.progress-bar-fill');
  if (fill) fill.style.width = pct + '%';
  const counter = $('q-counter');
  if (counter) counter.textContent = `${state.current + 1} / ${state.questions.length}`;

  /* Category + question */
  const catEl = $('q-category');
  if (catEl) catEl.textContent = q.category;
  const textEl = $('q-text');
  if (textEl) textEl.textContent = q.q;

  /* Options */
  const grid = $('options-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${letters[i]}</span>${opt}`;
    btn.addEventListener('click', () => onAnswer(i));
    grid.appendChild(btn);
  });

  /* Explication cachée */
  const exp = $('explanation');
  if (exp) exp.style.display = 'none';

  /* Bouton suivant caché */
  const nextBtn = $('btn-next');
  if (nextBtn) nextBtn.classList.remove('visible');

  /* Mascot */
  setMascot('neutral');
  setSpeech(randSpeech(SPEECHES.intro));

  /* Timer */
  startTimer();

  /* Score HUD */
  updateScoreUI();
}

/* ════════ ON ANSWER ════════ */
function onAnswer(idx) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();

  const q = state.questions[state.current];
  const isCorrect = idx === q.answer;
  const timeBonus = Math.round((state.timerLeft / TIMER_SEC) * TIME_BONUS);

  if (isCorrect) {
    state.score += BASE_POINTS + timeBonus;
    state.correct++;
    state.streak++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    if (state.streak > 1) {
      state.score += STREAK_BONUS;
      showToast(`${randSpeech(SPEECHES.streak)}${state.streak} ! +${STREAK_BONUS} bonus 🔥`, 'streak-toast');
    } else {
      showToast(randSpeech(SPEECHES.correct), 'correct-toast');
    }
    setMascot('happy', 'bounce');
    setSpeech(`<strong>${randSpeech(SPEECHES.correct)}</strong> +${BASE_POINTS + timeBonus} points`);
  } else {
    state.streak = 0;
    setMascot('sad', 'shake');
    setSpeech(randSpeech(SPEECHES.wrong));
    showToast(randSpeech(SPEECHES.wrong), 'wrong-toast');
  }

  updateStreakUI();
  updateScoreUI();
  revealAnswer(idx);
  showExplanation(q.explanation);
  showNextBtn();
}

function revealAnswer(chosen) {
  const q = state.questions[state.current];
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === chosen && chosen !== q.answer) btn.classList.add('wrong');
    else btn.classList.add('reveal');
  });
}

function showExplanation(text) {
  const el = $('explanation');
  if (!el) return;
  el.innerHTML = `💡 <strong>Explication :</strong> ${text}`;
  el.style.display = 'block';
}

function showNextBtn() {
  const btn = $('btn-next');
  if (!btn) return;
  const isLast = state.current >= state.questions.length - 1;
  btn.textContent = isLast ? 'Voir mes résultats →' : 'Question suivante →';
  btn.classList.add('visible');
}

/* ════════ HUD ════════ */
function updateScoreUI() {
  const el = $('hud-score');
  if (el) el.textContent = state.score.toLocaleString('fr-BE');
}

function updateStreakUI() {
  const badge = $('streak-badge');
  const val   = $('streak-val');
  if (!badge || !val) return;
  val.textContent = state.streak;
  badge.classList.toggle('streak-on', state.streak >= 2);
}

/* ════════ TOAST ════════ */
let toastTimer = null;
function showToast(msg, cls = '') {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast visible ${cls}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

/* ════════ CONFETTI ════════ */
function launchConfetti() {
  const container = $('confetti-container');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['#D4A84B','#4CAF50','#E8C876','#F0EDE8','#4A9EFF'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${2 + Math.random() * 2}s;
      animation-delay:${Math.random() * .5}s;
      width:${6 + Math.random() * 8}px;
      height:${6 + Math.random() * 8}px;
      border-radius:${Math.random() > .5 ? '50%' : '2px'};
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

/* ════════ SHOW RESULT ════════ */
function showResult() {
  showScreen('result');

  const total   = state.questions.length;
  const pct     = Math.round((state.correct / total) * 100);
  const circumf = 408;

  /* Mascot résultat */
  const mood = pct >= 80 ? 'star' : pct >= 50 ? 'happy' : 'sad';
  const resMascot = $('result-mascot');
  if (resMascot) resMascot.innerHTML = getMascotSVG(mood, 140);

  /* Titre */
  const title = $('result-title');
  if (title) {
    if (pct >= 90)      title.innerHTML = 'Exceptionnel !<br><em>Tu es un pro.</em>';
    else if (pct >= 70) title.innerHTML = 'Très bien !<br><em>Tu maîtrises les bases.</em>';
    else if (pct >= 50) title.innerHTML = 'Pas mal !<br><em>Continue à apprendre.</em>';
    else                title.innerHTML = 'Encore un effort !<br><em>Tu progresseras.</em>';
  }
  const sub = $('result-subtitle');
  if (sub) sub.textContent = pct >= 70 ? 'Continue comme ça — tu deviens investisseur !' : 'Relis nos articles et retente le quiz !';

  /* Score cercle */
  const numEl = $('score-number');
  if (numEl) {
    let n = 0;
    const interval = setInterval(() => {
      n = Math.min(n + 1, pct);
      numEl.textContent = n + '%';
      if (n >= pct) clearInterval(interval);
    }, 20);
  }

  /* Animer le cercle */
  setTimeout(() => {
    const fill = document.querySelector('.score-circle-fill');
    if (fill) fill.style.strokeDashoffset = circumf * (1 - pct / 100);
  }, 100);

  /* Stats */
  const s1 = $('res-correct');  if (s1) s1.textContent = state.correct + '/' + total;
  const s2 = $('res-score');    if (s2) s2.textContent = state.score.toLocaleString('fr-BE');
  const s3 = $('res-streak');   if (s3) s3.textContent = '×' + state.maxStreak;

  /* Badge niveau */
  const badge = $('result-level-badge');
  if (badge) {
    const labels = { debutant:'🌱 Débutant', intermediaire:'📈 Intermédiaire', expert:'🎯 Expert' };
    badge.innerHTML = `${labels[state.level]} · ${pct}% de réussite`;
  }

  /* Confetti si > 70% */
  if (pct >= 70) launchConfetti();
}

/* ════════ NEXT QUESTION ════════ */
function nextQuestion() {
  state.current++;
  if (state.current >= state.questions.length) {
    showResult();
  } else {
    const card = document.querySelector('.question-card');
    if (card) card.style.animation = 'none';
    setTimeout(() => {
      if (card) card.style.animation = '';
      renderQuestion();
    }, 100);
  }
}

/* ════════ START QUIZ ════════ */
function startQuiz() {
  const all = QUESTIONS[state.level];
  /* Mélange et prend 10 questions */
  state.questions = [...all].sort(() => Math.random() - .5).slice(0, 10);
  state.current  = 0;
  state.score    = 0;
  state.streak   = 0;
  state.maxStreak= 0;
  state.correct  = 0;

  showScreen('quiz');
  renderQuestion();
}

/* ════════ PARTAGE ════════ */
function shareResult() {
  const pct = Math.round((state.correct / state.questions.length) * 100);
  const lvl = { debutant:'Débutant', intermediaire:'Intermédiaire', expert:'Expert' }[state.level];
  const text = `Je viens de faire ${pct}% au quiz investissement ${lvl} sur EnvieInvestir ! 🎯\nTeste-toi aussi : https://envieinvestir.com/quiz`;
  if (navigator.share) {
    navigator.share({ title:'Quiz EnvieInvestir', text });
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('Lien copié ! 📋'));
  }
}

/* ════════ LEVEL SELECT ════════ */
function selectLevel(lvl) {
  state.level = lvl;
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === lvl);
  });
}

/* ════════ INIT ════════ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();

  /* Mascot accueil */
  const homeMascot = $('home-mascot');
  if (homeMascot) homeMascot.innerHTML = getMascotSVG('happy', 160);

  /* Niveau par défaut */
  selectLevel('debutant');
  showScreen('home');

  /* Events */
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', () => selectLevel(btn.dataset.level));
  });

  const btnStart = $('btn-start');
  if (btnStart) btnStart.addEventListener('click', startQuiz);

  const btnNext = $('btn-next');
  if (btnNext) btnNext.addEventListener('click', nextQuestion);

  const btnRetry = $('btn-retry');
  if (btnRetry) btnRetry.addEventListener('click', () => { showScreen('home'); });

  const btnShare = $('btn-share');
  if (btnShare) btnShare.addEventListener('click', shareResult);
});
