// Barre de contrôle du mode démo : play / pause / étape suivante / vitesse / quitter.
// DOM impératif, montée dans le slot fourni par DemoOverlay. S'abonne au statut du moteur.

import type { DemoEngine, EngineStatus } from './types';

export class ControlBar {
  private barEl: HTMLDivElement;
  private playBtn: HTMLButtonElement;
  private speedBtn: HTMLButtonElement;
  private progressEl: HTMLDivElement;
  private titleEl: HTMLDivElement;
  private engine: DemoEngine;
  private speeds: number[];
  private unsub: () => void;

  constructor(slot: HTMLElement, engine: DemoEngine, speeds: number[]) {
    this.engine = engine;
    this.speeds = speeds;

    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position: 'fixed',
      left: '50%',
      bottom: '16px',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '7px 9px',
      borderRadius: '14px',
      background: 'rgba(15,44,60,.97)',
      boxShadow: '0 8px 30px rgba(8,24,34,.5)',
      color: '#eaf3f7',
      maxWidth: 'calc(100vw - 24px)',
    } as CSSStyleDeclaration);

    const title = document.createElement('div');
    Object.assign(title.style, {
      fontSize: '11px',
      color: '#8fb4c6',
      maxWidth: '120px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      padding: '0 4px 0 6px',
    } as CSSStyleDeclaration);

    const play = this.mkBtn('▶︎', 'Lecture / pause', () => this.togglePlay());
    const nextB = this.mkBtn('⤼', 'Étape suivante', () => this.engine.next());
    nextB.innerHTML = '&#9197;'; // ⏭ next
    const speed = this.mkBtn('1×', 'Vitesse', () => this.cycleSpeed());
    speed.style.minWidth = '34px';
    const quit = this.mkBtn('✕', 'Quitter (Échap)', () => this.engine.stop());
    quit.style.color = '#f2b8b8';

    const progress = document.createElement('div');
    Object.assign(progress.style, {
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10.5px',
      color: '#8fb4c6',
      minWidth: '42px',
      textAlign: 'center',
    } as CSSStyleDeclaration);

    bar.append(title, play, nextB, speed, progress, quit);
    slot.appendChild(bar);

    this.barEl = bar;
    this.playBtn = play;
    this.speedBtn = speed;
    this.progressEl = progress;
    this.titleEl = title;

    this.unsub = engine.subscribe((s) => this.render(s));
    this.render(engine.status);
  }

  private mkBtn(label: string, title: string, onClick: () => void): HTMLButtonElement {
    const b = document.createElement('button');
    b.textContent = label;
    b.title = title;
    b.setAttribute('aria-label', title);
    Object.assign(b.style, {
      appearance: 'none',
      border: 'none',
      cursor: 'pointer',
      background: 'rgba(143,180,198,.14)',
      color: 'inherit',
      width: '34px',
      height: '34px',
      borderRadius: '9px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as CSSStyleDeclaration);
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    return b;
  }

  private togglePlay(): void {
    if (this.engine.status.phase === 'playing') this.engine.pause();
    else this.engine.play();
  }

  private cycleSpeed(): void {
    const cur = this.engine.status.speed;
    const i = this.speeds.indexOf(cur);
    const next = this.speeds[(i + 1) % this.speeds.length];
    this.engine.setSpeed(next);
  }

  private render(s: EngineStatus): void {
    this.titleEl.textContent = s.scenarioTitle || 'Visite guidée';
    this.playBtn.textContent = s.phase === 'playing' ? '❙❙' : '▶︎';
    this.playBtn.style.fontSize = s.phase === 'playing' ? '12px' : '14px';
    const speedLabel = Number.isInteger(s.speed) ? `${s.speed}×` : `${s.speed}×`;
    this.speedBtn.textContent = speedLabel;
    const shown = Math.min(s.stepIndex + 1, s.stepCount);
    this.progressEl.textContent = `${Math.max(0, shown)}/${s.stepCount}`;
    if (s.phase === 'finished') this.playBtn.textContent = '↺';
  }

  destroy(): void {
    this.unsub();
    this.barEl.remove();
  }
}
