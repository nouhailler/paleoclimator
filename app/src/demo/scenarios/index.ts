// Registre des scénarios de démo : id → scénario.
// Consommé par ?demo=<id> (main.jsx) et par l'entrée de menu « Visite guidée ».

import type { Scenario } from '../types';
import { decouverteAtlas } from './decouverte-atlas';

export const SCENARIOS: Record<string, Scenario> = {
  [decouverteAtlas.id]: decouverteAtlas,
};

export const SCENARIO_LIST: Scenario[] = Object.values(SCENARIOS);

export function getScenario(id: string | null | undefined): Scenario | undefined {
  return id ? SCENARIOS[id] : undefined;
}
