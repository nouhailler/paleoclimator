// Couche visuelle du mode démo : curseur virtuel, spotlight, bulle de narration.
// DOM impératif appendu à document.body → démontage net (destroy()).

export interface OverlayOptions {
  reducedMotion: boolean;
  cursorTravelMs: number;
  spotlightPadding: number;
}

export class DemoOverlay {
  readonly rootEl: HTMLDivElement;
  readonly controlsSlot: HTMLDivElement; // rempli par la barre de contrôle
  private cursorEl: HTMLDivElement;
  private spotEl: HTMLDivElement;
  private noteEl: HTMLDivElement;
  private narrateEl: HTMLDivElement;
  private opts: OverlayOptions;
  private cursorX = -100;
  private cursorY = -100;

  constructor(opts: OverlayOptions) {
    this.opts = opts;
    const root = document.createElement('div');
    root.setAttribute('data-demo-overlay', '');
    Object.assign(root.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483000',
      pointerEvents: 'none',
      font: "13px/1.5 'IBM Plex Sans', system-ui, sans-serif",
    } as CSSStyleDeclaration);

    // Spotlight : un cadre transparent avec une immense ombre portée qui assombrit le reste.
    const spot = document.createElement('div');
    Object.assign(spot.style, {
      position: 'fixed',
      borderRadius: '12px',
      boxShadow: '0 0 0 9999px rgba(8,24,34,0)',
      border: '2px solid rgba(111,178,209,0)',
      transition: opts.reducedMotion ? 'none' : 'all .35s cubic-bezier(.4,0,.2,1)',
      pointerEvents: 'none',
      opacity: '0',
    } as CSSStyleDeclaration);

    // Légende attachée au spotlight.
    const note = document.createElement('div');
    Object.assign(note.style, {
      position: 'fixed',
      maxWidth: '260px',
      padding: '8px 12px',
      borderRadius: '10px',
      background: '#0f2c3c',
      color: '#eaf3f7',
      fontSize: '12px',
      lineHeight: '1.45',
      boxShadow: '0 6px 22px rgba(8,24,34,.4)',
      pointerEvents: 'none',
      opacity: '0',
      transition: opts.reducedMotion ? 'none' : 'opacity .2s',
    } as CSSStyleDeclaration);

    // Curseur virtuel.
    const cursor = document.createElement('div');
    cursor.innerHTML =
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M5 3l4.5 15 2.4-6.1L18 9.5 5 3z" fill="#0f2c3c" stroke="#eaf3f7" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    Object.assign(cursor.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: '26px',
      height: '26px',
      transform: 'translate(-100px,-100px)',
      transition: opts.reducedMotion ? 'none' : `transform ${opts.cursorTravelMs}ms cubic-bezier(.45,.05,.2,1)`,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.35))',
      zIndex: '2',
    } as CSSStyleDeclaration);

    // Bulle de narration (bandeau bas par défaut).
    const narrate = document.createElement('div');
    Object.assign(narrate.style, {
      position: 'fixed',
      left: '50%',
      bottom: '78px',
      transform: 'translateX(-50%)',
      maxWidth: 'min(520px, calc(100vw - 32px))',
      padding: '12px 16px',
      borderRadius: '13px',
      background: 'rgba(15,44,60,.96)',
      color: '#eaf3f7',
      fontSize: '13.5px',
      lineHeight: '1.5',
      textAlign: 'center',
      boxShadow: '0 8px 30px rgba(8,24,34,.45)',
      pointerEvents: 'none',
      opacity: '0',
      transition: opts.reducedMotion ? 'none' : 'opacity .25s',
    } as CSSStyleDeclaration);

    // Emplacement de la barre de contrôle (interactive → pointer-events auto).
    const controls = document.createElement('div');
    Object.assign(controls.style, { pointerEvents: 'auto' } as CSSStyleDeclaration);

    root.append(spot, note, cursor, narrate, controls);
    document.body.appendChild(root);

    this.rootEl = root;
    this.controlsSlot = controls;
    this.cursorEl = cursor;
    this.spotEl = spot;
    this.noteEl = note;
    this.narrateEl = narrate;
  }

  /** Centre du curseur — utile pour animer le clic depuis sa position courante. */
  cursorCenter(): { x: number; y: number } {
    return { x: this.cursorX, y: this.cursorY };
  }

  /** Déplace le curseur vers (x, y). Retourne la durée du trajet (ms) pour temporiser. */
  moveCursor(x: number, y: number): number {
    const dist = Math.hypot(x - this.cursorX, y - this.cursorY);
    this.cursorX = x;
    this.cursorY = y;
    this.cursorEl.style.transform = `translate(${x - 5}px, ${y - 3}px)`;
    if (this.opts.reducedMotion || dist < 2) return 0;
    // Trajet proportionnel à la distance, borné.
    return Math.min(this.opts.cursorTravelMs, 180 + dist * 0.6);
  }

  /** Petite animation « clic » (anneau qui pulse). */
  pulse(): void {
    if (this.opts.reducedMotion) return;
    const ring = document.createElement('div');
    Object.assign(ring.style, {
      position: 'fixed',
      left: `${this.cursorX}px`,
      top: `${this.cursorY}px`,
      width: '10px',
      height: '10px',
      marginLeft: '-5px',
      marginTop: '-5px',
      borderRadius: '50%',
      border: '2px solid #6fb2d1',
      pointerEvents: 'none',
      animation: 'demo-pulse .5s ease-out forwards',
    } as CSSStyleDeclaration);
    this.rootEl.appendChild(ring);
    setTimeout(() => ring.remove(), 520);
  }

  /** Positionne le spotlight sur un rectangle (ou le masque si null). */
  spotlight(rect: DOMRect | null, note?: string): void {
    if (!rect) {
      this.spotEl.style.opacity = '0';
      this.spotEl.style.boxShadow = '0 0 0 9999px rgba(8,24,34,0)';
      this.spotEl.style.borderColor = 'rgba(111,178,209,0)';
      this.noteEl.style.opacity = '0';
      return;
    }
    const pad = this.opts.spotlightPadding;
    Object.assign(this.spotEl.style, {
      opacity: '1',
      left: `${rect.left - pad}px`,
      top: `${rect.top - pad}px`,
      width: `${rect.width + pad * 2}px`,
      height: `${rect.height + pad * 2}px`,
      boxShadow: '0 0 0 9999px rgba(8,24,34,.5)',
      borderColor: 'rgba(111,178,209,.9)',
    } as CSSStyleDeclaration);
    if (note) {
      this.noteEl.textContent = note;
      const belowSpace = window.innerHeight - rect.bottom;
      const top = belowSpace > 70 ? rect.bottom + pad + 8 : rect.top - pad - 46;
      Object.assign(this.noteEl.style, {
        opacity: '1',
        left: `${Math.max(12, Math.min(rect.left, window.innerWidth - 272))}px`,
        top: `${top}px`,
      } as CSSStyleDeclaration);
    } else {
      this.noteEl.style.opacity = '0';
    }
  }

  /** Affiche/masque la bulle de narration. */
  narrate(text: string | null): void {
    if (!text) {
      this.narrateEl.style.opacity = '0';
      return;
    }
    this.narrateEl.textContent = text;
    this.narrateEl.style.opacity = '1';
  }

  destroy(): void {
    this.rootEl.remove();
  }
}

// Keyframe du clic — injectée une seule fois.
if (typeof document !== 'undefined' && !document.getElementById('demo-overlay-kf')) {
  const st = document.createElement('style');
  st.id = 'demo-overlay-kf';
  st.textContent =
    '@keyframes demo-pulse{0%{transform:scale(1);opacity:.9}100%{transform:scale(4.5);opacity:0}}';
  document.head.appendChild(st);
}
