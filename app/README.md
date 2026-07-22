<div align="center">

<img src="public/icons/icon.svg" width="96" alt="Logo Paléoclim" />

# 🌍 Paléoclim — PWA de paléoclimatologie

*Application mobile éducative (**PWA, hors-ligne d'abord**) sur l'histoire du climat terrestre.*
*Recréation en **React + Vite** du prototype `../design_handoff_paleoclim/Paleoclim.dc.html`.*

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-hors--ligne-5A0FC8?logo=pwa&logoColor=white)

</div>

> 👉 Vitrine complète (fonctionnalités + galerie) : [README racine du dépôt](../README.md)

## 📸 Aperçu

| Frise des ères | Atlas mondial | Portraits |
|:---:|:---:|:---:|
| <img src="docs/screenshots/home.png" width="220" /> | <img src="docs/screenshots/atlas.png" width="220" /> | <img src="docs/screenshots/scientists.png" width="220" /> |
| Globe 3D | Time-Machine | Simulateur |
| <img src="docs/screenshots/globe.png" width="220" /> | <img src="docs/screenshots/timemachine.png" width="220" /> | <img src="docs/screenshots/simulator.png" width="220" /> |

## 🚀 Démarrer

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build de production (PWA) -> dist/
npm run preview  # prévisualiser le build
npm run lint     # oxlint
npm run shots    # (re)générer les captures d'écran (dev server requis)
```

## 🧱 Architecture

Le prototype était déjà un composant React (état + `renderVals()`). Le port en
conserve la **logique et l'état comme spécification**, dans une architecture propre :

| 📄 Fichier | Rôle |
|---|---|
| `src/App.jsx` | Composant principal `PaleoApp`. Contient l'état, **toutes les données scientifiques embarquées** (ères, espèces, archives, glaciations, atlas, scientifiques, séries EPICA/LR04…), les méthodes (globe canvas, projections, insolation de Milankovitch, interpolations) et `renderVals()` — porté quasi verbatim du prototype. |
| `src/render.jsx` | `renderApp(v, self)` : le markup des 24 vues traduit en JSX. Consomme les valeurs calculées par `renderVals()`. |
| `src/css.js` | Helper `css()` : convertit les chaînes de style inline en objets de style React (mémoïsé). |
| `src/ImageSlot.jsx` | Emplacement d'illustration (placeholder rayé + dépôt d'image), remplace le `<image-slot>` du prototype. |
| `scripts/shots.mjs` | Capture automatisée des captures d'écran (Playwright) → `docs/screenshots/`. |

### 🧭 Navigation
Application **mono-écran à tiroir (☰)** : un state `screen` pilote ~24 vues via des
ternaires (ex-`sc-if`). Détails (ère, espèce, région, scientifique…) pilotés par des ids.

### 📦 Données
Toutes les données sont **embarquées en dur** dans `App.jsx` — aucune dépendance
réseau à l'exécution. Un service worker (vite-plugin-pwa) précache l'app-shell.

### 🎨 Rendus programmatiques
Globe 3D (projection orthographique maison en `<canvas>`), cartes à épingles, courbes SVG —
dessinés à la main, portés du prototype.

## 🗺️ À faire / production

- [ ] **Polices** : chargées via Google Fonts en dev (`index.html`). Pour un vrai
  hors-ligne, les embarquer localement dans `public/fonts/` (Spectral, IBM Plex Sans/Mono).
- [ ] **Illustrations** : les reconstitutions paléoenvironnement sont des placeholders
  rayés — brancher de vraies illustrations (demander les visuels).
- [ ] **Persistance** : persister `userSites` (sites ajoutés) et la dernière vue en
  localStorage (non encore branché).
- [ ] **Icônes PWA** : `public/icons/` (générées ; à remplacer par un visuel définitif).
