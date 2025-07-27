import { LitElement, html, css } from 'lit';

export class FractionalLoader extends LitElement {
    static properties = {
        show:     { type: Boolean, reflect: true },
        duration: { type: Number },   // expected time (ms) to reach 75 %
        phases:   { type: Array }     // optional messages/icons
    };

    /* ---------- life‑cycle ---------- */

    constructor() {
        super();
        this.show     = false;
        this.duration = 15_000;
        this.phases   = [];

        /* animation internals */
        this._progress      = 0;      // 0 → 1 (but never 1)
        this._speed         = 0;      // progress units per ms
        this._nextThreshold = 0.75;   // first slow‑down marker
        this._raf           = 0;
        this._lastStamp     = 0;
        this._startTime     = 0;

        /* geometry cache (ring size hard‑coded in CSS) */
        const r = 125;                // 280/2 − 15
        this._circ = 2 * Math.PI * r; // full circumference
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.show) this._start();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._stop();
    }

    updated(changed) {
        if (changed.has('show')) {
            this.show ? this._start() : this._stop();
        }
    }

    /* ---------- animation loop ---------- */

    _start() {
        this._progress      = 0;
        this._speed         = 0.75 / this.duration; // reach ¾ at `duration`
        this._nextThreshold = 0.75;
        this._lastStamp     = performance.now();
        this._startTime     = this._lastStamp;
        this._raf           = requestAnimationFrame(() => this._tick());
    }

    _stop() {
        cancelAnimationFrame(this._raf);
        this._raf = 0;
        this._progress = 0;
        this.requestUpdate();
    }

    _tick() {
        const now = performance.now();
        const dt  = now - this._lastStamp;
        this._lastStamp = now;

        this._progress += dt * this._speed;

        /* decelerate at ¾, ⅞, 15⁄16, … */
        if (this._progress >= this._nextThreshold) {
            this._progress      = this._nextThreshold;
            this._speed        *= 0.5;
            this._nextThreshold = 1 - (1 - this._nextThreshold) / 2;
        }

        if (this._progress > 0.995) this._progress = 0.995; // asymptotic cap

        this.requestUpdate();

        if (this.show) {
            this._raf = requestAnimationFrame(() => this._tick());
        }
    }

    /* ---------- helpers ---------- */

    /** stroke‑dasharray string for the progress circle */
    _dasharray() {
        const len = this._progress * this._circ;
        return `${len} ${this._circ}`;
    }

    /** returns the current phase descriptor (icon / text) */
    _phase() {
        if (!this.phases?.length) return {};
        const elapsed = performance.now() - this._startTime;

        let cum = 0;
        for (const p of this.phases) {
            const d = p.duration ?? 1_000;
            if (elapsed < cum + d) return p;
            cum += d;
        }
        return this.phases[this.phases.length - 1];
    }

    /* ---------- template ---------- */

    render() {
        const size = 280;
        const r    = size / 2 - 15;
        const { icon, text, message } = this._phase();

        return html`
      <svg class="ring" viewBox="0 0 ${size} ${size}">
        <circle class="track"   cx="${size / 2}" cy="${size / 2}" r="${r}"></circle>
        <circle class="progress" cx="${size / 2}" cy="${size / 2}" r="${r}"
                stroke-dasharray="${this._dasharray()}"></circle>
      </svg>

      <div class="center">
        ${icon ? html`<span class="icon">${icon}</span>` : ''}
        ${text || message ? html`<p class="text">${text ?? message}</p>` : ''}
      </div>
    `;
    }

    /* ---------- styles ---------- */

    static styles = css`
    :host {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
      filter: drop-shadow(1px 1px 8px #ffffff);
    }

    :host([show]) {
      visibility: visible;
      opacity: 1;
    }

    .ring {
      width: 280px;
      height: 280px;
      transform: rotate(-90deg);
    }

    circle {
      fill: none;
      stroke-width: 6;
      stroke-linecap: round;
    }

    .track    { stroke: var(--purple-normal, #4f46e5); opacity: 0.3; }
    .progress { stroke: var(--purple-normal, #4f46e5); }

    .center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      text-align: center;
    }

    .icon  { font-size: 2.5rem; color: var(--purple-normal, #4f46e5); }
    .text  { margin: 0; font-size: 1.25rem; font-weight: bold; color: var(--purple-normal, #4f46e5); }
  `;
}

customElements.define('process-loading-ring', FractionalLoader);
