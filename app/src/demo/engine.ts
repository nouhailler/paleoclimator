// Moteur du mode démo : exécute une liste de steps déclaratifs en pilotant l'UI réelle
// (curseur virtuel, spotlight, narration). Découplé de l'app via DemoHost.
// Sortie propre à tout moment (stop / Échap) : état restauré, overlay démonté.

import type {
  DemoConfig,
  DemoEngine,
  DemoHost,
  DemoStep,
  EnginePhase,
  EngineStatus,
  Scenario,
  TargetInput,
} from './types';
import { DemoOverlay } from './overlay';
import { ControlBar } from './controls';

const ABORT = Symbol('demo-abort');

export const DEFAULT_CONFIG: DemoConfig = {
  cursorTravelMs: 750,
  typingPerCharMs: 55,
  defaultHoldMs: 650,
  spotlightPadding: 6,
  speeds: [0.5, 1, 2],
  waitTimeoutMs: 4000,
};

function targetOf(t: TargetInput): { demoId: string; nth: number } {
  return typeof t === 'string' ? { demoId: t, nth: 0 } : { demoId: t.demoId, nth: t.nth ?? 0 };
}

export class Engine implements DemoEngine {
  private host: DemoHost;
  private cfg: DemoConfig;
  private overlay: DemoOverlay | null = null;
  private controls: ControlBar | null = null;
  private scenario: Scenario | null = null;
  private snapshot: unknown = null;
  private subs = new Set<(s: EngineStatus) => void>();

  private phase: EnginePhase = 'idle';
  private index = -1;
  private speed = 1;
  private narration: string | undefined;

  private running = false; // boucle active
  private dead = false; // stop demandé
  private stepOnce = false; // exécuter un seul step puis pause (bouton « suivant »)
  private resumeWaiters: Array<() => void> = [];
  private rejectSleep: (() => void) | null = null;
  private onKey: ((e: KeyboardEvent) => void) | null = null;

  constructor(host: DemoHost, config?: Partial<DemoConfig>) {
    this.host = host;
    this.cfg = { ...DEFAULT_CONFIG, ...config };
    if (this.cfg.speeds.indexOf(1) >= 0) this.speed = 1;
    else this.speed = this.cfg.speeds[0] ?? 1;
  }

  /* ---------- API publique ---------- */

  get status(): EngineStatus {
    return {
      phase: this.phase,
      scenarioId: this.scenario?.id,
      scenarioTitle: this.scenario?.title,
      stepIndex: this.index,
      stepCount: this.scenario?.steps.length ?? 0,
      speed: this.speed,
      narration: this.narration,
    };
  }

  subscribe(cb: (s: EngineStatus) => void): () => void {
    this.subs.add(cb);
    return () => this.subs.delete(cb);
  }

  load(scenario: Scenario): void {
    if (this.phase !== 'idle') this.stop();
    this.scenario = scenario;
    this.index = -1;
    this.dead = false;
    this.phase = 'paused';
    this.snapshot = this.host.snapshot();
    this.host.applySeed(scenario.seed);
    this.mount();
    this.notify();
  }

  play(): void {
    if (!this.scenario || this.dead) return;
    if (this.phase === 'finished') {
      // Rejouer depuis le début.
      this.host.restore(this.snapshot);
      this.host.applySeed(this.scenario.seed);
      this.index = -1;
    }
    this.phase = 'playing';
    this.flushWaiters();
    this.notify();
    void this.loop();
  }

  pause(): void {
    if (this.phase === 'playing') {
      this.phase = 'paused';
      this.notify();
    }
  }

  next(): void {
    if (!this.scenario || this.dead) return;
    this.stepOnce = true;
    this.phase = 'playing';
    this.flushWaiters();
    this.notify();
    void this.loop();
  }

  setSpeed(multiplier: number): void {
    this.speed = multiplier;
    this.notify();
  }

  stop(): void {
    if (this.dead && this.phase === 'idle') return;
    this.dead = true;
    this.phase = 'idle';
    this.flushWaiters();
    if (this.rejectSleep) this.rejectSleep();
    // Restaure l'état réel de l'app et démonte l'overlay.
    if (this.snapshot != null) this.host.restore(this.snapshot);
    this.unmount();
    this.index = -1;
    this.narration = undefined;
    this.notify();
  }

  /* ---------- Cycle de vie overlay ---------- */

  private mount(): void {
    if (this.overlay) return;
    this.overlay = new DemoOverlay({
      reducedMotion: this.host.reducedMotion,
      cursorTravelMs: this.cfg.cursorTravelMs,
      spotlightPadding: this.cfg.spotlightPadding,
    });
    this.controls = new ControlBar(this.overlay.controlsSlot, this, this.cfg.speeds);
    this.onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.stop();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (this.phase === 'playing') this.pause();
        else this.play();
      }
    };
    window.addEventListener('keydown', this.onKey, true);
  }

  private unmount(): void {
    if (this.onKey) window.removeEventListener('keydown', this.onKey, true);
    this.onKey = null;
    this.controls?.destroy();
    this.overlay?.destroy();
    this.controls = null;
    this.overlay = null;
  }

  /* ---------- Boucle d'exécution ---------- */

  private async loop(): Promise<void> {
    if (this.running || !this.scenario) return;
    this.running = true;
    try {
      const steps = this.scenario.steps;
      while (this.index + 1 < steps.length) {
        await this.gate(); // attend l'état « playing »
        if (this.dead) break;
        this.index += 1;
        this.notify();
        await this.exec(steps[this.index]);
        if (this.dead) break;
        if (this.stepOnce) {
          this.stepOnce = false;
          this.phase = 'paused';
          this.notify();
        }
      }
      if (!this.dead && this.index + 1 >= steps.length) {
        this.phase = 'finished';
        if (this.scenario.loop) {
          this.running = false;
          this.play();
          return;
        }
        this.notify();
      }
    } catch (err) {
      if (err !== ABORT) throw err;
    } finally {
      this.running = false;
    }
  }

  /** Se résout quand le moteur est en lecture (ou mort). */
  private gate(): Promise<void> {
    if (this.phase === 'playing' || this.dead) return Promise.resolve();
    return new Promise((res) => this.resumeWaiters.push(res));
  }

  private flushWaiters(): void {
    const w = this.resumeWaiters;
    this.resumeWaiters = [];
    w.forEach((r) => r());
  }

  /* ---------- Exécution d'un step ---------- */

  private async exec(step: DemoStep): Promise<void> {
    const reduced = this.host.reducedMotion;
    if (step.skipOnReducedMotion && reduced) return;

    // Nettoie les visuels non pertinents pour ce step.
    if (step.type !== 'highlight' && !(step.type === 'narrate' && step.anchor)) {
      this.overlay?.spotlight(null);
    }
    if (step.type !== 'narrate') {
      this.narration = undefined;
      this.overlay?.narrate(null);
    }

    switch (step.type) {
      case 'navigate': {
        await this.host.navigate(step.to);
        await this.sleep(reduced ? 0 : 300); // laisse React rendre l'écran
        break;
      }
      case 'click': {
        const el = await this.resolveEl(step.target);
        if (el) await this.pointAndClick(el);
        break;
      }
      case 'type': {
        const el = await this.resolveEl(step.target);
        if (el) await this.typeInto(el as HTMLInputElement, step.text, step.clear !== false, step.perCharMs);
        break;
      }
      case 'wait': {
        if (step.forDemoId) await this.waitFor(step.forDemoId);
        else await this.sleep(step.ms ?? this.cfg.defaultHoldMs);
        break;
      }
      case 'highlight': {
        const el = await this.resolveEl(step.target);
        if (el) {
          el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
          await this.sleep(reduced ? 0 : 260);
          this.overlay?.spotlight(el.getBoundingClientRect(), step.note);
        }
        break;
      }
      case 'narrate': {
        this.narration = step.text;
        this.overlay?.narrate(step.text);
        this.notify();
        if (step.anchor) {
          const el = await this.resolveEl(step.anchor);
          if (el) this.overlay?.spotlight(el.getBoundingClientRect());
        }
        break;
      }
    }

    // Pause de lecture après le step (sauf « wait » qui a déjà temporisé).
    if (step.type !== 'wait') {
      await this.sleep(step.holdMs ?? this.cfg.defaultHoldMs);
    }
  }

  /* ---------- Primitives ---------- */

  private async pointAndClick(el: HTMLElement): Promise<void> {
    const reduced = this.host.reducedMotion;
    el.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    await this.sleep(reduced ? 0 : 240);
    const r = el.getBoundingClientRect();
    const travel = this.overlay?.moveCursor(r.left + r.width / 2, r.top + r.height / 2) ?? 0;
    await this.sleep(travel);
    this.overlay?.spotlight(r);
    this.overlay?.pulse();
    await this.sleep(reduced ? 0 : 130);
    el.click();
    await this.sleep(reduced ? 0 : 120);
    this.overlay?.spotlight(null);
  }

  private async typeInto(input: HTMLInputElement, text: string, clear: boolean, perChar?: number): Promise<void> {
    const reduced = this.host.reducedMotion;
    const r = input.getBoundingClientRect();
    const travel = this.overlay?.moveCursor(r.left + 24, r.top + r.height / 2) ?? 0;
    await this.sleep(travel);
    input.focus();
    const proto = Object.getPrototypeOf(input) as object;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    const setVal = (v: string): void => {
      if (setter) setter.call(input, v);
      else input.value = v;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    if (clear) setVal('');
    if (reduced) {
      setVal(text);
      return;
    }
    let cur = clear ? '' : input.value;
    const per = perChar ?? this.cfg.typingPerCharMs;
    for (const ch of text) {
      cur += ch;
      setVal(cur);
      await this.sleep(per);
    }
  }

  private async resolveEl(t: TargetInput): Promise<HTMLElement | null> {
    const { demoId, nth } = targetOf(t);
    const found = await this.waitFor(demoId, nth);
    if (!found) {
      // eslint-disable-next-line no-console
      console.warn(`[demo] introuvable: data-demo-id="${demoId}" (nth=${nth})`);
    }
    return found;
  }

  private async waitFor(demoId: string, nth = 0): Promise<HTMLElement | null> {
    const t0 = performance.now();
    for (;;) {
      const els = this.host.root.querySelectorAll<HTMLElement>(`[data-demo-id="${demoId}"]`);
      if (els[nth]) return els[nth];
      if (performance.now() - t0 > this.cfg.waitTimeoutMs || this.dead) return null;
      await this.sleep(60, true);
    }
  }

  /** Sleep respectant vitesse et abort. `raw` = ne pas appliquer le multiplicateur. */
  private sleep(ms: number, raw = false): Promise<void> {
    const scaled = raw || ms <= 0 ? ms : ms / this.speed;
    return new Promise<void>((resolve, reject) => {
      if (this.dead) return reject(ABORT);
      if (scaled <= 0) return resolve();
      const id = window.setTimeout(() => {
        this.rejectSleep = null;
        resolve();
      }, scaled);
      this.rejectSleep = () => {
        clearTimeout(id);
        this.rejectSleep = null;
        reject(ABORT);
      };
    });
  }

  private notify(): void {
    const s = this.status;
    this.subs.forEach((cb) => cb(s));
  }
}
