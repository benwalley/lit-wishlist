import { LitElement, html, css } from 'lit';


export class WysiwygEditor extends LitElement {
    // ——————————————————————————————————————————————————————————  STYLES
    static styles = css`
        :host {
            display: block;
            font-family: "Inter", Arial, sans-serif;
        }

        /* Outer wrapper gives us the rounded border visible in the mock-up */
        .wrapper {
            border: 1px solid var(--wysiwyg-border, #E0E3E6);
            border-radius: 8px;
            background: var(--wysiwyg-bg, #ffffff);
            overflow: hidden; /* keep toolbar radius */
            width: 100%;
            box-sizing: border-box;
        }

        /* Toolbar */
        .toolbar {
            display: flex;
            gap: 16px;
            align-items: center;
            padding: 8px 12px;
            background: var(--wysiwyg-toolbar-bg, #F7F8FA);
            border-bottom: 1px solid var(--wysiwyg-border, #E0E3E6);
            user-select: none;
        }

        button {
            all: unset; /* reset default styles */
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            font-weight: 400;
            color: var(--wysiwyg-icon, #111827);
        }

        button.active {
            font-weight: 700;
        }

        /* Editor area */
        .editor {
            padding: 12px 16px;
            min-height: 144px; /* ≈ 200px mock-up */
            font-size: 14px;
            line-height: 1.55;
            outline: none;
        }

        /* Placeholder – shown when editor is empty */
        .editor:empty::before {
            content: attr(data-placeholder);
            color: var(--wysiwyg-placeholder, #9CA3AF);
        }
    `;

    // ———————————————————————————————————————————————————————  PROPS
    static properties = {
        content: { type: String },
        placeholder: { type: String },
    };

    constructor() {
        super();
        this.content = '';
        this.placeholder = 'Start typing…';
    }

    firstUpdated() {
        // Inject initial content once the component is in the DOM
        const editor = this.#editor;
        if (this.content) editor.innerHTML = this.content;
    }
    
    updated(changedProperties) {
        // Update editor content when content property changes
        if (changedProperties.has('content') && this.#editor) {
            // Only update if the editor content differs from the current property value
            // This prevents infinite loops when the editor itself triggers a content change
            if (this.#editor.innerHTML !== this.content) {
                this.#editor.innerHTML = this.content;
            }
        }
    }

    // —————————————————————————————————————————————————————  GETTERS
    get #editor() {
        return this.renderRoot.querySelector('.editor');
    }

    // ——————————————————————————————————————————————  EVENT HANDLERS
    #handleInput() {
        this.content = this.#editor.innerHTML;
        this.#emitChange();
    }

    #handleCommand(command) {
        this.#editor.focus();
        document.execCommand(command);
        this.#updateToolbarState();
        this.#handleInput();
    }

    // ———————————————————————————————————————————————  HELPERS
    #emitChange() {
        this.dispatchEvent(new CustomEvent('content-changed', {
            detail: { content: this.content },
            bubbles: true,
            composed: true,
        }));
    }

    #updateToolbarState() {
        const states = {
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        };
        Object.entries(states).forEach(([cmd, active]) => {
            const btn = this.renderRoot.querySelector(`button[data-cmd="${cmd}"]`);
            if (btn) btn.classList.toggle('active', active);
        });
    }

    // —————————————————————————————————————————————————————————  RENDER
    render() {
        return html`
      <div class="wrapper">
        <div class="toolbar">
          <!-- Bold -->
          <button data-cmd="bold" title="Bold (Ctrl+B)"
            @click=${() => this.#handleCommand('bold')}><strong>B</strong></button>

          <!-- Italic -->
          <button data-cmd="italic" title="Italic (Ctrl+I)"
            @click=${() => this.#handleCommand('italic')}>/</button>

          <!-- Bullet List -->
          <button data-cmd="insertUnorderedList" title="Bullet list"
            @click=${() => this.#handleCommand('insertUnorderedList')}>≡</button>
        </div>

        <!-- Editable area -->
        <div class="editor"
             contenteditable="true"
             data-placeholder=${this.placeholder}
             @input=${this.#handleInput}
             @keyup=${this.#updateToolbarState}
             @mouseup=${this.#updateToolbarState}></div>
      </div>
    `;
    }
}

customElements.define('wysiwyg-editor', WysiwygEditor);
