import { LitElement, html, css } from 'lit';

export class CustomToggle extends LitElement {
    static styles = css`
    :host {
      display: flex;
    }

    .toggle-container {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }

    .toggle-container.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .toggle-switch {
      position: relative;
      width: 44px;
      height: 24px;
      background-color: #e5e7eb;
      border-radius: 999px;
      transition: background-color 0.2s;
    }

    .toggle-switch:hover {
      background-color: #d1d5db;
    }

    .toggle-switch[checked] {
      background-color: #2563eb;
    }

    .toggle-switch[checked]:hover {
      background-color: #1d4ed8;
    }

    .toggle-circle {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.2s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .toggle-switch[checked] .toggle-circle {
      transform: translateX(20px);
    }

    .toggle-switch:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #3b82f6;
    }

    .label {
      margin-left: 8px;
      font-size: 14px;
      color: #374151;
    }

    .label.disabled {
      color: #9ca3af;
    }

    /* Small size variant */
    .toggle-switch.small {
      width: 32px;
      height: 16px;
    }

    .toggle-switch.small .toggle-circle {
      width: 12px;
      height: 12px;
    }

    .toggle-switch.small[checked] .toggle-circle {
      transform: translateX(16px);
    }

    /* Large size variant */
    .toggle-switch.large {
      width: 56px;
      height: 32px;
    }

    .toggle-switch.large .toggle-circle {
      width: 28px;
      height: 28px;
    }

    .toggle-switch.large[checked] .toggle-circle {
      transform: translateX(24px);
    }
  `;

    static properties = {
        checked: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
        label: { type: String },
        size: { type: String }, // 'small', 'default', or 'large'
    };

    constructor() {
        super();
        this.checked = false;
        this.disabled = false;
        this.label = '';
        this.size = 'default';
    }

    _handleClick(e) {
        if (this.disabled) return;

        this.checked = !this.checked;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { checked: this.checked },
            bubbles: true,
            composed: true
        }));
    }

    _handleKeyDown(e) {
        if (this.disabled) return;

        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._handleClick();
        }
    }

    render() {
        return html`
      <div class="toggle-container ${this.disabled ? 'disabled' : ''}">
        <div
          class="toggle-switch ${this.size}"
          ?checked=${this.checked}
          @click=${this._handleClick}
          @keydown=${this._handleKeyDown}
          role="switch"
          aria-checked=${this.checked}
          aria-disabled=${this.disabled}
          tabindex=${this.disabled ? '-1' : '0'}
        >
          <div class="toggle-circle"></div>
        </div>
        ${this.label ? html`
          <span class="label ${this.disabled ? 'disabled' : ''}">${this.label}</span>
        ` : null}
      </div>
    `;
    }
}

customElements.define('custom-toggle', CustomToggle);
