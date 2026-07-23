import React from "react"
import { css } from "./css"
import ImageSlot from "./ImageSlot.jsx"
import { renderApp } from "./render.jsx"
import { Engine } from "./demo/engine"
import { getScenario, SCENARIO_LIST } from "./demo/scenarios/index"

// ============================================================================
//  Paleoclim -- coeur logique porte depuis le prototype (Paleoclim.dc.html).
//  Donnees scientifiques embarquees + methodes + renderVals() : quasi verbatim.
// ============================================================================

class PaleoApp extends React.Component {
  state = { screen: 'home', menuOpen: false, eraId: 0, age: 0, tmRange: 'full', tmScrub: 1000, evt: null, mapPeriod: 'pangea', reveal: 50, pinX: 52, pinY: 46, pinLabel: 'Votre région', dragging: false, proxy: null, grow: 100, playing: false, extreme: null, dsOn: { epica: true, sea: true, lr04: true }, shiftDs: 'sea', shiftKa: 0, dCalcite: '-1.5', dWater: '0.0', eqId: 'shack', ecc: 1.67, obl: 23.44, prec: 283, season: 90, glossQ: '', glossCat: 'Tous', site: null, siteCat: 'Tous', addMode: false, userSites: [], helpOpen: false, globePeriod: 4, globeRotate: true, geoQ: '', geoSel: null, histYear: 2008, storyId: 0, extinctId: null, atlasId: null, sciId: null, catMenu: null, tmInfo: null, pinSugOpen: false, glossId: null };
  globeRef = React.createRef();
  mapRef = React.createRef();
  cmpRef = React.createRef();
  scrollRef = React.createRef();
  componentWillUnmount() { clearInterval(this.timer); if (this.globePoll) clearInterval(this.globePoll); this.disposeGlobe(); if (this.demo) this.demo.stop(); }
  componentDidMount() {
    if (this.state.screen === 'globe') this.tryInitGlobe();
    const demoId = new URLSearchParams(window.location.search).get('demo');
    if (demoId && getScenario(demoId)) setTimeout(() => this.startDemo(demoId), 400);
  }

  // ── Mode démo : pont app ↔ moteur (DemoHost) ──
  // « Store réel » protégé : snapshot avant démo, restore à la sortie ; seed en mémoire, jamais persisté.
  demoHost = {
    get root() { return document.getElementById('root') || document.body; },
    get reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; },
    navigate: (screen) => new Promise((res) => {
      this.setState({ screen, menuOpen: false, catMenu: null, helpOpen: false }, () => {
        if (this.scrollRef && this.scrollRef.current) this.scrollRef.current.scrollTop = 0;
        res();
      });
    }),
    snapshot: () => ({ ...this.state }),
    restore: (snap) => { if (snap) this.setState(snap); },
    applySeed: (seed) => { if (seed && seed.userSites) this.setState({ userSites: seed.userSites }); },
  };
  startDemo(id) {
    const sc = getScenario(id);
    if (!sc) return;
    if (!this.demo) this.demo = new Engine(this.demoHost);
    this.demo.load(sc);
    this.demo.play();
  }
  componentDidUpdate(pp, ps) {
    if (this.state.screen === 'globe') {
      this.tryInitGlobe();
      if (this.globe && this.state.geoSel && (ps.geoSel !== this.state.geoSel || ps.globePeriod !== this.state.globePeriod)) {
        const pp2 = this.paleoPos(this.state.geoSel, this.state.globePeriod);
        this.globe.lon0 = pp2.lng; this.globe.lat0 = Math.max(-70, Math.min(70, pp2.lat));
      }
    } else if (ps.screen === 'globe') {
      this.disposeGlobe();
      if (this.globePoll) { clearInterval(this.globePoll); this.globePoll = null; }
    }
  }

  eras = [
    { name: 'Quaternaire', span: '2,58 Ma – présent', color: '#6fb2d1', wash: '#e4f0f5', img: '/eras/quaternaire.svg',
      tag: 'Cycles glaciaires–interglaciaires rythmés par les paramètres orbitaux de Milankovitch.',
      co2: '180–300 ppm', temp: '≈ −5 à +1 °C', ice: 'Étendues', regime: 'Glaciaire',
      body: "Le Quaternaire est marqué par l'alternance régulière de calottes massives et de brefs interglaciaires chauds. Les carottes de glace antarctiques (EPICA Dome C) restituent en continu 800 000 ans de CO₂, de CH₄ et de température, révélant un couplage étroit entre gaz à effet de serre et climat, et une variation naturelle du CO₂ confinée entre ~180 et ~300 ppm. C'est l'archive de référence pour évaluer le forçage anthropique actuel.",
      subperiods: [
        { name: 'Pléistocène', span: '2,58 Ma – 11,7 ka' },
        { name: 'Holocène', span: '11,7 ka – présent' }
      ],
      events: [
        { when: '2,58 Ma', what: "Intensification des glaciations de l'hémisphère nord (englacement Groenland)." },
        { when: '~1,25–0,7 Ma', what: 'Transition du Pléistocène moyen : passage des cycles de 41 ka à 100 ka.' },
        { when: '~130–115 ka', what: 'Dernier interglaciaire (Eemien) : CO₂ ~287 ppm, mer 6–9 m plus haut.' },
        { when: '21 ka', what: 'Dernier Maximum Glaciaire : CO₂ ~185 ppm, niveau marin ~120 m plus bas.' },
        { when: '12,9–11,7 ka', what: 'Dryas récent : refroidissement abrupt de l\u2019hémisphère nord.' },
        { when: '11,7 ka', what: 'Début de l\u2019Holocène, interglaciaire stable ; puis forçage anthropique.' }
      ],
      proxies: [
        'δD et δ¹⁸O de la glace → paléotempérature locale (carottes EPICA, Vostok, Dome Fuji).',
        'Air piégé dans les bulles → concentrations directes de CO₂ et CH₄.',
        'δ¹⁸O des foraminifères benthiques (marin) → volume global de glace.',
        'Pollens et δ¹⁸O des spéléothèmes → hydrologie continentale.'
      ] },
    { name: 'Cénozoïque ancien', span: '66 – 2,58 Ma', color: '#8fbfc9', wash: '#e6f0f2', img: '/eras/cenozoique.svg',
      tag: "Long refroidissement depuis l'optimum de l'Éocène jusqu'à l'englacement des pôles.",
      co2: '~280–1400 ppm', temp: '≈ +4 à +12 °C', ice: 'Naissantes', regime: 'Transition',
      body: "Après le pic de chaleur du maximum thermique Paléocène–Éocène (PETM), la Terre entame un refroidissement séculaire tracé par la courbe δ¹⁸O benthique de Zachos, lié à la baisse du CO₂ (altération himalayenne) et à la réorganisation océanique. La calotte antarctique s'installe vers 34 Ma, celle du Groenland bien plus tard (~2,7 Ma), préparant le monde bipolaire du Quaternaire.",
      subperiods: [
        { name: 'Paléogène', span: '66 – 23 Ma' },
        { name: 'Néogène', span: '23 – 2,58 Ma' }
      ],
      events: [
        { when: '56 Ma', what: 'PETM : injection massive de carbone, +5 à +8 °C en quelques millénaires.' },
        { when: '~50 Ma', what: 'Optimum climatique de l\u2019Éocène précoce : climat le plus chaud du Cénozoïque.' },
        { when: '34 Ma', what: "Englacement de l'Antarctique (transition Éocène–Oligocène), chute du CO₂." },
        { when: '17–15 Ma', what: 'Optimum climatique du Miocène moyen, puis refroidissement.' },
        { when: '~2,7 Ma', what: 'Installation de la calotte du Groenland ; entrée dans les glaciations.' }
      ],
      proxies: [
        'δ¹⁸O des foraminifères benthiques → température de fond et volume de glace.',
        'δ¹¹B et rapport B/Ca des foraminifères → pH océanique et pCO₂.',
        'Alcénones (indice UK′37) et TEX86 → température de surface des mers.',
        'Densité stomatique des feuilles fossiles → CO₂ atmosphérique.'
      ] },
    { name: 'Mésozoïque', span: '252 – 66 Ma', color: '#7fbfa2', wash: '#e7f2ec', img: '/eras/mesozoique.svg',
      tag: 'Monde « serre » chaud, largement dépourvu de glace polaire pérenne.',
      co2: '~1000–2000 ppm', temp: '≈ +10 à +14 °C', ice: 'Quasi nulles', regime: 'Serre',
      body: "L'ère des dinosaures se déroule sous un climat chaud entretenu par un volcanisme actif et la dislocation de la Pangée. Les pôles restent tempérés, sans grande calotte, et le niveau marin est haut. Des événements anoxiques océaniques (OAE), lisibles dans les excursions du δ¹³C, ponctuent le Crétacé et enfouissent d'importantes quantités de carbone.",
      subperiods: [
        { name: 'Trias', span: '252 – 201 Ma' },
        { name: 'Jurassique', span: '201 – 145 Ma' },
        { name: 'Crétacé', span: '145 – 66 Ma' }
      ],
      events: [
        { when: '201 Ma', what: 'Extinction Trias–Jurassique liée au volcanisme de la CAMP.' },
        { when: '183 Ma', what: 'Événement anoxique océanique du Toarcien (OAE-T), pic de CO₂.' },
        { when: '120–90 Ma', what: 'Optimum chaud du Crétacé ; OAE-1 et OAE-2, pôles sans glace.' },
        { when: '66 Ma', what: 'Impact de Chicxulub + trapps du Deccan : extinction K–Pg.' }
      ],
      proxies: [
        'δ¹⁸O des rostres de bélemnites et des foraminifères → paléotempérature marine.',
        'Excursions du δ¹³C → cycle du carbone et événements anoxiques (OAE).',
        'TEX86 (archées) → température de surface des océans chauds.',
        'Stomates et modèles géochimiques (GEOCARB) → pCO₂ élevé.'
      ] },
    { name: 'Paléozoïque', span: '541 – 252 Ma', color: '#d0a95f', wash: '#f3ecdd', img: '/eras/paleozoique.svg',
      tag: 'Grandes bascules : glaciations continentales et effondrement du CO₂.',
      co2: '~300–4000 ppm', temp: '≈ −2 à +8 °C', ice: 'Variables', regime: 'Contrasté',
      body: "Le Paléozoïque voit l'essor de la vie complexe, la conquête des continents par les plantes et de fortes bascules climatiques. La chute du CO₂ au Carbonifère, liée à l'enfouissement massif de carbone végétal, déclenche la Glaciation du Paléozoïque tardif (LPIA). L'ère s'achève par la plus grande extinction de tous les temps, à la limite Permien–Trias.",
      subperiods: [
        { name: 'Cambrien', span: '541 – 485 Ma' },
        { name: 'Ordovicien–Silurien', span: '485 – 419 Ma' },
        { name: 'Dévonien', span: '419 – 359 Ma' },
        { name: 'Carbonifère–Permien', span: '359 – 252 Ma' }
      ],
      events: [
        { when: '445 Ma', what: 'Glaciation de l\u2019Hirnantien ; extinction Ordovicien–Silurien.' },
        { when: '~375 Ma', what: 'Crises du Dévonien tardif, liées à l\u2019expansion des plantes vasculaires.' },
        { when: '340–290 Ma', what: 'Glaciation du Paléozoïque tardif (LPIA) ; forêts, charbon, CO₂ minimal.' },
        { when: '252 Ma', what: 'Extinction Permien–Trias (trapps de Sibérie) : ~90 % des espèces marines.' }
      ],
      proxies: [
        'δ¹⁸O des conodontes et des brachiopodes → paléotempérature.',
        'Tillites et dropstones → preuve directe d\u2019englacement continental.',
        'δ¹³C des carbonates et modèle GEOCARB → variations du CO₂.',
        'Paléosols et indice stomatique → CO₂ atmosphérique.'
      ] },
    { name: 'Protérozoïque', span: '2500 – 541 Ma', color: '#a595c9', wash: '#eeeaf4', img: '/eras/proterozoique.svg',
      tag: 'Grande Oxydation et épisodes de « Terre boule de neige ».',
      co2: 'Très variable', temp: 'Extrêmes', ice: 'Globales (Cryogénien)', regime: 'Extrême',
      body: "La photosynthèse oxygénique transforme l'atmosphère lors de la Grande Oxydation (~2,4 Ga). Au Cryogénien, des glaciations quasi totales enveloppent la planète (« Snowball Earth »), attestées par des dépôts glaciaires à basse latitude et surmontées de capuchons carbonatés ; elles sont suivies de réchauffements brutaux par accumulation de CO₂ volcanique. Ces crises précèdent l'essor de la vie multicellulaire.",
      subperiods: [
        { name: 'Paléoprotérozoïque', span: '2500 – 1600 Ma' },
        { name: 'Mésoprotérozoïque', span: '1600 – 1000 Ma' },
        { name: 'Néoprotérozoïque', span: '1000 – 541 Ma' }
      ],
      events: [
        { when: '~2,4 Ga', what: 'Grande Oxydation (GOE) ; glaciations huroniennes associées.' },
        { when: '1,8–0,8 Ga', what: '« Milliard ennuyeux » : climat et chimie océanique très stables.' },
        { when: '720–635 Ma', what: 'Snowball Earth : glaciations sturtienne puis marinoenne.' },
        { when: '~575 Ma', what: 'Biote de l\u2019Édiacarien : premiers grands organismes pluricellulaires.' }
      ],
      proxies: [
        'Formations de fer rubané (BIF) → chimie redox des océans anciens.',
        'Dépôts glaciaires à basse paléolatitude (paléomagnétisme) → Snowball Earth.',
        'Capuchons carbonatés et excursions extrêmes du δ¹³C → déglaciations brutales.',
        'δ³⁴S et disparition du MIF-S → oxygénation de l\u2019atmosphère.'
      ] },
    { name: 'Archéen', span: '4000 – 2500 Ma', color: '#c78f8f', wash: '#f3e9e9', img: '/eras/archeen.svg',
      tag: 'Terre jeune sous un Soleil faible : le paradoxe du jeune Soleil.',
      co2: 'Élevé (CO₂/CH₄)', temp: 'Tempérée malgré tout', ice: 'Absentes', regime: 'Primitif',
      body: "Le Soleil archéen était ~20–25 % moins lumineux qu'aujourd'hui, et pourtant l'eau liquide était présente : c'est le paradoxe du jeune Soleil faible. Une atmosphère riche en CO₂ et méthane, dépourvue d'oxygène libre (signature MIF du soufre), aurait maintenu un fort effet de serre. Les premiers procaryotes et stromatolithes apparaissent et façonnent peu à peu la géochimie de surface.",
      subperiods: [
        { name: 'Éo/Paléoarchéen', span: '4000 – 3200 Ma' },
        { name: 'Mésoarchéen', span: '3200 – 2800 Ma' },
        { name: 'Néoarchéen', span: '2800 – 2500 Ma' }
      ],
      events: [
        { when: '~3,8 Ga', what: 'Plus anciennes traces isotopiques (δ¹³C) attribuées à la vie.' },
        { when: '~3,5 Ga', what: 'Premiers stromatolithes ; atmosphère anoxique à effet de serre.' },
        { when: '~2,7 Ga', what: 'Essor des cyanobactéries productrices d\u2019oxygène.' },
        { when: '~2,5 Ga', what: 'Prélude à la Grande Oxydation à la charnière avec le Protérozoïque.' }
      ],
      proxies: [
        'Fractionnement indépendant de la masse du soufre (MIF-S) → atmosphère sans O₂.',
        'δ¹⁸O et δ³⁰Si des cherts → température (débattue) des océans anciens.',
        'δ¹³C de la matière organique → présence précoce de la biosphère.',
        'Stromatolithes et microfossiles → activité microbienne.'
      ] }
  ];

  archives = [
    { id: 'ice', name: 'Carottes de glace', color: '#4a9cc9', wash: '#e7f2f8', icon: '❄',
      tag: "Glace polaire feuilletée en couches annuelles.",
      forme: "La neige tombée chaque année se tasse en névé puis en glace. Les pores se referment et emprisonnent des bulles d'air : une atmosphère fossile scellée, couche après couche.",
      mesure: "Température locale (δD, δ¹⁸O de la glace), concentrations directes de CO₂ et CH₄ dans les bulles, poussières, cendres volcaniques, activité solaire (¹⁰Be).",
      precision: "Annuelle à décennale dans les couches récentes ; se dégrade en profondeur par tassement et diffusion.",
      reach: "≈ 800 000 ans (EPICA Dome C) ; jusqu'à ~2,7 Ma sur glace bleue ancienne." },
    { id: 'sediment', name: 'Sédiments océaniques', color: '#5f8f7a', wash: '#eaf2ee', icon: '≋',
      tag: "Les plus longues archives continues du climat.",
      forme: "Coquilles microscopiques et particules terrigènes tombent en « pluie » constante sur le fond marin et s'empilent ; les couches profondes sont les plus anciennes.",
      mesure: "Volume global de glace et température (δ¹⁸O, Mg/Ca des foraminifères), productivité, circulation océanique, apports continentaux.",
      precision: "Du siècle au millénaire selon le taux de sédimentation ; la bioturbation lisse les signaux courts.",
      reach: "Des dizaines à des centaines de millions d'années (records les plus longs disponibles)." },
    { id: 'pollen', name: 'Pollens fossiles', color: '#b0863c', wash: '#f4efe1', icon: '❀',
      tag: "La végétation passée lue grain par grain.",
      forme: "Les grains de pollen, à paroi très résistante, se déposent et se conservent dans les sédiments de lacs et de tourbières, en couches successives.",
      mesure: "Composition de la végétation régionale, d'où l'on déduit température et précipitations (climat continental) et l'impact humain sur les paysages.",
      precision: "Décennale à séculaire ; résolution spatiale régionale, non ponctuelle.",
      reach: "Du présent à plusieurs millions d'années dans les longues séquences lacustres." },
    { id: 'coral', name: 'Coraux', color: '#c56f7a', wash: '#f6eaec', icon: '✽',
      tag: "Thermomètres tropicaux à croissance rythmée.",
      forme: "Les coraux hermatypiques déposent un squelette d'aragonite en bandes de croissance annuelles, comme des cernes sous-marins.",
      mesure: "Température et salinité de surface (δ¹⁸O, Sr/Ca), variations ENSO/mousson, niveau marin (coraux fossiles émergés).",
      precision: "Mensuelle à saisonnière — parmi les plus fines des proxies marins.",
      reach: "Quelques siècles en continu ; fenêtres ponctuelles jusqu'à ~500 ka via coraux fossiles datés à l'U-Th." },
    { id: 'speleo', name: 'Spéléothèmes', color: '#8a6fb0', wash: '#efeaf5', icon: '⌇',
      tag: "Stalagmites : pluie enregistrée goutte à goutte.",
      forme: "L'eau d'infiltration dépose de fines couches de calcite dans les grottes, formant stalagmites et stalactites lamellées.",
      mesure: "Hydrologie continentale et intensité des moussons (δ¹⁸O, δ¹³C), température, couverture végétale au-dessus de la grotte.",
      precision: "Annuelle à décennale, avec une datation U-Th très précise et absolue.",
      reach: "Jusqu'à ~600 000 ans (limite pratique de la datation uranium-thorium)." },
    { id: 'tree', name: 'Cernes des arbres', color: '#7a9c4a', wash: '#eef3e4', icon: '◎',
      tag: "Un anneau de croissance par an, daté à l'année.",
      forme: "Chaque année, l'arbre ajoute un cerne clair (printemps) et un cerne sombre (fin d'été) dont largeur et densité dépendent du climat de la saison.",
      mesure: "Température estivale, précipitations, sécheresses, feux ; δ¹⁸O/δ¹³C de la cellulose pour le stress hydrique.",
      precision: "Annuelle, voire saisonnière — la résolution la plus fine et la mieux datée.",
      reach: "Plusieurs milliers d'années par interdatation de bois vivants et subfossiles (>12 000 ans en chêne/pin)." },
    { id: 'loess', name: 'Loess', color: '#c19a5b', wash: '#f4eede', icon: '⣿',
      tag: "Poussière éolienne empilée sur les continents.",
      forme: "Les vents des périodes glaciaires transportent et déposent des silts fins ; l'accumulation forme d'épaisses séquences, entrecoupées de paléosols aux périodes chaudes.",
      mesure: "Alternance glaciaire–interglaciaire, intensité des vents et de l'aridité, mousson (susceptibilité magnétique, granulométrie).",
      precision: "Millénaire ; le forçage est régional (aridité, régime des vents).",
      reach: "Jusqu'à ~2,6 millions d'années (plateau de Loess chinois)." },
    { id: 'peat', name: 'Tourbières', color: '#7d6a45', wash: '#f0ece3', icon: '▤',
      tag: "Matière végétale accumulée en milieu gorgé d'eau.",
      forme: "Dans les zones humides acides et anoxiques, les végétaux morts ne se décomposent pas totalement et s'accumulent en tourbe, couche après couche.",
      mesure: "Humidité locale et niveau de nappe, végétation (pollens, macro-restes), dépôts atmosphériques (métaux, cendres), δ¹³C.",
      precision: "Décennale à séculaire ; enregistre surtout l'hydrologie locale.",
      reach: "De l'Holocène (10–12 ka) à plusieurs dizaines de milliers d'années." },
    { id: 'microfossil', name: 'Microfossiles', color: '#5a8fa8', wash: '#e8f0f4', icon: '✦',
      tag: "Diatomées et radiolaires, indicateurs des eaux.",
      forme: "Les squelettes siliceux d'algues (diatomées) et de protozoaires (radiolaires) se déposent et se conservent dans les sédiments marins et lacustres.",
      mesure: "Température et salinité des eaux de surface, productivité, acidité et niveau des lacs, courants océaniques (fonctions de transfert d'assemblages).",
      precision: "Séculaire à millénaire, selon le support sédimentaire.",
      reach: "Des milliers à des millions d'années." },
    { id: 'foram', name: 'Foraminifères', color: '#4f7f9c', wash: '#e7eff4', icon: '◍',
      tag: "Les protistes-clés de la paléocéanographie.",
      forme: "Ces protozoaires marins bâtissent une coquille calcaire (test) ; benthiques (fond) et planctoniques (surface) sédimentent et sont triés espèce par espèce.",
      mesure: "Température (δ¹⁸O, Mg/Ca), volume de glace, pH et pCO₂ (δ¹¹B), circulation profonde (δ¹³C) — socle du stack LR04.",
      precision: "Du siècle au millénaire ; leur δ¹⁸O calibre l'échelle des cycles glaciaires.",
      reach: "Jusqu'à ~100 millions d'années dans les archives sédimentaires." }
  ];

  species = [
    { id: 'mammoth', name: 'Mammouth laineux', color: '#6f93b0', wash: '#e9f0f5', icon: 'Ma',
      tag: "Emblème de la steppe glaciaire du Pléistocène.",
      epoque: "Pléistocène supérieur à Holocène ancien (~400 000 – 4 000 ans).",
      climat: "Glaciaire froid et sec : la « steppe à mammouths » (mammouth-steppe), vaste prairie herbeuse péri-glaciaire.",
      temperature: "Froid marqué — adapté à des hivers bien plus rigoureux qu'aujourd'hui (pelage dense, graisse, petites oreilles).",
      alimentation: "Herbivore brouteur : graminées, carex et herbes de la steppe (jusqu'à ~180 kg de fourrage/jour).",
      repartition: "Holarctique : Eurasie du Nord et Amérique du Nord, reliées par la Béringie émergée.",
      indice: "Sa présence signe un climat froid et continental ; sa disparition (~4 ka pour les dernières populations de l'île Wrangel) accompagne le réchauffement post-glaciaire." },
    { id: 'trilobite', name: 'Trilobites', color: '#b0863c', wash: '#f4efe1', icon: 'Tr',
      tag: "Fossiles-guides du Paléozoïque marin.",
      epoque: "Paléozoïque : du Cambrien au Permien (~521 – 252 Ma), disparus lors de la Grande Mort.",
      climat: "Mers du Paléozoïque, du régime serre chaud aux épisodes glaciaires (Hirnantien, LPIA).",
      temperature: "Eaux marines chaudes à tempérées ; certains lignages tolèrent les eaux froides profondes.",
      alimentation: "Variée : détritivores, filtreurs, prédateurs ou charognards du fond marin.",
      repartition: "Tous les océans du globe ; excellents marqueurs biostratigraphiques par leur évolution rapide.",
      indice: "Fossiles-guides : chaque espèce date finement une strate. Leur diversité et leur répartition tracent la géographie et les crises marines du Paléozoïque." },
    { id: 'ammonite', name: 'Ammonites', color: '#8a6fb0', wash: '#efeaf5', icon: 'Am',
      tag: "Céphalopodes-horloges du Mésozoïque.",
      epoque: "Du Dévonien au Crétacé (~409 – 66 Ma), éteintes avec la crise K–Pg.",
      climat: "Apogée sous le climat serre chaud et sans glace du Mésozoïque, niveau marin élevé.",
      temperature: "Eaux marines chaudes ; le δ¹⁸O de leur coquille aragonitique restitue la température de l'eau.",
      alimentation: "Prédateurs et charognards nectoniques (plancton, petits animaux) capturés par les tentacules.",
      repartition: "Océans du monde entier ; évolution très rapide utilisée pour dater les couches marines.",
      indice: "Fossiles-guides majeurs du Mésozoïque ; l'isotopie de leur test enregistre température et chimie des mers chaudes." },
    { id: 'dino', name: 'Dinosaures', color: '#5f8f6a', wash: '#eaf2ec', icon: 'Di',
      tag: "Vertébrés dominants du monde « serre ».",
      epoque: "Trias supérieur au Crétacé terminal (~230 – 66 Ma) ; les non-aviens s'éteignent à la limite K–Pg.",
      climat: "Climat serre chaud, largement dépourvu de calotte polaire, avec des pôles tempérés et forestiers.",
      temperature: "Chaud : forêts polaires et absence de glace pérenne, même à haute latitude.",
      alimentation: "Herbivores (sauropodes, ornithischiens) et carnivores (théropodes) selon les groupes.",
      repartition: "Tous les continents, de la Pangée soudée aux masses continentales en dispersion.",
      indice: "Des restes de dinosaures à haute paléolatitude attestent de pôles doux et sans glace du Mésozoïque." },
    { id: 'smilodon', name: 'Smilodon', color: '#c56f5a', wash: '#f6ece7', icon: 'Sm',
      tag: "Prédateur à dents de sabre de l'ère glaciaire.",
      epoque: "Pléistocène à début Holocène (~2,5 Ma – 10 000 ans).",
      climat: "Climats glaciaires variés d'Amérique : prairies, savanes et zones boisées de la mégafaune.",
      temperature: "Tempéré à froid selon les régions ; contemporain des grands cycles glaciaires.",
      alimentation: "Hypercarnivore : embuscade sur grands herbivores (bisons, chevaux, jeunes proboscidiens).",
      repartition: "Amériques du Nord et du Sud ; abondant dans les fosses d'asphalte de Rancho La Brea.",
      indice: "Son abondance suit celle de la mégafaune herbivore ; son extinction marque l'effondrement de cette faune à la fin du Pléistocène." },
    { id: 'megatherium', name: 'Mégathérium', color: '#a5824a', wash: '#f2ecdf', icon: 'Mg',
      tag: "Paresseux géant terrestre d'Amérique du Sud.",
      epoque: "Pliocène à Pléistocène terminal (~5 Ma – 10 000 ans).",
      climat: "Milieux ouverts tempérés à semi-arides et savanes de la fin du Cénozoïque.",
      temperature: "Tempéré ; il traverse les alternances glaciaires-interglaciaires sud-américaines.",
      alimentation: "Herbivore folivore : feuillages arrachés en se dressant sur les pattes arrière.",
      repartition: "Amérique du Sud, remontant vers le Nord lors du Grand Échange américain.",
      indice: "Grand mammifère de la mégafaune ; sa disparition à la transition Pléistocène–Holocène balise le réchauffement et l'arrivée humaine." },
    { id: 'foram', name: 'Foraminifères', color: '#4f7f9c', wash: '#e7eff4', icon: '◍',
      tag: "Protistes-clés de la paléocéanographie.", iconMono: true,
      epoque: "Du Cambrien à l'actuel (~500 Ma – aujourd'hui) ; toujours vivants.",
      climat: "Tous les régimes climatiques marins depuis le Paléozoïque.",
      temperature: "Enregistrent la température de l'eau via le δ¹⁸O et le Mg/Ca de leur coquille calcaire.",
      alimentation: "Microphages : bactéries, phytoplancton, matière organique en suspension ou sur le fond.",
      repartition: "Océans du monde entier — planctoniques (surface) et benthiques (fond).",
      indice: "Proxy de référence : leur δ¹⁸O calibre l'échelle des cycles glaciaires (stack LR04) ; les assemblages tracent température et masses d'eau." },
    { id: 'coral', name: 'Coraux fossiles', color: '#c56f7a', wash: '#f6eaec', icon: 'Co',
      tag: "Bâtisseurs de récifs, thermomètres tropicaux.",
      epoque: "De l'Ordovicien à l'actuel (~485 Ma – aujourd'hui).",
      climat: "Mers tropicales chaudes, claires et peu profondes ; les récifs s'effondrent lors des grandes crises.",
      temperature: "Eaux chaudes (~20–29 °C) ; croissance en bandes annuelles enregistrant la température (δ¹⁸O, Sr/Ca).",
      alimentation: "Filtreurs planctonivores en symbiose avec des algues zooxanthelles photosynthétiques.",
      repartition: "Ceinture tropicale ; les récifs fossiles marquent d'anciennes mers chaudes peu profondes.",
      indice: "Indicateurs d'eaux chaudes et lumineuses ; les « gaps récifaux » signalent réchauffements extrêmes, acidification ou extinctions." }
  ];

  // Composite EPICA/Vostok — [âge ka, CO2 ppm, ΔT °C], 0..800 par pas de 20
  ice = [
    [0,280,0.2],[20,190,-8],[40,215,-6],[60,200,-6.5],[80,230,-4],[100,250,-3],
    [120,285,1.5],[140,200,-8],[160,200,-7.5],[180,215,-6],[200,240,-4.5],[220,250,-3],
    [240,285,1.5],[260,220,-5],[280,200,-7],[300,220,-6],[320,270,-1],[340,278,0.8],
    [360,210,-6],[380,215,-6],[400,278,0.8],[420,285,1],[440,210,-6],[460,210,-6],
    [480,250,-3],[500,265,-1.5],[520,240,-4],[540,225,-5],[560,250,-3],[580,270,-1],
    [600,255,-2],[620,270,-0.8],[640,230,-4.5],[660,225,-5],[680,245,-3],[700,255,-2],
    [720,245,-3],[740,270,-0.8],[760,255,-2],[780,240,-3],[800,230,-3.5]
  ];

  // ── Composite « temps profond » (schématique) — âge Ma → valeur ──
  cTemp = [[0,15],[0.02,8],[2.58,14],[5,16],[15,19],[34,18],[50,26],[56,28],[66,24],[90,26],[120,24],[145,22],[201,24],[230,25],[252,25],[300,12],[340,15],[360,20],[400,23],[430,22],[445,14],[480,25],[541,23],[600,16],[635,6],[680,18],[720,8],[1000,20],[1800,20],[2200,20],[2400,12],[3000,22],[3500,25],[4000,22],[4500,20]];
  cCo2 = [[0,420],[0.02,185],[2.58,280],[5,300],[15,400],[34,700],[50,1400],[56,1600],[66,800],[90,1000],[120,1500],[145,1500],[201,1200],[252,900],[300,300],[340,800],[400,3000],[445,4000],[480,5000],[541,5000],[635,1200],[720,1500],[1000,2000],[2000,4000],[2400,8000],[3000,15000],[3500,20000],[4000,30000],[4500,30000]];
  cSea = [[0,0],[0.02,-120],[2.58,-20],[5,10],[15,30],[34,20],[56,80],[66,100],[90,250],[120,200],[145,80],[201,50],[252,20],[300,-50],[340,80],[400,150],[430,180],[445,100],[480,200],[541,50],[600,10],[720,0],[1000,0],[2400,0],[4500,0]];
  cBio = [[0,3000],[2.58,2800],[5,2600],[15,2000],[34,1500],[56,1200],[66,900],[90,1400],[145,1000],[201,450],[230,500],[252,250],[300,1000],[340,800],[375,600],[400,900],[430,700],[445,500],[480,900],[541,300],[575,50],[635,5],[720,3],[1000,2],[2400,1],[4500,0]];
  events = [
    { age:56, cat:'Réchauffement', title:'Maximum thermique Paléocène–Éocène (PETM)', body:"Injection massive de carbone (>4 000 Gt) en quelques millénaires : +5 à +8 °C, forte acidification océanique et bouleversement des écosystèmes. Souvent cité comme analogue partiel — mais plus lent — du forçage anthropique actuel." },
    { age:66, cat:'Extinction', title:'Extinction Crétacé–Paléogène (K–Pg)', body:"Impact de l'astéroïde de Chicxulub conjugué aux trapps du Deccan : hiver d'impact bref puis perturbations climatiques. Disparition des dinosaures non-aviens et de ~75 % des espèces." },
    { age:90, cat:'Réchauffement', title:'Optimum thermique du Crétacé', body:"Climat serre sans glace polaire pérenne ; niveau marin jusqu'à ~250 m au-dessus de l'actuel et vastes mers épicontinentales. CO₂ élevé entretenu par un volcanisme intense." },
    { age:252, cat:'Extinction', title:'Extinction Permien–Trias', body:"La plus grande crise du Phanérozoïque. Les trapps de Sibérie déclenchent réchauffement, anoxie océanique et acidification ; ~90 % des espèces marines disparaissent." },
    { age:300, cat:'Glaciation', title:'Glaciation du Paléozoïque tardif (LPIA)', body:"L'enfouissement massif de carbone végétal (formation du charbon) fait chuter le CO₂ vers ~300 ppm ; de vastes calottes recouvrent le Gondwana pendant des dizaines de millions d'années." },
    { age:445, cat:'Glaciation', title:'Glaciation de l’Hirnantien', body:"Englacement rapide du Gondwana à la fin de l'Ordovicien : chute du niveau marin et extinction Ordovicien–Silurien, deuxième plus grande crise du Phanérozoïque." },
    { age:541, cat:'Biosphère', title:'Explosion cambrienne', body:"Diversification rapide des grands plans d'organisation animale et essor de la biodiversité marine, sur fond de climat chaud après la sortie du Cryogénien." },
    { age:660, cat:'Glaciation', title:'Snowball Earth — Cryogénien', body:"Glaciations sturtienne (~717 Ma) puis marinoenne (~650 Ma) : englacement quasi global atteignant les tropiques. Les déglaciations, provoquées par l'accumulation de CO₂ volcanique, sont brutales." },
    { age:2400, cat:'Atmosphère', title:'Grande Oxydation (GOE)', body:"La photosynthèse oxygénique fait monter l'O₂ atmosphérique, transformant durablement la chimie de surface. Des glaciations huroniennes lui sont associées." }
  ];

  proxies = {
    ice: {
      label: 'Carotte de glace', color: '#4a9cc9', accent: '#8fd0e6',
      what: "Une carotte de glace est un cylindre foré dans une calotte polaire. La neige tombée chaque année se tasse en couches de glace annuelles qui piègent bulles d'air, poussières et cendres.",
      records: 'CO₂, CH₄, température, volcanisme, poussières', reach: "jusqu'à ~800 000 ans (EPICA Dome C)",
      signal: 'δD / δ¹⁸O de la glace', signalNote: 'plus la glace est appauvrie en isotopes lourds, plus la température de condensation était basse.',
      steps: [
        { t: 'Accumulation', d: 'La neige tombe et forme des couches annuelles.' },
        { t: 'Compaction', d: 'Le névé se densifie ; les pores se referment.' },
        { t: 'Piégeage', d: "Des bulles d'air fossile emprisonnent l'atmosphère d'alors." },
        { t: 'Forage', d: 'On extrait un cylindre de glace couche par couche.' },
        { t: 'Analyse', d: 'Spectrométrie de masse : δ¹⁸O, CO₂, CH₄ des bulles.' }
      ],
      facts: ["EPICA Dome C couvre ~800 000 ans et 8 cycles glaciaires.", "Les bulles livrent une mesure directe du CO₂ passé — unique parmi les proxies."]
    },
    tree: {
      label: "Cerne d'arbre", color: '#b07a3c', accent: '#e0b070',
      what: "La dendrochronologie lit les anneaux de croissance annuels des arbres. Chaque année ajoute un cerne dont la largeur et la densité dépendent du climat de la saison.",
      records: 'Température estivale, précipitations, sécheresses', reach: 'quelques milliers d’années (bois subfossiles)',
      signal: 'Largeur & densité des cernes', signalNote: 'un cerne large traduit une saison favorable ; la densité du bois final trace la température estivale.',
      steps: [
        { t: 'Croissance', d: 'Un cerne clair (printemps) + un cerne sombre (fin d’été) par an.' },
        { t: 'Carottage', d: "On prélève une carotte à la tarière de Pressler, sans abattre l'arbre." },
        { t: 'Mesure', d: 'On mesure chaque cerne au micromètre près.' },
        { t: 'Interdatation', d: 'On raccorde les séries pour remonter dans le temps.' },
        { t: 'Analyse', d: 'δ¹⁸O / δ¹³C de la cellulose : hydrologie et stress hydrique.' }
      ],
      facts: ["L'interdatation raccorde bois vivants et poutres anciennes sur des millénaires.", "Largeur, densité et isotopes du même cerne livrent des signaux complémentaires."]
    },
    sediment: {
      label: 'Sédiment marin', color: '#6f8f6a', accent: '#a9c4a0',
      what: "Les carottes de sédiments océaniques empilent des couches de boue et de coquilles microscopiques (foraminifères). Elles offrent les plus longues archives climatiques continues.",
      records: 'Température, volume de glace, productivité', reach: 'des millions d’années',
      signal: 'δ¹⁸O des foraminifères', signalNote: "il combine température de l'eau et volume global de glace : la référence des cycles glaciaires (stack LR04).",
      steps: [
        { t: 'Sédimentation', d: 'Coquilles et particules tombent en « pluie » sur le fond.' },
        { t: 'Enfouissement', d: 'Les couches s’empilent, les plus profondes sont les plus vieilles.' },
        { t: 'Carottage', d: 'Un navire foreur prélève une carotte de plusieurs centaines de mètres.' },
        { t: 'Tri', d: 'On isole les foraminifères par espèce sous binoculaire.' },
        { t: 'Analyse', d: 'δ¹⁸O et Mg/Ca des coquilles → température et glace.' }
      ],
      facts: ["Le stack benthique LR04 couvre 5,3 millions d'années.", "Le Mg/Ca sépare l'effet température de l'effet volume de glace dans le δ¹⁸O."]
    }
  };

  extremes = [
    { id:'snowball', name:'Snowball Earth', cat:'Glaciation globale', color:'#3d7fa8', when:'≈ 717 – 635 Ma', era:'Cryogénien',
      dur:"Deux épisodes majeurs (Sturtien ~57 Ma, Marinoen ~15 Ma), chacun de plusieurs millions d'années.",
      summary:"Des glaciations si intenses que la banquise atteint probablement les tropiques, transformant la planète en boule de glace presque totale.",
      causes:["Baisse du CO₂ par altération intense des basaltes de la Rodinia près de l'équateur.","Position équatoriale des continents, très réfléchissante.","Emballement de l'albédo : plus il gèle, plus la Terre renvoie la lumière solaire."],
      consequences:["Quasi-arrêt de la photosynthèse océanique de surface.","Sortie brutale par effet de serre : le CO₂ volcanique s'accumule pendant des millions d'années sans altération.","Déglaciation express suivie de dépôts de capuchons carbonatés."],
      proofs:["Dépôts glaciaires (tillites) à paléolatitude équatoriale, calés par paléomagnétisme.","Capuchons carbonatés surmontant directement les tillites.","Excursions extrêmes du δ¹³C ; retour des formations de fer rubané."] },
    { id:'ypd', name:'Dryas récent (Younger Dryas)', cat:'Refroidissement abrupt', color:'#4a90c2', when:'≈ 12 900 – 11 700 ans', era:'Fin du Pléistocène',
      dur:"~1 200 ans ; bascule initiale possible en quelques décennies seulement.",
      summary:"En pleine déglaciation, l'hémisphère nord replonge brutalement dans des conditions quasi glaciaires, avant un réchauffement tout aussi rapide.",
      causes:["Débâcle d'eau douce (lac glaciaire Agassiz) dans l'Atlantique Nord.","Ralentissement de la circulation méridienne atlantique (AMOC) et du transport de chaleur.","Hypothèse d'un impact cosmique débattue, non consensuelle."],
      consequences:["Refroidissement de ~5 à 10 °C sur le pourtour de l'Atlantique Nord.","Réavancée des glaciers, retour de la toundra en Europe.","Pression sur les sociétés humaines ; contexte des débuts de l'agriculture au Proche-Orient."],
      proofs:["Carottes du Groenland (GISP2, NGRIP) : chute nette du δ¹⁸O.","Pollens (retour de Dryas octopetala, la plante éponyme).","Varves lacustres et enregistrements marins de l'Atlantique Nord."] },
    { id:'petm', name:'Maximum thermique PETM', cat:'Réchauffement extrême', color:'#c98a3d', when:'≈ 56 Ma', era:'Limite Paléocène–Éocène',
      dur:"Réchauffement en <20 000 ans ; retour à l'équilibre en ~150 000–200 000 ans.",
      summary:"Une injection massive de carbone réchauffe la planète de 5 à 8 °C et acidifie les océans — l'analogue géologique le plus étudié du réchauffement actuel.",
      causes:["Libération massive de carbone (>4 000 Gt) : volcanisme de l'Atlantique Nord, déstabilisation d'hydrates de méthane.","Rétroactions positives du cycle du carbone.","Déclencheur orbital possible."],
      consequences:["+5 à +8 °C globalement, davantage aux pôles.","Acidification et dissolution des carbonates au fond des océans.","Extinction de foraminifères benthiques ; grande dispersion des mammifères."],
      proofs:["Excursion négative marquée du δ¹³C dans les carbonates et la matière organique.","Horizon de dissolution des carbonates dans les carottes océaniques.","Assemblages fossiles et migration des espèces vers les pôles."] },
    { id:'ptme', name:'Extinction Permien–Trias', cat:'Extinction de masse', color:'#b5654a', when:'≈ 252 Ma', era:'Limite Permien–Trias',
      dur:"Crise principale en ~60 000 ans ; récupération des écosystèmes sur plusieurs millions d'années.",
      summary:"« La Grande Mort » : la plus sévère extinction du Phanérozoïque, ~90 % des espèces marines disparaissent.",
      causes:["Trapps de Sibérie : volcanisme colossal libérant CO₂, SO₂ et méthane.","Réchauffement rapide et anoxie océanique généralisée.","Acidification des océans, possibles remontées d'eaux euxiniques (H₂S)."],
      consequences:["~90 % des espèces marines et ~70 % des vertébrés terrestres éteints.","Effondrement des récifs ; « gap » de charbon au début du Trias.","Réorganisation profonde de la biosphère, ouvrant la voie aux dinosaures."],
      proofs:["Datations U-Pb reliant l'extinction aux trapps de Sibérie.","Excursion du δ¹³C et indicateurs géochimiques d'anoxie.","Disparition brutale des taxons dans les coupes (ex. Meishan, Chine)."] },
    { id:'kpg', name:'Extinction K–Pg', cat:'Extinction de masse', color:'#a15a4a', when:'≈ 66 Ma', era:'Limite Crétacé–Paléogène',
      dur:"Choc quasi instantané ; hiver d'impact de quelques années, perturbations sur des milliers d'années.",
      summary:"L'impact de Chicxulub, conjugué aux trapps du Deccan, met fin au règne des dinosaures non-aviens.",
      causes:["Impact d'un astéroïde de ~10 km à Chicxulub (Yucatán).","Injection massive de poussières et d'aérosols : « hiver d'impact ».","Trapps du Deccan aggravant le stress climatique."],
      consequences:["Extinction de ~75 % des espèces, dont les dinosaures non-aviens.","Effondrement de la photosynthèse, puis pic de CO₂ et réchauffement.","Essor des mammifères et des oiseaux au Paléogène."],
      proofs:["Couche mondiale d'iridium à la limite K–Pg (anomalie de Alvarez).","Cratère de Chicxulub, quartz choqués, sphérules et tsunamites.","Rupture nette des assemblages fossiles (foraminifères, pollens)."] },
    { id:'lpia', name:'Glaciation du Paléozoïque tardif', cat:'Ère glaciaire longue', color:'#4f8a9e', when:'≈ 340 – 290 Ma', era:'Carbonifère–Permien',
      dur:"Plusieurs dizaines de millions d'années, la plus longue glaciation du Phanérozoïque.",
      summary:"L'essor des forêts fait chuter le CO₂ et engendre de vastes calottes sur le Gondwana — l'analogue paléozoïque du monde glaciaire actuel.",
      causes:["Enfouissement massif de carbone végétal (formation du charbon) → chute du CO₂.","Position polaire du Gondwana favorisant l'accumulation de glace.","Faible apport volcanique de CO₂."],
      consequences:["Vastes calottes continentales sur le Gondwana ; cycles glaciaires-interglaciaires.","Fortes variations du niveau marin (cyclothèmes).","Fragmentation des habitats, endémisme des flores (Glossopteris)."],
      proofs:["Tillites et surfaces striées par les glaciers sur le Gondwana.","Cyclothèmes : alternances rythmiques traduisant les variations du niveau marin.","Gisements de charbon et flore de Glossopteris."] }
  ];

  glossary = [
    { term:'Bølling-Allerød', cat:'Événements', def:"Interstade de réchauffement rapide de l'hémisphère nord (~14 700–12 900 ans), interrompant la dernière déglaciation avant le Dryas récent." },
    { term:'Dryas récent', cat:'Événements', def:"Retour brutal à des conditions quasi glaciaires (~12 900–11 700 ans), attribué à un afflux d'eau douce ralentissant la circulation atlantique." },
    { term:'Téphra', cat:'Méthodes', def:"Ensemble des matériaux projetés par une éruption volcanique. Les couches de cendres (téphrochronologie) servent de repères temporels entre archives." },
    { term:'Diatomées benthiques', cat:'Proxies', def:"Algues unicellulaires à test siliceux vivant sur le fond ; leurs assemblages renseignent sur la productivité, la salinité et la profondeur." },
    { term:'Foraminifères', cat:'Proxies', def:"Protistes marins à coquille calcaire (planctoniques ou benthiques). Le δ¹⁸O et le Mg/Ca de leur test sont des proxies clés de température et de glace." },
    { term:'δ¹⁸O (delta O-18)', cat:'Isotopes', def:"Rapport entre isotopes ¹⁸O et ¹⁶O d'un échantillon, rapporté à un standard. Proxy de température et de volume de glace." },
    { term:'δ¹³C (delta C-13)', cat:'Isotopes', def:"Rapport ¹³C/¹²C. Trace la productivité biologique, la ventilation océanique et les perturbations du cycle du carbone." },
    { term:'δD (deutérium)', cat:'Isotopes', def:"Rapport deutérium/hydrogène de la glace. Proxy de la température de condensation dans les carottes polaires." },
    { term:'Mg/Ca', cat:'Proxies', def:"Rapport magnésium/calcium des tests de foraminifères ; dépend de la température de l'eau, il complète le δ¹⁸O." },
    { term:'Proxy', cat:'Concepts', def:"Indicateur naturel mesurable qui remplace une variable climatique non observée directement (température, CO₂, glace…)." },
    { term:'Alcénones (UK’37)', cat:'Proxies', def:"Lipides produits par certaines algues ; leur degré d'insaturation (indice UK’37) reconstitue la température de surface des mers." },
    { term:'TEX86', cat:'Proxies', def:"Proxy de température de surface basé sur les lipides membranaires d'archées marines (GDGT)." },
    { term:'Stade isotopique marin (MIS)', cat:'Concepts', def:"Découpage du δ¹⁸O benthique en stades pairs (glaciaires) et impairs (interglaciaires) numérotés depuis l'actuel (MIS 1)." },
    { term:'Terminaison', cat:'Concepts', def:"Transition rapide d'un maximum glaciaire vers un interglaciaire (ex. Terminaison I, ~18–11 ka)." },
    { term:'Cycles de Milankovitch', cat:'Concepts', def:"Variations orbitales (excentricité ~100/400 ka, obliquité ~41 ka, précession ~21 ka) modulant l'insolation et rythmant les glaciations." },
    { term:'Événement de Heinrich', cat:'Événements', def:"Débâcle massive d'icebergs dans l'Atlantique Nord, laissant des couches de débris détritiques dans les sédiments." },
    { term:'Événement anoxique océanique (OAE)', cat:'Événements', def:"Épisode d'appauvrissement en oxygène des océans, souvent lié à un réchauffement, laissant des schistes noirs riches en carbone." },
    { term:'Tillite', cat:'Méthodes', def:"Roche issue de la consolidation d'un till glaciaire ; preuve directe d'un englacement passé, y compris à basse latitude." },
    { term:'Capuchon carbonaté', cat:'Méthodes', def:"Couche de carbonate déposée juste au-dessus de dépôts glaciaires, marquant une déglaciation brutale (Snowball Earth)." },
    { term:'Spéléothème', cat:'Proxies', def:"Concrétion de grotte (stalagmite…) ; ses couches et son δ¹⁸O enregistrent l'hydrologie et le climat continentaux, datables à l'U-Th." },
    { term:'Varve', cat:'Méthodes', def:"Couche sédimentaire annuelle (souvent lacustre) permettant un comptage direct du temps." },
    { term:'Paléosol', cat:'Proxies', def:"Sol fossile ; sa composition (carbonates, indice stomatique associé) renseigne sur le climat et le CO₂ passés." },
    { term:'Forçage radiatif', cat:'Concepts', def:"Déséquilibre du bilan énergétique terrestre (W/m²) imposé par un facteur donné (CO₂, aérosols, orbite)." },
    { term:'AMOC', cat:'Concepts', def:"Circulation méridienne de retournement de l'Atlantique ; son ralentissement refroidit l'hémisphère nord (cf. Dryas récent)." },
    { term:'Loess', cat:'Proxies', def:"Dépôt éolien de fines poussières ; les séquences loess-paléosols enregistrent l'alternance de phases sèches (glaciaires) et humides." },
    { term:'Dropstone', cat:'Méthodes', def:"Bloc rocheux lâché par un iceberg ou une banquise en fusion dans un sédiment fin ; indice de transport glaciaire." },
    { term:'Formation de fer rubané (BIF)', cat:'Proxies', def:"Dépôts alternant fer et silice, typiques de l'océan précambrien pauvre en oxygène ; marqueurs de l'état redox ancien." },
    { term:'Pollen (palynologie)', cat:'Proxies', def:"Grains de pollen fossiles ; leurs assemblages reconstituent la végétation et donc le climat continental passé." },
    { term:'Chironomes', cat:'Proxies', def:"Larves d'insectes aquatiques dont les restes en lacs servent de thermomètre des températures estivales continentales." },
    { term:'Datation U-Th', cat:'Méthodes', def:"Datation par déséquilibre uranium-thorium, précise sur les carbonates (coraux, spéléothèmes) jusqu'à ~600 ka." },
    { term:'Datation ¹⁴C (radiocarbone)', cat:'Méthodes', def:"Datation par le carbone 14 sur matière organique, utile jusqu'à ~50 000 ans." },
    { term:'Datation U-Pb', cat:'Méthodes', def:"Datation uranium-plomb, très précise sur les zircons, permettant de caler des événements profonds (ex. trapps de Sibérie)." },
    { term:'Cyclothème', cat:'Concepts', def:"Alternance sédimentaire rythmique traduisant des variations répétées du niveau marin, typique des glaciations du Paléozoïque." },
    { term:'GDGT', cat:'Proxies', def:"Lipides membranaires d'archées et bactéries (glycérol dialkyl glycérol tétraéthers), base des proxies TEX86 et MBT/CBT." },
    { term:'Indice stomatique', cat:'Proxies', def:"Densité des stomates sur les feuilles fossiles ; inversement liée au CO₂ atmosphérique passé." },
    { term:'δ¹¹B (bore)', cat:'Isotopes', def:"Rapport isotopique du bore dans les carbonates ; proxy du pH océanique, donc de la pCO₂ atmosphérique." },
    { term:'Excursion isotopique', cat:'Concepts', def:"Écart brusque et transitoire d'un rapport isotopique (souvent δ¹³C), signant une perturbation majeure du cycle du carbone." },
    { term:'Interstade / Stade', cat:'Concepts', def:"Phase relativement chaude (interstade) ou froide (stade) au sein d'une période glaciaire, plus courte qu'un interglaciaire." },
    { term:'Événements de Dansgaard-Oeschger', cat:'Événements', def:"Réchauffements abrupts et récurrents (~1 470 ans) enregistrés dans les glaces du Groenland durant la dernière glaciation." },
    { term:'Optimum climatique', cat:'Concepts', def:"Intervalle particulièrement chaud d'une période (ex. optimum de l'Holocène, optimum du Miocène moyen)." },
    { term:'Anoxie / Euxinie', cat:'Concepts', def:"Absence d'oxygène (anoxie) voire présence de sulfure d'hydrogène (euxinie) dans l'eau ; conditions léthales associées à des crises." },
    { term:'Sapropèle', cat:'Proxies', def:"Couche sédimentaire sombre riche en matière organique (ex. Méditerranée), déposée lors d'épisodes d'anoxie de fond." },
    { term:'Isochrone', cat:'Méthodes', def:"Surface ou ligne de même âge dans une archive, servant à corréler les enregistrements entre eux." },
    { term:'PETM', cat:'Événements', def:"Maximum thermique Paléocène–Éocène (~56 Ma) : réchauffement global de +5 à +8 °C en quelques millénaires, dû à une injection massive de carbone. Analogue partiel du réchauffement actuel." },
    { term:'Snowball Earth', cat:'Événements', def:"« Terre boule de neige » : glaciations quasi totales du Cryogénien (~720–635 Ma), avec de la glace jusqu'à l'équateur, suivies de déglaciations brutales." },
    { term:'Sensibilité climatique', cat:'Concepts', def:"Réchauffement global à l'équilibre pour un doublement du CO₂ (~3 °C, fourchette ~2,5–4 °C). Contrainte majeure que les paléoclimats aident à préciser." },
    { term:'Rétroaction (feedback)', cat:'Concepts', def:"Mécanisme qui amplifie (positive) ou atténue (négative) une perturbation climatique — ex. albédo de la glace, vapeur d'eau, dégazage de CO₂ océanique." },
    { term:'Astrochronologie', cat:'Méthodes', def:"Datation des séries sédimentaires par calage sur les cycles orbitaux de Milankovitch, atteignant une résolution de l'ordre de 20 ka sur des dizaines de millions d'années." },
    { term:'Benthique / Planctonique', cat:'Concepts', def:"Benthique = vivant sur le fond marin ; planctonique = flottant en surface. Distinction clé pour les foraminifères (fond → eaux profondes, surface → eaux de surface)." },
    { term:'Hiatus', cat:'Méthodes', def:"Lacune sédimentaire : intervalle de temps non enregistré (érosion ou non-dépôt) qu'il faut repérer pour ne pas fausser une chronologie." }
  ];

  // Notes étendues (« en pratique ») affichées dans la fiche détaillée d'un terme.
  glossMore = {
    'Proxy': "Aucun thermomètre n'existait au Crétacé : on lit donc des indicateurs indirects (isotopes, fossiles, sédiments) qu'on calibre sur le présent avant de les appliquer au passé. Toute reconstruction paléoclimatique repose sur des proxies.",
    'δ¹⁸O (delta O-18)': "Dans les carottes de glace, un δ¹⁸O bas signale un climat froid ; dans les foraminifères benthiques, il reflète surtout le volume de glace mondial. C'est le proxy le plus utilisé en paléoclimatologie.",
    'δD (deutérium)': "Comme le δ¹⁸O, le δD de la glace suit la température de condensation : plus il fait froid, plus la glace est appauvrie. Vostok et EPICA en tirent leurs courbes de paléotempérature.",
    'Foraminifères': "On les trie sous binoculaire dans les carottes marines, puis on mesure leur δ¹⁸O et leur Mg/Ca. Les espèces de surface (planctoniques) et de fond (benthiques) racontent des étages différents de l'océan.",
    'Cycles de Milankovitch': "Excentricité (~100 ka), obliquité (~41 ka) et précession (~23 ka) modulent l'ensoleillement par saison et latitude. Leur signature, retrouvée dans les sédiments en 1976, rythme les glaciations.",
    'Stade isotopique marin (MIS)': "Numérotés depuis le présent (MIS 1 = Holocène), les stades pairs sont froids (glaciaires) et impairs chauds. Ils fournissent l'échelle de temps standard du Quaternaire.",
    'Terminaison': "Les terminaisons (I, II…) sont des sorties de glaciation rapides : en quelques millénaires, le CO₂ remonte et les calottes s'effondrent. Elles marquent le passage d'un stade froid à un interglaciaire.",
    'Événement de Heinrich': "Des couches de débris rocheux (IRD) larguées par des armadas d'icebergs jalonnent l'Atlantique Nord. Ils signent des débâcles massives de la calotte laurentidienne pendant la dernière glaciation.",
    'Événements de Dansgaard-Oeschger': "Vus d'abord dans la glace du Groenland : des réchauffements de +8 à +15 °C en quelques décennies, répétés ~25 fois durant la dernière glaciation. La preuve du changement climatique abrupt.",
    'Tillite': "Roche issue d'un dépôt glaciaire (till) consolidé. En trouver à basse paléolatitude a révélé les Terres « boule de neige » — un climat glaciaire là où règnent aujourd'hui déserts et tropiques.",
    'Spéléothème': "Stalagmites et stalactites se datent très précisément à l'uranium-thorium ; leur δ¹⁸O retrace l'intensité des moussons. Les grottes chinoises en tirent 640 000 ans d'histoire climatique.",
    'Varve': "Chaque varve = une année (couche claire d'été + couche sombre d'hiver). En les comptant, on obtient un calendrier annuel, comme les cernes des arbres — ex. le lac Suigetsu.",
    'AMOC': "Le « tapis roulant » atlantique redistribue la chaleur vers le nord ; sa plongée d'eaux froides et salées peut ralentir brutalement (cf. Dryas récent). C'est un point de bascule surveillé.",
    'Forçage radiatif': "Mesuré en W/m², il quantifie un déséquilibre imposé au bilan d'énergie (CO₂, Soleil, aérosols volcaniques). Positif → réchauffement, négatif → refroidissement.",
    'Datation ¹⁴C (radiocarbone)': "Utilisable jusqu'à ~50 000 ans, elle date la matière organique par la décroissance du carbone-14. On l'étalonne sur des archives absolues (varves, spéléothèmes, cernes).",
    'Datation U-Th': "Idéale pour les carbonates (spéléothèmes, coraux) jusqu'à ~500 000 ans, elle exploite la décroissance de l'uranium vers le thorium. Très précise, indépendante du ¹⁴C.",
    'Loess': "Poussière éolienne empilée en couches épaisses (Chine, Europe centrale). Son alternance loess/paléosols enregistre la succession glaciaire-interglaciaire sur le continent.",
    'PETM': "Injection massive de carbone (~56 Ma) : acidification des océans, migration des espèces vers les pôles, sols lessivés. Souvent étudié comme un analogue partiel — mais plus lent — de nos émissions.",
    'Snowball Earth': "Attestée par des dépôts glaciaires équatoriaux surmontés de « capuchons carbonatés ». La sortie se fait par accumulation de CO₂ volcanique, réchauffant brutalement une planète gelée.",
    'Sensibilité climatique': "Les transitions passées (déglaciations, PETM, Pliocène chaud) fournissent des points de calibration indépendants des modèles pour cerner cette valeur — d'où l'importance des paléoclimats.",
  };
  // Écran lié à un terme (« Voir aussi → »).
  glossLink = {
    'δ¹⁸O (delta O-18)': { screen: 'calc', label: 'Calculateur δ¹⁸O → T°' },
    'Cycles de Milankovitch': { screen: 'milank', label: 'Bac à sable orbital' },
    'Foraminifères': { screen: 'species', label: 'Espèces indicatrices' },
    'δD (deutérium)': { screen: 'data', label: 'Carottes de glace' },
    'Événements de Dansgaard-Oeschger': { screen: 'cores', label: 'Forages célèbres' },
    'Tillite': { screen: 'glaciations', label: 'Les grandes glaciations' },
    'Spéléothème': { screen: 'atlas', label: 'Atlas mondial' },
    'AMOC': { screen: 'atlas', label: 'Atlas → Océan Atlantique' },
    'Événement de Heinrich': { screen: 'atlas', label: 'Atlas → Océan Atlantique' },
    'PETM': { screen: 'extremes', label: 'Événements extrêmes' },
    'Snowball Earth': { screen: 'glaciations', label: 'Les grandes glaciations' },
    'Forçage radiatif': { screen: 'simulator', label: 'Simulateur climatique' },
    'Stade isotopique marin (MIS)': { screen: 'timemachine', label: 'Time-Machine' },
    'Loess': { screen: 'atlas', label: 'Atlas → Himalaya' },
  };

  proxySites = [
    { name:'EPICA Dome C', lat:-75.1, lon:123.4, cat:'Carotte de glace', region:'Antarctique', desc:"Carotte de glace de référence : 800 000 ans de CO₂ et de température." },
    { name:'Vostok', lat:-78.5, lon:106.8, cat:'Carotte de glace', region:'Antarctique', desc:"Première grande carotte antarctique (420 ka), pionnière du lien CO₂–climat." },
    { name:'Summit / GISP2', lat:72.6, lon:-38.5, cat:'Carotte de glace', region:'Groenland', desc:"Carotte groenlandaise ; enregistre les brusques événements de Dansgaard-Oeschger." },
    { name:'Dome Fuji', lat:-77.3, lon:39.7, cat:'Carotte de glace', region:'Antarctique', desc:"Carotte japonaise complétant EPICA sur plusieurs cycles glaciaires." },
    { name:'Grotte de Hulu', lat:32.5, lon:119.2, cat:'Spéléothème', region:'Chine', desc:"Stalagmites datées à l'U-Th ; référence de la mousson asiatique et de l'étalonnage ¹⁴C." },
    { name:'Devils Hole', lat:36.4, lon:-116.3, cat:'Spéléothème', region:'Nevada, USA', desc:"Veine de calcite continue enregistrant la température sur >500 ka." },
    { name:'Lac Suigetsu', lat:35.58, lon:135.88, cat:'Varves', region:'Japon', desc:"Varves annuelles servant d'étalon radiocarbone sur ~50 000 ans." },
    { name:'Flinders Ranges', lat:-31.5, lon:138.6, cat:'Tillite / Snowball', region:'Australie', desc:"Tillites et capuchons carbonatés du Cryogénien : preuves de la Terre boule de neige." },
    { name:'Meishan (GSSP)', lat:31.1, lon:119.7, cat:'Limite / extinction', region:'Chine', desc:"Coupe de référence de la limite Permien–Trias, la plus grande extinction." },
    { name:'Chicxulub', lat:21.3, lon:-89.5, cat:'Limite / extinction', region:'Mexique', desc:"Cratère d'impact enfoui, cause de l'extinction K–Pg (66 Ma)." },
    { name:'Gubbio', lat:43.35, lon:12.58, cat:'Limite / extinction', region:'Italie', desc:"Anomalie mondiale d'iridium à la limite K–Pg (découverte des Alvarez)." },
    { name:'Zumaia', lat:43.3, lon:-2.25, cat:'Limite / extinction', region:'Espagne', desc:"Falaises exposant les limites K–Pg et le PETM en continu." },
    { name:'Trapps de Sibérie', lat:67.0, lon:100.0, cat:'Volcanisme', region:'Russie', desc:"Épanchements basaltiques colossaux liés à l'extinction Permien–Trias." },
    { name:'Bassin du Karoo', lat:-32.0, lon:24.0, cat:'Fossiles', region:'Afrique du Sud', desc:"Flore à Glossopteris et vertébrés de la transition Permien–Trias." },
    { name:'Fosse de Messel', lat:49.9, lon:8.75, cat:'Fossiles', region:'Allemagne', desc:"Gisement de l'Éocène à préservation exceptionnelle (serre chaude)." },
    { name:'Newark Basin', lat:40.7, lon:-74.4, cat:'Varves', region:'New Jersey, USA', desc:"Lacs du Trias : cyclostratigraphie orbitale sur des dizaines de Ma." }
  ];

  siteColors = { 'Carotte de glace':'#4a9cc9', 'Spéléothème':'#8a6fb0', 'Varves':'#4f9d7a', 'Tillite / Snowball':'#3d7fa8', 'Limite / extinction':'#b5654a', 'Volcanisme':'#c98a3d', 'Fossiles':'#7a8c3c', 'Espèce disparue':'#9a5bb0', 'Communauté':'#d0587e' };

  // Insolation journalière moyenne (W/m²) — formule standard de Milankovitch.
  // lat, lambda (longitude solaire vraie, 0 = équinoxe de printemps NH), e, eps (obliquité), peri (longitude du périhélie)
  insolation(latDeg, lambdaDeg, e, epsDeg, periDeg) {
    const S0 = 1361, d2r = Math.PI / 180;
    const phi = latDeg * d2r, eps = epsDeg * d2r, lam = lambdaDeg * d2r, peri = periDeg * d2r;
    const sinDelta = Math.sin(eps) * Math.sin(lam);
    const delta = Math.asin(sinDelta), cosDelta = Math.cos(delta);
    const nu = lam - peri; // anomalie vraie
    const distFactor = Math.pow((1 + e * Math.cos(nu)) / (1 - e * e), 2);
    let cosH0 = -Math.tan(phi) * Math.tan(delta);
    let H0; if (cosH0 >= 1) H0 = 0; else if (cosH0 <= -1) H0 = Math.PI; else H0 = Math.acos(cosH0);
    const q = (S0 / Math.PI) * distFactor * (H0 * Math.sin(phi) * sinDelta + Math.cos(phi) * cosDelta * Math.sin(H0));
    return Math.max(0, q);
  }

  // Équations de paléotempérature — T(°C) fonction de Δ = δc - (δw - 0.27)
  // δc : δ18O calcite (‰ VPDB), δw : δ18O eau de mer (‰ VSMOW). Correction d'échelle -0.27.
  tempEqs = [
    { id:'shack', species:'Générique — Shackleton (1974)', detail:'Calibration paléocéanographique de référence, valable sur une large gamme.',
      a:16.9, b:-4.38, c:0.10, formula:'T = 16,9 − 4,38·Δ + 0,10·Δ²' },
    { id:'oneil', species:'Calcite inorganique — O’Neil et al. (1969)', detail:'Fractionnement calcite–eau en laboratoire ; base historique linéaire.',
      a:16.9, b:-4.0, c:0.0, formula:'T = 16,9 − 4,0·Δ' },
    { id:'erez', species:'Foraminifères planctoniques — Erez & Luz (1983)', detail:'Calibration sur planctoniques de culture (ex. Globigerinoides).',
      a:17.0, b:-4.52, c:0.03, formula:'T = 17,0 − 4,52·Δ + 0,03·Δ²' },
    { id:'univ', species:'Orbulina universa (faible lumière) — Bemis (1998)', detail:'Calibration planctonique moderne très utilisée.',
      a:16.5, b:-4.80, c:0.0, formula:'T = 16,5 − 4,80·Δ' },
    { id:'bull', species:'Globigerina bulloides — Bemis (1998)', detail:'Espèce planctonique des eaux tempérées à froides.',
      a:13.2, b:-4.89, c:0.0, formula:'T = 13,2 − 4,89·Δ' },
    { id:'uvig', species:'Uvigerina spp. (benthique) — Shackleton (1974)', detail:'Foraminifère benthique ; enregistre la température des eaux profondes.',
      a:16.9, b:-4.38, c:0.10, formula:'T = 16,9 − 4,38·Δ + 0,10·Δ²', dc:0 }
  ];

  // Data Overlay — vraies séries NOAA (âge en ka, valeur réelle), pas de 20 ka.
  // Digitalisées depuis les fichiers archivés au NOAA NCEI Paleoclimatology.
  datasets = {
    epica: { label: 'EPICA / composite antarctique — CO₂', short: 'CO₂ EPICA', color: '#c25a3a',
      unit: 'ppm', vmin: 175, vmax: 295, invert: false,
      note: "Composite antarctique de CO₂ (Bereiter et al. 2015, révision EPICA Dome C / Vostok). NOAA NCEI, étude 17975.",
      pts: [[0,285],[20,192],[40,194],[60,217],[80,232],[100,246],[120,272],[140,193],[160,188],[180,208],[200,247],[220,227],[240,250],[260,207],[280,208],[300,231],[320,240],[340,237],[360,188],[380,228],[400,283],[420,272],[440,201],[460,199],[480,224],[500,231],[520,247],[540,211],[560,230],[580,240],[600,231],[620,246],[640,190],[660,188],[680,232],[700,238],[720,212],[740,186],[760,224],[780,254],[800,200]] },
    sea: { label: 'Spratt & Lisiecki 2016 — niveau marin', short: 'Niveau marin', color: '#2f7ca0',
      unit: 'm vs actuel', vmin: -130, vmax: 25, invert: false,
      note: "Reconstruction globale du niveau marin sur 0–800 ka (Spratt & Lisiecki 2016, PC1 long). NOAA NCEI, étude 19982. Tail 720–800 ka lissé.",
      pts: [[0,9],[20,-116],[40,-83],[60,-77],[80,-32],[100,-17],[120,-1],[140,-120],[160,-86],[180,-63],[200,-10],[220,-50],[240,-27],[260,-76],[280,-42],[300,-40],[320,-6],[340,-91],[360,-86],[380,-23],[400,19],[420,-61],[440,-100],[460,-81],[480,-33],[500,-23],[520,-45],[540,-59],[560,-36],[580,-32],[600,-41],[620,-78],[640,-94],[660,-75],[680,-38],[700,-21],[720,-45],[740,-72],[760,-70],[780,-25],[800,-60]] },
    lr04: { label: 'LR04 — δ¹⁸O benthique', short: 'δ¹⁸O LR04', color: '#5b3f9e',
      unit: '‰ (axe inversé)', vmin: 3.1, vmax: 5.1, invert: true,
      note: "Empilement mondial de δ¹⁸O benthique (Lisiecki & Raymo 2005), proxy du volume de glace. Axe inversé : haut = interglaciaire. NOAA NCEI, étude 8664.",
      pts: [[0,3.3],[20,4.9],[40,4.4],[60,4.3],[80,4.0],[100,3.9],[120,3.2],[140,4.8],[160,4.7],[180,4.6],[200,4.2],[220,3.8],[240,3.4],[260,4.2],[280,4.3],[300,3.8],[320,3.5],[340,3.7],[360,4.9],[380,4.4],[400,3.3],[420,3.5],[440,5.0],[460,4.8],[480,4.2],[500,3.9],[520,4.3],[540,4.2],[560,3.9],[580,4.4],[600,4.2],[620,3.7],[640,4.5],[660,4.6],[680,4.9],[700,4.3],[720,3.9],[740,4.6],[760,4.5],[780,3.7],[800,4.4]] }
  };

  sx(a) { return 30 + (a / 800) * 280; }
  co2Y(v) { return 100 - ((v - 170) / 140) * 80; }
  tempY(v) { return 100 - ((v + 10) / 13) * 80; }
  tX(a, maxAge) { return 314 - (Math.min(a, maxAge) / maxAge) * 306; }
  mTemp(v) { return 70 - ((Math.max(5, Math.min(28, v)) - 5) / 23) * 56; }
  mCo2(v) { const L = Math.log10(Math.max(150, Math.min(30000, v))); return 70 - ((L - Math.log10(150)) / (Math.log10(30000) - Math.log10(150))) * 56; }
  mSea(v) { return 70 - ((Math.max(-130, Math.min(260, v)) + 130) / 390) * 56; }
  mBio(v) { return 70 - (Math.max(0, Math.min(3000, v)) / 3000) * 56; }
  cpath(arr, maxAge, mf) { return arr.filter(p => p[0] <= maxAge).map((p, i) => `${i ? 'L' : 'M'}${this.tX(p[0], maxAge).toFixed(1)} ${mf(p[1]).toFixed(1)}`).join(' '); }
  interp(arr, age) { const a = Math.max(arr[0][0], Math.min(age, arr[arr.length - 1][0])); for (let i = 0; i < arr.length - 1; i++) { if (a >= arr[i][0] && a <= arr[i + 1][0]) { const t = (a - arr[i][0]) / ((arr[i + 1][0] - arr[i][0]) || 1); return arr[i][1] + t * (arr[i + 1][1] - arr[i][1]); } } return arr[arr.length - 1][1]; }
  fmtAge(a) { if (a <= 0.001) return "Aujourd'hui"; if (a < 1) return Math.round(a * 1000) + ' ka'; if (a < 1000) return (a < 10 ? a.toFixed(1) : Math.round(a)) + ' Ma'; return (a / 1000).toFixed(2).replace('.', ',') + ' Ga'; }
  eraAt(a) { if (a < 2.58) return 'Quaternaire'; if (a < 66) return 'Cénozoïque'; if (a < 252) return 'Mésozoïque'; if (a < 541) return 'Paléozoïque'; if (a < 2500) return 'Protérozoïque'; if (a < 4000) return 'Archéen'; return 'Hadéen'; }
  rangeBtn(active) { return { flex: 1, textAlign: 'center', padding: '9px 6px', borderRadius: 9, fontSize: 11, fontWeight: active ? 600 : 500, cursor: 'pointer', border: '1px solid ' + (active ? '#1d6f96' : '#d3e0e6'), background: active ? '#1d6f96' : '#fff', color: active ? '#fff' : '#5b7688' }; }
  storyChip(active) { return { padding: '7px 12px', borderRadius: 20, fontSize: 11, fontWeight: active ? 600 : 500, cursor: 'pointer', border: '1px solid ' + (active ? '#b5654a' : '#dbe4e8'), background: active ? '#b5654a' : '#fff', color: active ? '#fff' : '#5b7688' }; }
  extinctBadge(fate) { const ext = fate === 'extinct'; return { display: 'inline-block', whiteSpace: 'nowrap', fontFamily: 'IBM Plex Mono,monospace', fontSize: 8, letterSpacing: '.5px', textTransform: 'uppercase', fontWeight: 600, color: '#fff', background: ext ? '#b5654a' : '#3a8f7a', borderRadius: 20, padding: '3px 9px' }; }
  storyBtn(enabled) { return { flex: 1, textAlign: 'center', padding: '10px 6px', borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: enabled ? 'pointer' : 'default', border: '1px solid #d3e0e6', background: enabled ? '#fff' : '#f2f6f8', color: enabled ? '#1d6f96' : '#b7c6cd' }; }
  mapChip(active) { return { flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 9, fontSize: 10.5, fontWeight: active ? 600 : 500, cursor: 'pointer', lineHeight: 1.25, border: '1px solid ' + (active ? '#1d6f96' : '#d3e0e6'), background: active ? '#1d6f96' : '#fff', color: active ? '#fff' : '#5b7688' }; }
  globeChip(active) { return { textAlign: 'center', padding: '7px 3px', borderRadius: 8, fontSize: 9.5, fontWeight: active ? 600 : 500, cursor: 'pointer', lineHeight: 1.3, border: '1px solid ' + (active ? '#1d6f96' : '#d3e0e6'), background: active ? '#1d6f96' : '#fff', color: active ? '#fff' : '#5b7688' }; }
  // Projection équirectangulaire : liste de polygones [lng,lat] -> chaîne SVG `d` (boîte W×H).
  equirect(polys, W, H) { return (polys || []).map(poly => poly.map((p, i) => `${i ? 'L' : 'M'}${(((p[0] + 180) / 360) * W).toFixed(1)} ${(((90 - p[1]) / 180) * H).toFixed(1)}`).join(' ') + ' Z').join(' '); }
  // Graticule (méridiens tous les 30°, parallèles tous les 30°).
  graticule(W, H) { let d = ''; for (let lng = -150; lng <= 150; lng += 30) { const x = (((lng + 180) / 360) * W).toFixed(1); d += `M${x} 0L${x} ${H}`; } for (let lat = -60; lat <= 60; lat += 30) { const y = (((90 - lat) / 180) * H).toFixed(1); d += `M0 ${y}L${W} ${y}`; } return d; }
  // Test point-dans-polygone (lng,lat) par lancer de rayon.
  pointInPoly(x, y, poly) { let inside = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi)) inside = !inside; } return inside; }
  // État d'un lieu à une époque : sous la glace, terre émergée, ou sous l'eau.
  regionState(lng, lat, lands, ice) { if ((ice || []).some(p => this.pointInPoly(lng, lat, p))) return 'ice'; if ((lands || []).some(p => this.pointInPoly(lng, lat, p))) return 'land'; return 'sea'; }
  // Distance (en degrés, corrigée en longitude par cos·lat) du point au bord le plus proche des polygones.
  edgeDistDeg(lng, lat, polys) {
    const cl = Math.max(0.25, Math.cos(lat * Math.PI / 180)); let best = Infinity;
    const x = lng * cl, y = lat;
    for (const poly of (polys || [])) for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const ax = poly[j][0] * cl, ay = poly[j][1], bx = poly[i][0] * cl, by = poly[i][1];
      const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1e-9;
      let t = ((x - ax) * dx + (y - ay) * dy) / L2; t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(x - (ax + t * dx), y - (ay + t * dy)); if (d < best) best = d;
    }
    return best === Infinity ? 0 : best;
  }
  // Épaisseur de glace estimée (km) : fine au bord, épaisse au cœur de la calotte.
  iceThickness(lng, lat, ice, maxThk) { const f = Math.max(0, Math.min(1, this.edgeDistDeg(lng, lat, ice) / 12)); return 0.4 + f * (maxThk - 0.4); }
  fmtDepth(m) { return m >= 1000 ? (m / 1000).toFixed(1).replace('.', ',') + ' km' : (Math.round(m / 10) * 10) + ' m'; }
  fmtThk(km) { return km >= 1 ? km.toFixed(1).replace('.', ',') + ' km' : Math.round(km * 1000) + ' m'; }
  // Température locale estimée (°C) : profil latitudinal actuel + anomalie globale de l'époque
  // avec amplification polaire, moins l'altitude de la calotte si le lieu est sous la glace.
  localTemp(lat, globalMean, state, iceThk) {
    const Tmod = 27 - 0.0068 * lat * lat;                 // moyenne annuelle actuelle par latitude
    const amp = 0.6 + 1.1 * (Math.abs(lat) / 90);         // les pôles amplifient l'anomalie
    let T = Tmod + (globalMean - 15) * amp;
    if (state === 'ice') T -= 6.5 * (iceThk || 0);        // surface de la calotte en altitude (gradient ~6,5 °C/km)
    if (state === 'sea') T = Math.max(-2, T);             // plancher de la température de surface de la mer
    return T;
  }
  fmtTemp(t) { const r = Math.round(t); return '≈ ' + (r === 0 ? 0 : r) + ' °C'; }
  presentLands = [
    [[-168,66],[-158,71],[-130,70],[-95,72],[-82,73],[-64,60],[-70,47],[-81,43],[-81,25],[-97,26],[-107,24],[-117,32],[-124,40],[-124,48],[-138,58],[-152,59],[-168,66]],
    [[-45,60],[-22,70],[-20,76],[-32,83],[-52,82],[-55,76],[-50,68],[-45,60]],
    [[-81,8],[-70,11],[-60,6],[-50,0],[-35,-6],[-40,-22],[-58,-34],[-66,-45],[-74,-52],[-72,-40],[-70,-20],[-77,-5],[-81,8]],
    [[-16,15],[-6,32],[10,37],[24,32],[34,32],[43,12],[52,14],[43,-2],[40,-16],[32,-27],[20,-35],[16,-28],[9,4],[-8,5],[-16,15]],
    [[-10,36],[-5,44],[3,52],[6,58],[26,71],[55,72],[95,78],[140,73],[170,68],[178,66],[160,60],[142,50],[130,40],[122,30],[108,18],[95,16],[80,8],[72,20],[60,26],[48,30],[36,36],[22,40],[8,38],[-10,36]],
    [[113,-22],[124,-16],[136,-12],[143,-12],[147,-20],[151,-30],[146,-38],[135,-35],[123,-34],[114,-33],[113,-22]]
  ];
  antarctica = [[-180,-68],[180,-68],[180,-90],[-180,-90]];
  greenland = [[-45,60],[-22,70],[-20,76],[-32,83],[-52,82],[-55,76],[-50,68],[-45,60]];
  indiaIsl = [[70,4],[82,6],[84,-4],[74,-10],[68,-4],[70,4]];
  globePeriods = [
    { label: 'Pangée', age: '≈ 300 Ma', era: 'Paléozoïque · Permien', ocean: '#357a94', land: '#a98f5e', sea: 'Modéré à bas', oceanName: 'Panthalassa',
      note: "Toutes les terres sont soudées en un supercontinent unique, la Pangée, ceinturé par l'océan mondial Panthalassa et échancré à l'est par la Téthys. Intérieurs continentaux très arides.",
      lands: [ [[-70,60],[-42,72],[-8,70],[16,58],[26,42],[12,30],[28,16],[44,4],[38,-10],[46,-26],[24,-46],[-10,-58],[-42,-50],[-58,-26],[-48,0],[-64,22],[-72,42],[-70,60]] ],
      ice: [ [[-180,-72],[180,-72],[180,-90],[-180,-90]] ] },
    { label: 'Éclatement', age: '≈ 180 Ma', era: 'Mésozoïque · Jurassique', ocean: '#347f9a', land: '#9c8a5c', sea: 'En hausse', oceanName: 'Téthys · Panthalassa',
      note: "La Pangée se scinde : la Laurasia au nord, le Gondwana au sud, séparés par l'océan Téthys. L'Atlantique central commence tout juste à s'ouvrir.",
      lands: [ [[-90,32],[-66,50],[-28,58],[12,60],[46,54],[68,46],[46,34],[8,30],[-32,28],[-62,26],[-90,32]],
               [[-80,-8],[-44,-2],[-4,-6],[30,-10],[54,-24],[44,-46],[14,-58],[-22,-58],[-56,-44],[-78,-24],[-80,-8]],
               [[66,-16],[80,-14],[82,-26],[70,-30],[64,-24],[66,-16]] ],
      ice: [] },
    { label: 'Crétacé', age: '≈ 90 Ma', era: 'Mésozoïque · Crétacé', ocean: '#2f86a0', land: '#7f9a5a', sea: 'Très haut (+200 m)', oceanName: 'Atlantique jeune',
      note: "Serre chaude, sans glace polaire. L'Atlantique s'élargit, l'Inde dérive vers le nord et de vastes mers épicontinentales inondent les continents.",
      lands: [ [[-112,60],[-90,66],[-70,60],[-64,48],[-76,36],[-102,34],[-118,44],[-114,54],[-112,60]],
               [[-58,8],[-44,6],[-36,-6],[-42,-24],[-58,-36],[-66,-30],[-62,-10],[-58,8]],
               [[-30,42],[-6,54],[34,60],[84,64],[128,58],[150,46],[120,36],[80,32],[40,34],[0,34],[-30,42]],
               [[-30,18],[-14,32],[8,34],[26,30],[36,10],[30,-10],[22,-30],[6,-34],[-14,-20],[-28,-2],[-30,18]],
               [[60,-24],[74,-22],[76,-32],[64,-36],[58,-30],[60,-24]],
               [[110,-42],[142,-40],[152,-50],[130,-58],[110,-52],[110,-42]],
               [[-180,-74],[180,-74],[180,-90],[-180,-90]] ],
      ice: [] },
    { label: 'Éocène', age: '≈ 50 Ma', era: 'Cénozoïque · Éocène', ocean: '#2f7d97', land: '#7d9a58', sea: 'Haut', oceanName: 'Océans quasi modernes',
      note: "Géographie proche de l'actuelle mais climat de serre : aucune calotte permanente, l'Antarctique est encore verdoyant, l'Inde percute l'Asie.",
      lands: this.presentLands.concat([ this.antarctica, this.indiaIsl ]),
      ice: [] },
    { label: 'Actuel', age: "Aujourd'hui", era: 'Cénozoïque · Quaternaire', ocean: '#2b6a8a', land: '#83925f', sea: 'Référence (0 m)', oceanName: 'Pacifique · Atlantique · Indien',
      note: "Configuration moderne des continents. De vastes calottes couvrent l'Antarctique et le Groenland ; nous vivons une période interglaciaire.",
      lands: this.presentLands,
      ice: [ this.antarctica, this.greenland ] }
  ];
  curGlobe() { return this.globePeriods[this.state.globePeriod] || this.globePeriods[this.globePeriods.length - 1]; }
  gazetteer = [
    { n: 'Paris', c: 'EUR', lat: 48.85, lng: 2.35, alt: 'france' },
    { n: 'Londres', c: 'EUR', lat: 51.5, lng: -0.13, alt: 'london uk angleterre' },
    { n: 'Berlin', c: 'EUR', lat: 52.52, lng: 13.4, alt: 'allemagne' },
    { n: 'Madrid', c: 'EUR', lat: 40.42, lng: -3.7, alt: 'espagne' },
    { n: 'Rome', c: 'EUR', lat: 41.9, lng: 12.5, alt: 'roma italie' },
    { n: 'Moscou', c: 'EUR', lat: 55.75, lng: 37.62, alt: 'moscow russie' },
    { n: 'Istanbul', c: 'EUR', lat: 41.0, lng: 28.98, alt: 'turquie' },
    { n: 'Athènes', c: 'EUR', lat: 37.98, lng: 23.73, alt: 'grece athenes' },
    { n: 'Stockholm', c: 'EUR', lat: 59.33, lng: 18.07, alt: 'suede' },
    { n: 'New York', c: 'NAM', lat: 40.71, lng: -74.0, alt: 'usa etats-unis' },
    { n: 'Los Angeles', c: 'NAM', lat: 34.05, lng: -118.24, alt: 'usa californie' },
    { n: 'Chicago', c: 'NAM', lat: 41.88, lng: -87.63, alt: 'usa' },
    { n: 'Toronto', c: 'NAM', lat: 43.65, lng: -79.38, alt: 'canada' },
    { n: 'Mexico', c: 'NAM', lat: 19.43, lng: -99.13, alt: 'mexique mexico city' },
    { n: 'Montréal', c: 'NAM', lat: 45.5, lng: -73.57, alt: 'canada montreal' },
    { n: 'Vancouver', c: 'NAM', lat: 49.28, lng: -123.12, alt: 'canada' },
    { n: 'São Paulo', c: 'SAM', lat: -23.55, lng: -46.63, alt: 'sao paulo bresil' },
    { n: 'Buenos Aires', c: 'SAM', lat: -34.6, lng: -58.38, alt: 'argentine' },
    { n: 'Rio de Janeiro', c: 'SAM', lat: -22.9, lng: -43.2, alt: 'bresil rio' },
    { n: 'Lima', c: 'SAM', lat: -12.05, lng: -77.04, alt: 'perou' },
    { n: 'Bogotá', c: 'SAM', lat: 4.61, lng: -74.08, alt: 'colombie bogota' },
    { n: 'Santiago', c: 'SAM', lat: -33.45, lng: -70.67, alt: 'chili' },
    { n: 'Le Caire', c: 'AFR', lat: 30.04, lng: 31.24, alt: 'cairo egypte' },
    { n: 'Lagos', c: 'AFR', lat: 6.52, lng: 3.38, alt: 'nigeria' },
    { n: 'Nairobi', c: 'AFR', lat: -1.29, lng: 36.82, alt: 'kenya' },
    { n: 'Le Cap', c: 'AFR', lat: -33.92, lng: 18.42, alt: 'cape town afrique du sud' },
    { n: 'Casablanca', c: 'AFR', lat: 33.57, lng: -7.59, alt: 'maroc' },
    { n: 'Kinshasa', c: 'AFR', lat: -4.32, lng: 15.31, alt: 'congo' },
    { n: 'Tokyo', c: 'ASIA', lat: 35.68, lng: 139.7, alt: 'japon' },
    { n: 'Pékin', c: 'ASIA', lat: 39.9, lng: 116.4, alt: 'beijing chine' },
    { n: 'Shanghai', c: 'ASIA', lat: 31.23, lng: 121.47, alt: 'chine' },
    { n: 'Dubaï', c: 'ASIA', lat: 25.2, lng: 55.27, alt: 'dubai emirats' },
    { n: 'Bangkok', c: 'ASIA', lat: 13.75, lng: 100.5, alt: 'thailande' },
    { n: 'Singapour', c: 'ASIA', lat: 1.35, lng: 103.82, alt: 'singapore' },
    { n: 'Séoul', c: 'ASIA', lat: 37.57, lng: 126.98, alt: 'seoul coree' },
    { n: 'Djakarta', c: 'ASIA', lat: -6.2, lng: 106.85, alt: 'jakarta indonesie' },
    { n: 'Riyad', c: 'ASIA', lat: 24.71, lng: 46.68, alt: 'riyadh arabie' },
    { n: 'Mumbai', c: 'IND', lat: 19.08, lng: 72.88, alt: 'bombay inde' },
    { n: 'Delhi', c: 'IND', lat: 28.61, lng: 77.21, alt: 'new delhi inde' },
    { n: 'Bangalore', c: 'IND', lat: 12.97, lng: 77.59, alt: 'bengaluru inde' },
    { n: 'Sydney', c: 'AUS', lat: -33.87, lng: 151.21, alt: 'australie' },
    { n: 'Melbourne', c: 'AUS', lat: -37.81, lng: 144.96, alt: 'australie' },
    { n: 'Perth', c: 'AUS', lat: -31.95, lng: 115.86, alt: 'australie' },
    { n: 'Auckland', c: 'AUS', lat: -36.85, lng: 174.76, alt: 'nouvelle-zelande' }
  ];
  contOffsets = {
    EUR:  [[-45,-10],[-22,-8],[-16,-6],[-9,-4]],
    NAM:  [[-38,42],[-18,22],[-10,9],[-6,4]],
    SAM:  [[-16,16],[-11,11],[-6,6],[-3,2]],
    AFR:  [[-28,-8],[-18,-6],[-11,-4],[-6,-2]],
    ASIA: [[-26,-92],[-15,-48],[-8,-24],[-4,-10]],
    IND:  [[-56,-14],[-50,-11],[-50,-6],[-24,-4]],
    AUS:  [[-34,-42],[-28,-30],[-19,-20],[-11,-9]],
    ANT:  [[6,-30],[4,-20],[2,-12],[1,-6]]
  };
  gNorm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  guessCont(lat, lng) {
    if (lng >= 60 && lng <= 92 && lat >= 2 && lat <= 36) return 'IND';
    if (lng >= 105 && lat <= -10) return 'AUS';
    if (lng >= 55 && lng <= 180) return 'ASIA';
    if (lng >= -20 && lng <= 55) return (lat >= 36 ? 'EUR' : 'AFR');
    if (lat < 12) return 'SAM';
    return 'NAM';
  }
  // Continent (code plaque) le plus proche d'un point — pour appliquer la bonne reconstruction.
  nearestCont(lng, lat) {
    let best = 'EUR', bd = Infinity;
    for (const g of this.gazetteer) {
      let dl = Math.abs(g.lng - lng); if (dl > 180) dl = 360 - dl;
      const d = (g.lat - lat) * (g.lat - lat) + (dl * Math.cos(lat * Math.PI / 180)) ** 2;
      if (d < bd) { bd = d; best = g.c; }
    }
    return best;
  }
  paleoPos(sel, idx) {
    if (idx >= this.globePeriods.length - 1) return { lat: sel.lat, lng: sel.lng };
    const off = (this.contOffsets[sel.c] || this.contOffsets.EUR)[idx];
    let lat = Math.max(-88, Math.min(88, sel.lat + off[0]));
    let lng = sel.lng + off[1];
    while (lng > 180) lng -= 360; while (lng < -180) lng += 360;
    return { lat, lng };
  }
  zoneName(lat) { const a = Math.abs(lat); if (a < 10) return 'équatoriale'; if (a < 23.5) return 'tropicale'; if (a < 35) return 'subtropicale'; if (a < 55) return 'tempérée'; if (a < 66.5) return 'subpolaire'; return 'polaire'; }
  fmtCoord(lat, lng) {
    const la = Math.abs(lat).toFixed(1).replace('.', ',') + '° ' + (lat >= 0 ? 'N' : 'S');
    const lo = Math.abs(lng).toFixed(1).replace('.', ',') + '° ' + (lng >= 0 ? 'E' : 'O');
    return la + ' · ' + lo;
  }
  fmtLat(lat) { return Math.abs(lat).toFixed(0) + '° ' + (lat >= 0 ? 'N' : 'S'); }
  // Illustration embarquée d'une espèce / d'un fossile (public/bio/<slug>.svg).
  bioImg(id) { return '/bio/' + (id === 'shark' ? 'shark-tooth' : id) + '.svg'; }
  // Fossile : vraie photo (Wikimedia) si disponible, sinon illustration SVG.
  fossilImg(id) { return this.fossilCredits[id] ? '/bio-photos/' + id + '.jpg' : this.bioImg(id); }
  histTemp = [[1421,-0.36],[1440,-0.40],[1460,-0.50],[1480,-0.45],[1500,-0.40],[1520,-0.35],[1540,-0.45],[1560,-0.55],[1580,-0.50],[1600,-0.60],[1620,-0.55],[1640,-0.62],[1660,-0.70],[1680,-0.66],[1700,-0.55],[1720,-0.40],[1740,-0.35],[1760,-0.45],[1780,-0.40],[1800,-0.46],[1810,-0.56],[1816,-0.62],[1820,-0.42],[1840,-0.40],[1860,-0.34],[1880,-0.30],[1900,-0.20],[1910,-0.26],[1920,-0.10],[1940,0.05],[1950,0.00],[1960,0.00],[1970,0.02],[1980,0.16],[1990,0.30],[2000,0.45],[2008,0.52]];
  histPrec = [[1421,2],[1450,-3],[1480,4],[1510,-2],[1540,-5],[1570,1],[1600,-6],[1630,-3],[1660,-7],[1690,-4],[1720,2],[1750,3],[1780,-1],[1800,-3],[1816,-8],[1820,-5],[1840,0],[1860,2],[1880,-2],[1900,1],[1920,3],[1940,-1],[1960,2],[1980,0],[2000,-3],[2008,-4]];
  histPres = [[1421,0.5],[1450,-0.8],[1480,0.3],[1510,1.0],[1540,-0.5],[1570,0.6],[1600,-1.2],[1630,0.4],[1660,-1.5],[1690,-0.7],[1720,0.8],[1750,1.1],[1780,-0.3],[1800,-0.6],[1820,-1.0],[1840,0.2],[1860,0.7],[1880,-0.4],[1900,0.3],[1920,0.9],[1940,0.1],[1960,0.5],[1980,-0.2],[2000,0.6],[2008,0.8]];
  histEvents = [
    { y: '1645–1715', t: 'Minimum de Maunder — taches solaires quasi absentes, hivers très rigoureux en Europe.' },
    { y: '1783', t: 'Éruption du Laki (Islande) — brouillard sec, étés froids et récoltes perdues.' },
    { y: '1790–1830', t: 'Minimum de Dalton — activité solaire faible, refroidissement prolongé.' },
    { y: '1815', t: 'Tambora (Indonésie) — 1816, « l’année sans été » dans l’hémisphère nord.' },
    { y: '1850', t: 'Fin du Petit Âge glaciaire ; début des séries instrumentales fiables.' },
    { y: '1900 →', t: 'Réchauffement industriel : hausse quasi continue des températures.' },
    { y: '1998 · 2005', t: 'Années parmi les plus chaudes de la série, jusqu’en 2008.' }
  ];
  hX(y) { return 30 + ((Math.max(1421, Math.min(2008, y)) - 1421) / 587) * 280; }
  hTempY(v) { return 78 - ((Math.max(-0.9, Math.min(0.7, v)) + 0.9) / 1.6) * 66; }
  hPrecY(v) { return 78 - ((Math.max(-10, Math.min(8, v)) + 10) / 18) * 66; }
  hPresY(v) { return 78 - ((Math.max(-2, Math.min(2, v)) + 2) / 4) * 66; }
  histPath(arr, mf) { return arr.map((p, i) => `${i ? 'L' : 'M'}${this.hX(p[0]).toFixed(1)} ${mf(p[1]).toFixed(1)}`).join(' '); }
  histEra(y) { if (y < 1550) return 'Petit Âge glaciaire (phase précoce)'; if (y <= 1715) return 'Petit Âge glaciaire · Minimum de Maunder'; if (y < 1850) return 'Sortie du Petit Âge glaciaire'; if (y < 1950) return 'Ère industrielle'; return 'Réchauffement moderne'; }
  extinctSp = [
    { id: 'mammoth', fate: 'extinct', emoji: '🦣', accent: '#3f7fa6', wash: '#e6eff5',
      name: 'Mammouth laineux', taxon: 'Mammuthus primigenius', tagline: "Icône de l'Âge glaciaire",
      period: 'Pléistocène supérieur', dates: '−400 000 à −10 000 ans', lifespan: '≈ 390 000 ans',
      tlStart: 12, tlEnd: 97, tlGlac: [[30, 'Riss'], [58, 'Würm'], [90, 'DMG']],
      climTemp: '−10 °C (moy.) · −50 °C l\'hiver', climType: 'Toundra · steppe froide', climPrec: 'Faibles (200–400 mm/an)', climCo2: '180–220 ppm (glaciaire)',
      geo: ['Sibérie', 'Alaska', 'Europe du Nord', 'Béringie'],
      geoNote: "La « steppe à mammouths » couvrait jusqu'à 30 % de l'hémisphère nord.",
      adapt: [
        ['🧥', 'Triple fourrure', "Poils de garde d'1 m + poils intermédiaires + sous-poil laineux dense — isolation jusqu'à −50 °C."],
        ['🩸', 'Sang anti-gel', "Hémoglobine modifiée qui libère l'oxygène même à très basse température."],
        ['🧈', 'Graisse épaisse', "Couche de 8–10 cm sous la peau + bosses de réserve, comme un chameau."],
        ['👂', 'Petites oreilles', "Un dixième de celles d'un éléphant actuel : moins de surface, moins de pertes de chaleur."]
      ],
      diet: "180 kg de végétation/jour : herbes de steppe, saules nains, bouleaux.",
      pop: [92, 90, 86, 78, 58, 30, 12, 4, 1],
      popNote: '−15 000 : ~10 M · −10 000 : effondrement · −6 000 : dernières hardes (île Wrangel).',
      causes: [
        ['Perte d\'habitat', 60, '#b5654a'],
        ['Réchauffement rapide', 25, '#d1934e'],
        ['Chasse humaine', 10, '#5a7d8c'],
        ['Maladies', 5, '#8a8f97']
      ],
      trigger: "La disparition de la « mammoth steppe », son habitat, transformée en forêt et toundra spongieuse en quelques millénaires.",
      lesson: "Le mammouth a survécu à plusieurs cycles glaciaires — mais pas au réchauffement RAPIDE de la fin du Pléistocène. La vitesse du changement compte autant que son ampleur.",
      sites: ['Sibérie (permafrost)', 'Île Wrangel', 'Alaska', 'Mer du Nord'],
      fossilSites: [
        { name: 'Île Wrangel', lat: 71.2, lon: -179.5, region: 'Arctique russe', desc: "Dernier refuge : des mammouths nains y ont survécu jusqu'à ~4000 ans avant notre ère." },
        { name: 'Berezovka', lat: 67.5, lon: 155.0, region: 'Sibérie (Iakoutie)', desc: "Célèbre mammouth congelé retrouvé avec sa chair et le contenu de son estomac." },
        { name: 'Hot Springs', lat: 43.43, lon: -103.48, region: 'Dakota du Sud, USA', desc: "Piège naturel (source chaude) ayant accumulé des dizaines de mammouths." },
        { name: 'Doggerland (mer du Nord)', lat: 54.5, lon: 2.5, region: 'Mer du Nord', desc: "Plaine aujourd'hui submergée ; les chaluts y remontent régulièrement os et défenses." }
      ],
      specimens: [['Lyuba', 'bébé congelé, 42 000 ans'], ['Dima', 'juvénile, 40 000 ans'], ['Yukagir', 'mâle, 18 000 ans']],
      deextinct: "Dé-extinction à l'étude : Harvard (G. Church, CRISPR sur éléphant d'Asie) et Colossal Biosciences (objectif ~2028) — débat éthique ouvert.",
      facts: ["Les humains du Paléolithique bâtissaient des huttes avec les os et défenses de mammouths.", "Ses molaires, larges comme une brique, se remplaçaient six fois au cours de sa vie."] },

    { id: 'tiktaalik', fate: 'survived', emoji: '🐟', accent: '#3a8f7a', wash: '#e4f0ec',
      name: 'Tiktaalik roseae', taxon: 'Tiktaalik roseae', tagline: "Le poisson qui voulait marcher",
      period: 'Dévonien supérieur', dates: '≈ −375 millions d\'années', lifespan: 'Genre bref (≈ qq. Ma)',
      tlStart: 44, tlEnd: 52, tlGlac: [[70, 'Andine-saharienne'], [92, 'Karoo']],
      climTemp: 'Tropical chaud (30–35 °C)', climType: 'Lagunes & deltas côtiers', climPrec: 'Saisons des pluies marquées', climCo2: 'O₂ ~15 % · mers peu profondes',
      geo: ['Laurussia équatoriale', 'Actuelle île d\'Ellesmere (Arctique)'],
      geoNote: "Découvert en Arctique canadien — mais à l'époque, la région était sur l'équateur !",
      adapt: [
        ['🦴', 'Nageoires → membres', "Nageoires lobées avec os d'épaule, coude et poignet : de quoi se hisser hors de l'eau."],
        ['🔄', 'Cou mobile', "Premier « cou » de l'histoire : la tête bouge indépendamment du corps."],
        ['🫁', 'Poumons + branchies', "Respiration aérienne d'appoint dans des eaux pauvres en oxygène."],
        ['📐', 'Côtes larges', "Cage thoracique renforcée pour soutenir le corps hors de la poussée de l'eau."]
      ],
      diet: "Prédateur d'embuscade des bas-fonds : petits poissons et invertébrés.",
      pop: [20, 35, 55, 70, 78, 74, 68, 60, 55],
      popNote: "Lignée non éteinte au sens strict : Tiktaalik est proche de l'ancêtre de tous les tétrapodes.",
      factors: [
        ['🔑', 'Innovation clé', "Les membres et poumons ouvrent un tout nouveau milieu : la terre ferme."],
        ['🌍', 'Nouvelle niche', "Peu de concurrence hors de l'eau ; les lagunes asséchées deviennent un avantage."],
        ['🧬', 'Plan corporel fécond', "Le squelette « à membres » sera hérité par tous les vertébrés terrestres."]
      ],
      descendants: "Amphibiens, reptiles, oiseaux, mammifères… et nous.",
      trigger: "Les lagunes s'asséchaient saisonnièrement : les poissons capables de « marcher » d'une mare à l'autre survivaient mieux.",
      lesson: "Un stress climatique (assèchement) peut devenir moteur d'évolution : la pression a favorisé les formes de transition vers la terre.",
      sites: ['Île d\'Ellesmere (Nunavut, Canada)'],
      fossilSites: [
        { name: 'Île d\'Ellesmere', lat: 78.5, lon: -82.0, region: 'Nunavut, Canada', desc: "Sédiments dévoniens de l'Arctique canadien où le fossile fut découvert en 2004." }
      ],
      specimens: [['Holotype 2004', 'découvert par Neil Shubin & coll.']],
      facts: ["Tiktaalik avait des poignets : ses nageoires contenaient les mêmes os que notre radius et notre cubitus.", "Son nom signifie « grand poisson d'eau douce » en inuktitut."] },

    { id: 'arthropleura', fate: 'extinct', emoji: '🐛', accent: '#7d5bb0', wash: '#ece6f4',
      name: 'Arthropleura', taxon: 'Arthropleura armata', tagline: "Le géant du Carbonifère",
      period: 'Carbonifère', dates: '−340 à −280 millions d\'années', lifespan: '≈ 60 millions d\'années',
      tlStart: 40, tlEnd: 62, tlGlac: [[74, 'Karoo (fin)']],
      climTemp: '20–25 °C · tropical humide', climType: 'Forêts denses permanentes', climPrec: 'Élevées, pas de saison sèche', climCo2: 'CO₂ ~800 ppm · O₂ ~35 %',
      geo: ['Euramérique équatoriale', 'Actuelles Europe & Amérique du Nord'],
      geoNote: "Vivait dans les immenses forêts de fougères arborescentes qui donneront le charbon.",
      adapt: [
        ['📏', 'Gigantisme', "2 à 2,5 m de long : le plus grand arthropode terrestre ayant jamais existé."],
        ['💨', 'Respiration trachéale', "L'air à 35 % d'O₂ permet d'oxygéner un corps géant sans poumons."],
        ['🛡️', 'Cuirasse segmentée', "Plaques articulées épaisses pour se protéger et soutenir sa masse."],
        ['🌿', 'Régime détritivore', "Se nourrissait de végétaux et de spores, abondants dans la litière."]
      ],
      diet: "Détritivore/herbivore : fougères, spores, matière végétale en décomposition.",
      pop: [30, 55, 78, 88, 84, 66, 40, 18, 6],
      popNote: "Prospère au pic d'oxygène, puis décline avec la chute de l'O₂ et l'assèchement.",
      causes: [
        ['Chute de l\'O₂ (35→15 %)', 45, '#7d5bb0'],
        ['Assèchement du climat', 30, '#d1934e'],
        ['Effondrement des forêts', 15, '#5a9e5e'],
        ['Premiers prédateurs reptiliens', 10, '#5a7d8c']
      ],
      trigger: "La chute de l'oxygène atmosphérique : la respiration trachéale ne pouvait plus alimenter un corps aussi grand.",
      lesson: "La taille maximale des animaux dépend directement de la composition de l'atmosphère — surtout du taux d'oxygène.",
      sites: ['Écosse', 'Allemagne', 'États-Unis (empreintes)'],
      fossilSites: [
        { name: 'Arran (Écosse)', lat: 55.58, lon: -5.24, region: 'Écosse', desc: "Grès carbonifères conservant de larges pistes d'Arthropleura." },
        { name: 'Saar-Nahe', lat: 49.4, lon: 7.0, region: 'Allemagne', desc: "Bassin houiller livrant plaques cuticulaires et empreintes." },
        { name: 'Nouveau-Mexique', lat: 35.0, lon: -106.0, region: 'États-Unis', desc: "Empreintes de pistes de 50 cm de large attribuées au géant du Carbonifère." }
      ],
      specimens: [['Empreintes de pistes', 'traces de 50 cm de large'], ['Segments cuticulaires', 'plaques fossilisées']],
      facts: ["Aucun crâne complet n'a jamais été retrouvé : on le connaît surtout par ses plaques et ses traces de pas.", "La « Crise des forêts humides du Carbonifère » a scellé son sort en fragmentant son habitat."] },

    { id: 'megalodon', fate: 'extinct', emoji: '🦈', accent: '#2f7d92', wash: '#e3eff2',
      name: 'Mégalodon', taxon: 'Otodus megalodon', tagline: "Le plus grand requin de tous les temps",
      period: 'Miocène à Pliocène', dates: '−23 à −3,6 millions d\'années', lifespan: '≈ 20 millions d\'années',
      tlStart: 88, tlEnd: 97, tlGlac: [[95, 'Quaternaire']],
      climTemp: 'Océans chauds (20–30 °C)', climType: 'Mers côtières tempérées à tropicales', climPrec: 'Upwellings riches en nutriments', climCo2: 'CO₂ ~300–500 ppm · haut niveau marin',
      geo: ['Océans du monde entier', 'Côtes des Amériques', 'Méditerranée', 'Pacifique sud'],
      geoNote: "Cosmopolite : ses dents se retrouvent sur tous les continents sauf l'Antarctique.",
      adapt: [
        ['🦷', 'Dents de 18 cm', "Dents triangulaires dentelées, les plus grandes de tous les requins — de quoi trancher l'os de baleine."],
        ['📏', 'Corps de 15–18 m', "Trois fois le grand requin blanc ; masse estimée jusqu'à 60 tonnes."],
        ['🌡️', 'Semi-endothermie', "Capable de réchauffer ses muscles, mais dépendant des mers chaudes pour ses nurseries."],
        ['🐋', 'Prédateur d\'apex', "Au sommet de la chaîne marine : baleines, dauphins, phoques, grandes tortues."]
      ],
      diet: "Grands mammifères marins : baleines, dauphins, phoques, grandes tortues.",
      pop: [40, 62, 82, 90, 84, 60, 34, 14, 3],
      popNote: "Apogée au Miocène moyen (mers chaudes, proies abondantes), puis déclin au refroidissement Plio-Pléistocène.",
      causes: [
        ['Refroidissement des océans', 40, '#3d7fa8'],
        ['Effondrement des proies (baleines)', 30, '#b5654a'],
        ['Concurrence (requin blanc, orques)', 20, '#5a7d8c'],
        ['Fermeture des voies océaniques', 10, '#c98a3d']
      ],
      trigger: "Le refroidissement de la fin du Pliocène a fait disparaître ses nurseries côtières chaudes et raréfié les baleines dont il dépendait.",
      lesson: "Même un super-prédateur cosmopolite peut s'éteindre quand le climat réorganise les océans et déplace ses proies : la taille ne protège pas du changement.",
      sites: ['Calvert Cliffs (Maryland)', 'Bone Valley (Floride)', 'Formation Pisco (Pérou)', 'Bahía Inglesa (Chili)'],
      fossilSites: [
        { name: 'Calvert Cliffs', lat: 38.5, lon: -76.5, region: 'Maryland, USA', desc: "Falaises du Miocène riches en dents de mégalodon et faune marine." },
        { name: 'Bone Valley', lat: 27.8, lon: -81.9, region: 'Floride, USA', desc: "Gisement phosphaté livrant d'innombrables dents de mégalodon." },
        { name: 'Formation Pisco', lat: -14.3, lon: -75.7, region: 'Pérou', desc: "Désert côtier à préservation exceptionnelle de cétacés et requins du Miocène." },
        { name: 'Bahía Inglesa', lat: -27.1, lon: -70.9, region: 'Chili', desc: "Formation marine à dents de mégalodon et vertébrés du Néogène." }
      ],
      specimens: [['Dents isolées', 'jusqu\'à 18 cm de haut'], ['Vertèbres', 'centres calcifiés rares'], ['Séries dentaires', 'reconstitutions de mâchoires']],
      facts: ["On ne connaît le mégalodon presque que par ses dents : son squelette de cartilage se fossilise très mal.", "Une seule de ses dents remplit la paume d'une main d'adulte."] },

    { id: 'dodo', fate: 'extinct', emoji: '🐦', accent: '#8a7a3c', wash: '#f1ecdb',
      name: 'Dodo', taxon: 'Raphus cucullatus', tagline: "L'oiseau qui avait perdu la peur",
      period: 'Holocène', dates: 'Éteint vers 1681', lifespan: 'Endémique récent (île Maurice)',
      tlStart: 96, tlEnd: 99.5, tlGlac: [],
      climTemp: 'Tropical doux (23–27 °C)', climType: 'Forêt insulaire subtropicale', climPrec: 'Abondantes (île volcanique)', climCo2: 'Préindustriel (~280 ppm)',
      geo: ['Île Maurice', 'Océan Indien'],
      geoNote: "Endémique d'une seule île : aucune population de secours ailleurs sur Terre.",
      adapt: [
        ['🚫', 'Perte du vol', "Sans prédateur terrestre, voler ne servait plus : ailes atrophiées, corps massif (10–18 kg)."],
        ['🥚', 'Nid au sol', "Pondait un unique œuf à même le sol, sans défense contre les prédateurs importés."],
        ['🍈', 'Régime frugivore', "Fruits tombés, graines et bourgeons de la forêt mauricienne."],
        ['😌', 'Absence de peur', "N'ayant jamais connu de prédateur, il ne fuyait pas l'homme — d'où sa capture facile."]
      ],
      diet: "Fruits, graines, noix et bourgeons de la forêt insulaire.",
      pop: [95, 92, 88, 70, 45, 22, 8, 2, 0],
      popNote: "Découvert par les marins en 1598, disparu en moins d'un siècle : une des extinctions historiques les mieux datées.",
      causes: [
        ['Prédateurs introduits (rats, porcs, singes)', 40, '#5a7d8c'],
        ['Chasse par les marins', 35, '#b5654a'],
        ['Destruction de l\'habitat forestier', 20, '#5a9e5e'],
        ['Faible taux de reproduction', 5, '#8a8f97']
      ],
      trigger: "L'arrivée de l'homme et de ses animaux sur une île sans prédateurs : le dodo n'avait aucune défense évolutive.",
      lesson: "Les espèces insulaires, isolées par la géographie et un climat stable, sont d'une fragilité extrême face à un bouleversement brutal — ici l'invasion humaine plutôt que le climat.",
      sites: ['Mare aux Songes (Maurice)', 'Hauts plateaux de Maurice'],
      fossilSites: [
        { name: 'Mare aux Songes', lat: -20.43, lon: 57.70, region: 'Île Maurice', desc: "Marécage fossilifère livrant des centaines d'ossements de dodos." },
        { name: 'Hauts plateaux', lat: -20.30, lon: 57.55, region: 'Île Maurice', desc: "Dépôts de subfossiles de la faune endémique mauricienne." }
      ],
      specimens: [['Squelettes composites', 'reconstitués depuis 1865'], ['Tête d\'Oxford', 'seuls tissus mous connus'], ['Os Mare aux Songes', 'fouilles 1865 et 2005']],
      facts: ["Aucun spécimen complet naturalisé n'a survécu : les musées n'exposent que des reconstitutions.", "Le dodo est un cousin du pigeon ; son plus proche parent vivant est le pigeon de Nicobar."] },

    { id: 'smilodon', fate: 'extinct', emoji: '🐯', accent: '#a5642e', wash: '#f2e8db',
      name: 'Tigre à dents de sabre', taxon: 'Smilodon fatalis', tagline: "Le félin aux crocs de 18 cm",
      period: 'Pléistocène', dates: '−2,5 millions à −10 000 ans', lifespan: '≈ 2,5 millions d\'années',
      tlStart: 90, tlEnd: 98, tlGlac: [[94, 'Würm / Wisconsin']],
      climTemp: 'Froid glaciaire à tempéré', climType: 'Steppes, savanes et forêts claires', climPrec: 'Variables selon les cycles glaciaires', climCo2: '180–280 ppm (cycles glaciaires)',
      geo: ['Amérique du Nord', 'Amérique du Sud'],
      geoNote: "Ne vivait qu'aux Amériques ; jamais présent en Europe malgré le surnom de « tigre ».",
      adapt: [
        ['🦷', 'Canines de 18 cm', "Crocs en lame de sabre pour une morsure fatale à la gorge de grosses proies."],
        ['💪', 'Corps musculeux', "Trapu et puissant plutôt que rapide : embuscade et force brute (jusqu'à 280 kg)."],
        ['🦵', 'Pattes robustes', "Membres courts et massifs pour plaquer au sol de grands herbivores."],
        ['👥', 'Vie sociale probable', "De nombreux fossiles blessés puis guéris suggèrent l'entraide en groupe."]
      ],
      diet: "Grands herbivores : bisons, chevaux, jeunes mammouths, paresseux géants.",
      pop: [30, 55, 78, 88, 82, 66, 40, 16, 2],
      popNote: "Prospère tant que la mégafaune abonde, puis s'effondre avec elle à la fin du Pléistocène.",
      causes: [
        ['Disparition de la mégafaune', 50, '#b5654a'],
        ['Réchauffement de fin de glaciation', 25, '#d1934e'],
        ['Spécialisation extrême', 15, '#8a5a3f'],
        ['Pression humaine', 10, '#5a7d8c']
      ],
      trigger: "La disparition rapide des grands herbivores à la fin du Pléistocène : un chasseur ultra-spécialisé sans grosses proies ne pouvait survivre.",
      lesson: "La sur-spécialisation est un piège quand le climat change vite : privé de ses grandes proies, Smilodon n'a pas pu se rabattre sur du petit gibier.",
      sites: ['La Brea (Los Angeles)', 'Talara (Pérou)', 'Pampa argentine'],
      fossilSites: [
        { name: 'Rancho La Brea', lat: 34.06, lon: -118.36, region: 'Californie, USA', desc: "Fosses de bitume ayant piégé des milliers de Smilodon — le gisement de référence." },
        { name: 'Talara', lat: -4.58, lon: -81.27, region: 'Pérou', desc: "Suintements d'asphalte livrant une riche faune pléistocène sud-américaine." },
        { name: 'Pampa de Buenos Aires', lat: -34.6, lon: -58.4, region: 'Argentine', desc: "Sédiments pampéens à Smilodon populator, la plus grande espèce." }
      ],
      specimens: [['La Brea', 'plus de 2000 individus'], ['Crânes complets', 'canines intactes'], ['Smilodon populator', 'la plus grande espèce (~400 kg)']],
      facts: ["Les fosses de La Brea ont livré plus de 2000 tigres à dents de sabre, piégés en voulant dévorer des proies déjà englués.", "Ses canines spectaculaires étaient fragiles : elles tranchaient la chair, pas l'os."] }
  ];

  stories = [
    { chip: '536', wash: '#efe6dd', period: '536–550 apr. J.-C.', title: "L'année sans soleil", region: "Europe, Moyen-Orient, Asie — empire romain d'Orient",
      climate: '−1,5 à −2,5 °C', impact: 'Famines massives',
      harvest: [82,52,40,46,58,66,72,76], mort: [40,72,95,88,70,58,50,46],
      narrative: "Une double éruption volcanique (536 puis 540) plonge l'hémisphère nord dans un voile de poussière : le soleil est pâle pendant 18 mois. Les étés froids ruinent les récoltes de Chine à l'Irlande. Cette décennie, la plus froide de 2000 ans, précède de peu la peste de Justinien (541).",
      chain: 'Éruptions → voile stratosphérique → étés glacés → disettes → malnutrition → vulnérabilité à la peste de Justinien.' },
    { chip: '~810', wash: '#efe8dc', period: '760–910 apr. J.-C.', title: "L'effondrement Maya classique", region: 'Méso-Amérique — basses terres Maya (Yucatán, Péten)',
      climate: 'Sécheresses répétées', impact: 'Cités abandonnées',
      harvest: [78,70,52,38,44,36,30,34], mort: [44,52,68,82,74,86,90,82],
      narrative: "Les archives de stalagmites et de sédiments lacustres révèlent une série de sécheresses sévères entre 760 et 910. L'agriculture sur brûlis, dépendante des pluies, s'effondre ; les réservoirs des grandes cités se vident. En quelques générations, les centres du sud (Tikal, Copán, Palenque) sont désertés et l'écriture des stèles cesse.",
      chain: 'Sécheresses prolongées → échec des récoltes → pénurie d’eau → tensions politiques → abandon des cités-États.' },
    { chip: '1315', wash: '#e7ecdf', period: '1315–1322', title: 'La Grande Famine', region: "Europe du Nord-Ouest — de l'Irlande à la Pologne",
      climate: 'Étés froids & pluvieux', impact: '10–15 % de morts',
      histYear: 1316,
      harvest: [80,44,36,42,50,58,70,84], mort: [42,78,90,82,70,60,50,44],
      narrative: "Le début du Petit Âge glaciaire s'ouvre par des pluies torrentielles et des étés pourris. Les grains pourrissent sur pied deux années de suite (1315–1316) ; le sel manque pour conserver, le bétail meurt. Les prix du blé sont multipliés par cinq ; jusqu'à 10–15 % de la population des villes du Nord disparaît.",
      chain: 'Refroidissement → pluies incessantes → grains pourris → flambée des prix → famine urbaine → surmortalité.' },
    { chip: '1645', wash: '#e3e9ee', period: '1645–1715', title: 'Le Minimum de Maunder', region: 'Hémisphère nord — Europe, Chine des Ming',
      climate: 'Hivers extrêmes', impact: 'Crises & révoltes',
      histYear: 1690,
      harvest: [72,60,48,44,52,62,70,74], mort: [48,60,74,80,68,58,52,50],
      narrative: "Les taches solaires disparaïssent presque totalement pendant 70 ans. La Tamise et les canaux hollandais gèlent, on tient des foires sur la glace. En Chine, sécheresses et famines minent la dynastie Ming, qui s'effondre en 1644 ; en Europe, le ‘XVIIᵉ siècle de fer’ enchaîne disettes, révoltes et guerres.",
      chain: 'Minimum solaire → hivers rigoureux → saisons agricoles courtes → tensions sociales → révoltes et chutes de régimes.' },
    { chip: '1783', wash: '#eae4dc', period: '1783–1784', title: 'Éruption du Laki', region: 'Islande, Europe de l’Ouest',
      climate: 'Brouillard sec toxique', impact: 'Surmortalité aff.',
      histYear: 1783,
      harvest: [78,58,42,50,64,72,76,80], mort: [44,66,84,76,62,54,50,46],
      narrative: "La fissure du Laki déverse des gaz sulfureux durant huit mois. Un ‘brouillard sec’ recouvre l'Europe à l'été 1783, brûlant les cultures ; l'hiver suivant est glacial. En Islande, un cinquième de la population périt ; en France, les mauvaises récoltes répétées des années 1780 nourrissent le mécontentement pré-révolutionnaire.",
      chain: 'Éruption fissurale → aérosols sulfatés → récoltes brûlées → disette → tensions sociales (vers 1789).' },
    { chip: '1816', wash: '#e5e2ea', period: '1816', title: "L'année sans été", region: 'Hémisphère nord — Europe, Amérique du Nord',
      climate: '−0,4 à −0,7 °C', impact: 'Dernière gde famine',
      histYear: 1816,
      harvest: [80,74,40,58,70,78,82,84], mort: [46,52,82,70,58,52,48,46],
      narrative: "L'éruption du Tambora (1815), la plus puissante en 1300 ans, injecte des aérosols dans la stratosphère. En 1816, il neige en juin en Nouvelle-Angleterre, les gelées détruisent les cultures. L'Europe connaît sa dernière grande crise de subsistance ; la misère pousse des vagues d'émigration.",
      chain: 'Tambora → voile stratosphérique global → gelées estivales → récoltes perdues → famine, émigration, émeutes.' },
    { chip: '1934', wash: '#efe7d8', period: '1930–1936', title: 'Le Dust Bowl', region: 'Grandes Plaines américaines — Oklahoma, Kansas, Texas',
      climate: 'Sécheresse extrême', impact: '2,5 M déplacés',
      histYear: 1934,
      harvest: [82,64,44,28,22,30,40,58], mort: [46,54,66,78,84,74,60,50],
      narrative: "Une sécheresse pluriannuelle frappe des plaines déjà surexploitées par une agriculture intensive. Les sols nus s'envolent en tempêtes de poussière noires (les « black blizzards ») qui obscurcissent le ciel jusqu'à la côte est. Les récoltes s'effondrent ; environ 2,5 millions de personnes fuient la région, épisode immortalisé par Steinbeck.",
      chain: 'Sécheresse + labour intensif → érosion éolienne → tempêtes de poussière → faillites agricoles → exode massif (Okies).' }
  ];
  storyWash(i) { return this.stories[i].wash; }
  polyPath(arr, x0, x1, y0, y1, lo, hi) { const n = arr.length; return arr.map((v, i) => { const x = x0 + (x1 - x0) * (i / (n - 1)); const y = y1 - (y1 - y0) * ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)); return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' '); }
  shade(hex, amt) { const n = parseInt(hex.slice(1), 16); let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; r = Math.max(0, Math.min(255, Math.round(r + amt * 255))); g = Math.max(0, Math.min(255, Math.round(g + amt * 255))); b = Math.max(0, Math.min(255, Math.round(b + amt * 255))); return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
  gProject(lng, lat, lon0, lat0) {
    const d = Math.PI / 180, ph = lat * d, la = (lng - lon0) * d, cp = Math.cos(ph);
    const x = cp * Math.sin(la), y = Math.sin(ph), z = cp * Math.cos(la);
    const t = lat0 * d, ct = Math.cos(t), st = Math.sin(t);
    return { x, y: y * ct - z * st, z: y * st + z * ct };
  }
  densify(pts) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const n = Math.max(1, Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / 3));
      for (let k = 0; k < n; k++) { const t = k / n; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  drawGlobePoly(ctx, pts, cx, cy, R, lon0, lat0, fill, stroke) {
    const dp = this.densify(pts); let anyVis = false;
    ctx.beginPath();
    for (let i = 0; i < dp.length; i++) {
      const pr = this.gProject(dp[i][0], dp[i][1], lon0, lat0);
      let X, Y;
      if (pr.z >= 0) { X = cx + R * pr.x; Y = cy - R * pr.y; anyVis = true; }
      else { const len = Math.hypot(pr.x, pr.y) || 1e-6; X = cx + R * 0.999 * pr.x / len; Y = cy - R * 0.999 * pr.y / len; }
      i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
    }
    ctx.closePath();
    if (!anyVis) return;
    ctx.fillStyle = fill; ctx.fill();
    ctx.lineWidth = 1.2; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.stroke();
  }
  gLine(ctx, cx, cy, R, lon0, lat0, fn) {
    ctx.beginPath(); let pen = false;
    for (let i = 0; i <= 60; i++) {
      const p = fn(i / 60), pr = this.gProject(p[0], p[1], lon0, lat0);
      if (pr.z >= 0) { const X = cx + R * pr.x, Y = cy - R * pr.y; if (pen) ctx.lineTo(X, Y); else { ctx.moveTo(X, Y); pen = true; } }
      else pen = false;
    }
    ctx.stroke();
  }
  drawGraticule(ctx, cx, cy, R, lon0, lat0) {
    ctx.strokeStyle = 'rgba(255,255,255,0.09)'; ctx.lineWidth = 1;
    for (let lng = -180; lng < 180; lng += 30) this.gLine(ctx, cx, cy, R, lon0, lat0, t => [lng, -80 + 160 * t]);
    for (let lat = -60; lat <= 60; lat += 30) this.gLine(ctx, cx, cy, R, lon0, lat0, t => [-180 + 360 * t, lat]);
  }
  drawGlobe() {
    const g = this.globe; if (!g) return;
    const { ctx, canvas, dpr } = g;
    const W = canvas.width / dpr, H = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const p = this.curGlobe(), cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.42 * g.zoom, lon0 = g.lon0, lat0 = g.lat0;
    const glow = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.22);
    glow.addColorStop(0, 'rgba(111,178,209,0.22)'); glow.addColorStop(1, 'rgba(111,178,209,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
    ctx.fillStyle = p.ocean; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    this.drawGraticule(ctx, cx, cy, R, lon0, lat0);
    const edge = this.shade(p.land, -0.16);
    p.lands.forEach(pl => this.drawGlobePoly(ctx, pl, cx, cy, R, lon0, lat0, p.land, edge));
    p.ice.forEach(pl => this.drawGlobePoly(ctx, pl, cx, cy, R, lon0, lat0, '#eef4f7', '#cfe0e8'));
    if (this.state.geoSel) {
      const gp = this.paleoPos(this.state.geoSel, this.state.globePeriod);
      const pr = this.gProject(gp.lng, gp.lat, lon0, lat0);
      if (pr.z >= -0.03) {
        const X = cx + R * pr.x, Y = cy - R * pr.y, t = Date.now() / 600;
        const rad = 9 + Math.sin(t) * 3;
        ctx.beginPath(); ctx.arc(X, Y, rad, 0, 7); ctx.strokeStyle = 'rgba(226,101,63,0.55)'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.beginPath(); ctx.arc(X, Y, 5.5, 0, 7); ctx.fillStyle = '#e2653f'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
      }
    }
    const sh = ctx.createRadialGradient(cx - R * 0.32, cy - R * 0.38, R * 0.08, cx, cy, R * 1.05);
    sh.addColorStop(0, 'rgba(255,255,255,0.30)'); sh.addColorStop(0.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(3,15,24,0.55)');
    ctx.fillStyle = sh; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(143,180,198,0.5)'; ctx.stroke();
  }
  initGlobe() {
    const el = this.globeRef.current;
    if (!el || this.globe) return !!this.globe;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;cursor:grab;touch-action:none';
    el.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    this.globe = { el, canvas, ctx, dpr: 1, lon0: 20, lat0: 14, zoom: 1, pointers: new Map(), lastX: 0, lastY: 0, pinchD: 0 };
    const resize = () => { if (!this.globe) return; const w = el.clientWidth || 360, h = el.clientHeight || 340, dpr = Math.min(2, window.devicePixelRatio || 1); canvas.width = w * dpr; canvas.height = h * dpr; this.globe.dpr = dpr; this.drawGlobe(); };
    this.globeRO = new ResizeObserver(resize); this.globeRO.observe(el); resize();
    const down = e => { canvas.setPointerCapture(e.pointerId); this.globe.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); this.globe.lastX = e.clientX; this.globe.lastY = e.clientY; canvas.style.cursor = 'grabbing'; };
    const move = e => {
      const g = this.globe; if (!g || !g.pointers.has(e.pointerId)) return;
      g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (g.pointers.size >= 2) { const ps = [...g.pointers.values()]; const d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y); if (g.pinchD) g.zoom = Math.max(0.7, Math.min(2.8, g.zoom * d / g.pinchD)); g.pinchD = d; }
      else { g.lon0 -= (e.clientX - g.lastX) * 0.35; g.lat0 = Math.max(-85, Math.min(85, g.lat0 + (e.clientY - g.lastY) * 0.35)); g.lastX = e.clientX; g.lastY = e.clientY; }
    };
    const up = e => { const g = this.globe; if (!g) return; g.pointers.delete(e.pointerId); if (g.pointers.size < 2) g.pinchD = 0; if (g.pointers.size === 1) { const pv = [...g.pointers.values()][0]; g.lastX = pv.x; g.lastY = pv.y; } if (g.pointers.size === 0) canvas.style.cursor = 'grab'; };
    const wheel = e => { e.preventDefault(); const g = this.globe; if (!g) return; g.zoom = Math.max(0.7, Math.min(2.8, g.zoom * (e.deltaY < 0 ? 1.1 : 0.9))); };
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('wheel', wheel, { passive: false });
    this.globe.handlers = { down, move, up, wheel };
    const loop = () => { const g = this.globe; if (!g) return; g.raf = requestAnimationFrame(loop); if (this.state.globeRotate && g.pointers.size === 0) g.lon0 -= 0.18; this.drawGlobe(); };
    loop();
    return true;
  }
  tryInitGlobe() { if (this.globe) return; if (this.initGlobe()) this.forceUpdate(); }
  disposeGlobe() {
    if (this.globeRO) { this.globeRO.disconnect(); this.globeRO = null; }
    const g = this.globe; if (!g) return;
    cancelAnimationFrame(g.raf);
    const c = g.canvas, h = g.handlers;
    if (h) { c.removeEventListener('pointerdown', h.down); c.removeEventListener('pointermove', h.move); c.removeEventListener('pointerup', h.up); c.removeEventListener('pointercancel', h.up); c.removeEventListener('wheel', h.wheel); }
    if (c.parentNode === g.el) g.el.removeChild(c);
    this.globe = null;
  }
    onPinDown(e) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {} this.setState({ dragging: true }); }
  onPinMove(e) { if (!this.state.dragging || !this.cmpRef.current) return; const r = this.cmpRef.current.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * 100; const y = ((e.clientY - r.top) / r.height) * 100; this.setState({ pinX: Math.max(2, Math.min(98, x)), pinY: Math.max(8, Math.min(96, y)) }); }
  onPinUp() { this.setState({ dragging: false }); }
  onMapTap(e) {
    if (!this.state.addMode || !this.mapRef.current) return;
    const r = this.mapRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    const lon = px * 360 - 180, lat = 90 - py * 180;
    const site = { name: 'Nouveau site', lat, lon, cat: 'Communauté', region: 'Votre repère', desc: 'Décrivez ce site paléoclimatique.', user: true };
    this.setState(s => ({ userSites: [...s.userSites, site], site: { ...site, idx: s.userSites.length }, addMode: false }));
  }
  updateUserSite(idx, field, val) {
    this.setState(s => { const us = s.userSites.slice(); if (us[idx]) us[idx] = { ...us[idx], [field]: val }; const site = s.site ? { ...s.site, [field]: val } : s.site; return { userSites: us, site }; });
  }
  openProxy(k) { clearInterval(this.timer); this.setState({ proxy: k, grow: 100, playing: false }); }
  playProxy() {
    clearInterval(this.timer);
    this.setState({ grow: 0, playing: true });
    this.timer = setInterval(() => {
      this.setState(s => {
        const g = s.grow + 2;
        if (g >= 100) { clearInterval(this.timer); return { grow: 100, playing: false }; }
        return { grow: g };
      });
    }, 40);
  }

  line(f) {
    return this.ice.map((d, i) => `${i ? 'L' : 'M'}${this.sx(800 - d[0]).toFixed(1)} ${f(d).toFixed(1)}`).join(' ');
  }

  helpDocs = {
    extinct: { title: 'Espèces disparues', why: "Chaque espèce est un thermomètre vivant : sa morphologie enregistre le climat de son époque. Comparer mammouth, tiktaalik et arthropleura montre comment température, oxygène et humidité façonnent — puis condamnent — des lignées entières.", tips: ["Touchez une carte pour ouvrir sa fiche complète.", "Le passeport climatique résume ses conditions de vie.", "La section causes/facteurs relie sa disparition (ou survie) au climat."] },
    story: { title: 'Climat & sociétés', why: "Les grandes crises de subsistance sont souvent d'origine climatique : une éruption ou un minimum solaire raccourcit les saisons agricoles, les récoltes chutent, les prix flambent et la mortalité grimpe. Corréler ces séries rend la causalité visible — tout en rappelant qu'elle est rarement unique.", tips: ["Choisissez un épisode par la pastille d'année ou les flèches.", "Comparez les courbes récoltes (vert) et mortalité (rouge).", "Lisez la chaîne causale pour relier climat et société."] },
    hist: { title: 'Le climat des 6 derniers siècles', why: "Entre 1421 et 2008 se joue le passage du Petit Âge glaciaire au réchauffement industriel. Cette échelle relie les archives naturelles (proxies) aux mesures instrumentales et rend visibles les signatures des éruptions et des minima solaires.", tips: ["Glissez le curseur pour lire une année précise.", "Touchez un repère historique pour y sauter directement.", "Précipitations et pression sont des indices reconstruits, indicatifs."] },
    globe: { title: 'Le globe 3D', why: "Une carte plate déforme les hautes latitudes et coupe le monde en deux. Un globe rend justice à la vraie géométrie des continents et fait sentir, en le tournant, comment la Terre s'est réorganisée depuis la Pangée.", tips: ["Glissez pour tourner, molette ou pincez pour zoomer.", "Cherchez votre ville pour poser un repère et lire sa paléolatitude à chaque époque.", "Changez d'époque avec les puces ou le curseur du bas."] },
    home: { title: 'La frise chronologique', why: "Le climat de la Terre n'a jamais été stable. Cette frise range 4 milliards d'années en 6 grandes ères pour situer d'un coup d'œil les grands régimes : périodes « serre » sans glace, longues glaciations, et Terres « boule de neige ». C'est le point de repère de toute l'application.", tips: ["Touchez une ère (carte colorée) pour ouvrir sa fiche détaillée.", "Le CO₂ et le régime affichés sur chaque carte résument le climat de l'ère.", "Tous les outils d'analyse sont rangés dans le menu ☰ en haut à gauche."] },
    era: { title: "La fiche d'une ère", why: "Une ère se lit par ses chiffres-clés : température, CO₂, présence ou non de calottes glaciaires. On les rassemble ici pour comparer une ère à l'actuel et comprendre son contexte tectonique et biologique.", tips: ["Faites défiler pour voir contexte, calottes et événements datés.", "Le fil des événements majeurs est classé du plus ancien au plus récent.", "Revenez à la frise avec la flèche « ‹ » en haut de la fiche."] },
    timemachine: { title: 'Time-Machine — 4 courbes synchronisées', why: "Aucune variable climatique n'agit seule : le CO₂, la température, le niveau marin et la biodiversité montent et chutent ensemble. On les empile sur un même axe de temps pour rendre ces couplages visibles — par ex. voir la température suivre le CO₂, ou une extinction accompagner une chute du niveau marin.", tips: ["Glissez le curseur temporel : la ligne verticale balaie les 4 courbes en même temps.", "Le CO₂ est en échelle logarithmique car il varie sur plusieurs ordres de grandeur.", "Touchez une carte d'événement (PETM, K–Pg…) pour l'ouvrir en détail.", "Changez la fenêtre de temps (boutons de plage) pour zoomer sur une période."] },
    maps: { title: 'Cartes paléo — Avant / Après', why: "Les continents ont bougé, et cette géographie commande le climat : la position des terres décide où la glace peut s'accumuler et comment circulent les océans. Le comparateur montre à quel point le monde d'une époque diffère de l'actuel.", tips: ["Glissez la poignée verticale pour révéler « avant » puis « après ».", "Choisissez l'époque comparée : Pangée, Crétacé ou dernier maximum glaciaire.", "Déplacez l'épingle « Votre région » pour situer un lieu sur l'ancienne carte."] },
    proxies: { title: 'Galerie de proxies', why: "On ne peut pas mesurer directement le climat d'il y a un million d'années : on lit des indicateurs indirects — les « proxies ». Cet écran montre, étape par étape, comment un objet naturel enregistre le climat, puis comment on le décode.", tips: ["Lancez l'animation de formation pour voir l'archive se construire couche par couche.", "L'analyse isotopique se déroule en 5 étapes synchronisées avec le schéma.", "Chaque proxy indique ce qu'il mesure réellement (température, CO₂…)."] },
    archives: { title: 'Archives climatiques', why: "Chaque archive naturelle a ses forces et ses limites : l'une remonte très loin mais reste grossière, l'autre est annuelle mais courte. Les rassembler permet de choisir la bonne archive selon la question posée.", tips: ["Touchez une archive pour ouvrir sa fiche complète.", "Comparez surtout deux champs : la précision et jusqu'où elle remonte.", "« Ce qu'elle mesure » indique quelle variable climatique on en tire."] },
    species: { title: 'Espèces indicatrices', why: "Certains fossiles sont de vrais thermomètres et calendriers : leur seule présence signale un climat, un âge ou un milieu précis. Cette base explique ce que chaque espèce nous apprend du monde où elle vivait.", tips: ["Touchez une espèce pour son époque, son climat et sa répartition.", "Le bloc « Ce qu'elle indique » résume sa valeur d'indicateur climatique.", "Les fossiles-guides (trilobites, ammonites) servent surtout à dater les couches."] },
    simulator: { title: 'Simulateur climatique', why: "Plutôt que de subir les explications, on manipule les causes. En réglant les grands forçages (CO₂, Soleil, volcans, géographie, orbite) on voit émerger température, glaciers et niveau marin — et on saisit pourquoi telle combinaison donne une serre ou une glaciation.", tips: ["Bougez un curseur : les 3 sorties et le globe se recalculent en direct.", "Le globe schématise l'étendue des calottes et la chaleur de l'océan.", "« Réinitialiser » ramène aux valeurs actuelles (CO₂ 420 ppm, etc.).", "C'est un modèle pédagogique du bilan radiatif, pas une projection réelle."] },
    overlay: { title: 'Superposition de données', why: "Des archives différentes (CO₂, niveau marin, δ¹⁸O) devraient raconter la même histoire glaciaire. Les superposer permet de vérifier qu'elles concordent, et d'aligner visuellement leurs oscillations — le « wiggle-matching » que pratiquent les paléoclimatologues.", tips: ["Activez/désactivez chaque jeu de données pour comparer deux courbes à la fois.", "Le curseur de décalage glisse une série dans le temps pour caler les oscillations.", "Toutes les séries sont de vraies données NOAA normalisées."] },
    calc: { title: 'Calculateur δ¹⁸O → température', why: "Le rapport isotopique de l'oxygène (δ¹⁸O) d'une coquille dépend de la température de l'eau. Cet outil applique les vraies équations de calibration pour convertir une mesure de laboratoire en température — le geste quotidien du paléocéanographe.", tips: ["Réglez le δ¹⁸O de la calcite et celui de l'eau pour obtenir la température.", "Changez d'équation (Shackleton, O'Neil…) selon le type de foraminifère.", "La formule utilisée s'affiche pour chaque calibration."] },
    milank: { title: 'Bac à sable orbital (Milankovitch)', why: "Les glaciations reviennent au rythme de l'orbite terrestre. En jouant sur excentricité, obliquité et précession, on voit changer l'insolation reçue par saison et par latitude — le moteur astronomique des cycles glaciaires.", tips: ["Bougez les 3 curseurs orbitaux : la courbe d'insolation se recalcule.", "Basculez la saison (solstices) pour voir l'effet sur chaque hémisphère.", "L'obliquité contrôle surtout le contraste des saisons aux hautes latitudes."] },
    glossary: { title: 'Glossaire du jargon', why: "La littérature paléoclimatique est dense en termes techniques. Ce glossaire les décode pour rendre le reste de l'application — et les articles scientifiques — accessibles.", tips: ["Tapez dans la barre de recherche pour filtrer en direct.", "Filtrez par catégorie (isotopes, proxies, méthodes, événements).", "44 termes couvrent l'essentiel du vocabulaire des articles."] },
    sites: { title: 'Carte des sites proxy', why: "Le paléoclimat s'observe à des endroits précis : forages de glace, tillites, varves, gisements fossiles. Cette carte situe les grands sites de référence pour comprendre d'où viennent les données.", tips: ["Touchez une épingle pour la fiche du site (type, ce qu'on y lit).", "Filtrez par type d'archive pour n'afficher qu'une catégorie.", "Le mode ajout permet d'épingler un nouveau site."] },
    data: { title: 'Carottes de glace — 800 000 ans', why: "Les carottes de glace sont la preuve la plus directe du lien CO₂–température : les bulles d'air piégées donnent l'atmosphère du passé, la glace elle-même donne la température. On trace les deux ensemble pour voir leur couplage sur 8 cycles glaciaires.", tips: ["Suivez comment CO₂ et température montent et chutent de concert.", "Les données sont le composite EPICA/Vostok, normalisé à 20 ka.", "Chaque grande oscillation correspond à un cycle glaciaire-interglaciaire."] },
    extremes: { title: 'Événements extrêmes', why: "Les crises climatiques (Snowball Earth, PETM, extinctions) sont les tests grandeur nature du système Terre : elles révèlent sa sensibilité et ses points de bascule. On les documente par leurs causes, conséquences et preuves géologiques.", tips: ["Touchez un événement pour sa fiche structurée.", "Chaque fiche sépare causes, conséquences et preuves de terrain.", "Ces événements apparaissent aussi comme cartes dans Time-Machine."] },
    fossils: { title: 'Galerie des fossiles', why: "Un fossile n'est pas qu'un objet de collection : c'est un instantané de l'environnement où vivait l'organisme. Réunir des fiches illustrées permet de relier une forme reconnaissable à son âge, son milieu et le climat qu'elle révèle.", tips: ["Touchez un fossile pour sa fiche : âge, localisation, environnement, climat.", "Déposez votre propre photo dans le cadre de chaque fiche.", "Le champ « climat » indique ce que le fossile nous apprend du passé."] },
    glaciations: { title: 'Les grandes glaciations', why: "L'histoire de la Terre est ponctuée de rares mais gigantesques épisodes glaciaires, séparés par des centaines de millions d'années. Les placer sur un même axe de temps profond montre à quel point ils sont espacés, et ce qui les déclenche — géographie, chute du CO₂, biologie.", tips: ["Touchez une bande colorée sur l'axe pour ouvrir la glaciation correspondante.", "L'axe vertical va des temps anciens (haut) à aujourd'hui (bas).", "Chaque fiche sépare cause, extension des glaces et preuves de terrain.", "Déposez une carte de l'extension des glaces dans le cadre de la fiche."] },
    cores: { title: 'Carte des forages célèbres', why: "Quelques forages profonds ont fait l'essentiel de notre savoir sur les cycles glaciaires. Les situer sur la carte montre pourquoi on fore aux calottes polaires — seuls endroits où la glace ancienne se conserve — et ce que chaque carotte a révélé.", tips: ["Touchez une épingle pour la profondeur, l'âge maximal et les découvertes du forage.", "Antarctique = glace la plus ancienne ; Groenland = résolution fine des événements rapides.", "Déposez une carte du monde dans le cadre pour situer les forages."] },
    atlas: { title: 'Atlas mondial des sites', why: "Le paléoclimat ne se lit pas partout de la même façon : chaque grande région du globe garde une archive particulière — glace polaire, désert jadis vert, forêt tropicale, chaîne de montagnes, plancher océanique. Cet atlas relie sept régions emblématiques à ce qu'elles nous apprennent du climat passé.", tips: ["Touchez une épingle sur la carte, ou une carte-région, pour ouvrir sa fiche.", "Chaque fiche indique les proxies, la profondeur temporelle et les grandes révélations de la région.", "Le bouton en bas de fiche renvoie aux sites proxy réels de la région."] },
    scientists: { title: 'Portraits de scientifiques', why: "La paléoclimatologie est une aventure humaine : d'Agassiz devinant les glaciations dans les Alpes à Jouzel lisant 800 000 ans dans la glace, chaque figure a apporté une pièce du puzzle. Comprendre qui a découvert quoi éclaire comment nous savons ce que nous savons.", tips: ["Touchez un portrait pour lire sa biographie et ses contributions.", "Les fiches sont classées par ordre chronologique de naissance.", "Le lien en bas de fiche mène à l'outil ou l'archive liés à ses travaux."] }
  };

  fossils = [
    { id: 'ammonite', name: 'Ammonite', color: '#8a6fb0', wash: '#efeaf5', slot: 'fossil-ammonite', ph: 'Photo — coquille spiralée cloisonnée',
      taxon: 'Céphalopodes · Ammonoidea',
      age: 'Dévonien à Crétacé (~409 – 66 Ma)',
      loc: 'Mondial — bassins marins (Europe, Maroc, Madagascar)',
      env: 'Mers ouvertes, nectonique en pleine eau',
      clim: 'Mers chaudes du Mésozoïque, sans glace polaire' },
    { id: 'trilobite', name: 'Trilobite', color: '#b0863c', wash: '#f4efe1', slot: 'fossil-trilobite', ph: 'Photo — corps segmenté à trois lobes',
      taxon: 'Arthropodes · Trilobita',
      age: 'Cambrien à Permien (~521 – 252 Ma)',
      loc: 'Mondial — schistes et calcaires (Maroc, Utah, République tchèque)',
      env: 'Fonds marins peu profonds, benthique',
      clim: 'Mers paléozoïques chaudes à tempérées' },
    { id: 'fern', name: 'Fougère fossile', color: '#5f8f6a', wash: '#eaf2ec', slot: 'fossil-fern', ph: 'Photo — empreinte de fronde dans le charbon',
      taxon: 'Plantes · Ptéridophytes',
      age: 'Carbonifère (~359 – 299 Ma)',
      loc: 'Gisements houillers (Europe du Nord, Appalaches)',
      env: 'Forêts marécageuses côtières',
      clim: 'Chaud et très humide, atmosphère riche en O₂' },
    { id: 'foram', name: 'Foraminifère', color: '#4f7f9c', wash: '#e7eff4', slot: 'fossil-foram', ph: 'Photo — test calcaire microscopique (loupe binoculaire)',
      taxon: 'Protistes · Foraminifera',
      age: 'Cambrien à l\'actuel (~500 Ma – aujourd\'hui)',
      loc: 'Mondial — carottes de sédiments océaniques',
      env: 'Plancton de surface et benthos profond',
      clim: 'Tous régimes — proxy de référence (δ¹⁸O)' },
    { id: 'coral', name: 'Corail fossile', color: '#c56f7a', wash: '#f6eaec', slot: 'fossil-coral', ph: 'Photo — colonie à corallites (rugueux / tabulé)',
      taxon: 'Cnidaires · Anthozoa',
      age: 'Ordovicien à l\'actuel (~485 Ma – aujourd\'hui)',
      loc: 'Anciens récifs (bassin de Paris, Australie, Indonésie)',
      env: 'Eaux marines claires, chaudes et peu profondes',
      clim: 'Tropical chaud ; les récifs s\'effondrent lors des crises' },
    { id: 'leaf', name: 'Feuille fossile', color: '#7a9c4a', wash: '#eef3e4', slot: 'fossil-leaf', ph: 'Photo — empreinte de feuille à nervures',
      taxon: 'Plantes · Angiospermes',
      age: 'Crétacé à Néogène (~100 – 3 Ma)',
      loc: 'Sédiments lacustres et fluviatiles (Green River, Islande)',
      env: 'Bords de lacs et de rivières, forêts tempérées',
      clim: 'Reconstitué par la morphologie des marges foliaires' },
    { id: 'fish', name: 'Poisson fossile', color: '#5a8fa8', wash: '#e8f0f4', slot: 'fossil-fish', ph: 'Photo — squelette articulé sur dalle calcaire',
      taxon: 'Vertébrés · Actinopterygii',
      age: 'Éocène (~50 Ma)',
      loc: 'Lagerstätten (Monte Bolca, Green River Formation)',
      env: 'Lacs et lagunes anoxiques (conservation exceptionnelle)',
      clim: 'Chaud — optimum climatique de l\'Éocène' },
    { id: 'shark', name: 'Dent de requin', color: '#6b7f8c', wash: '#eceff2', slot: 'fossil-shark', ph: 'Photo — dent triangulaire dentelée (Carcharocles)',
      taxon: 'Vertébrés · Chondrichthyes',
      age: 'Miocène à Pliocène (~20 – 3 Ma)',
      loc: 'Sédiments marins côtiers (Caroline du Nord, Pérou, Malte)',
      env: 'Plateaux marins chauds, prédateur pélagique',
      clim: 'Mers chaudes du Néogène' },
    { id: 'amber', name: 'Ambre à inclusion', color: '#c19a3c', wash: '#f5efdd', slot: 'fossil-amber', ph: 'Photo — insecte piégé dans la résine dorée',
      taxon: 'Résine fossile · inclusions',
      age: 'Crétacé à Miocène (~100 – 15 Ma)',
      loc: 'Baltique, Birmanie, République dominicaine',
      env: 'Forêts résineuses continentales',
      clim: 'Tempéré chaud à tropical, boisé' },
    { id: 'wood', name: 'Bois pétrifié', color: '#a5824a', wash: '#f2ecdf', slot: 'fossil-wood', ph: 'Photo — tronc silicifié aux cernes visibles',
      taxon: 'Plantes · gymnospermes (bois)',
      age: 'Trias à Néogène (~230 – 5 Ma)',
      loc: 'Petrified Forest (Arizona), Patagonie, Lesbos',
      env: 'Plaines alluviales, troncs enfouis puis silicifiés',
      clim: 'Cernes = saisonnalité et stress hydrique passés' }
  ];

  // Photos de fossiles (Wikimedia Commons). id -> attribution. Sans entrée => illustration SVG.
  fossilCredits = {
    ammonite: { artist: 'Amir Ali Iranshahi', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Polished_fossil_ammonite_003.jpg' },
    trilobite: { artist: 'Gary Todd', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Fossil_Trilobite_(with_cast).jpg' },
    fern: { artist: 'Woudloper', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:Pecopteris_arborescens.jpg' },
    coral: { artist: 'James St. John', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Hexagonaria_percarinata_(fossil_coral)_(Petoskey_Stone)_(Traverse_Group,_Middle_Devonian;_Michigan,_USA)_5.jpg' },
    leaf: { artist: 'Daderot', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Acer_leaf,_Late_Early_Eocene,_Lost_Cabin_Age,_Green_River_Formation,_South_Bonanza,_Unitah_County,_Utah,_USA_-_Houston_Museum_of_Natural_Science_-_DSC01942.JPG' },
    fish: { artist: 'Joe deSousa', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Knightia_Fossil_Fish_(20255016550).jpg' },
    shark: { artist: 'James St. John', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Carcharocles_megalodon_(fossil_shark_tooth)_(Yorktown_Formation,_Upper_Miocene_to_Lower_Pliocene;_offshore_North_Carolina,_USA)_1.jpg' },
    amber: { artist: 'LucasFassari', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Dominican_Amber_housing_an_Insect.jpg' },
    wood: { artist: 'Michael Gäbler', license: 'CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Polished_slice_of_petrified_wood_(Large_Image).jpg' },
  };

  // Images Wikimedia Commons (régions, forages, glaciations, portraits, carte du monde). clé -> attribution.
  wikiCredits = {
    worldmap: { artist: 'Xofc / NASA', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Equirectangular-projection%2Bterminator.jpg' },
    cores: { artist: 'Nicolle Rager-Fuller / NSF', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:Lake_Vostok_drill_2011.jpg' },
    reg_groenland: { artist: 'NASA / MODIS', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:Sea_Ice_off_East_Coast_of_Greenland_(MODIS_2020-08-31).jpg' },
    reg_antarctique: { artist: 'Pierre Markuse', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Brunt_Ice_Shelf,_Antarctica_-_11_December_2022_(52559137901).jpg' },
    reg_sahara: { artist: 'Fiontain', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Algeria_Sahara_Desert_Photo_From_Drone_5.jpg' },
    reg_amazonie: { artist: 'James Martins', license: 'CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Amazon_rainforest_manaus_APA_Margem_Esquerda_do_Rio_Negro_-_panoramio.jpg' },
    reg_himalaya: { artist: 'NASA', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:Himalayas.jpg' },
    reg_alpes: { artist: 'René Reichelt', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Glacier_du_Tour_(Unsplash).jpg' },
    reg_atlantique: { artist: 'NASA / MODIS', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:Wave_clouds_in_the_central_Atlantic_Ocean_(MODIS_2016-05-01).jpg' },
    glac_huron: { artist: 'James St. John', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Metatillite_(Diamictite)_(Gowganda_Formation,_Paleoproterozoic,_2.3_Ga;_Wright_Run_Creek,_Dublin,_Ohio,_USA)_1_(46400939041).jpg' },
    glac_cryo: { artist: 'Oleg Kuznetsov (3depix)', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Snowball_Huronian.jpg' },
    glac_andean: { artist: 'PinchyCC', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Glacial_till_along_Rosario_Beach.jpg' },
    glac_karoo: { artist: 'Bahudhara', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Selwyn_Rock_3.JPG' },
    glac_quat: { artist: 'Hannes Grobe / AWI', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:Pleistocene_north_ice_map.jpg' },
    sci_milankovic: { artist: 'Auteur inconnu', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:Milutin_Milankovi%C4%87.jpg' },
    sci_agassiz: { artist: 'William Shaw Warren', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:Louis_Agassiz_H6.jpg' },
    sci_arrhenius: { artist: 'Auguste Léon', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:1922_Svante_Arrhenius.jpg' },
    sci_tyndall: { artist: 'John McLure Hamilton', license: 'Domaine public', source: 'https://commons.wikimedia.org/wiki/File:John_Tyndall_by_John_McLure_Hamilton.jpg' },
    sci_broecker: { artist: 'Bruce Gilbert', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Wally_Broecker,_c._2010.jpg' },
    sci_lorius: { artist: 'Claude Lorius', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Claude.Lorius.jpg' },
    sci_jouzel: { artist: 'G. Garitan', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Jean_Jouzel_2019.jpg' },
  };
  // clé -> chemin image (ou null), et crédit formaté court.
  wikiImg(key) { return this.wikiCredits[key] ? '/wiki/' + key + '.jpg' : null; }
  wikiCreditTxt(key) { const c = this.wikiCredits[key]; return c ? c.artist + ' · ' + c.license + ' · Wikimedia Commons' : ''; }

  glaciations = [
    { id: 'huron', name: 'Glaciation huronienne', color: '#3f7fa8', wash: '#e7f1f6', slot: 'glac-huron',
      start: 2450, end: 2100, period: 'Paléoprotérozoïque',
      span: '≈ 2,45 – 2,1 milliards d\'années', dur: '~350 Ma — la plus longue connue',
      extent: 'Probablement globale ou quasi globale (premières « Terre boule de neige »)',
      cause: 'Grande Oxydation : l\'O₂ produit par les cyanobactéries détruit le méthane (puissant gaz à effet de serre), effondrant l\'effet de serre.',
      evidence: 'Tillites (dépôts glaciaires) de la Formation de Gowganda, Ontario (Canada), à basse paléolatitude.',
      loc: 'Amérique du Nord (bouclier canadien), Afrique du Sud, Australie' },
    { id: 'cryo', name: 'Glaciations cryogéniennes', color: '#5aa0c4', wash: '#e6f2f8', slot: 'glac-cryo',
      start: 720, end: 635, period: 'Néoprotérozoïque',
      span: '≈ 720 – 635 millions d\'années', dur: 'Deux épisodes : Sturtien puis Marinoen',
      extent: 'Snowball Earth : glace jusqu\'à l\'équateur, océans peut-être gelés en surface',
      cause: 'Altération intense des basaltes de Rodinia consommant le CO₂, rétroaction de l\'albédo ; sortie par accumulation volcanique de CO₂.',
      evidence: 'Dépôts glaciaires équatoriaux, « cap carbonates » sus-jacents, formations ferrifères rubanées.',
      loc: 'Mondial — dépôts sur presque tous les continents' },
    { id: 'andean', name: 'Glaciation andine-saharienne', color: '#6f9c6a', wash: '#eaf2ea', slot: 'glac-andean',
      start: 460, end: 420, period: 'Ordovicien–Silurien',
      span: '≈ 460 – 420 millions d\'années', dur: 'Pic à l\'Hirnantien (~445 Ma)',
      extent: 'Calotte centrée sur le Gondwana, alors positionné sur le pôle Sud',
      cause: 'Gondwana au pôle Sud + baisse du CO₂ (altération, essor des premières plantes terrestres).',
      evidence: 'Vallées glaciaires et tillites du Sahara (Afrique du Nord), stries glaciaires ; liée à l\'extinction Ordovicien-Silurien.',
      loc: 'Afrique du Nord (Sahara), Amérique du Sud (Andes), Arabie' },
    { id: 'karoo', name: 'Glaciation du Karoo', color: '#8a7fb0', wash: '#eeeaf5', slot: 'glac-karoo',
      start: 360, end: 260, period: 'Carbonifère–Permien',
      span: '≈ 360 – 260 millions d\'années', dur: '~100 Ma (Late Paleozoic Ice Age, LPIA)',
      extent: 'Vastes calottes sur le Gondwana austral, cycles glaciaires marqués',
      cause: 'Essor des forêts (enfouissement massif de carbone → chute du CO₂) et position polaire du Gondwana.',
      evidence: 'Tillites du Groupe du Karoo (Afrique du Sud), surfaces striées, diamictites sur les continents du Gondwana.',
      loc: 'Afrique australe, Inde, Australie, Antarctique, Amérique du Sud' },
    { id: 'quat', name: 'Glaciation quaternaire', color: '#4f7f9c', wash: '#e7eff4', slot: 'glac-quat',
      start: 2.6, end: 0, period: 'Quaternaire',
      span: '2,58 millions d\'années – aujourd\'hui', dur: 'En cours — nous vivons dans un interglaciaire',
      extent: 'Calottes de l\'hémisphère nord pulsant au rythme des cycles glaciaires (~100 ka)',
      cause: 'Fermeture de l\'isthme de Panama, surrection himalayenne, baisse du CO₂, rythmée par les cycles de Milankovitch.',
      evidence: 'Carottes de glace (EPICA, Vostok), moraines, δ¹⁸O des foraminifères, loess.',
      loc: 'Hémisphère nord (Laurentide, Fennoscandie), Antarctique, Groenland' }
  ];

  cores = [
    { id: 'vostok', name: 'Vostok', color: '#4f7f9c', x: 79.5, y: 92.5, region: 'Antarctique de l\'Est · station russe',
      depth: '3 623 m de glace forée',
      maxage: '≈ 420 000 ans (4 cycles glaciaires)',
      finds: 'A révélé le couplage étroit CO₂–température sur 4 cycles glaciaires ; a mis au jour le lac sous-glaciaire Vostok sous la calotte.',
      loc: '78,5° S · 106,8° E · 3 488 m d\'altitude' },
    { id: 'epica', name: 'EPICA Dome C', color: '#5aa0c4', x: 84.0, y: 91.5, region: 'Antarctique de l\'Est · consortium européen',
      depth: '3 270 m de glace forée',
      maxage: '≈ 800 000 ans — le plus long enregistrement de glace continu',
      finds: 'A étendu le record CO₂–température à 8 cycles glaciaires ; confirme que le CO₂ actuel dépasse tout l\'intervalle des 800 000 ans.',
      loc: '75,1° S · 123,4° E · 3 233 m d\'altitude' },
    { id: 'grip', name: 'GRIP', color: '#6f9c6a', x: 40.2, y: 9.0, region: 'Sommet du Groenland · projet européen',
      depth: '3 029 m — jusqu\'au socle rocheux',
      maxage: '≈ 120 000 ans (jusqu\'à l\'Eémien, partie basale perturbée)',
      finds: 'A mis en évidence les brusques oscillations de Dansgaard-Oeschger ; changements climatiques abrupts en quelques décennies.',
      loc: '72,6° N · 37,6° O · sommet, 3 230 m' },
    { id: 'gisp2', name: 'GISP2', color: '#c08a3c', x: 36.4, y: 11.4, region: 'Sommet du Groenland · projet américain',
      depth: '3 053 m — record de profondeur au Groenland',
      maxage: '≈ 110 000 ans',
      finds: 'Foré à 28 km de GRIP pour recoupement ; a précisé le Dryas récent et montré un basculement climatique en ~10 ans.',
      loc: '72,6° N · 38,5° O · sommet, 3 200 m' }
  ];

  // Atlas mondial des sites paléoclimatiques — 7 grandes régions-archives.
  // x/y = position sur une carte équirectangulaire ( x=(lon+180)/360·100 ; y=(90−lat)/180·100 ).
  atlasRegions = [
    { id: 'groenland', name: 'Groenland', emoji: '❄️', color: '#4a9cc9', wash: '#e8f2f8', x: 38.9, y: 10.5,
      lat: 72, lon: -40, coords: '72° N · 40° O', slot: 'atlas-groenland',
      tagline: 'La calotte qui enregistre les changements brusques',
      intro: "La calotte groenlandaise conserve une glace vieille de ~130 000 ans. Sa forte accumulation de neige donne une résolution quasi annuelle : c'est l'archive reine des changements climatiques abrupts.",
      timespan: '≈ 130 000 ans (jusqu\'à l\'Eémien)',
      proxies: ['Carottes de glace', 'δ¹⁸O de la glace', 'Bulles d\'air', 'Poussières', 'Couches annuelles'],
      reveal: [
        ['🧊', 'Forages de référence', 'GRIP, GISP2, NGRIP puis NEEM ont percé la calotte jusqu\'au socle. Les bulles d\'air piégées livrent l\'atmosphère passée ; le δ¹⁸O de la glace donne la température.'],
        ['⚡', 'Événements de Dansgaard-Oeschger', 'Le Groenland a révélé 25 réchauffements abrupts pendant la dernière glaciation — parfois +8 à +15 °C en quelques décennies. Une découverte majeure sur l\'instabilité du climat.'],
        ['🌊', 'Le Dryas récent', 'La carotte montre un basculement climatique en ~10 ans il y a 12 900 ans, lié à un ralentissement de la circulation océanique — le scénario type d\'un point de bascule.'],
      ],
      facts: ['3 km d\'épaisseur de glace', 'Résolution quasi annuelle sur les derniers millénaires', 'Complémentaire de l\'Antarctique (plus ancien mais moins résolu)'],
      linkCat: 'Carotte de glace' },
    { id: 'antarctique', name: 'Antarctique', emoji: '🐧', color: '#3d7fa8', wash: '#e6eff6', x: 50, y: 94,
      lat: -80, lon: 0, coords: '80° S · 0°', slot: 'atlas-antarctique',
      tagline: 'La plus longue mémoire de glace de la planète',
      intro: "Le plus grand réservoir de glace de la Terre abrite les carottes les plus anciennes : EPICA Dome C remonte 800 000 ans. C'est ici qu'on a établi le couplage direct entre CO₂ et température.",
      timespan: '≈ 800 000 ans (record continu ; projet « Oldest Ice » vise 1,5 Ma)',
      proxies: ['Carottes de glace', 'CO₂ / CH₄ des bulles', 'δD et δ¹⁸O', 'Poussières éoliennes'],
      reveal: [
        ['📈', 'Le couplage CO₂–température', 'Vostok puis EPICA ont montré, sur 8 cycles glaciaires, que CO₂ et température montent et chutent ensemble. La preuve la plus directe du rôle du CO₂.'],
        ['🕰️', '800 000 ans en continu', 'La faible accumulation de neige au Dôme C comprime beaucoup de temps dans peu de glace : moins de détail annuel, mais une profondeur temporelle inégalée.'],
        ['🧪', 'Un plafond dépassé', 'Sur tout l\'intervalle des 800 000 ans, le CO₂ oscillait entre 180 et 300 ppm. Nous avons dépassé 420 ppm : hors de la gamme naturelle du dernier million d\'années.'],
      ],
      facts: ['Jusqu\'à 4,8 km d\'épaisseur de glace', 'Sites clés : EPICA Dome C, Vostok, Dome Fuji, WAIS Divide', 'Abrite des lacs sous-glaciaires (lac Vostok)'],
      linkCat: 'Carotte de glace' },
    { id: 'sahara', name: 'Sahara', emoji: '🏜️', color: '#c98a3d', wash: '#f6efe4', x: 53.6, y: 37,
      lat: 23, lon: 13, coords: '23° N · 13° E', slot: 'atlas-sahara',
      tagline: 'Un désert qui fut vert — et une glaciation tropicale',
      intro: "Le plus grand désert chaud garde deux archives majeures : les traces d'un « Sahara vert » récent, et les tillites d'une glaciation qui atteignit ces latitudes il y a 445 millions d'années.",
      timespan: 'Du « Sahara vert » (~11–5 ka) aux tillites ordoviciennes (~445 Ma)',
      proxies: ['Paléolacs & pollens', 'Art rupestre', 'Tillites glaciaires', 'Poussières exportées', 'Dunes fossiles'],
      reveal: [
        ['🌿', 'La Période humide africaine', 'Il y a 11 000 à 5 000 ans, la mousson renforcée par la précession orbitale a couvert le Sahara de lacs, de savanes et d\'hippopotames — peints sur les parois du Tassili.'],
        ['❄️', 'Une glaciation au Sahara', 'À l\'Ordovicien, le Gondwana était sur le pôle Sud : des vallées glaciaires et des stries fossiles sous le sable actuel témoignent d\'une calotte là où règne aujourd\'hui le désert.'],
        ['💨', 'Le poumon de poussière', 'Le Sahara exporte chaque année des centaines de millions de tonnes de poussière jusqu\'en Amazonie — un flux enregistré dans les carottes marines de l\'Atlantique.'],
      ],
      facts: ['Cyclicité orbitale de la mousson (précession, ~21 ka)', 'Tillites de l\'Ordovicien-Silurien', 'Fertilise l\'Amazonie par ses poussières'],
      linkCat: 'Tillite / Snowball' },
    { id: 'amazonie', name: 'Amazonie', emoji: '🌳', color: '#4f9d7a', wash: '#e7f2ec', x: 32.8, y: 51.5,
      lat: -3, lon: -62, coords: '3° S · 62° O', slot: 'atlas-amazonie',
      tagline: 'La forêt-mémoire des climats tropicaux',
      intro: "La plus grande forêt tropicale enregistre les variations d'humidité tropicale via ses sédiments lacustres, ses pollens et les spéléothèmes des grottes andines voisines. Un test grandeur nature de la résilience des forêts.",
      timespan: 'Derniers cycles glaciaires (~100 ka) ; spéléothèmes jusqu\'à plusieurs centaines de ka',
      proxies: ['Pollens & charbons', 'Sédiments lacustres', 'Spéléothèmes andins', 'δ¹³C des sols', 'Cernes tropicaux'],
      reveal: [
        ['🌦️', 'Mousson sud-américaine', 'Les stalagmites des Andes orientales (grotte de Paraíso, Pérou) reconstruisent la pluviométrie amazonienne sur des dizaines de milliers d\'années, calées sur les cycles orbitaux.'],
        ['🔥', 'Refuges glaciaires', 'Pollens et charbons montrent qu\'au dernier maximum glaciaire, la forêt était plus fraîche et par endroits fragmentée — un débat clé sur l\'origine de sa biodiversité.'],
        ['🌍', 'Puits puis source de carbone', 'Archives et mesures actuelles documentent le basculement possible de la forêt d\'un puits de carbone vers une source sous l\'effet du réchauffement et de la déforestation.'],
      ],
      facts: ['Reçoit la poussière fertilisante du Sahara', 'Spéléothèmes = calendriers de la mousson', 'Point de bascule potentiel du système Terre'],
      linkCat: 'Spéléothème' },
    { id: 'himalaya', name: 'Himalaya', emoji: '🏔️', color: '#8a6fb0', wash: '#efeaf5', x: 73.3, y: 33.3,
      lat: 30, lon: 84, coords: '30° N · 84° E', slot: 'atlas-himalaya',
      tagline: 'La chaîne qui a refroidi la planète',
      intro: "Le « troisième pôle » concentre glaciers de montagne et archives de la mousson asiatique. Surtout, la surrection de l'Himalaya a piloté le climat global sur des millions d'années en consommant le CO₂.",
      timespan: 'De la mousson récente (spéléothèmes, ~640 ka) à la surrection (dizaines de Ma)',
      proxies: ['Glaciers de montagne', 'Spéléothèmes de mousson', 'Loess & sédiments', 'Isotopes du strontium'],
      reveal: [
        ['⛏️', 'Le thermostat de la Terre', 'La surrection himalayenne a exposé d\'immenses surfaces de roche à l\'altération, qui consomme le CO₂ atmosphérique — un refroidissement de long terme qui a préparé les glaciations du Quaternaire.'],
        ['🌧️', 'Archive de la mousson', 'Les grottes chinoises voisines (Hulu, Sanbao, Dongge) donnent l\'un des plus beaux enregistrements orbitaux de la mousson asiatique sur 640 000 ans, daté à l\'uranium-thorium.'],
        ['🧊', 'Le troisième pôle', 'Les glaciers himalayens, châteaux d\'eau de l\'Asie, conservent leurs propres carottes (Guliya, plateau tibétain) et reculent aujourd\'hui rapidement.'],
      ],
      facts: ['Plus grande réserve de glace hors des pôles', 'Moteur du refroidissement cénozoïque', 'Loess chinois = poussière piégée sous le vent'],
      linkCat: 'Spéléothème' },
    { id: 'alpes', name: 'Alpes', emoji: '🗻', color: '#5a86a0', wash: '#e9eff3', x: 52.8, y: 24,
      lat: 46.5, lon: 10, coords: '46,5° N · 10° E', slot: 'atlas-alpes',
      tagline: 'Le berceau de la théorie des glaciations',
      intro: "C'est dans les Alpes que Louis Agassiz a formulé la théorie des âges glaciaires. Moraines, blocs erratiques et glaciers en recul font des Alpes un livre ouvert de la glaciologie — et un thermomètre du réchauffement actuel.",
      timespan: 'Cycles glaciaires quaternaires ; recul mesuré depuis ~1850',
      proxies: ['Moraines & erratiques', 'Glaciers alpins', 'Varves lacustres', 'Cernes des arbres', 'Momie glaciaire (Ötzi)'],
      reveal: [
        ['💡', 'Où naît l\'idée des glaciations', 'Blocs erratiques et moraines loin des glaciers actuels ont conduit Agassiz (1840) à proposer qu\'une grande glaciation avait jadis recouvert l\'Europe — acte de naissance de la paléoclimatologie.'],
        ['📉', 'Thermomètres visibles', 'Le recul des glaciers alpins depuis la fin du Petit Âge glaciaire (~1850) est l\'un des signaux les plus lisibles du réchauffement ; leurs fronts datent les avancées passées.'],
        ['🧊', 'Archives de haute altitude', 'La fonte a livré Ötzi, momie de 5 300 ans, et expose des sols et bois anciens — preuves que ces glaces n\'avaient pas reculé aussi loin depuis des millénaires.'],
      ],
      facts: ['Nom des glaciations alpines : Günz, Mindel, Riss, Würm', 'Recul glaciaire = signal climatique direct', 'Varves lacustres à résolution annuelle'],
      linkCat: 'Varves' },
    { id: 'atlantique', name: 'Océan Atlantique', emoji: '🌊', color: '#3a7d91', wash: '#e6f0f2', x: 38.9, y: 32,
      lat: 33, lon: -40, coords: '33° N · 40° O', slot: 'atlas-atlantique',
      tagline: 'Le tapis roulant qui distribue la chaleur',
      intro: "Sous l'Atlantique, les sédiments marins et leurs foraminifères ont fondé la paléocéanographie. C'est aussi le siège de la circulation thermohaline — le « tapis roulant océanique » de Wallace Broecker.",
      timespan: 'Des sédiments récents à des dizaines de millions d\'années (forages IODP)',
      proxies: ['Carottes de sédiments', 'δ¹⁸O des foraminifères', 'Couches d\'IRD (Heinrich)', 'Mg/Ca', 'Assemblages microfossiles'],
      reveal: [
        ['🌡️', 'Naissance de la paléocéanographie', 'Cesare Emiliani a lu le δ¹⁸O des foraminifères des carottes atlantiques pour reconstruire les températures et définir les stades isotopiques marins — l\'échelle de temps de référence.'],
        ['♻️', 'Le tapis roulant océanique', "Broecker a décrit la circulation thermohaline : l'Atlantique Nord plonge des eaux froides et salées qui redistribuent la chaleur planétaire. Son ralentissement est un point de bascule surveillé (AMOC)."],
        ['🧊', 'Les événements de Heinrich', 'Des couches de débris rocheux (IRD) larguées par des armadas d\'icebergs marquent des débâcles massives de la calotte laurentidienne — couplées aux soubresauts du Groenland.'],
      ],
      facts: ['Foraminifères = thermomètres et calendriers', 'Siège de l\'AMOC (circulation méridienne)', 'Forages profonds DSDP / ODP / IODP'],
      linkCat: 'Limite / extinction' },
  ];

  // Portraits de scientifiques — les figures de la paléoclimatologie.
  scientists = [
    { id: 'agassiz', name: 'Louis Agassiz', initials: 'LA', color: '#5a86a0', wash: '#e9eff3', slot: 'sci-agassiz',
      years: '1807 – 1873', nat: '🇨🇭 Suisse → 🇺🇸 États-Unis', field: 'Naturaliste · glaciologie',
      tagline: 'A prouvé que la Terre a connu des âges glaciaires',
      keyWork: '« Études sur les glaciers » (1840)',
      bio: [
        "Naturaliste suisse formé en médecine et en histoire naturelle, Louis Agassiz s'illustre d'abord par l'étude des poissons fossiles avant de bouleverser la géologie.",
        "En observant blocs erratiques, moraines et roches striées loin de tout glacier, il en déduit qu'une immense calotte a jadis recouvert l'Europe. Sa théorie de l'« Époque glaciaire », exposée en 1837 puis dans ses Études sur les glaciers (1840), fonde la paléoclimatologie.",
        "Émigré aux États-Unis en 1846, il devient professeur à Harvard et y fonde le Museum of Comparative Zoology. Grand pédagogue, il reste toutefois un adversaire acharné de la théorie de l'évolution de Darwin.",
      ],
      contributions: [
        ['🧊', 'Théorie des glaciations', 'Premier à démontrer, preuves de terrain à l\'appui, que des glaciers ont recouvert de vastes régions aujourd\'hui tempérées.'],
        ['🪨', 'Lecture des moraines', 'A codé la reconnaissance des blocs erratiques et moraines comme signatures d\'anciennes glaciations.'],
        ['🎓', 'Institution scientifique', 'Fondateur du Museum of Comparative Zoology de Harvard, formateur de toute une génération de naturalistes.'],
      ],
      legacy: "L'idée qu'un climat radicalement différent a régné sur Terre — pilier de toute la paléoclimatologie — remonte à lui. Les Alpes, son terrain d'observation, en restent le berceau. On lui doit le concept ; on retient aussi son refus obstiné de l'évolution.",
      note: 'Ses positions sur l\'origine des espèces humaines, marquées par le racisme scientifique de son temps, sont aujourd\'hui unanimement rejetées.',
      linkScreen: 'atlas', linkLabel: 'Voir l\'Atlas → Alpes' },
    { id: 'tyndall', name: 'John Tyndall', initials: 'JT', color: '#3a7d91', wash: '#e6f0f2', slot: 'sci-tyndall',
      years: '1820 – 1893', nat: '🇮🇪 Irlande', field: 'Physicien',
      tagline: 'A mesuré l\'effet de serre en laboratoire',
      keyWork: 'Expériences sur l\'absorption infrarouge des gaz (1859)',
      bio: [
        "Physicien irlandais, alpiniste et grand vulgarisateur, John Tyndall s'intéresse au rayonnement de chaleur (l'infrarouge).",
        "En 1859, il construit un spectrophotomètre à radiation et démontre que la vapeur d'eau et le dioxyde de carbone absorbent fortement la chaleur rayonnante, alors que l'azote et l'oxygène — l'essentiel de l'air — sont transparents.",
        "Il comprend que ces gaz-traces contrôlent la température de surface de la Terre et que leur variation pourrait expliquer les changements de climat, dont les âges glaciaires d'Agassiz.",
      ],
      contributions: [
        ['🔬', 'Preuve expérimentale de l\'effet de serre', 'A mesuré directement l\'absorption de l\'infrarouge par CO₂ et vapeur d\'eau — base physique du réchauffement.'],
        ['🌡️', 'Rôle des gaz-traces', 'A montré que des gaz minoritaires gouvernent le bilan thermique de l\'atmosphère.'],
        ['🏔️', 'Physique des glaciers', 'A aussi étudié l\'écoulement de la glace, reliant physique et glaciologie.'],
      ],
      legacy: "Toute la théorie moderne du climat repose sur son constat de 1859 : sans les gaz à effet de serre, la Terre serait gelée. Ses expériences précèdent de près de 40 ans le calcul d'Arrhenius.",
      linkScreen: 'simulator', linkLabel: 'Régler le CO₂ dans le Simulateur' },
    { id: 'arrhenius', name: 'Svante Arrhenius', initials: 'SA', color: '#c98a3d', wash: '#f6efe4', slot: 'sci-arrhenius',
      years: '1859 – 1927', nat: '🇸🇪 Suède', field: 'Chimiste physicien',
      tagline: 'A calculé le premier le réchauffement dû au CO₂',
      keyWork: '« On the Influence of Carbonic Acid in the Air… » (1896)',
      bio: [
        "Chimiste suédois, prix Nobel de chimie 1903 pour sa théorie de la dissociation électrolytique, Arrhenius s'attaque au problème des âges glaciaires.",
        "En 1896, à la main, il calcule l'effet d'une variation de CO₂ sur la température globale et estime qu'un doublement réchaufferait la Terre de plusieurs degrés — un ordre de grandeur remarquablement proche des estimations actuelles.",
        "Il fut aussi l'un des premiers à envisager que la combustion du charbon puisse, à terme, réchauffer le climat.",
      ],
      contributions: [
        ['🧮', 'Première sensibilité climatique', 'A quantifié le lien entre concentration de CO₂ et température globale.'],
        ['🏭', 'Anticipation du réchauffement anthropique', 'A relié dès 1896 les émissions industrielles de CO₂ à un futur réchauffement.'],
        ['🏆', 'Nobel de chimie 1903', 'Récompensé pour ses travaux fondateurs sur les électrolytes.'],
      ],
      legacy: "Son calcul de 1896 est le premier modèle quantitatif du climat. La notion de « sensibilité climatique » — le réchauffement pour un doublement du CO₂ — vient directement de lui.",
      linkScreen: 'simulator', linkLabel: 'Doubler le CO₂ dans le Simulateur' },
    { id: 'milankovic', name: 'Milutin Milanković', initials: 'MM', color: '#8a6fb0', wash: '#efeaf5', slot: 'sci-milankovic',
      years: '1879 – 1958', nat: '🇷🇸 Serbie', field: 'Mathématicien · climatologie',
      tagline: 'A relié les glaciations à l\'orbite terrestre',
      keyWork: '« Canon de l\'insolation terrestre » (1941)',
      bio: [
        "Ingénieur et mathématicien serbe, Milanković consacre des décennies à une question : peut-on calculer, par la seule mécanique céleste, le climat des époques passées ?",
        "Il calcule à la main l'insolation reçue par chaque latitude et chaque saison en fonction de trois cycles orbitaux — excentricité (~100 ka), obliquité (~41 ka) et précession (~23 ka). Une partie de ce travail titanesque est menée alors qu'il est interné pendant la Première Guerre mondiale.",
        "Son Canon de 1941 pose que ces variations d'ensoleillement rythment l'avancée et le recul des calottes — la théorie astronomique des paléoclimats.",
      ],
      contributions: [
        ['☉', 'Théorie astronomique du climat', 'A montré que excentricité, obliquité et précession modulent l\'insolation et déclenchent les glaciations.'],
        ['✍️', 'Calcul de l\'insolation', 'A produit à la main des courbes d\'ensoleillement pour tout le Quaternaire.'],
        ['🔄', 'Les cycles de Milankovitch', 'Ses cycles portent son nom et structurent la lecture de toutes les archives climatiques.'],
      ],
      legacy: "Longtemps contestée, sa théorie est confirmée en 1976 (Hays, Imbrie & Shackleton) : les cycles orbitaux sont bien inscrits dans les sédiments marins. Les cycles de Milankovitch sont aujourd'hui le cadre temporel de la paléoclimatologie.",
      linkScreen: 'milank', linkLabel: 'Ouvrir le Bac à sable orbital' },
    { id: 'dansgaard', name: 'Willi Dansgaard', initials: 'WD', color: '#4a9cc9', wash: '#e8f2f8', slot: 'sci-dansgaard',
      years: '1922 – 2011', nat: '🇩🇰 Danemark', field: 'Paléoclimatologue',
      tagline: 'A fait parler les isotopes de la glace',
      keyWork: 'Isotopes de la pluie et de la glace (années 1950–1980)',
      bio: [
        "Géophysicien danois, Dansgaard découvre que le rapport isotopique de l'oxygène (δ¹⁸O) dans les précipitations dépend de la température de condensation.",
        "Il applique cette idée aux carottes de glace du Groenland : la glace devient un thermomètre du passé, couche après couche. Avec Hans Oeschger, il met en évidence les brusques oscillations qui portent leur nom.",
        "Ces événements de Dansgaard-Oeschger — des réchauffements de plusieurs degrés en quelques décennies — révèlent que le climat peut basculer très vite.",
      ],
      contributions: [
        ['💧', 'Thermomètre isotopique', 'A établi le lien entre δ¹⁸O des précipitations et température.'],
        ['⚡', 'Événements de Dansgaard-Oeschger', 'A découvert les réchauffements abrupts de la dernière glaciation.'],
        ['🧊', 'Glaciologie isotopique', 'A fait des carottes de glace un instrument de paléothermométrie.'],
      ],
      legacy: "Sa méthode isotopique est le cœur de toute analyse de carotte de glace. Les événements de Dansgaard-Oeschger ont imposé l'idée du changement climatique abrupt.",
      linkScreen: 'data', linkLabel: 'Voir les carottes de glace' },
    { id: 'emiliani', name: 'Cesare Emiliani', initials: 'CE', color: '#3a7d91', wash: '#e6f0f2', slot: 'sci-emiliani',
      years: '1922 – 1995', nat: '🇮🇹 Italie → 🇺🇸 États-Unis', field: 'Micropaléontologie · géochimie',
      tagline: 'Fondateur de la paléocéanographie isotopique',
      keyWork: '« Pleistocene Temperatures » (1955)',
      bio: [
        "Géologue italien émigré aux États-Unis, Emiliani a l'idée d'appliquer le δ¹⁸O aux coquilles de foraminifères des sédiments marins profonds.",
        "En 1955, il reconstruit ainsi les températures océaniques du Pléistocène et définit une succession de stades chauds et froids — les stades isotopiques marins (MIS), toujours numérotés selon son système.",
        "Il révèle que les glaciations sont bien plus nombreuses que les quatre reconnues jusqu'alors, en accord avec les cycles de Milankovitch.",
      ],
      contributions: [
        ['🌡️', 'δ¹⁸O des foraminifères', 'A transformé les microfossiles marins en thermomètres du passé.'],
        ['🔢', 'Stades isotopiques marins', 'A créé l\'échelle de temps (MIS) de référence du Quaternaire.'],
        ['🌊', 'Naissance de la paléocéanographie', 'A ouvert la lecture climatique des sédiments océaniques.'],
      ],
      legacy: "Chaque carotte marine se lit encore avec ses stades isotopiques. Il a fait de l'océan une archive climatique à part entière, complémentaire des glaces polaires.",
      linkScreen: 'calc', linkLabel: 'Calculer une paléotempérature (δ¹⁸O)' },
    { id: 'broecker', name: 'Wallace Broecker', initials: 'WB', color: '#4f9d7a', wash: '#e7f2ec', slot: 'sci-broecker',
      years: '1931 – 2019', nat: '🇺🇸 États-Unis', field: 'Géochimiste',
      tagline: 'A décrit le « tapis roulant » océanique',
      keyWork: '« Are We on the Brink of a Pronounced Global Warming? » (1975)',
      bio: [
        "Géochimiste à l'observatoire Lamont-Doherty (Columbia), Broecker est une figure centrale de la science du climat de la fin du XXᵉ siècle.",
        "Il décrit la « grande boucle de circulation océanique » (thermohaline) qui transporte la chaleur autour du globe et propose qu'un ralentissement de ce tapis roulant puisse provoquer des changements climatiques brutaux, comme le Dryas récent.",
        "Dans un article de 1975, il popularise l'expression « global warming » et prédit avec justesse le réchauffement à venir dû au CO₂.",
      ],
      contributions: [
        ['♻️', 'Circulation thermohaline', 'A conceptualisé le « Great Ocean Conveyor » et son rôle climatique.'],
        ['⚠️', 'Changement climatique abrupt', 'A relié points de bascule océaniques et basculements rapides du climat.'],
        ['🗣️', '« Global warming »', 'A popularisé le terme et alerté tôt sur le réchauffement anthropique.'],
      ],
      legacy: "Surnommé le « grand-père de la science du climat », il a mis la circulation océanique au cœur de la compréhension des changements abrupts — et le mot « réchauffement global » dans le langage courant.",
      linkScreen: 'atlas', linkLabel: 'Voir l\'Atlas → Océan Atlantique' },
    { id: 'lorius', name: 'Claude Lorius', initials: 'CL', color: '#3d7fa8', wash: '#e6eff6', slot: 'sci-lorius',
      years: '1932 – 2023', nat: '🇫🇷 France', field: 'Glaciologie',
      tagline: 'Pionnier des carottes de glace antarctiques',
      keyWork: 'Carotte de Vostok — lien CO₂/climat (1987)',
      bio: [
        "Glaciologue français, Claude Lorius participe dès 1957 aux expéditions antarctiques et consacre sa vie aux carottes de glace.",
        "Une anecdote célèbre : voyant les bulles d'air fossiles pétiller dans un glaçon tombé dans son verre, il comprend que la glace piège l'atmosphère du passé. Il en fait un programme scientifique.",
        "Avec les équipes franco-russes, il exploite la carotte de Vostok qui démontre, sur 150 000 puis 420 000 ans, le couplage étroit entre CO₂, méthane et température.",
      ],
      contributions: [
        ['🧊', 'Paléoclimat par la glace', 'A fondé l\'exploitation climatique des carottes antarctiques.'],
        ['📈', 'Couplage CO₂–température', 'A établi, via Vostok, le lien gaz à effet de serre / climat sur plusieurs cycles.'],
        ['🌍', 'Alerte climatique', 'A porté ces résultats dans le débat public sur le réchauffement.'],
      ],
      legacy: "Ses travaux sur Vostok sont l'une des preuves les plus citées du rôle du CO₂. Médaille d'or du CNRS, prix Balzan, il incarne l'aventure des forages polaires.",
      linkScreen: 'atlas', linkLabel: 'Voir l\'Atlas → Antarctique' },
    { id: 'shackleton', name: 'Nicholas Shackleton', initials: 'NS', color: '#5a86a0', wash: '#e9eff3', slot: 'sci-shackleton',
      years: '1937 – 2006', nat: '🇬🇧 Royaume-Uni', field: 'Paléoclimatologie',
      tagline: 'A prouvé le rythme orbital des glaciations',
      keyWork: '« Pacemaker of the Ice Ages » (Hays, Imbrie & Shackleton, 1976)',
      bio: [
        "Géologue et physicien britannique de Cambridge, Shackleton perfectionne la mesure du δ¹⁸O des foraminifères et montre qu'il reflète surtout le volume global de glace, pas seulement la température.",
        "En 1976, avec Hays et Imbrie, il démontre que les sédiments marins contiennent les fréquences orbitales prédites par Milanković — confirmation décisive de la théorie astronomique.",
        "Il contribue aussi à caler l'échelle des temps géologiques par astrochronologie.",
      ],
      contributions: [
        ['🧮', 'δ¹⁸O = volume de glace', 'A réinterprété le signal isotopique marin comme indicateur du volume des calottes.'],
        ['☉', 'Confirmation de Milankovitch', 'A trouvé les cycles orbitaux dans les archives marines (1976).'],
        ['⏱️', 'Astrochronologie', 'A affiné les échelles de temps par calage orbital.'],
      ],
      legacy: "Sa démonstration de 1976 a transformé la théorie de Milanković en fait établi. L'astrochronologie qu'il a promue date aujourd'hui une grande partie du temps géologique.",
      linkScreen: 'milank', linkLabel: 'Explorer les cycles orbitaux' },
    { id: 'jouzel', name: 'Jean Jouzel', initials: 'JJ', color: '#4a9cc9', wash: '#e8f2f8', slot: 'sci-jouzel',
      years: 'né en 1947', nat: '🇫🇷 France', field: 'Climatologie · glaciologie',
      tagline: '800 000 ans de climat par la glace, et le GIEC',
      keyWork: 'EPICA Dome C — 800 000 ans (2004–2007)',
      bio: [
        "Climatologue et glaciologue français, Jean Jouzel est spécialiste des isotopes de l'eau dans les glaces polaires.",
        "Collaborateur puis continuateur de Claude Lorius, il joue un rôle clé dans les carottes de Vostok puis d'EPICA Dome C, qui étend le record climatique continu à 800 000 ans.",
        "Vice-président du groupe scientifique du GIEC, il partage à ce titre le prix Nobel de la paix 2007 et devient une voix majeure de l'alerte climatique.",
      ],
      contributions: [
        ['❄️', 'Record de 800 000 ans', 'A contribué à l\'enregistrement glaciaire continu le plus long (EPICA).'],
        ['💧', 'Isotopes & paléotempératures', 'A raffiné la lecture des températures passées via les isotopes de l\'eau.'],
        ['🏆', 'GIEC / Nobel 2007', 'Membre du GIEC, colauréat du Nobel de la paix, porte-voix de la science du climat.'],
      ],
      legacy: "EPICA reste la référence des 800 000 ans de CO₂ et de température. Par le GIEC et ses ouvrages, Jouzel a fait le pont entre la recherche polaire et la décision publique.",
      linkScreen: 'atlas', linkLabel: 'Voir l\'Atlas → Antarctique' },
  ];

  renderVals() {
    const { screen, menuOpen, eraId, age, tmRange, tmScrub, evt } = this.state;
    const eras = this.eras.map((e, i) => ({ ...e, open: () => this.setState({ screen: 'era', eraId: i }) }));
    const era = eras[eraId];

    // ice-core (data screen)
    const co2Path = this.line(d => this.co2Y(d[1]));
    const tempPath = this.line(d => this.tempY(d[2]));
    const co2Area = co2Path + ` L${this.sx(0).toFixed(1)} 105 L${this.sx(800).toFixed(1)} 105 Z`;
    const idx = Math.round(age / 20);
    const pt = this.ice[idx] || this.ice[0];
    const scrubX = this.sx(800 - pt[0]);
    const ageTxt = pt[0] === 0 ? "aujourd'hui" : pt[0] + ' 000 ans';

    // time machine
    const maxAge = tmRange === 'phan' ? 541 : 4500;
    const scrubAge = maxAge * (1 - tmScrub / 1000);
    const tX = a => this.tX(a, maxAge);
    const tT = this.interp(this.cTemp, scrubAge), tC = this.interp(this.cCo2, scrubAge);
    const tS = this.interp(this.cSea, scrubAge), tB = this.interp(this.cBio, scrubAge);
    const tmScrubX = tX(scrubAge);
    const catColor = { 'Extinction': '#b5654a', 'Glaciation': '#3d7fa8', 'Réchauffement': '#c98a3d', 'Biosphère': '#4f9d7a', 'Atmosphère': '#8a6fb0' };
    const tmEvents = this.events.filter(e => e.age <= maxAge).map(e => ({
      ...e, color: catColor[e.cat] || '#666', leftPct: (tX(e.age) / 3.2).toFixed(2),
      open: () => this.setState({ evt: { ...e, color: catColor[e.cat] || '#666' } })
    }));

    // drawer nav
    const nav = [
      { group: 'Explorer', icon: '◷', label: 'Frise des ères', sub: 'Les 6 grandes ères', screen: 'home' },
      { group: 'Explorer', icon: '⟳', label: 'Time-Machine', sub: 'Chronologie interactive · 4,5 Ga', screen: 'timemachine' },
      { group: 'Explorer', icon: '◐', label: 'Cartes paléo', sub: 'Comparateur Avant / Après', screen: 'maps' },
      { group: 'Explorer', icon: '◉', label: 'Globe 3D', sub: 'Terre interactive à travers les âges', screen: 'globe' },
      { group: 'Explorer', icon: '⌇', label: 'Climat historique', sub: 'Température · précip. · pression · 1421–2008', screen: 'hist' },
      { group: 'Explorer', icon: '⚜', label: 'Mode Histoire', sub: 'Climat & sociétés : récoltes, famines, mortalité', screen: 'story' },

      { group: 'Bases de données', icon: '◍', label: 'Espèces indicatrices', sub: 'Fossiles témoins du climat', screen: 'species' },
      { group: 'Bases de données', icon: '☠', label: 'Espèces disparues', sub: 'Fiches climat · mammouth, tiktaalik…', screen: 'extinct' },
      { group: 'Bases de données', icon: '✦', label: 'Galerie des fossiles', sub: 'Fiches illustrées · 10 fossiles', screen: 'fossils' },
      { group: 'Bases de données', icon: '▤', label: 'Archives climatiques', sub: '10 archives naturelles du climat', screen: 'archives' },
      { group: 'Bases de données', icon: '⚡', label: 'Événements extrêmes', sub: 'Base de données · grandes crises', screen: 'extremes' },

      { group: 'Cartes & sites', icon: '❄', label: 'Les grandes glaciations', sub: 'Axe du temps profond · 5 épisodes', screen: 'glaciations' },
      { group: 'Cartes & sites', icon: '◉', label: 'Forages célèbres', sub: 'Vostok · EPICA · GRIP · GISP2', screen: 'cores' },
      { group: 'Cartes & sites', icon: '⚑', label: 'Carte des sites proxy', sub: 'Où voir le paléoclimat', screen: 'sites' },
      { group: 'Cartes & sites', icon: '🌍', label: 'Atlas mondial', sub: 'Groenland, Antarctique, Sahara, Amazonie…', screen: 'atlas' },

      { group: 'Portraits', icon: '👤', label: 'Portraits de scientifiques', sub: 'Milanković, Agassiz, Lorius, Jouzel…', screen: 'scientists' },

      { group: 'Outils d\'analyse', icon: '⚙', label: 'Simulateur climatique', sub: 'Réglez les forçages, observez', screen: 'simulator' },
      { group: 'Outils d\'analyse', icon: '≣', label: 'Superposition de données', sub: 'Comparer & corréler les datasets', screen: 'overlay' },
      { group: 'Outils d\'analyse', icon: '∑', label: 'Calculateur δ¹⁸O → T°', sub: 'Paléotempérature isotopique', screen: 'calc' },
      { group: 'Outils d\'analyse', icon: '☉', label: 'Bac à sable orbital', sub: 'Simulateur de Milankovitch', screen: 'milank' },

      { group: 'Comprendre', icon: '◈', label: 'Galerie de proxies', sub: 'Comment on sait — indicateurs', screen: 'proxies' },
      { group: 'Comprendre', icon: '≋', label: 'Carottes de glace', sub: 'EPICA · Vostok · 800 ka', screen: 'data' },
      { group: 'Comprendre', icon: 'Aa', label: 'Glossaire du jargon', sub: 'Décoder les articles', screen: 'glossary' }
    ];
    const mkItem = n => ({
      ...n, go: () => { this.setState({ screen: n.screen, menuOpen: false, catMenu: null }); if (this.scrollRef && this.scrollRef.current) this.scrollRef.current.scrollTop = 0; },
      active: screen === n.screen,
      style: { display: 'flex', alignItems: 'center', gap: 11, padding: '10px 11px', borderRadius: 10, marginBottom: 3, cursor: 'pointer', background: screen === n.screen ? 'rgba(111,178,209,0.16)' : 'transparent', borderLeft: '3px solid ' + (screen === n.screen ? '#6fb2d1' : 'transparent') },
      iconStyle: { flexShrink: 0, width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, fontWeight: 600, background: screen === n.screen ? 'rgba(111,178,209,0.28)' : 'rgba(143,180,198,0.14)', color: screen === n.screen ? '#bfe2f0' : '#8fb4c6' }
    });
    const groupOrder = ['Explorer', 'Bases de données', 'Cartes & sites', 'Portraits', 'Outils d\'analyse', 'Comprendre'];
    const navGroups = groupOrder.map(g => ({ title: g, items: nav.filter(n => n.group === g).map(mkItem) }));
    const navItems = nav.map(mkItem);
    // Groupe « Visite guidée » : lance un scénario de démo au lieu de naviguer.
    const demoStyle = { display: 'flex', alignItems: 'center', gap: 11, padding: '10px 11px', borderRadius: 10, marginBottom: 3, cursor: 'pointer', background: 'transparent', borderLeft: '3px solid transparent' };
    const demoIconStyle = { flexShrink: 0, width: 26, height: 26, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, background: 'rgba(94,207,166,0.18)', color: '#7fd8bb' };
    if (SCENARIO_LIST.length) navGroups.push({ title: 'Visite guidée', items: SCENARIO_LIST.map(sc => ({
      icon: '▷', label: sc.title, sub: sc.description || 'Démo guidée automatique',
      go: () => { this.setState({ menuOpen: false }); this.startDemo(sc.id); },
      style: demoStyle, iconStyle: demoIconStyle,
    })) });

    // Barre de catégories en bas d'écran : chaque catégorie du tiroir devient un onglet.
    const catMeta = {
      'Explorer': { icon: '🧭', short: 'Explorer' },
      'Bases de données': { icon: '🗂️', short: 'Bases' },
      'Cartes & sites': { icon: '🗺️', short: 'Cartes' },
      'Portraits': { icon: '👥', short: 'Portraits' },
      "Outils d'analyse": { icon: '🔬', short: 'Outils' },
      'Comprendre': { icon: '📖', short: 'Comprendre' },
    };
    // Écrans « détail » sans entrée de nav propre → rattachés à leur catégorie logique.
    const screenGroupExtra = { era: 'Explorer' };
    const navScreenGroup = {};
    for (const n of nav) navScreenGroup[n.screen] = n.group;
    const activeCat = navScreenGroup[screen] || screenGroupExtra[screen] || null;
    const bottomCats = groupOrder.map(g => {
      const active = activeCat === g;
      return {
        title: g, icon: catMeta[g].icon, label: catMeta[g].short, active,
        open: () => this.setState(s => ({ catMenu: s.catMenu === g ? null : g })),
        style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '7px 2px 6px', cursor: 'pointer', background: 'transparent', borderTop: '2px solid ' + (active ? '#6fb2d1' : 'transparent'), color: active ? '#0c2534' : '#5f829a', transition: 'color .15s' },
        iconStyle: { fontSize: 17, lineHeight: 1, opacity: active ? 1 : 0.72, filter: active ? 'none' : 'grayscale(0.3)' },
        labelStyle: { fontSize: 9, fontWeight: active ? 700 : 500, letterSpacing: '.2px', whiteSpace: 'nowrap' },
      };
    });
    const catMenu = this.state.catMenu;
    const catGroup = catMenu ? navGroups.find(gr => gr.title === catMenu) : null;

    // paleogeographic maps
    const { mapPeriod, reveal, pinX, pinY, pinLabel } = this.state;
    const periods = {
      pangea: { label: 'Pangée', age: '≈ 250 Ma', note: "À la limite Permien–Trias, les continents sont soudés en un supercontinent unique, la Pangée, ceinturé par l'océan Panthalassa. Climat de type serre, saisons continentales extrêmes, aucune calotte polaire pérenne.", pin: "se trouvait soudée aux autres terres au cœur de la Pangée — souvent loin de tout littoral.",
        st: { land: "Terre émergée — au cœur aride de la Pangée", sea: "Sous l'océan mondial Panthalassa", ice: "Sous une calotte polaire" },
        depth: { shelf: 80, deep: 4200 }, iceMax: 2.6, ageMa: 250 },
      cretaceous: { label: 'Crétacé', age: '≈ 90 Ma', note: "L'Atlantique s'ouvre et la Téthys sépare les masses continentales. Le niveau marin culmine (~+250 m) : de vastes mers épicontinentales inondent les continents. Pôles sans glace, climat chaud.", pin: "bordait probablement des mers chaudes et peu profondes, sous un climat sans glace polaire.",
        st: { land: "Terre émergée, climat chaud sans glace", sea: "Sous une mer épicontinentale chaude", ice: "Sous la glace" },
        depth: { shelf: 180, deep: 3800 }, iceMax: 3.0, ageMa: 90 },
      lgm: { label: 'Dernier Maximum Glaciaire', age: '≈ 21 ka', note: "Géographie quasi moderne, mais d'immenses calottes (Laurentide, Fennoscandienne) recouvrent l'Amérique du Nord et l'Europe du Nord. Le niveau marin ~120 m plus bas exonde la Manche et la Béringie.", pin: "connaissait un climat glaciaire ; les plateaux continentaux proches étaient souvent émergés.",
        st: { land: "Toundra / steppe périglaciaire", sea: "En mer (niveau ~120 m plus bas)", ice: "Sous la calotte" },
        depth: { shelf: 50, deep: 3900 }, iceMax: 3.4, ageMa: 0.021 }
    };
    const per = periods[mapPeriod];

    // Cartes dynamiques dessinées (projection équirectangulaire) — plus de placeholders.
    const MW = 360, MH = 180;
    const gpToday = this.globePeriods[4]; // Actuel
    // Calottes du Dernier Maximum Glaciaire (Laurentide, Fennoscandie) + Antarctique + Groenland.
    const lgmIce = [
      [[-142,58],[-120,74],[-86,80],[-58,73],[-52,58],[-74,46],[-102,44],[-126,48],[-142,58]],
      [[-6,54],[13,61],[35,69],[57,71],[47,58],[24,54],[3,51],[-6,54]],
      this.antarctica, this.greenland
    ];
    const mapCfg = {
      pangea: { lands: this.globePeriods[0].lands, ice: this.globePeriods[0].ice, ocean: this.globePeriods[0].ocean, land: this.globePeriods[0].land },
      cretaceous: { lands: this.globePeriods[2].lands, ice: this.globePeriods[2].ice, ocean: this.globePeriods[2].ocean, land: this.globePeriods[2].land },
      lgm: { lands: this.presentLands, ice: lgmIce, ocean: '#2b6a8a', land: '#7e8c56' }
    }[mapPeriod];

    // Zoom « Votre région » : état du lieu sous le repère (terre / mer / glace), aujourd'hui vs à l'époque.
    const pinLng = (pinX / 100) * 360 - 180;
    const pinLat = 90 - (pinY / 100) * 180;
    const rgnTodaySt = this.regionState(pinLng, pinLat, gpToday.lands, gpToday.ice);
    const rgnEpochSt = this.regionState(pinLng, pinLat, mapCfg.lands, mapCfg.ice);
    const stEmoji = { ice: '❄️', sea: '🌊', land: '⛰️' };
    const stTodayPhrase = { ice: "Sous la glace (calotte actuelle)", land: "Terre émergée", sea: "En mer" };
    // Chiffres : profondeur d'eau (mer épicontinentale sur continent noyé vs océan profond) et épaisseur de glace.
    const onContinent = gpToday.lands.some(p => this.pointInPoly(pinLng, pinLat, p));
    const seaShelfPhrase = { pangea: "Sous une mer côtière peu profonde", cretaceous: "Sous une mer épicontinentale chaude", lgm: "Sous une mer côtière" };
    const seaDeepPhrase = { pangea: "Au large, dans l'océan Panthalassa", cretaceous: "Au large, en océan ouvert", lgm: "Au large, en océan ouvert" };
    const rgnEpochPhrase = rgnEpochSt === 'sea' ? (onContinent ? seaShelfPhrase[mapPeriod] : seaDeepPhrase[mapPeriod]) : per.st[rgnEpochSt];
    const epochIceThk = this.iceThickness(pinLng, pinLat, mapCfg.ice, per.iceMax);
    const todayIceThk = this.iceThickness(pinLng, pinLat, gpToday.ice, pinLat < -55 ? 3.6 : 2.9);
    const rgnEpochValue = rgnEpochSt === 'sea'
      ? '≈ ' + this.fmtDepth(onContinent ? per.depth.shelf : per.depth.deep) + " d'eau"
      : rgnEpochSt === 'ice' ? '≈ ' + this.fmtThk(epochIceThk) + ' de glace' : '';
    const rgnTodayValue = rgnTodaySt === 'sea'
      ? '≈ ' + this.fmtDepth(3800) + " d'eau (océan)"
      : rgnTodaySt === 'ice' ? '≈ ' + this.fmtThk(todayIceThk) + ' de glace' : '';
    // Paléolatitude du repère à l'époque (dérive des plaques).
    const glIdx = { pangea: 0, cretaceous: 2, lgm: 4 }[mapPeriod];
    const rgnPaleo = this.paleoPos({ lat: pinLat, lng: pinLng, c: this.nearestCont(pinLng, pinLat) }, glIdx);
    const rgnPaleoLat = rgnPaleo.lat;
    // Températures locales estimées — l'époque utilise la paléolatitude (position réelle d'alors).
    const epGlobalT = this.interp(this.cTemp, per.ageMa);
    const rgnEpochTemp = this.fmtTemp(this.localTemp(rgnPaleoLat, epGlobalT, rgnEpochSt, epochIceThk));
    const rgnTodayTemp = this.fmtTemp(this.localTemp(pinLat, 15, rgnTodaySt, todayIceThk));

    // proxies gallery
    const { proxy, grow, playing } = this.state;
    const pKeys = ['ice', 'tree', 'sediment'];
    const galleryCards = pKeys.map(k => {
      const p = this.proxies[k];
      return { key: k, label: p.label, color: p.color, accent: p.accent, records: p.records, open: () => this.openProxy(k) };
    });
    const pv = proxy ? this.proxies[proxy] : null;
    let proxyDiagram = null;
    if (pv) {
      const nLayers = Math.max(1, Math.round((grow / 100) * 14));
      const cx = 150;
      if (proxy === 'tree') {
        // concentric rings growing outward
        const rings = [];
        for (let i = 0; i < nLayers; i++) {
          const r = 8 + i * 6.6;
          rings.push(React.createElement('circle', { key: i, cx, cy: 96, r, fill: 'none', stroke: i % 2 ? pv.color : pv.accent, strokeWidth: i % 2 ? 3.2 : 2.2, opacity: 0.55 + (i / 14) * 0.45 }));
        }
        proxyDiagram = React.createElement('svg', { viewBox: '0 0 300 192', style: { width: '100%', display: 'block' } },
          React.createElement('circle', { cx, cy: 96, r: 6, fill: pv.color }), ...rings,
          React.createElement('text', { x: cx, y: 186, textAnchor: 'middle', fontSize: 10, fill: '#5b7688', fontFamily: 'IBM Plex Mono' }, nLayers + ' cernes annuels'));
      } else {
        // stacked horizontal layers accumulating from bottom (ice) / top (sediment)
        const layers = [];
        const h = 11;
        for (let i = 0; i < nLayers; i++) {
          const y = proxy === 'sediment' ? 14 + i * h : 178 - (i + 1) * h;
          layers.push(React.createElement('rect', { key: i, x: 60, y, width: 180, height: h - 1.5, rx: 1, fill: i % 2 ? pv.color : pv.accent, opacity: 0.5 + (i / 14) * 0.5 }));
          if (proxy === 'ice') {
            const bx = 78 + (i * 47) % 150;
            layers.push(React.createElement('circle', { key: 'b' + i, cx: bx, cy: y + (h - 1.5) / 2, r: 2, fill: '#fff', opacity: 0.8 }));
          }
        }
        const label = proxy === 'ice' ? "bulles d'air = atmosphère fossile" : 'foraminifères empilés';
        proxyDiagram = React.createElement('svg', { viewBox: '0 0 300 192', style: { width: '100%', display: 'block' } },
          React.createElement('rect', { x: 60, y: 12, width: 180, height: 168, rx: 4, fill: 'none', stroke: '#dbe7ec' }),
          ...layers,
          React.createElement('text', { x: 150, y: 188, textAnchor: 'middle', fontSize: 10, fill: '#5b7688', fontFamily: 'IBM Plex Mono' }, label));
      }
    }
    const activeStep = pv ? Math.min(pv.steps.length - 1, Math.floor((grow / 100) * pv.steps.length)) : 0;
    const proxySteps = pv ? pv.steps.map((s, i) => ({ ...s, num: i + 1, active: i === activeStep, done: i < activeStep,
      style: { display: 'flex', gap: 10, padding: '9px 0', borderTop: i ? '1px solid #e4edf1' : 'none', opacity: i <= activeStep ? 1 : 0.4, transition: 'opacity .3s' },
      dotStyle: { flexShrink: 0, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, background: i <= activeStep ? pv.color : '#e4edf1', color: i <= activeStep ? '#fff' : '#8aa5b3' } })) : [];

    // extreme events database
    const { extreme } = this.state;
    const exCards = this.extremes.map(e => ({ id: e.id, name: e.name, cat: e.cat, color: e.color, when: e.when, summary: e.summary, open: () => this.setState({ extreme: e.id }) }));
    const ex = extreme ? this.extremes.find(e => e.id === extreme) : null;

    // data overlay + visual correlation
    const { dsOn: dsOnRaw, shiftDs, shiftKa } = this.state;
    const dsOn = { epica: dsOnRaw.epica ?? true, sea: dsOnRaw.sea ?? true, lr04: dsOnRaw.lr04 ?? true };
    const dsKeys = ['epica', 'sea', 'lr04'];
    const oX = a => 30 + (Math.max(0, Math.min(800, a)) / 800) * 280;
    const oNorm = (v, ds) => { const t = (v - ds.vmin) / (ds.vmax - ds.vmin); const c = Math.max(0, Math.min(1, t)); return ds.invert ? 1 - c : c; };
    const oY = (n, k) => { const idx = dsKeys.indexOf(k); const band = 92 / dsKeys.length; const top = 6 + idx * band; return top + (1 - n) * (band - 6); };
    // stacked bands so curves stay legible; shifted dataset offset horizontally
    const overlayCurves = dsKeys.filter(k => dsOn[k]).map(k => {
      const ds = this.datasets[k];
      const off = k === shiftDs ? shiftKa : 0;
      const d = ds.pts.map((p, i) => `${i ? 'L' : 'M'}${oX(p[0] + off).toFixed(1)} ${oY(oNorm(p[1], ds), k).toFixed(1)}`).join(' ');
      return { key: k, path: d, color: ds.color, label: ds.label };
    });
    const dsChips = dsKeys.map(k => {
      const ds = this.datasets[k];
      const on = dsOn[k];
      return { key: k, label: ds.short, color: ds.color, on,
        toggle: () => this.setState(s => ({ dsOn: { ...s.dsOn, [k]: !s.dsOn[k] } })),
        style: { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 20, cursor: 'pointer', border: '1px solid ' + (on ? ds.color : '#d3e0e6'), background: on ? ds.color : '#fff', color: on ? '#fff' : '#5b7688', fontSize: 11.5, fontWeight: 600 },
        dotStyle: { width: 8, height: 8, borderRadius: '50%', background: on ? '#fff' : ds.color } };
    });
    const shiftOptions = dsKeys.filter(k => dsOn[k]).map(k => ({ key: k, label: this.datasets[k].short, active: k === shiftDs,
      pick: () => this.setState({ shiftDs: k }),
      style: { flex: 1, textAlign: 'center', padding: '7px 4px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: k === shiftDs ? 600 : 500, border: '1px solid ' + (k === shiftDs ? '#0f2c3c' : '#d3e0e6'), background: k === shiftDs ? '#0f2c3c' : '#fff', color: k === shiftDs ? '#eaf3f7' : '#5b7688' } }));
    const shiftLabel = this.datasets[shiftDs] ? this.datasets[shiftDs].short : '—';

    // paleotemperature calculator
    const { dCalcite, dWater, eqId } = this.state;
    const eq = this.tempEqs.find(e => e.id === eqId) || this.tempEqs[0];
    const dc = parseFloat(dCalcite), dw = parseFloat(dWater);
    const calcValid = !isNaN(dc) && !isNaN(dw);
    let delta = null, tempC = null;
    if (calcValid) { delta = dc - (dw - 0.27); tempC = eq.a + eq.b * delta + eq.c * delta * delta; }
    const eqCards = this.tempEqs.map(e => ({ id: e.id, species: e.species, detail: e.detail, formula: e.formula, active: e.id === eqId,
      pick: () => this.setState({ eqId: e.id }),
      style: { padding: '11px 13px', borderRadius: 11, cursor: 'pointer', marginBottom: 7, border: '1px solid ' + (e.id === eqId ? '#1d6f96' : '#e0eaef'), background: e.id === eqId ? '#eef6fa' : '#fff' } }));
    let tempInterp = '';
    if (tempC != null) {
      if (tempC < 4) tempInterp = 'Eaux profondes / polaires — conditions glaciaires.';
      else if (tempC < 12) tempInterp = 'Eaux froides à tempérées.';
      else if (tempC < 20) tempInterp = 'Eaux tempérées de surface.';
      else if (tempC < 28) tempInterp = 'Eaux chaudes subtropicales.';
      else tempInterp = 'Eaux tropicales / serre.';
    }

    // milankovitch orbital sandbox
    const { ecc, obl, prec, season } = this.state;
    const eVal = ecc / 100; // slider 0..6 -> 0..0.06
    const lats = []; for (let l = -90; l <= 90; l += 5) lats.push(l);
    const insoW = lats.map(l => this.insolation(l, season, eVal, obl, prec));
    const iMaxY = 560;
    const miX = l => 34 + ((l + 90) / 180) * 278;
    const miY = w => 152 - (Math.min(iMaxY, w) / iMaxY) * 140;
    const insoPath = lats.map((l, i) => `${i ? 'L' : 'M'}${miX(l).toFixed(1)} ${miY(insoW[i]).toFixed(1)}`).join(' ');
    const insoArea = insoPath + ` L${miX(90).toFixed(1)} 152 L${miX(-90).toFixed(1)} 152 Z`;
    const inso65 = this.insolation(65, season, eVal, obl, prec);
    const inso65Preind = this.insolation(65, season, 0.0167, 23.44, 283);
    const inso65Delta = inso65 - inso65Preind;
    const seasonName = season === 90 ? 'Solstice de juin' : season === 270 ? 'Solstice de décembre' : 'Équinoxe de mars';

    // glossary
    const { glossQ, glossCat } = this.state;
    const glossCats = ['Tous', 'Concepts', 'Isotopes', 'Proxies', 'Méthodes', 'Événements'];
    const q = glossQ.trim().toLowerCase();
    const glossTerms = this.glossary
      .filter(g => (glossCat === 'Tous' || g.cat === glossCat) && (!q || g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q)))
      .sort((a, b) => a.term.localeCompare(b.term, 'fr'));
    const glossCatChips = glossCats.map(c => ({ label: c, active: c === glossCat,
      pick: () => this.setState({ glossCat: c }),
      style: { padding: '6px 11px', borderRadius: 20, cursor: 'pointer', fontSize: 11, fontWeight: c === glossCat ? 600 : 500, whiteSpace: 'nowrap', border: '1px solid ' + (c === glossCat ? '#1d6f96' : '#d3e0e6'), background: c === glossCat ? '#1d6f96' : '#fff', color: c === glossCat ? '#fff' : '#5b7688' } }));

    // proxy sites map
    const { site, siteCat, addMode, userSites } = this.state;
    const fossilSites = this.extinctSp.flatMap(e => (e.fossilSites || []).map(fs => ({ name: fs.name, lat: fs.lat, lon: fs.lon, cat: 'Espèce disparue', region: fs.region, desc: (fs.desc || '') + ' — gisement de ' + e.name + '.' })));
    const allSites = this.proxySites.concat(fossilSites).concat(userSites.map((s, i) => ({ ...s, idx: i })));
    const siteCats = ['Tous', 'Carotte de glace', 'Spéléothème', 'Varves', 'Tillite / Snowball', 'Limite / extinction', 'Volcanisme', 'Fossiles', 'Espèce disparue', 'Communauté'];
    const mapPins = allSites
      .filter(s => siteCat === 'Tous' || s.cat === siteCat)
      .map(s => {
        const left = ((s.lon + 180) / 360) * 100, top = ((90 - s.lat) / 180) * 100;
        return { name: s.name, color: this.siteColors[s.cat] || '#666',
          pinStyle: { position: 'absolute', left: left + '%', top: top + '%', transform: 'translate(-50%,-50%)', width: 13, height: 13, borderRadius: '50%', background: this.siteColors[s.cat] || '#666', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,.4)', cursor: 'pointer', zIndex: 5 },
          open: () => this.setState({ site: s }) };
      });
    const siteCatChips = siteCats.map(c => ({ label: c, active: c === siteCat,
      pick: () => this.setState({ siteCat: c }),
      style: { padding: '5px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 10.5, fontWeight: c === siteCat ? 600 : 500, whiteSpace: 'nowrap', border: '1px solid ' + (c === siteCat ? '#1d6f96' : '#d3e0e6'), background: c === siteCat ? '#1d6f96' : '#fff', color: c === siteCat ? '#fff' : '#5b7688' } }));
    const legendItems = Object.keys(this.siteColors).map(k => ({ label: k, color: this.siteColors[k] }));

    return {
      isSites: screen === 'sites',
      goSites: () => this.setState({ screen: 'sites', site: null, addMode: false, menuOpen: false }),
      mapRef: this.mapRef, mapPins, siteCatChips, legendItems,
      siteCount: mapPins.length,
      addMode, toggleAdd: () => this.setState(s => ({ addMode: !s.addMode })),
      addBtnLabel: addMode ? 'Touchez la carte pour placer le repère…' : '＋ Épingler un site',
      addBtnStyle: { marginTop: 10, textAlign: 'center', padding: '10px', borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid ' + (addMode ? '#d0587e' : '#cfe0e8'), background: addMode ? '#d0587e' : '#fff', color: addMode ? '#fff' : '#38617a' },
      onMapTap: (e) => this.onMapTap(e),
      mapCursor: addMode ? 'crosshair' : 'default',
      siteOpen: !!site,
      siteName: site && site.name, siteCat2: site && site.cat, siteRegion: site && site.region, siteDesc: site && site.desc,
      siteColor: site ? (this.siteColors[site.cat] || '#666') : '#666',
      siteCoords: site ? `${Math.abs(site.lat).toFixed(1)}°${site.lat >= 0 ? 'N' : 'S'}, ${Math.abs(site.lon).toFixed(1)}°${site.lon >= 0 ? 'E' : 'O'}` : '',
      siteIsUser: !!(site && site.user), siteReadonly: !!(site && !site.user),
      onSiteName: (e) => this.updateUserSite(site.idx, 'name', e.target.value),
      onSiteDesc: (e) => this.updateUserSite(site.idx, 'desc', e.target.value),
      closeSite: () => this.setState({ site: null }),
      isGlossary: screen === 'glossary',
      goGlossary: () => this.setState({ screen: 'glossary', glossQ: '', glossCat: 'Tous', menuOpen: false }),
      glossQ, glossCatChips, glossCount: glossTerms.length,
      glossTerms: glossTerms.map(g => ({ ...g, open: () => this.setState({ glossId: g.term }) })),
      glossEmpty: glossTerms.length === 0,
      onGlossQ: (e) => this.setState({ glossQ: e.target.value }),
      glossOpen: !!this.state.glossId,
      closeGloss: () => this.setState({ glossId: null }),
      gl2: (() => {
        const g = this.glossary.find(x => x.term === this.state.glossId);
        if (!g) return { related: [] };
        const lk = this.glossLink[g.term];
        return {
          term: g.term, cat: g.cat, def: g.def,
          more: this.glossMore[g.term] || '', hasMore: !!this.glossMore[g.term],
          related: this.glossary.filter(x => x.cat === g.cat && x.term !== g.term).slice(0, 6)
            .map(x => ({ term: x.term, open: () => this.setState({ glossId: x.term }) })),
          hasLink: !!lk, linkLabel: lk ? lk.label : '',
          goLink: lk ? () => this.setState({ screen: lk.screen, glossId: null, atlasId: null, sciId: null, menuOpen: false }) : (() => {}),
        };
      })(),
      isMilank: screen === 'milank',
      goMilank: () => this.setState({ screen: 'milank', menuOpen: false }),
      eccVal: ecc, oblVal: obl, precVal: prec, season,
      eccTxt: eVal.toFixed(4), oblTxt: obl.toFixed(2) + '°', precTxt: Math.round(prec) + '°',
      onEcc: (e) => this.setState({ ecc: +e.target.value }),
      onObl: (e) => this.setState({ obl: +e.target.value }),
      onPrec: (e) => this.setState({ prec: +e.target.value }),
      setSummer: () => this.setState({ season: 90 }),
      setEquinox: () => this.setState({ season: 0 }),
      setWinter: () => this.setState({ season: 270 }),
      seasonSummerStyle: this.mapChip(season === 90),
      seasonEquinoxStyle: this.mapChip(season === 0),
      seasonWinterStyle: this.mapChip(season === 270),
      insoPath, insoArea, seasonName,
      x65: miX(65).toFixed(1), y65: miY(inso65).toFixed(1),
      inso65Txt: Math.round(inso65) + ' W/m²',
      inso65DeltaTxt: (inso65Delta >= 0 ? '+' : '') + Math.round(inso65Delta) + ' W/m²',
      inso65DeltaColor: inso65Delta >= 0 ? '#4f9d7a' : '#c25a3a',
      resetOrbit: () => this.setState({ ecc: 1.67, obl: 23.44, prec: 283 }),
      isCalc: screen === 'calc',
      goCalc: () => this.setState({ screen: 'calc', menuOpen: false }),
      dCalcite, dWater, eqCards, eqFormula: eq.formula, eqSpecies: eq.species,
      onDCalcite: (e) => this.setState({ dCalcite: e.target.value }),
      onDWater: (e) => this.setState({ dWater: e.target.value }),
      calcValid, calcInvalid: !calcValid,
      deltaTxt: delta == null ? '—' : delta.toFixed(2) + ' ‰',
      tempTxt: tempC == null ? '—' : tempC.toFixed(1) + ' °C',
      tempInterp,
      isOverlay: screen === 'overlay',
      goOverlay: () => this.setState({ screen: 'overlay', menuOpen: false }),
      overlayCurves, dsChips, shiftOptions, shiftLabel, shiftKa,
      onShift: (e) => this.setState({ shiftKa: +e.target.value }),
      shiftTxt: (shiftKa > 0 ? '+' : '') + shiftKa + ' ka',
      resetShift: () => this.setState({ shiftKa: 0 }),
      isExtremes: screen === 'extremes',
      goExtremes: () => this.setState({ screen: 'extremes', extreme: null, menuOpen: false }),
      exCards, exList: !ex, exOpen: !!ex,
      backToExList: () => this.setState({ extreme: null }),
      exName: ex && ex.name, exCat: ex && ex.cat, exColor: ex && ex.color, exWhen: ex && ex.when, exEra: ex && ex.era,
      exDur: ex && ex.dur, exSummary: ex && ex.summary,
      exCauses: ex ? ex.causes : [], exConsequences: ex ? ex.consequences : [], exProofs: ex ? ex.proofs : [],
      exBadgeStyle: ex ? { display: 'inline-block', whiteSpace: 'nowrap', fontFamily: 'IBM Plex Mono,monospace', fontSize: 8.5, letterSpacing: '.6px', textTransform: 'uppercase', color: '#fff', background: ex.color, padding: '3px 9px', borderRadius: 20 } : {},
      isHome: screen === 'home', isEra: screen === 'era', isData: screen === 'data', isTM: screen === 'timemachine', isMaps: screen === 'maps', isProxies: screen === 'proxies',
      isGlobe: screen === 'globe',
      goGlobe: () => this.setState({ screen: 'globe', menuOpen: false }),
      globeRef: this.globeRef,
      globePeriod: this.state.globePeriod, globeMax: this.globePeriods.length - 1,
      globeLabel: this.curGlobe().label, globeAge: this.curGlobe().age, globeEra: this.curGlobe().era, globeNote: this.curGlobe().note,
      globeOcean: this.curGlobe().oceanName, globeSea: this.curGlobe().sea,
      globeRotateLabel: this.state.globeRotate ? '⏸ rotation' : '▶ rotation',
      toggleGlobeRotate: () => this.setState(s => ({ globeRotate: !s.globeRotate })),
      onGlobeScrub: (e) => this.setState({ globePeriod: +e.target.value }),
      globeChips: this.globePeriods.map((p, i) => ({ label: p.label, age: p.age, go: () => this.setState({ globePeriod: i }), style: this.globeChip(i === this.state.globePeriod) })),
      globeLoadingStyle: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8fb4c6', fontFamily: 'IBM Plex Mono,monospace', fontSize: 11, pointerEvents: 'none', opacity: this.globe ? 0 : 1, transition: 'opacity .4s' },
      geoQ: this.state.geoQ,
      onGeoQ: (e) => this.setState({ geoQ: e.target.value }),
      geoActive: !!this.state.geoSel,
      geoName: this.state.geoSel ? this.state.geoSel.n : '',
      geoNowTxt: this.state.geoSel ? this.fmtCoord(this.state.geoSel.lat, this.state.geoSel.lng) : '',
      geoPaleoLatTxt: (() => { if (!this.state.geoSel) return ''; const pp = this.paleoPos(this.state.geoSel, this.state.globePeriod); return this.fmtLat(pp.lat); })(),
      geoNarrative: (() => {
        if (!this.state.geoSel) return '';
        const idx = this.state.globePeriod, per = this.curGlobe();
        if (idx >= this.globePeriods.length - 1) return `${this.state.geoSel.n} occupe aujourd'hui sa position moderne, en zone ${this.zoneName(this.state.geoSel.lat)}.`;
        const pp = this.paleoPos(this.state.geoSel, idx);
        return `Il y a ${per.age.replace('≈ ', '')}, cette région se situait environ vers ${this.fmtLat(pp.lat)}, en zone ${this.zoneName(pp.lat)}, portée par la dérive des plaques.`;
      })(),
      clearGeo: () => this.setState({ geoQ: '', geoSel: null }),
      geoResults: (() => {
        const raw = this.state.geoQ.trim();
        if (!raw || this.state.geoSel) return [];
        const m = raw.match(/^\s*(-?\d+(?:[.,]\d+)?)\s*,\s*(-?\d+(?:[.,]\d+)?)\s*$/);
        if (m) {
          const lat = Math.max(-89, Math.min(89, parseFloat(m[1].replace(',', '.'))));
          const lng = Math.max(-180, Math.min(180, parseFloat(m[2].replace(',', '.'))));
          const sel = { n: 'Point ' + this.fmtLat(lat), c: this.guessCont(lat, lng), lat, lng };
          return [{ name: 'Ces coordonnées', sub: this.fmtCoord(lat, lng), pick: () => this.setState({ geoSel: sel, geoRotate: false, globeRotate: false }) }];
        }
        const q = this.gNorm(raw);
        return this.gazetteer.filter(g => this.gNorm(g.n).includes(q) || this.gNorm(g.alt).includes(q)).slice(0, 6)
          .map(g => ({ name: g.n, sub: this.fmtCoord(g.lat, g.lng), pick: () => this.setState({ geoSel: g, geoQ: g.n, globeRotate: false }) }));
      })(),
      geoHasResults: (() => {
        const raw = this.state.geoQ.trim();
        if (!raw || this.state.geoSel) return false;
        if (/^\s*-?\d+(?:[.,]\d+)?\s*,\s*-?\d+(?:[.,]\d+)?\s*$/.test(raw)) return true;
        const q = this.gNorm(raw);
        return this.gazetteer.some(g => this.gNorm(g.n).includes(q) || this.gNorm(g.alt).includes(q));
      })(),
      geoNoResults: (() => {
        const raw = this.state.geoQ.trim();
        if (!raw || this.state.geoSel) return false;
        if (/^\s*-?\d+(?:[.,]\d+)?\s*,\s*-?\d+(?:[.,]\d+)?\s*$/.test(raw)) return false;
        const q = this.gNorm(raw);
        return !this.gazetteer.some(g => this.gNorm(g.n).includes(q) || this.gNorm(g.alt).includes(q));
      })(),
      isStory: screen === 'story',
      goStory: () => this.setState({ screen: 'story', menuOpen: false }),
      storyChips: this.stories.map((s, i) => ({ label: s.chip, style: this.storyChip(i === this.state.storyId), go: () => this.setState({ storyId: i }) })),
      storyWash: this.stories[this.state.storyId].wash,
      storyPeriod: this.stories[this.state.storyId].period,
      storyTitle: this.stories[this.state.storyId].title,
      storyRegion: this.stories[this.state.storyId].region,
      storyClimate: this.stories[this.state.storyId].climate,
      storyImpact: this.stories[this.state.storyId].impact,
      storyNarrative: this.stories[this.state.storyId].narrative,
      storyChain: this.stories[this.state.storyId].chain,
      storyHasHist: this.stories[this.state.storyId].histYear >= 1421 && this.stories[this.state.storyId].histYear <= 2008,
      storyHistYear: this.stories[this.state.storyId].histYear,
      storyGoHist: () => { const y = this.stories[this.state.storyId].histYear; this.setState({ screen: 'hist', histYear: y }); if (this.scrollRef && this.scrollRef.current) this.scrollRef.current.scrollTop = 0; },
      storyHarvestPath: this.polyPath(this.stories[this.state.storyId].harvest, 12, 308, 8, 88, 30, 100),
      storyMortPath: this.polyPath(this.stories[this.state.storyId].mort, 12, 308, 8, 88, 30, 100),
      storyPrev: () => this.setState(s => ({ storyId: Math.max(0, s.storyId - 1) })),
      storyNext: () => this.setState(s => ({ storyId: Math.min(this.stories.length - 1, s.storyId + 1) })),
      storyPrevStyle: this.storyBtn(this.state.storyId > 0),
      storyNextStyle: this.storyBtn(this.state.storyId < this.stories.length - 1),
      isArchives: screen === 'archives',
      isHist: screen === 'hist',
      goHist: () => this.setState({ screen: 'hist', menuOpen: false }),
      histYear: this.state.histYear,
      onHistScrub: (e) => this.setState({ histYear: +e.target.value }),
      histScrubX: this.hX(this.state.histYear).toFixed(1),
      histEraTxt: this.histEra(this.state.histYear),
      histTempTxt: (() => { const v = this.interp(this.histTemp, this.state.histYear); return (v >= 0 ? '+' : '') + v.toFixed(2).replace('.', ',') + ' °C'; })(),
      histPrecTxt: (() => { const v = this.interp(this.histPrec, this.state.histYear); return (v >= 0 ? '+' : '') + v.toFixed(0) + ' %'; })(),
      histPresTxt: (() => { const v = this.interp(this.histPres, this.state.histYear); return (v >= 0 ? '+' : '') + v.toFixed(1).replace('.', ',') + ' hPa'; })(),
      histTempPath: this.histPath(this.histTemp, v => this.hTempY(v)),
      histPrecPath: this.histPath(this.histPrec, v => this.hPrecY(v)),
      histPresPath: this.histPath(this.histPres, v => this.hPresY(v)),
      histTempMarkY: this.hTempY(this.interp(this.histTemp, this.state.histYear)).toFixed(1),
      histPrecMarkY: this.hPrecY(this.interp(this.histPrec, this.state.histYear)).toFixed(1),
      histPresMarkY: this.hPresY(this.interp(this.histPres, this.state.histYear)).toFixed(1),
      histEvents: this.histEvents.map(e => ({ ...e, go: () => { const m = String(e.y).match(/\d{4}/); if (m) this.setState({ histYear: +m[0] }); } })),
      goArchives: () => this.setState({ screen: 'archives', archiveId: null, menuOpen: false }),
      archiveCards: this.archives.map(a => ({ ...a, open: () => this.setState({ archiveId: a.id }) })),
      archiveList: !this.state.archiveId,
      ar: this.state.archiveId ? this.archives.find(a => a.id === this.state.archiveId) : null,
      backToArchives: () => this.setState({ archiveId: null }),
      isSpecies: screen === 'species',
      goSpecies: () => this.setState({ screen: 'species', speciesId: null, menuOpen: false }),
      speciesCards: this.species.map(s => ({ ...s, img: this.bioImg(s.id), open: () => this.setState({ speciesId: s.id }) })),
      speciesList: !this.state.speciesId,
      sp: this.state.speciesId ? (() => { const s = this.species.find(x => x.id === this.state.speciesId); return s ? { ...s, img: this.bioImg(s.id) } : null; })() : null,
      backToSpecies: () => this.setState({ speciesId: null }),
      isExtinct: screen === 'extinct',
      goExtinct: () => this.setState({ screen: 'extinct', extinctId: null, menuOpen: false }),
      extinctList: !this.state.extinctId,
      extinctDetail: !!this.state.extinctId,
      backToExtinct: () => this.setState({ extinctId: null }),
      extinctCards: this.extinctSp.map(e => ({
        id: e.id, name: e.name, taxon: e.taxon, emoji: e.emoji, wash: e.wash, accent: e.accent, period: e.period, dates: e.dates,
        img: this.bioImg(e.id),
        badge: e.fate === 'extinct' ? 'Éteinte' : 'Lignée survivante',
        badgeStyle: this.extinctBadge(e.fate),
        open: () => this.setState({ extinctId: e.id })
      })),
      ex2: (() => {
        const e = this.extinctSp.find(x => x.id === this.state.extinctId);
        if (!e) return { adaptRows: [], factorRows: [], causeRows: [], specimenRows: [], geoChips: [], siteChips: [], factList: [], tlTicks: [] };
        const isExt = e.fate === 'extinct';
        return {
          ...e,
          img: this.bioImg(e.id),
          slot: 'ext-' + e.id, ph: 'Déposez une illustration de ' + e.name,
          badge: isExt ? 'Éteinte' : 'Lignée survivante',
          badgeStyle: this.extinctBadge(e.fate),
          isExtinctFate: isExt, isSurvivedFate: !isExt,
          fateHeadStyle: { marginTop: 18, padding: '13px 14px', borderRadius: 12, background: isExt ? '#f7ece8' : '#e4f0ec', color: isExt ? '#7a3b28' : '#1f5a4a' },
          fateTitle: isExt ? '❌ Extinction' : '✅ Survie (lignée moderne)',
          fateIntro: isExt ? "Le climat a fini par retirer à cette espèce les conditions dont elle dépendait." : "Face au stress climatique, cette lignée a su s'adapter et prospérer sur le long terme.",
          adaptRows: e.adapt.map(a => ({ ic: a[0], ti: a[1], tx: a[2] })),
          factorRows: (e.factors || []).map(f => ({ ic: f[0], ti: f[1], tx: f[2] })),
          descendants: e.descendants || '',
          causeRows: (e.causes || []).map(c => ({ label: c[0], pctTxt: c[1] + ' %', color: c[2], barStyle: { height: '100%', width: c[1] + '%', background: c[2], borderRadius: 4 } })),
          geoChips: e.geo,
          siteChips: (e.fossilSites || []).map(fs => ({ label: fs.name, go: () => this.setState({ screen: 'sites', siteCat: 'Espèce disparue', site: { name: fs.name, cat: 'Espèce disparue', region: fs.region, desc: (fs.desc || '') + ' — gisement de ' + e.name + '.', lat: fs.lat, lon: fs.lon }, menuOpen: false }) })),
          factList: e.facts,
          specimenRows: e.specimens.map(s => ({ nm: s[0], dt: s[1] })),
          hasDeextinct: !!e.deextinct, deextinct: e.deextinct || '',
          tlBarStyle: { position: 'absolute', top: 0, bottom: 0, left: e.tlStart + '%', width: Math.max(2, e.tlEnd - e.tlStart) + '%', background: e.accent, borderRadius: 7 },
          tlTicks: e.tlGlac.map(g => ({ label: g[1], style: { position: 'absolute', top: '-3px', bottom: '-3px', left: g[0] + '%', width: '2px', background: '#0f2c3c', opacity: 0.5 } })),
          popPath: this.polyPath(e.pop, 10, 310, 8, 68, 0, 100),
          popArea: this.polyPath(e.pop, 10, 310, 8, 68, 0, 100) + ' L310 70 L10 70 Z'
        };
      })(),
      isFossils: screen === 'fossils',
      goFossils: () => this.setState({ screen: 'fossils', fossilId: null, menuOpen: false }),
      fossilCards: this.fossils.map(f => ({ ...f, img: this.fossilImg(f.id), open: () => this.setState({ fossilId: f.id }) })),
      fossilList: !this.state.fossilId,
      fo: this.state.fossilId ? (() => { const f = this.fossils.find(x => x.id === this.state.fossilId); if (!f) return null; const cr = this.fossilCredits[f.id]; return { ...f, img: this.fossilImg(f.id), credit: cr ? { artist: cr.artist, license: cr.license, source: cr.source } : null }; })() : null,
      backToFossils: () => this.setState({ fossilId: null }),
      isGlaciations: screen === 'glaciations',
      goGlaciations: () => this.setState({ screen: 'glaciations', glacId: this.state.glacId || 'cryo', menuOpen: false }),
      glacBands: this.glaciations.map(g => {
        const AX = 2600; const top = (1 - Math.min(AX, g.start) / AX) * 100; const bot = (1 - Math.min(AX, g.end) / AX) * 100;
        const active = this.state.glacId === g.id;
        return { ...g, active,
          open: () => this.setState({ glacId: g.id }),
          bandStyle: { position: 'absolute', left: 0, right: 0, top: top + '%', height: Math.max(2.4, bot - top) + '%', minHeight: 10, background: g.color, opacity: active ? 1 : 0.62, borderRadius: 4, cursor: 'pointer', border: active ? '2px solid #0f2c3c' : '2px solid transparent', transition: 'opacity .15s' },
          labelStyle: { position: 'absolute', left: 0, marginLeft: 9, top: (top + bot) / 2 + '%', transform: 'translateY(-50%)', whiteSpace: 'nowrap', fontSize: 11, fontWeight: active ? 700 : 500, color: active ? '#0f2c3c' : '#5a7688', cursor: 'pointer' } };
      }),
      glac: (() => { const g = this.glaciations.find(x => x.id === (this.state.glacId || 'cryo')); return g ? { ...g, img: this.wikiImg('glac_' + g.id), credit: this.wikiCreditTxt('glac_' + g.id) } : g; })(),
      isCores: screen === 'cores',
      goCores: () => this.setState({ screen: 'cores', coreId: this.state.coreId || 'epica', menuOpen: false }),
      corePins: this.cores.map(c => {
        const active = (this.state.coreId || 'epica') === c.id;
        return { ...c, active,
          open: () => this.setState({ coreId: c.id }),
          pinStyle: { position: 'absolute', left: c.x + '%', top: c.y + '%', transform: 'translate(-50%,-50%)', width: active ? 20 : 14, height: active ? 20 : 14, borderRadius: '50%', background: c.color, border: '2.5px solid #fff', boxShadow: active ? '0 0 0 4px ' + c.color + '55, 0 2px 6px rgba(0,0,0,.4)' : '0 2px 5px rgba(0,0,0,.35)', cursor: 'pointer', zIndex: active ? 3 : 2, transition: 'all .15s' },
          chipStyle: { flex: 1, textAlign: 'center', padding: '9px 4px', borderRadius: 9, cursor: 'pointer', fontSize: 11, fontWeight: 600, border: '1px solid ' + (active ? c.color : '#dbe7ec'), background: active ? c.color : '#fff', color: active ? '#fff' : '#4d6c7d' } };
      }),
      core: this.cores.find(c => c.id === (this.state.coreId || 'epica')),
      coresImg: this.wikiImg('cores'), coresCredit: this.wikiCreditTxt('cores'),

      // ── Atlas mondial des sites paléoclimatiques ──
      isAtlas: screen === 'atlas',
      goAtlas: () => this.setState({ screen: 'atlas', atlasId: null, menuOpen: false }),
      atlasList: !this.state.atlasId,
      atlasDetail: !!this.state.atlasId,
      backToAtlas: () => this.setState({ atlasId: null }),
      atlasPins: this.atlasRegions.map(r => {
        const active = this.state.atlasId === r.id;
        return { id: r.id, name: r.name, emoji: r.emoji,
          open: () => this.setState({ atlasId: r.id }),
          pinStyle: { position: 'absolute', left: r.x + '%', top: r.y + '%', transform: 'translate(-50%,-50%)', width: active ? 24 : 17, height: active ? 24 : 17, borderRadius: '50%', background: r.color, border: '2.5px solid #fff', boxShadow: active ? '0 0 0 4px ' + r.color + '55, 0 2px 6px rgba(0,0,0,.4)' : '0 2px 5px rgba(0,0,0,.35)', cursor: 'pointer', zIndex: active ? 3 : 2, transition: 'all .15s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: active ? 12 : 9 } };
      }),
      atlasWorldMap: this.wikiImg('worldmap'),
      atlasCards: this.atlasRegions.map(r => ({
        id: r.id, name: r.name, emoji: r.emoji, color: r.color, wash: r.wash, tagline: r.tagline, coords: r.coords, timespan: r.timespan,
        img: this.wikiImg('reg_' + r.id),
        open: () => this.setState({ atlasId: r.id })
      })),
      at2: (() => {
        const r = this.atlasRegions.find(x => x.id === this.state.atlasId);
        if (!r) return { proxies: [], reveal: [], facts: [] };
        return {
          ...r, ph: 'Déposez une illustration de ' + r.name,
          img: this.wikiImg('reg_' + r.id), credit: this.wikiCreditTxt('reg_' + r.id),
          revealRows: r.reveal.map(x => ({ ic: x[0], ti: x[1], tx: x[2] })),
          goSites: () => this.setState({ screen: 'sites', siteCat: r.linkCat, site: null, addMode: false, menuOpen: false }),
        };
      })(),

      // ── Portraits de scientifiques ──
      isScientists: screen === 'scientists',
      goScientists: () => this.setState({ screen: 'scientists', sciId: null, menuOpen: false }),
      sciList: !this.state.sciId,
      sciDetail: !!this.state.sciId,
      backToScientists: () => this.setState({ sciId: null }),
      sciCards: this.scientists.map(s => ({
        id: s.id, name: s.name, initials: s.initials, color: s.color, wash: s.wash,
        years: s.years, field: s.field, tagline: s.tagline, nat: s.nat,
        photo: this.wikiImg('sci_' + s.id),
        open: () => this.setState({ sciId: s.id })
      })),
      sc2: (() => {
        const s = this.scientists.find(x => x.id === this.state.sciId);
        if (!s) return { bio: [], contributions: [] };
        return {
          ...s, ph: 'Déposez un portrait de ' + s.name,
          photo: this.wikiImg('sci_' + s.id), credit: this.wikiCreditTxt('sci_' + s.id),
          bioParas: s.bio,
          contribRows: s.contributions.map(c => ({ ic: c[0], ti: c[1], tx: c[2] })),
          hasNote: !!s.note,
          goLink: () => this.setState({ screen: s.linkScreen, atlasId: null, sciId: null, menuOpen: false }),
        };
      })(),

      ...(() => {
        const co2 = this.state.simCo2 ?? 420, solar = this.state.simSolar ?? 100, volc = this.state.simVolc ?? 1, cont = this.state.simCont ?? 'dispersed', obl = this.state.simObl ?? 23.44;
        const contData = { ocean: { label: 'Pôles océaniques', desc: 'Océan libre aux pôles', dT: 2.2, ice: -28 }, dispersed: { label: 'Dispersés (actuel)', desc: 'Continents séparés', dT: 0, ice: 0 }, pangea: { label: 'Supercontinent', desc: 'Type Pangée', dT: 0.6, ice: 2 }, polar: { label: 'Continent polaire', desc: 'Terre centrée au pôle', dT: -2.2, ice: 22 } };
        const cd = contData[cont];
        const dTco2 = 0.8 * 5.35 * Math.log(co2 / 280);
        const dTsolar = (solar / 100 - 1) * 238 * 0.8;
        const dTvolc = -0.35 * Math.max(0, volc - 1);
        const dTobl = (obl - 23.44) * 0.12;
        const T = 14 + dTco2 + dTsolar + dTvolc + cd.dT + dTobl;
        let ice = (17 - T) * 8 + cd.ice - (obl - 23.44) * 2; ice = Math.max(0, Math.min(100, ice));
        const sea = (15 - ice) * 1.8 + (T - 14) * 4;
        const iceLabel = ice < 3 ? 'Aucune glace pérenne' : ice < 20 ? 'Calottes polaires' : ice < 55 ? 'Calottes étendues' : 'Terre « boule de neige »';
        const climLabel = T > 22 ? 'Serre extrême' : T > 17 ? 'Serre — sans glace' : T > 11 ? 'Tempéré' : T > 4 ? 'Glaciaire' : 'Englacement global';
        const seaLabel = sea > 60 ? 'Mers épicontinentales' : sea > 10 ? 'Plus haut qu\u2019aujourd\u2019hui' : sea > -10 ? 'Proche de l\u2019actuel' : sea > -80 ? 'Plateaux exondés' : 'Chute majeure du niveau marin';
        const warm = Math.max(0, Math.min(1, (T - 2) / 26));
        const oc = (a, b) => Math.round(a + (b - a) * warm);
        const oceanCol = `rgb(${oc(28, 66)},${oc(84, 150)},${oc(128, 138)})`;
        const capH = (ice / 100) * 46;
        const h = React.createElement;
        const simGlobe = h('svg', { viewBox: '0 0 160 160', style: { width: 132, height: 132, display: 'block', margin: '0 auto' } },
          h('defs', {}, h('clipPath', { id: 'simgclip' }, h('circle', { cx: 80, cy: 80, r: 62 }))),
          h('circle', { cx: 80, cy: 80, r: 62, fill: oceanCol }),
          h('g', { clipPath: 'url(#simgclip)' },
            h('rect', { x: 18, y: 18, width: 124, height: capH, fill: '#eef5f8' }),
            h('rect', { x: 18, y: 142 - capH, width: 124, height: capH, fill: '#eef5f8' })),
          h('circle', { cx: 80, cy: 80, r: 62, fill: 'none', stroke: '#0f2c3c', strokeOpacity: 0.18, strokeWidth: 2 }));
        const chip = active => ({ flex: 1, textAlign: 'center', padding: '9px 4px', borderRadius: 9, cursor: 'pointer', fontSize: 10.5, fontWeight: 600, lineHeight: 1.25, border: '1px solid ' + (active ? '#2f7ca0' : '#dbe7ec'), background: active ? '#2f7ca0' : '#fff', color: active ? '#fff' : '#4d6c7d' });
        return {
          isSimulator: screen === 'simulator',
          goSimulator: () => this.setState({ screen: 'simulator', menuOpen: false }),
          simGlobe,
          simTTxt: T.toFixed(1) + ' °C', simDeltaTxt: ((T - 14) >= 0 ? '+' : '') + (T - 14).toFixed(1) + ' °C vs préindustriel',
          simClimLabel: climLabel,
          simIceTxt: Math.round(ice) + ' %', simIceLabel: iceLabel,
          simSeaTxt: (sea >= 0 ? '+' : '') + Math.round(sea) + ' m', simSeaLabel: seaLabel,
          simCo2Val: co2, simCo2Txt: Math.round(co2) + ' ppm',
          simSolarVal: solar, simSolarTxt: solar.toFixed(1) + ' %',
          simVolcVal: volc, simVolcTxt: volc.toFixed(1),
          simOblVal: obl, simOblTxt: obl.toFixed(2) + '°',
          simContLabel: cd.label, simContDesc: cd.desc,
          onSimCo2: e => this.setState({ simCo2: +e.target.value }),
          onSimSolar: e => this.setState({ simSolar: +e.target.value }),
          onSimVolc: e => this.setState({ simVolc: +e.target.value }),
          onSimObl: e => this.setState({ simObl: +e.target.value }),
          setContOcean: () => this.setState({ simCont: 'ocean' }),
          setContDispersed: () => this.setState({ simCont: 'dispersed' }),
          setContPangea: () => this.setState({ simCont: 'pangea' }),
          setContPolar: () => this.setState({ simCont: 'polar' }),
          contOceanStyle: chip(cont === 'ocean'), contDispersedStyle: chip(cont === 'dispersed'), contPangeaStyle: chip(cont === 'pangea'), contPolarStyle: chip(cont === 'polar'),
          resetSim: () => this.setState({ simCo2: 420, simSolar: 100, simVolc: 1, simCont: 'dispersed', simObl: 23.44 })
        };
      })(),
      goProxies: () => this.setState({ screen: 'proxies', proxy: null, menuOpen: false }),
      galleryCards, proxyOpen: !!pv, proxyGallery: !pv,
      pvLabel: pv && pv.label, pvColor: pv && pv.color, pvWhat: pv && pv.what,
      pvRecords: pv && pv.records, pvReach: pv && pv.reach, pvSignal: pv && pv.signal, pvSignalNote: pv && pv.signalNote,
      pvFacts: pv ? pv.facts : [], proxyDiagram, proxySteps,
      backToGallery: () => { clearInterval(this.timer); this.setState({ proxy: null, playing: false }); },
      playProxy: () => this.playProxy(), playing,
      playBtnLabel: playing ? '● Formation en cours…' : (grow >= 100 ? '↺ Rejouer la formation' : '▶ Lancer la formation'),
      diagramCardStyle: { position: 'relative', background: pv ? pv.color + '10' : '#eef4f7', border: '1px solid #dbe7ec', borderRadius: 14, padding: '10px 12px', marginBottom: 12 },
      goMaps: () => this.setState({ screen: 'maps', menuOpen: false }),
      cmpRef: this.cmpRef, reveal, mapPeriod,
      setPangea: () => this.setState({ mapPeriod: 'pangea' }),
      setCret: () => this.setState({ mapPeriod: 'cretaceous' }),
      setLgm: () => this.setState({ mapPeriod: 'lgm' }),
      periodPangeaStyle: this.mapChip(mapPeriod === 'pangea'),
      periodCretStyle: this.mapChip(mapPeriod === 'cretaceous'),
      periodLgmStyle: this.mapChip(mapPeriod === 'lgm'),
      onReveal: (e) => this.setState({ reveal: +e.target.value }),
      overlayClipStyle: { position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - reveal}% 0 0)` },
      // cartes dessinées (équirectangulaire)
      mapW: MW, mapH: MH, mapGrat: this.graticule(MW, MH),
      mapTodayOcean: gpToday.ocean, mapTodayLandCol: gpToday.land,
      mapTodayLand: this.equirect(gpToday.lands, MW, MH), mapTodayIce: this.equirect(gpToday.ice, MW, MH),
      mapPeriodOcean: mapCfg.ocean, mapPeriodLandCol: mapCfg.land,
      mapPeriodLand: this.equirect(mapCfg.lands, MW, MH), mapPeriodIce: this.equirect(mapCfg.ice, MW, MH),
      // zoom « Votre région » (coupe)
      rgnLatLng: `${Math.abs(pinLat).toFixed(0)}°${pinLat >= 0 ? 'N' : 'S'} · ${Math.abs(pinLng).toFixed(0)}°${pinLng >= 0 ? 'E' : 'O'}`,
      rgnEpochIce: rgnEpochSt === 'ice', rgnEpochSea: rgnEpochSt === 'sea', rgnEpochLand: rgnEpochSt === 'land',
      rgnTodayIce: rgnTodaySt === 'ice', rgnTodaySea: rgnTodaySt === 'sea', rgnTodayLand: rgnTodaySt === 'land',
      rgnEpochEmoji: stEmoji[rgnEpochSt], rgnTodayEmoji: stEmoji[rgnTodaySt],
      rgnEpochPhrase, rgnTodayPhrase: stTodayPhrase[rgnTodaySt],
      rgnEpochValue, rgnTodayValue, rgnEpochTemp, rgnTodayTemp,
      rgnPaleoLatTxt: this.fmtLat(rgnPaleoLat) + ' · ' + this.zoneName(rgnPaleoLat),
      rgnTodayLatTxt: this.fmtLat(pinLat) + ' · ' + this.zoneName(pinLat),
      rgnEpochOcean: mapCfg.ocean, rgnEpochLandCol: mapCfg.land,
      rgnTodayOcean: gpToday.ocean, rgnTodayLandCol: gpToday.land,
      rgnSame: rgnEpochSt === rgnTodaySt,
      handleStyle: { position: 'absolute', top: 0, bottom: 0, left: `${reveal}%`, width: 2, background: '#fff', boxShadow: '0 0 5px rgba(0,0,0,.45)', transform: 'translateX(-1px)', pointerEvents: 'none', zIndex: 15 },
      handleGripStyle: { position: 'absolute', top: '50%', left: `${reveal}%`, transform: 'translate(-50%,-50%)', width: 30, height: 30, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f2c3c', fontSize: 13, pointerEvents: 'none', zIndex: 16 },
      pinStyle: { position: 'absolute', left: `${pinX}%`, top: `${pinY}%`, transform: 'translate(-50%,-100%)', zIndex: 20, cursor: 'grab', touchAction: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' },
      pinLabel,
      onPinLabel: (e) => { const val = e.target.value; this.setState({ pinLabel: val, pinSugOpen: this.gNorm(val).length >= 3 }); },
      closePinSug: () => this.setState({ pinSugOpen: false }),
      onPinBlur: () => { setTimeout(() => this.setState({ pinSugOpen: false }), 160); },
      onPinFocus: () => { if (this.gNorm(this.state.pinLabel).length >= 3) this.setState({ pinSugOpen: true }); },
      // Autocomplétion de villes (dès 3 caractères) : sélectionner déplace le repère.
      pinSugShow: this.state.pinSugOpen && this.gNorm(pinLabel).length >= 3,
      pinSuggestions: (() => {
        const q = this.gNorm(pinLabel);
        if (q.length < 3) return [];
        return this.gazetteer.filter(g => this.gNorm(g.n).includes(q) || this.gNorm(g.alt).includes(q)).slice(0, 6).map(g => ({
          name: g.n, sub: this.fmtCoord(g.lat, g.lng),
          pick: () => this.setState({
            pinLabel: g.n, pinSugOpen: false,
            pinX: Math.max(2, Math.min(98, (g.lng + 180) / 360 * 100)),
            pinY: Math.max(8, Math.min(96, (90 - g.lat) / 180 * 100)),
          }),
        }));
      })(),
      pinSugEmpty: (() => { const q = this.gNorm(pinLabel); return q.length >= 3 && !this.gazetteer.some(g => this.gNorm(g.n).includes(q) || this.gNorm(g.alt).includes(q)); })(),
      onPinDown: (e) => this.onPinDown(e), onPinMove: (e) => this.onPinMove(e), onPinUp: () => this.onPinUp(),
      mapPeriodLabel: per.label, mapPeriodAge: per.age, mapPeriodNote: per.note, mapPinNote: per.pin,
      eras, era, age,
      co2Path, tempPath, co2Area,
      scrubX, co2MarkY: this.co2Y(pt[1]), tempMarkY: this.tempY(pt[2]),
      scrubCo2: pt[1], scrubTempTxt: (pt[2] > 0 ? '+' : '') + pt[2].toFixed(1) + ' °C',
      scrubAgeTxt: ageTxt,
      goHome: () => this.setState({ screen: 'home', menuOpen: false }),
      goData: () => this.setState({ screen: 'data', menuOpen: false }),
      goTM: () => this.setState({ screen: 'timemachine', menuOpen: false }),
      onScrub: (e) => this.setState({ age: +e.target.value }),
      // menu
      toggleMenu: () => this.setState(s => ({ menuOpen: !s.menuOpen })),
      closeMenu: () => this.setState({ menuOpen: false }),
      openHelp: () => this.setState({ helpOpen: true, menuOpen: false }),
      closeHelp: () => this.setState({ helpOpen: false }),
      helpTitle: (this.helpDocs[screen] || this.helpDocs.home).title,
      helpWhy: (this.helpDocs[screen] || this.helpDocs.home).why,
      helpTips: (this.helpDocs[screen] || this.helpDocs.home).tips,
      helpScrimStyle: { position: 'absolute', inset: 0, background: 'rgba(8,24,34,0.5)', zIndex: 50, transition: 'opacity .25s', opacity: this.state.helpOpen ? 1 : 0, pointerEvents: this.state.helpOpen ? 'auto' : 'none' },
      helpSheetStyle: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '82%', display: 'flex', flexDirection: 'column', background: '#fff', zIndex: 51, borderRadius: '20px 20px 0 0', transform: this.state.helpOpen ? 'translateY(0)' : 'translateY(102%)', transition: 'transform .3s cubic-bezier(.4,0,.2,1)', boxShadow: '0 -8px 30px rgba(8,24,34,0.25)' },
      navItems,
      navGroups,
      // barre de catégories (bas d'écran) + feuille de sous-menu
      bottomCats,
      catSheetOpen: !!catMenu,
      catSheetTitle: catMenu || '',
      catSheetItems: catGroup ? catGroup.items : [],
      closeCatSheet: () => this.setState({ catMenu: null }),
      catScrimStyle: { position: 'absolute', inset: 0, background: 'rgba(8,24,34,0.5)', zIndex: 44, transition: 'opacity .25s', opacity: catMenu ? 1 : 0, pointerEvents: catMenu ? 'auto' : 'none' },
      catSheetStyle: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '72%', display: 'flex', flexDirection: 'column', background: '#0c2534', zIndex: 45, borderRadius: '20px 20px 0 0', transform: catMenu ? 'translateY(0)' : 'translateY(102%)', transition: 'transform .28s cubic-bezier(.4,0,.2,1)', boxShadow: '0 -8px 30px rgba(0,0,0,0.4)' },
      menuScrimStyle: { position: 'absolute', inset: 0, background: 'rgba(8,24,34,0.5)', zIndex: 40, transition: 'opacity .25s', opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none' },
      menuPanelStyle: { position: 'absolute', top: 0, left: 0, bottom: 0, width: '80%', maxWidth: 300, background: '#0c2534', zIndex: 41, transform: menuOpen ? 'translateX(0)' : 'translateX(-102%)', transition: 'transform .28s cubic-bezier(.4,0,.2,1)', boxShadow: '8px 0 30px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column' },
      // time machine
      tmRange, tmScrub,
      setFull: () => this.setState({ tmRange: 'full', tmInfo: null }),
      setPhan: () => this.setState({ tmRange: 'phan', tmInfo: null }),
      onTmScrub: (e) => this.setState({ tmScrub: +e.target.value }),
      rangeFullStyle: this.rangeBtn(tmRange !== 'phan'),
      rangePhanStyle: this.rangeBtn(tmRange === 'phan'),
      tmEvents, tmScrubX, tmScrubPct: (tmScrubX / 3.2).toFixed(2),
      tmAgeTxt: this.fmtAge(scrubAge), tmEra: this.eraAt(scrubAge), tmLeftLabel: maxAge === 4500 ? '4,5 Ga' : '541 Ma',
      tmTempTxt: tT.toFixed(1) + ' °C', tmCo2Txt: Math.round(tC) + ' ppm',
      tmSeaTxt: (tS >= 0 ? '+' : '') + Math.round(tS) + ' m', tmBioTxt: Math.round(tB) + '',
      tmTempPath: this.cpath(this.cTemp, maxAge, v => this.mTemp(v)),
      tmCo2Path: this.cpath(this.cCo2, maxAge, v => this.mCo2(v)),
      tmSeaPath: this.cpath(this.cSea, maxAge, v => this.mSea(v)),
      tmBioPath: this.cpath(this.cBio, maxAge, v => this.mBio(v)),
      tmTempMarkY: this.mTemp(tT), tmCo2MarkY: this.mCo2(tC), tmSeaMarkY: this.mSea(tS), tmBioMarkY: this.mBio(tB),
      // Temps profond : bande Précambrien + popover « peu de données » sur chaque graphe
      tmDeep: tmRange !== 'phan',
      tmPreX: this.tX(541, maxAge),            // frontière 541 Ma (Précambrien | Phanérozoïque)
      tmPreW: this.tX(541, maxAge) - this.tX(maxAge, maxAge),
      tmInfoOpen: this.state.tmInfo,
      tmInfoToggle: (id) => this.setState(s => ({ tmInfo: s.tmInfo === id ? null : id })),
      tmCloseInfo: () => this.setState({ tmInfo: null }),
      tmInfoText: {
        temp: "Avant 541 Ma, la température globale n'est reconstruite que très grossièrement (δ¹⁸O rares, datations incertaines). Aucune variation fine documentée ici — hormis les glaciations globales du Cryogénien. La courbe est indicative.",
        co2: "Le CO₂ précambrien provient de modèles (GEOCARB) et de paléosols : valeurs très élevées mais peu contraintes. Le seul grand repère est la Grande Oxydation (~2,4 Ga) ; le reste est lissé, faute de mesures.",
        sea: "Le niveau marin relatif n'est pas reconstruit avant le Phanérozoïque. La courbe est mise à plat par convention : aucun événement remarquable n'est documenté sur cette période.",
        bio: "La biodiversité animale ne décolle qu'à l'explosion cambrienne (541 Ma). Avant, la vie est essentiellement microbienne : quasi rien à dénombrer — la courbe reste au ras de zéro.",
      },
      // event sheet
      evtOpen: !!evt, evtCat: evt && evt.cat, evtTitle: evt && evt.title, evtBody: evt && evt.body,
      evtColor: evt && evt.color, evtAgeTxt: evt && this.fmtAge(evt.age),
      closeEvt: () => this.setState({ evt: null })
    };
  }


  render() {
    const v = this.renderVals()
    return renderApp(v, this)
  }
}

export default PaleoApp
