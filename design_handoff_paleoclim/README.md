# Handoff : Paléoclim — application PWA de paléoclimatologie

## Overview
**Paléoclim** est une application mobile (PWA, hors-ligne) éducative en français sur la paléoclimatologie : l'histoire du climat terrestre sur ~4,5 milliards d'années, la façon dont on le reconstitue (proxies), et ses liens avec la vie et les sociétés humaines. Le public est grand public curieux / niveau lycée–université ; le ton est pédagogique et rigoureux (chaque contenu simplifié porte un avertissement).

L'app est une **application mono-écran à navigation par tiroir (drawer ☰)** : un state `screen` pilote l'affichage d'une vingtaine de vues distinctes, présentées dans le cadre d'un téléphone Android.

## About the Design Files
Les fichiers de ce dossier sont des **références de design réalisées en HTML** — un prototype fonctionnel montrant l'apparence et le comportement voulus, **pas du code de production à copier tel quel**. La tâche est de **recréer ces designs dans l'environnement de la codebase cible** (React/React Native, Vue, SwiftUI, Flutter…), avec ses patterns et bibliothèques établis. S'il n'existe pas encore d'environnement, choisir le framework le plus adapté (une PWA React + Vite ou React Native conviennent bien à cette app mobile hors-ligne) et y implémenter les designs.

Le prototype est bâti comme un « Design Component » : la logique vit dans une classe `Component` (état + `renderVals()`) et le markup est un template à trous. Traiter cela comme la **spécification de la logique et de l'état**, pas comme l'architecture à reproduire.

## Fidelity
**Haute-fidélité (hifi).** Couleurs, typographie, espacements, courbes et interactions sont définitifs. Recréer l'UI au pixel près en utilisant les bibliothèques existantes de la codebase. Les rendus canvas (globe 3D, cartes, graphes) sont dessinés à la main en `<canvas>` 2D — reproduire le rendu, mais libre choix de la techno (canvas, SVG, ou lib de dataviz/globe équivalente).

## Cadre & plateforme
- Cible : **téléphone mobile portrait**. Le prototype rend dans un cadre Android de **412 × 892 px** (`android-frame.jsx`). En production, l'app occupe le plein écran ; le cadre n'est qu'un décor de prototypage à ne PAS reproduire.
- **Hors-ligne d'abord** : aucune dépendance réseau à l'exécution, aucune donnée distante. Toutes les données scientifiques sont embarquées en dur dans la logique. Un badge « Hors-ligne » figure dans l'en-tête.
- Polices : **Spectral** (serif, titres et gros chiffres), **IBM Plex Sans** (corps de texte / UI), **IBM Plex Mono** (données, coordonnées, valeurs chiffrées). Chargées via Google Fonts — les embarquer localement pour le vrai hors-ligne.

## Structure de navigation
Barre d'en-tête fixe (logo + titre « Paléoclimat / Archives du climat terrestre », bouton menu ☰ à gauche, bouton aide « ? » et badge « Hors-ligne » à droite), puis corps scrollable, puis (selon l'écran) une barre d'outils basse.

Le **tiroir de navigation** (☰) liste toutes les vues, groupées par section :
- **Explorer** — Frise des ères (`home`), Time-Machine (`timemachine`), Cartes paléo (`maps`), Globe 3D (`globe`), Climat historique (`hist`), Mode Histoire (`story`)
- **Bases de données** — Espèces indicatrices (`species`), Espèces disparues (`extinct`), Galerie des fossiles (`fossils`), Archives climatiques (`archives`), Événements extrêmes (`extremes`)
- **Cartes & sites** — Grandes glaciations (`glaciations`), Forages célèbres (`cores`), Carte des sites proxy (`sites`)
- **Outils d'analyse** — Simulateur climatique (`simulator`), Superposition de données (`overlay`), Calculateur δ¹⁸O → T° (`calc`), Bac à sable orbital / Milankovitch (`milank`)
- **Comprendre** — Galerie de proxies (`proxies`), Carottes de glace (`data`), Glossaire (`glossary`)

Un écran de détail existe pour la plupart des bases de données (ère, espèce, espèce disparue, fossile, archive, événement extrême) : liste → fiche, avec un lien retour « ‹ … ».

## Screens / Views

> Chaque vue est un bloc `sc-if` piloté par un flag `is<Screen>`. Les valeurs (textes, courbes, chips) sont calculées dans `renderVals()`. Ci-dessous, le rôle et le contenu de chacune ; se référer au HTML pour le détail au pixel.

### 1. Frise des ères — `home` (écran d'accueil)
- **But** : point d'entrée ; parcourir les 6 grandes ères climatiques.
- **Layout** : titre + intro, puis liste verticale de cartes d'ère (une par ère), puis encart « Note » (échelle non linéaire).
- **Carte d'ère** : rangée flex, bande de couleur `era.color` (8 px) à gauche, puis nom (Spectral 16px/600), intervalle temporel (Mono 10px), tag descriptif, et deux mini-stats (CO₂ atm., Régime). Fond blanc, `border-radius:12px`, bordure `#e0eaef`, ombre douce. Cliquable → détail.

### 2. Détail d'ère — `era`
- En-tête teinté `era.wash`, intervalle (Mono), nom (Spectral 26px), tag. Grille 3 colonnes de vitals (CO₂, T° globale, Calottes). Bloc image placeholder rayé en `era.color`. Puis sections narratives.

### 3. Time-Machine — `timemachine`
- Chronologie interactive sur 4,5 Ga. Curseur de balayage (`tmScrub`), sélecteur d'intervalle (`tmRange`), événements cliquables (`evt`).

### 4. Cartes paléo — `maps`
- Comparateur « Avant / Après » à volet révélateur (`reveal`, 0–100 %). Périodes : Pangée (`pangea`) et autres. Épingle déplaçable « Votre région » (`pinX`,`pinY`, drag). Chaque période porte label, âge, note.

### 5. Globe 3D — `globe`
- Globe terrestre dessiné en `<canvas>` (projection orthographique maison), rotation auto + drag + molette (zoom). Curseur temporel `globePeriod` balaye des reconstructions paléogéographiques (chaque période : terres, glaces, océan, niveau marin, note). Champ de recherche géographique (`geoQ`) + gazetteer (villes) : sélectionner un lieu affiche sa **paléo-latitude** à l'époque choisie et un récit de dérive des plaques. Bouton lecture/pause rotation.

### 6. Climat historique — `hist`
- Séries température / précipitations / pression, années **1421–2008**. Curseur d'année (`histYear`), courbes tracées, marqueurs d'événements historiques cliquables (recentrent l'année).

### 7. Mode Histoire — `story`
- Climat & sociétés : récoltes, famines, mortalité. Chips de sélection d'épisode (`storyId`), courbes récolte/mortalité, lien « voir dans Climat historique » (saute à l'année).

### 8. Espèces indicatrices — `species` (liste → détail `speciesId`)
- Fossiles témoins du climat (indicateurs paléoenvironnementaux).

### 9. Espèces disparues — `extinct` (liste → détail `extinctId`)  ⭐ zone de travail récente
- Fiches climat d'espèces éteintes. Actuellement : **mammouth laineux, Tiktaalik, Arthropleura, mégalodon, dodo, Smilodon (tigre à dents de sabre)**.
- **Fiche détail**, structure type :
  - Timeline / intervalle d'existence
  - **Passeport climatique** : température, précipitations, atmosphère + géographie (chips `geo`)
  - Adaptations
  - **Facteurs d'extinction pondérés** : barres horizontales `causes` = `[label, pourcentage, couleur]`
  - Courbe d'abondance
  - **Sites majeurs** (`fossilSites`) : chips cliquables — un tap sur 📍 fait `screen:'sites'` en centrant la carte sur ce site fossile et en filtrant la catégorie « Espèce disparue »
  - Preuves fossiles / spécimens (`specimens` = `[nom, date]`), leçon paléoclimatique (`lesson`), anecdotes (`facts`)
- Chaque espèce a un tableau `fossilSites` : `{ name, lat, lon, region, desc }` (lieux de fouille réels/plausibles).
- **Suites prévues** (non faites) : mégacéros (élan irlandais), Néandertal, paresseux géant ; éventuellement reconstructions Crétacé/Carbonifère ; toggle couche satellite/terrain sur la carte.

### 10. Galerie des fossiles — `fossils` (liste → détail `fossilId`)
- 10 fiches fossiles illustrées.

### 11. Archives climatiques — `archives` (liste → détail `archiveId`)
- 10 archives naturelles du climat.

### 12. Événements extrêmes — `extremes` (liste → détail `extreme`)
- Base des grandes crises climatiques (extinctions, événements). Cartes avec catégorie/couleur, quand, résumé.

### 13. Grandes glaciations — `glaciations`
- Axe du temps profond, 5 épisodes (bandes, `glacId`, ex. `cryo`).

### 14. Forages célèbres — `cores`
- Vostok, EPICA, GRIP, GISP2.

### 15. Carte des sites proxy — `sites`
- **Carte** (canvas/fond mondial) avec épingles de sites, filtrées par catégorie (`siteCat`). Catégories : Tous, Carotte de glace, Spéléothème, Varves, Tillite / Snowball, Limite / extinction, Volcanisme, Fossiles, **Espèce disparue** (violet), Communauté.
- Sources des épingles : `proxySites` (en dur) + `fossilSites` dérivés des espèces disparues + `userSites` (ajoutés par l'utilisateur via `addMode` → `onMapTap`).
- Sélection d'un site (`site`) → panneau détail (nom, région, description). Légende par catégorie.

### 16. Simulateur climatique — `simulator`
- Réglage de forçages, observation de la réponse.

### 17. Superposition de données — `overlay`
- Comparer/corréler des datasets (EPICA, niveau marin, LR04). Toggles par courbe (`dsOn`), décalage temporel (`shiftKa`) pour aligner visuellement.

### 18. Calculateur δ¹⁸O → T° — `calc`
- Paléotempérature isotopique. Entrées `dCalcite`, `dWater`, choix d'équation (`eqId`), formule affichée, résultat + interprétation.

### 19. Bac à sable orbital (Milankovitch) — `milank`
- Sliders excentricité (`ecc`), obliquité (`obl`), précession (`prec`), saison ; insolation par latitude tracée. Bouton reset (`ecc:1.67, obl:23.44, prec:283`).

### 20. Galerie de proxies — `proxies`
- Comment on sait : indicateurs (glace, cernes d'arbres, sédiments). Cartes animées (`grow`, `playing`).

### 21. Carottes de glace — `data`
- EPICA / Vostok / 800 ka : courbes CO₂ / température.

### 22. Glossaire — `glossary`
- Recherche (`glossQ`) + filtre catégorie (`glossCat` : Tous, Concepts, Isotopes, Proxies, Méthodes, Événements). Liste de termes filtrée.

## Interactions & Behavior
- **Navigation** : tap sur item du tiroir → `setState({ screen, menuOpen:false })` + reset de l'état local de la vue. Liens retour dans les détails.
- **Listes → détail** : chaque base pose un id (`extinctId`, `speciesId`, …) ; `null` = vue liste, valeur = fiche.
- **Cross-navigation** : chips « Sites majeurs » d'une espèce disparue → carte des sites centrée/filtrée ; marqueurs d'événements de Climat historique → saut d'année ; Mode Histoire → Climat historique à l'année de l'épisode.
- **Canvas interactifs** : globe (drag rotation + molette zoom + rotation auto en boucle `requestAnimationFrame`, mise en pause quand un pointeur est actif) ; comparateur de cartes (poignée de révélation + épingle déplaçable via pointer capture) ; carte des sites (tap pour ajouter un site en `addMode`).
- **Sliders** : curseurs `<input type=range>` pilotant en direct les valeurs affichées et les courbes (Time-Machine, hist, milank, overlay, calc, globe).
- **Aide contextuelle** : bouton « ? » ouvre une aide propre à l'écran courant.
- **Responsive** : conçu pour le portrait mobile ; corps en `flex:1; overflow-y:auto`.

## State Management
Tout l'état vit dans un seul composant (`state = {…}`). Variables clés :
- `screen` (vue active), `menuOpen` (tiroir).
- Détails / ids : `eraId`, `speciesId`, `extinctId`, `fossilId`, `archiveId`, `extreme`, `glacId`, `storyId`.
- Time-Machine : `age`, `tmRange`, `tmScrub`, `evt`.
- Cartes paléo : `mapPeriod`, `reveal`, `pinX`, `pinY`, `pinLabel`, `dragging`.
- Globe : `globePeriod`, `globeRotate`, `geoQ`, `geoSel`.
- Climat historique : `histYear`. Story : `storyId`.
- Sites : `site`, `siteCat`, `addMode`, `userSites` (persistables).
- Outils : `dCalcite`, `dWater`, `eqId` (calc) ; `ecc`, `obl`, `prec`, `season` (milank) ; `dsOn`, `shiftKa` (overlay) ; `proxy`, `grow`, `playing` (proxies) ; `glossQ`, `glossCat` (glossaire).

**Persistance** : app hors-ligne — persister au minimum `userSites` (sites ajoutés par l'utilisateur) et idéalement la dernière vue en localStorage/stockage natif. Aucune donnée distante.

**Données embarquées** (en dur, à porter tel quel) : `eras`, `species`, `extinctSp`, `fossils`, `archives`, `extremes`, `glaciation(s)`, `proxySites`, `gazetteer`, `globePeriods`, séries historiques (`histTemp`/`histPres`/…), `tempEqs`, `glossary`, `histEvents`, `stories`.

## Design Tokens
Couleurs (thème « archives / bleu ardoise ») :
- Fond app : `#eef4f7` — Texte principal : `#0f2c3c`
- Dégradé en-tête : `#0c2534` → `#123246` ; texte en-tête `#eaf3f7` ; texte secondaire en-tête `#8fb4c6`
- Texte corps secondaire : `#4d6c7d` / `#3a5a6b` ; labels discrets : `#8aa5b3` / `#6b8898`
- Accent lien : `#2f7ca0` (hover `#1d5a78`)
- Cartes : fond `#fff`, bordure `#e0eaef`, ombre `0 1px 2px rgba(15,44,60,.06), 0 8px 20px rgba(15,44,60,.05)`
- Encart note : fond `#dfeef4`, bordure pointillée `#a9cdda`, texte `#345a6c`
- Vert « en ligne / hors-ligne » : `#5ecfa6` ; catégorie « Espèce disparue » : violet
- Chaque ère porte sa couleur (`color`) et sa teinte de fond (`wash`) ; les facteurs d'extinction ont des couleurs par barre.

Typo :
- Titres / gros chiffres : **Spectral** (serif), 600 — tailles vues : 26px (titre détail), 21px (accueil), 16–17px (cartes)
- Corps / UI : **IBM Plex Sans**, 400–600, 11–13px
- Données / mono : **IBM Plex Mono**, 400–500, 9–14px ; labels uppercase 8–9px, letter-spacing ~0.6px

Formes : `border-radius` cartes 10–12px ; badges/chips arrondis (pill) ; bande d'ère 8px.

Icônes : glyphes Unicode (◷ ⟳ ◐ ◉ ⌇ ⚜ ◍ ☠ ✦ ▤ ⚡ ❄ ⚑ ⚙ ≣ ∑ ☉ ◈ ≋ Aa) — remplaçables par un set d'icônes de la codebase.

## Assets
- **Aucune image bitmap** : reconstitutions paléoenvironnement rendues en placeholders rayés (motif CSS) ; à remplacer par de vraies illustrations en production (demander les visuels).
- Cartes, globe et graphes : **rendus programmatiques** (canvas 2D) — pas d'asset.
- `image-slot.js` : composant d'emplacement d'image glisser-déposer utilisé pour les placeholders (spécifique au prototype).
- Polices Google : Spectral, IBM Plex Sans, IBM Plex Mono (embarquer localement).

## Files
Fichiers du prototype (inclus dans ce dossier) :
- **`Paleoclim.dc.html`** — le design complet : markup (template) + logique (classe `Component` : état, données embarquées, `renderVals()`, rendus canvas). C'est la source de vérité.
- `android-frame.jsx` — cadre de téléphone Android (décor de prototypage, **ne pas reproduire** en prod).
- `image-slot.js` — emplacement d'image drag-and-drop pour les placeholders.
- `support.js` — runtime du prototype (Design Component). **Non pertinent** pour la production : ne pas porter.
