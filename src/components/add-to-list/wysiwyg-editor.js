import { LitElement, html, css } from 'lit';

class WysiwygEditor extends LitElement {
    static styles = css`
        .editor-toolbar {
            border: 1px solid #ccc;
            padding: 5px;
            display: flex;
            gap: 5px;
        }

        .editor {
            border: 1px solid #ccc;
            min-height: 200px;
            padding: 10px;
            margin-top: 5px;
            font-family: Arial, sans-serif;
            outline: none;
        }

        button {
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid transparent;
        }

        button.active {
            border: 1px solid #000;
            background-color: #ddd;
        }
    `;

    static properties = {
        content: { type: String },
    };

    constructor() {
        super();
        this.content = '<p>Start editing here...</p>';
    }

    firstUpdated() {
        // Set the initial content after the component is added to the DOM
        const editor = this.renderRoot.querySelector('.editor');
        editor.innerHTML = this.content;
    }

    updateContent() {
        const editor = this.renderRoot.querySelector('.editor');
        this.content = editor.innerHTML;

        // Dispatch the content-changed event to notify the parent
        this.dispatchEvent(
            new CustomEvent('content-changed', {
                detail: { content: this.content },
            })
        );
        this.updateToolbarState();
    }

    handleCommand(command, value = null) {
        const editor = this.renderRoot.querySelector('.editor');
        editor.focus();
        document.execCommand(command, false, value);
        this.updateContent();
    }

    updateToolbarState() {
        const boldActive = document.queryCommandState('bold');
        const italicActive = document.queryCommandState('italic');
        const bulletListActive = document.queryCommandState('insertUnorderedList');
        const numberedListActive = document.queryCommandState('insertOrderedList');

        this.updateButtonState('bold', boldActive);
        this.updateButtonState('italic', italicActive);
        this.updateButtonState('insertUnorderedList', bulletListActive);
        this.updateButtonState('insertOrderedList', numberedListActive);
    }

    updateButtonState(command, isActive) {
        const button = this.renderRoot.querySelector(`button[data-command="${command}"]`);
        if (button) {
            button.classList.toggle('active', isActive);
        }
    }

    render() {
        return html`
      <div class="editor-toolbar">
        <button data-command="bold" @click="${() => this.handleCommand('bold')}">Bold</button>
        <button data-command="italic" @click="${() => this.handleCommand('italic')}">Italic</button>
        <button data-command="insertUnorderedList" @click="${() => this.handleCommand('insertUnorderedList')}">Bullet List</button>
        <button data-command="insertOrderedList" @click="${() => this.handleCommand('insertOrderedList')}">Numbered List</button>
      </div>
      <div
        class="editor"
        contenteditable="true"
        @input="${this.updateContent}"
        @keyup="${this.updateToolbarState}"
        @mouseup="${this.updateToolbarState}"
      ></div>
    `;
    }
}

customElements.define('wysiwyg-editor', WysiwygEditor);
