// BLB — univers fictif
// label de rap underground / capsule streetwear
// ──────────────────────────────────────────────

const BLB_DATA = {
  brand: {
    name: 'BLB',
    long: 'BLOC LIBRE BÂTARD',
    motto: 'RADAR · TEXTILES · FRÉQUENCES',
    estab: 'EST. 2019 — PARIS / 75',
    coords: '48.8566° N · 2.3522° E',
  },

  // countdown target — ~12 jours dans le futur (depuis le 21 mai 2026)
  drop: {
    code: 'PROTOCOLE 008',
    name: 'RADAR',
    target: '2026-06-06T21:21:21+02:00',
    blurb:
      "Huitième capsule. 14 pièces textiles + pressage vinyle limité 300 ex. Confection France, sérigraphie main. Aucun restock — disparaît au coup de minuit.",
    pieces: 14,
    state: 'EN ATTENTE',
  },

  nav: [
    { label: 'BOUTIQUE', href: '#boutique' },
    { label: 'CATÉGORIES', href: '#categories' },
    { label: 'DROPS', href: '#drops' },
    { label: 'ARCHIVES', href: '#archives' },
    { label: 'ATELIER', href: '#atelier' },
  ],

  // 8 pièces du drop courant
  products: [
    {
      id: 'p01',
      ref: 'BLB-008-01',
      name: 'HOODIE RADAR',
      sub: 'Capsule Protocole 008',
      price: 145,
      tag: 'NEW',
      explicit: false,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: 'BAS',
      desc: "Capuche oversize en molleton 480gsm écru/noir. Broderie radar bras gauche, sérigraphie dos « ON GUETTE ».",
    },
    {
      id: 'p02',
      ref: 'BLB-008-02',
      name: 'VINYLE — PROTOCOLE 008',
      sub: 'LP 12" — 180g — édition de 300',
      price: 38,
      tag: 'LIMITED',
      explicit: true,
      sizes: ['STANDARD'],
      stock: '47 / 300',
      desc: "12 titres inédits du roster pressés sur vinyle 180g. Pochette gatefold sérigraphiée à la main par AMAS.",
    },
    {
      id: 'p03',
      ref: 'BLB-008-03',
      name: 'TEE EXPLICIT',
      sub: 'Coton lourd 240gsm — coupe boxy',
      price: 65,
      tag: null,
      explicit: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      stock: 'OK',
      desc: "Tee jersey lourd, encolure côtelée renforcée. Sérigraphie ton sur ton dos + marquage parental front.",
    },
    {
      id: 'p04',
      ref: 'BLB-008-04',
      name: 'BEANIE SENTINELLE',
      sub: 'Laine recyclée — broderie BLB',
      price: 45,
      tag: null,
      explicit: false,
      sizes: ['UNIQUE'],
      stock: 'OK',
      desc: "Beanie maille serrée 100% laine recyclée. Broderie monogramme front + étiquette tissée intérieur.",
    },
    {
      id: 'p05',
      ref: 'BLB-008-05',
      name: 'VESTE TACTIQUE',
      sub: 'Nylon militaire — coupe utility',
      price: 280,
      tag: 'PIÈCE FORTE',
      explicit: false,
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 'BAS',
      desc: "Veste nylon enduit déperlant, 6 poches utility, doublure nylon orange signalisation. Broderie radar épaule.",
    },
    {
      id: 'p06',
      ref: 'BLB-008-06',
      name: 'CAPSULE PANTALON',
      sub: 'Cargo coton lourd 380gsm',
      price: 95,
      tag: null,
      explicit: false,
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 'OK',
      desc: "Pantalon cargo coupe droite, ceinture sangle, 8 poches dont 2 zippées. Patch tissé arrière.",
    },
    {
      id: 'p07',
      ref: 'BLB-008-07',
      name: 'CASSETTE ANALOGIQUE',
      sub: 'K7 dub — 60 min — 200 ex.',
      price: 22,
      tag: 'LIMITED',
      explicit: true,
      sizes: ['STANDARD'],
      stock: '88 / 200',
      desc: "Dub K7 60 minutes mastérisée à l'analogique. Pochette risographie 2 passages, étiquettes manuscrites.",
    },
    {
      id: 'p08',
      ref: 'BLB-008-08',
      name: 'BRACELET ACIER',
      sub: 'Acier 316L — gravure laser',
      price: 55,
      tag: null,
      explicit: false,
      sizes: ['S', 'M', 'L'],
      stock: 'OK',
      desc: "Bracelet maille acier 316L. Plaque gravée laser coordonnées QG + numéro de série individuel.",
    },
  ],

  artists: [],

  categories: [
    {
      id: 'textile',
      n: '01',
      name: 'TEXTILE',
      count: 6,
      tags: 'HOODIES · TEES · VESTES · PANTALONS',
      blurb: "Confection France. Coton lourd, molleton brossé, nylon enduit. Sérigraphie main, 3 passages.",
    },
    {
      id: 'pressage',
      n: '02',
      name: 'PRESSAGE',
      count: 2,
      tags: 'VINYLES 180g · CASSETTES · CD ÉDITIONS',
      blurb: "Pressage limité numéroté. Mastering analogique. Pochettes risographiées en atelier.",
    },
    {
      id: 'accessoires',
      n: '03',
      name: 'ACCESSOIRES',
      count: 4,
      tags: 'BEANIES · BIJOUX · CASQUETTES · SACS',
      blurb: "Petites pièces, gros impact. Acier 316L gravé, broderie machine, finitions main.",
    },
  ],

  archives: [
    { code: '007', name: 'NOCTURNE', year: 2025, season: 'AUTOMNE', pieces: 11, status: 'SOLD OUT', accent: '#222' },
    { code: '006', name: 'BARRICADE', year: 2025, season: 'PRINTEMPS', pieces: 9, status: 'SOLD OUT', accent: '#1a1a1a' },
    { code: '005', name: 'SENTINELLE', year: 2024, season: 'AUTOMNE', pieces: 12, status: 'SOLD OUT', accent: '#252525' },
    { code: '004', name: 'CONTREBANDE', year: 2024, season: 'PRINTEMPS', pieces: 8, status: 'SOLD OUT', accent: '#1f1f1f' },
    { code: '003', name: 'CARGO', year: 2023, season: 'AUTOMNE', pieces: 10, status: 'SOLD OUT — 1 EXEMPLAIRE MUSÉE', accent: '#1a1a1a' },
    { code: '002', name: 'FRÉQUENCE', year: 2023, season: 'PRINTEMPS', pieces: 7, status: 'SOLD OUT', accent: '#252525' },
    { code: '001', name: 'PROTOTYPE', year: 2022, season: 'HIVER', pieces: 5, status: 'SOLD OUT — JAMAIS RESTOCKÉ', accent: '#1f1f1f' },
  ],

  atelier: {
    title: "FAIT À LA MAIN.\nÀ PARIS.\nÀ PETITS LOTS.",
    intro: "Chaque pièce passe par notre atelier du 19e. Sérigraphie main, confection chez deux ateliers partenaires (Paris 11 et Roubaix), zéro stock dormant.",
    stats: [
      { k: '04', l: 'PERSONNES À L\'ATELIER' },
      { k: '02', l: 'ATELIERS PARTENAIRES FR' },
      { k: '300', l: 'PIÈCES MAX PAR DROP' },
      { k: '00', l: 'PIÈCE RESTOCKÉE EN 4 ANS' },
    ],
    steps: [
      { n: '01', t: 'DESSIN', d: "Croquis main, brief textile, choix matière + grammage." },
      { n: '02', t: 'PROTO', d: "Patron, 3 prototypes essayés, ajustement coupe." },
      { n: '03', t: 'CONFECTION', d: "Production en petits lots chez nos ateliers partenaires FR." },
      { n: '04', t: 'SÉRIGRAPHIE', d: "Encres écologiques, 3 passages main, séchage 24h." },
      { n: '05', t: 'EXPÉDITION', d: "Emballage scellé, étiquette numérotée, expédition une fois le drop fermé." },
    ],
  },

  faq: [
    {
      q: "Comment fonctionne un drop ?",
      a: "Chaque drop ouvre à une date précise (countdown sur la home), reste accessible 7 jours, puis ferme. Les pièces non vendues partent au pilon — aucun restock."
    },
    {
      q: "Quelles sont les tailles disponibles ?",
      a: "XS à XXL pour le textile, taille unique pour les accessoires. Guide des tailles détaillé sur chaque fiche produit. En cas de doute, contacte-nous avant achat."
    },
    {
      q: "Combien de temps pour la livraison ?",
      a: "Expédition sous 5 à 10 jours après la fermeture du drop. Livraison France : 2-3 jours (Colissimo suivi). Europe : 4-7 jours. Monde : 7-14 jours."
    },
    {
      q: "Puis-je retourner une pièce ?",
      a: "Oui, sous 14 jours après réception. Pièce non portée, étiquette d'origine. Frais de retour à ta charge. Pas de retour sur les pressages vinyle / cassette ouverts."
    },
    {
      q: "Paiement sécurisé ?",
      a: "CB, Apple Pay, Google Pay, PayPal, Bancontact. Paiement en 3× sans frais via Klarna à partir de 100€. Aucune donnée stockée sur nos serveurs."
    },
    {
      q: "Vous restockez ?",
      a: "Jamais. C'est la règle. Si tu vois une pièce que tu aimes — c'est maintenant ou jamais. Quatre ans, zéro exception."
    },
  ],

  // ticker — bandeau d'actualité défilante
  ticker: [
    'PROTOCOLE 008 — DROP 06.06.26',
    'PAIEMENT 3× SANS FRAIS DÈS 100€',
    'LIVRAISON FRANCE OFFERTE DÈS 80€',
    'CONFECTION FRANCE — ATELIERS PARTENAIRES',
    'PRESSAGE VINYLE LIMITÉ — 300 EX.',
    'AUCUN RESTOCK — UNE FOIS PARTI, PARTI',
    'INSCRIPTION RADAR REQUISE',
  ],

  // journal kept for backward compat — not rendered anywhere
  journal: [],
};

window.BLB_DATA = BLB_DATA;
