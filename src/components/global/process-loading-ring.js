import { LitElement, html, css } from 'lit';

export class FractionalLoader extends LitElement {
    static properties = {
        show: { type: Boolean, reflect: true },
        duration: { type: Number },
        phases: { type: Array }
    };

    constructor() {
        super();
        this.show = false;
        this.duration = 15000;
        this.phases = [];
        this._progress = 0;
        this._startTime = null;
        this._timer = null;
        this._animationFrame = null;
    }

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

        .track {
            stroke: var(--purple-normal, #4f46e5);
            opacity: 0.3;
        }

        .progress {
            stroke: var(--purple-normal, #4f46e5);
            transition: stroke-dasharray 0.3s linear;
        }

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

        .icon {
            font-size: 2.5rem;
            color: var(--purple-normal, #4f46e5);
        }

        .text {
            margin: 0;
            font-size: 1.25rem;
            font-weight: bold;
            color: var(--purple-normal, #4f46e5);
        }
    `;

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

    _start() {
        this._progress = 0;
        this._startTime = Date.now();
        this._totalDuration = this._calculateTotalDuration();
        this._animate();
    }

    _stop() {
        clearTimeout(this._timer);
        this._timer = null;
        if (this._animationFrame) {
            cancelAnimationFrame(this._animationFrame);
            this._animationFrame = null;
        }
    }

    _animate() {
        const now = Date.now();
        const elapsed = now - this._startTime;
        const totalDuration = this._totalDuration || this.duration;

        // Calculate progress based on phase durations
        this._progress = this._calculateProgress(elapsed, totalDuration);

        this.requestUpdate();

        // Continue animation until we reach very close to 100%
        if (this._progress < 99.9) {
            this._animationFrame = requestAnimationFrame(() => this._animate());
        }
    }

    _dasharray() {
        const radius = 125; // Updated for larger ring (280/2 - 15 = 125)
        const circ = 2 * Math.PI * radius;
        const len = (this._progress / 100) * circ;
        return `${len} ${circ}`;
    }

    _calculateTotalDuration() {
        if (!this.phases.length) return this.duration;
        return this.phases.reduce((total, phase) => total + (phase.duration || 1000), 0);
    }

    _calculateProgress(elapsed, totalDuration) {
        if (!this.phases.length) {
            // Fallback to original asymptotic approach
            const t = elapsed / totalDuration;
            return 100 * (1 - Math.exp(-3 * t));
        }

        let cumulativeDuration = 0;
        for (let i = 0; i < this.phases.length; i++) {
            const phaseDuration = this.phases[i].duration || 1000;
            if (elapsed <= cumulativeDuration + phaseDuration) {
                // We're in this phase
                const phaseElapsed = elapsed - cumulativeDuration;
                const phaseProgress = phaseElapsed / phaseDuration;
                const smoothProgress = 1 - Math.exp(-3 * phaseProgress); // Asymptotic within phase

                // Calculate overall progress
                const baseProgress = (cumulativeDuration / totalDuration) * 100;
                const phaseContribution = ((phaseDuration / totalDuration) * 100) * smoothProgress;
                return baseProgress + phaseContribution;
            }
            cumulativeDuration += phaseDuration;
        }

        // If we've exceeded all phases, approach 100% asymptotically
        const t = (elapsed - totalDuration) / 5000; // 5 second tail
        return 95 + (5 * (1 - Math.exp(-2 * t)));
    }

    _phase() {
        if (!this.phases.length) return {};

        const now = Date.now();
        const elapsed = now - this._startTime;

        let cumulativeDuration = 0;
        for (let i = 0; i < this.phases.length; i++) {
            const phaseDuration = this.phases[i].duration || 1000;
            if (elapsed <= cumulativeDuration + phaseDuration) {
                return this.phases[i];
            }
            cumulativeDuration += phaseDuration;
        }

        // Return last phase if we've exceeded all durations
        return this.phases[this.phases.length - 1];
    }

    render() {
        const size = 280;
        const r = size / 2 - 15;
        const phase = this._phase();
        return html`
      <svg class="ring" viewBox="0 0 ${size} ${size}">
        <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}"></circle>
        <circle class="progress" cx="${size / 2}" cy="${size / 2}" r="${r}"
                stroke-dasharray="${this._dasharray()}"></circle>
      </svg>
      <div class="center">
        ${phase.icon ? html`<span class="icon">${phase.icon}</span>` : ''}
        ${phase.text || phase.message ? html`<p class="text">${phase.text || phase.message}</p>` : ''}
      </div>
    `;
    }
}

customElements.define('process-loading-ring', FractionalLoader);
