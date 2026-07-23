// Scénario d'exemple : présente l'Atlas mondial puis le Glossaire.
// 100 % déclaratif — aucune logique, tout se cible par data-demo-id.

import type { Scenario } from '../types';

export const decouverteAtlas: Scenario = {
  id: 'decouverte-atlas',
  title: 'Découvrir l’Atlas',
  description: 'Un tour rapide : Atlas mondial → fiche région → Glossaire → fiche terme.',
  steps: [
    {
      type: 'narrate',
      text: 'Bienvenue dans Paléoclimat. Voyons comment explorer les archives du climat terrestre.',
    },
    { type: 'navigate', to: 'atlas', label: 'Ouvrir l’Atlas mondial' },
    {
      type: 'highlight',
      target: 'atlas-worldmap',
      note: 'Carte NASA : chaque épingle est une grande région-archive du climat.',
    },
    { type: 'narrate', text: 'Sept régions, sept façons de lire le passé. Ouvrons le Sahara.' },
    { type: 'click', target: { demoId: 'atlas-card', nth: 2 }, label: 'Choisir le Sahara' },
    {
      type: 'narrate',
      text: 'Un désert aujourd’hui — mais un « Sahara vert » couvert de lacs il y a 10 000 ans, et même une glaciation il y a 445 millions d’années.',
    },
    { type: 'navigate', to: 'glossary', label: 'Aller au Glossaire' },
    {
      type: 'narrate',
      text: 'Le jargon paléoclimatique est dense. Le glossaire le décode — cherchons un terme.',
    },
    { type: 'type', target: 'gloss-search', text: 'Cycles de Mil' },
    { type: 'click', target: 'gloss-term', label: 'Ouvrir la fiche du terme' },
    {
      type: 'narrate',
      text: 'Chaque fiche donne la définition, un exemple concret et des renvois vers les outils de l’app. Fin de la visite !',
    },
  ],
};
