# Paléoclim — PWA de paléoclimatologie

Application mobile éducative (PWA, **hors-ligne d'abord**) sur l'histoire du climat
terrestre. Recréation en **React + Vite** du prototype de design
`../design_handoff_paleoclim/Paleoclim.dc.html`.

## Démarrer

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build de production (PWA) -> dist/
npm run preview  # prévisualiser le build
```

## Architecture

Le prototype était déjà un composant React (état + `renderVals()`). Le port en
conserve la **logique et l'état comme spécification**, dans une architecture propre :

| Fichier | Rôle |
|---|---|
| `src/App.jsx` | Composant principal `PaleoApp`. Contient l'état, **toutes les données scientifiques embarquées** (ères, espèces, archives, glaciations, séries EPICA/LR04…), les méthodes (globe canvas, projections, insolation de Milankovitch, interpolations) et `renderVals()` — porté quasi verbatim du prototype. |
| `src/render.jsx` | `renderApp(v, self)` : le markup des 24 vues traduit en JSX. Consomme les valeurs calculées par `renderVals()`. |
| `src/css.js` | Helper `css()` : convertit les chaînes de style inline en objets de style React (mémoïsé). |
| `src/ImageSlot.jsx` | Emplacement d'illustration (placeholder rayé + dépôt d'image), remplace le `<image-slot>` du prototype. |

### Navigation
Application **mono-écran à tiroir (☰)** : un state `screen` pilote ~24 vues via des
ternaires (ex-`sc-if`). Détails (ère, espèce, fossile…) pilotés par des ids.

### Données
Toutes les données sont **embarquées en dur** dans `App.jsx` — aucune dépendance
réseau à l'exécution. Un service worker (vite-plugin-pwa) précache l'app-shell.

### Rendus programmatiques
Globe 3D (projection orthographique maison en `<canvas>`), cartes, courbes SVG —
dessinés à la main, portés du prototype.

## À faire / production

- **Polices** : chargées via Google Fonts en dev (`index.html`). Pour un vrai
  hors-ligne, les embarquer localement dans `public/fonts/` (Spectral, IBM Plex Sans/Mono).
- **Illustrations** : les reconstitutions paléoenvironnement sont des placeholders
  rayés — brancher de vraies illustrations (demander les visuels).
- **Persistance** : persister `userSites` (sites ajoutés) et la dernière vue en
  localStorage (non encore branché).
- Icônes PWA : `public/icons/` (générées ; à remplacer par un visuel définitif).
