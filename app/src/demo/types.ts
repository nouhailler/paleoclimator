// Types du « mode démo » — rejoue des parcours utilisateur automatiquement.
// Contrainte : les steps sont 100 % données (aucune fonction), ciblage par data-demo-id.

/* ---------- Ciblage ---------- */
// Toujours par data-demo-id, jamais par classe CSS. `nth` pour les listes.
export interface DemoTarget {
  demoId: string;
  nth?: number; // 0-based, si plusieurs éléments partagent l'id (cartes, termes…)
}
// Sucre : un step peut écrire target: "atlas-card" au lieu de { demoId: "atlas-card" }.
export type TargetInput = string | DemoTarget;

/* ---------- Steps ---------- */
export interface StepBase {
  label?: string; // libellé lisible (barre de contrôle / liste d'étapes)
  holdMs?: number; // pause après le step, avant application du multiplicateur de vitesse
  skipOnReducedMotion?: boolean; // ignorer ce step si prefers-reduced-motion
}

export interface NavigateStep extends StepBase {
  type: 'navigate';
  to: string; // id d'écran ('atlas', 'glossary'…) — via DemoHost.navigate. Écran seul.
}
export interface ClickStep extends StepBase {
  type: 'click';
  target: TargetInput; // déplace le curseur virtuel puis clique
}
export interface TypeStep extends StepBase {
  type: 'type';
  target: TargetInput; // un <input>/<textarea> porteur d'un data-demo-id
  text: string;
  clear?: boolean; // vider avant de taper (défaut : true)
  perCharMs?: number; // override de la vitesse de frappe
}
export interface WaitStep extends StepBase {
  type: 'wait';
  ms?: number; // attente fixe…
  forDemoId?: string; // …ou attendre l'apparition d'un élément (avec timeout interne)
}
export interface HighlightStep extends StepBase {
  type: 'highlight'; // surbrillance sans clic
  target: TargetInput;
  note?: string; // légende optionnelle attachée à la surbrillance
}
export interface NarrateStep extends StepBase {
  type: 'narrate'; // bulle de narration
  text: string;
  anchor?: TargetInput; // ancrée à un élément ; sinon bandeau bas
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export type DemoStep =
  | NavigateStep
  | ClickStep
  | TypeStep
  | WaitStep
  | HighlightStep
  | NarrateStep;

/* ---------- Scénario ---------- */
export interface DemoSeed {
  // Données de démo isolées, injectées via DemoHost.applySeed (jamais persistées).
  userSites?: Array<{ name: string; lat: number; lon: number; cat: string }>;
}
export interface Scenario {
  id: string; // sert dans ?demo=<id>
  title: string;
  description?: string;
  seed?: DemoSeed;
  loop?: boolean; // rejouer en boucle (mode kiosque)
  steps: DemoStep[]; // 100 % données
}

/* ---------- Pont app ↔ moteur (implémenté par PaleoApp) ---------- */
export interface DemoHost {
  root: HTMLElement; // racine pour querySelector des data-demo-id
  reducedMotion: boolean; // matchMedia('prefers-reduced-motion: reduce')
  navigate(screen: string): void | Promise<void>;
  snapshot(): unknown; // capture l'état réel avant démo
  restore(snap: unknown): void; // restaure à la sortie (Échap / quitter)
  applySeed(seed?: DemoSeed): void; // pose la graine de démo (non persistée)
}

/* ---------- Moteur ---------- */
export type EnginePhase = 'idle' | 'playing' | 'paused' | 'finished';
export interface EngineStatus {
  phase: EnginePhase;
  scenarioId?: string;
  scenarioTitle?: string;
  stepIndex: number; // -1 avant le premier step
  stepCount: number;
  speed: number; // multiplicateur courant
  narration?: string; // narration active (pour la barre)
}
export interface DemoConfig {
  cursorTravelMs: number; // durée d'un déplacement de curseur
  typingPerCharMs: number; // frappe par caractère
  defaultHoldMs: number; // pause par défaut entre steps
  spotlightPadding: number; // marge de la surbrillance (px)
  speeds: number[]; // multiplicateurs sélectionnables (ex. [0.5, 1, 2])
  waitTimeoutMs: number; // timeout pour wait.forDemoId
}
export interface DemoEngine {
  load(scenario: Scenario): void;
  play(): void;
  pause(): void;
  next(): void; // exécute le step suivant puis se met en pause
  setSpeed(multiplier: number): void;
  stop(): void; // sortie propre : restore + démontage overlay
  readonly status: EngineStatus;
  subscribe(cb: (s: EngineStatus) => void): () => void;
}
