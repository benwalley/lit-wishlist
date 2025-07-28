import {LitElement, html, css} from 'lit';
import {userState} from '../../../state/userStore.js';
import {observeState} from 'lit-element-state';
import {messagesState} from '../../../state/messagesStore.js';
import {saveNote} from '../../../helpers/api/users.js';
import buttonStyles from '../../../css/buttons.js';
import '../../add-to-list/wysiwyg-editor.js';
import {listenInitialUserLoaded} from "../../../events/eventListeners.js";

export class AccountPrivateNotes extends observeState(LitElement) {
    static get properties() {
        return {
            isEditing: {type: Boolean},
            notes: {type: String},
            originalNotes: {type: String},
            isSaving: {type: Boolean}
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }

                h2 {
                    margin: 0;
                    padding: var(--spacing-small) 0;
                }
                
                p {
                    margin-top: 0;
                    font-style: italic;
                    color: var(--text-color-medium-dark);
                }
                
                .editor-container {
                    margin-top: 1rem;
                }
                
                .button-group {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                .notes-display {
                    background: var(--background-dark);
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 1rem;
                    min-height: 100px;
                    margin-top: 1rem;
                }
                
                .notes-display:empty::before {
                    content: "No notes yet. Click Edit to add some.";
                    color: #6c757d;
                    font-style: italic;
                }
                
                .edit-button {
                    margin-top: 1rem;
                }
            `
        ];
    }

    constructor() {
        super();
        this.isEditing = false;
        this.notes = '';
        this.originalNotes = '';
        this.isSaving = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadNotes();
        listenInitialUserLoaded(() => this.loadNotes())
    }

    loadNotes() {
        const userData = userState.userData;
        if (userData && userData.notes) {
            this.notes = userData.notes;
            this.originalNotes = userData.notes;
        }
    }

    startEditing() {
        this.isEditing = true;
        this.originalNotes = this.notes;
    }

    cancelEditing() {
        this.isEditing = false;
        this.notes = this.originalNotes;
    }

    async saveNotes() {
        this.isSaving = true;

        try {
            const response = await saveNote(this.notes);

            if (response.success) {
                userState.userData = {...userState.userData, notes: this.notes};
                this.originalNotes = this.notes;
                this.isEditing = false;
                messagesState.addMessage('Private notes saved successfully');
            } else {
                messagesState.addMessage('Error saving notes: ' + (response.message || 'Unknown error'));
            }
        } catch (error) {
            messagesState.addMessage('Error saving notes: ' + error.message);
        } finally {
            this.isSaving = false;
        }
    }

    handleContentChanged(e) {
        this.notes = e.detail.content;
    }

    render() {
        return html`
            <h2>Private Notes</h2>
            <p>Only you can see these notes.</p>
            
            ${this.isEditing ? html`
                <div class="editor-container">
                    <wysiwyg-editor
                        .content="${this.notes}"
                        placeholder="Add your private notes here..."
                        @content-changed="${this.handleContentChanged}"
                    ></wysiwyg-editor>
                    
                    <div class="button-group">
                        <button 
                            class="button primary" 
                            @click="${this.saveNotes}"
                            ?disabled="${this.isSaving}"
                        >
                            ${this.isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                            class="button secondary" 
                            @click="${this.cancelEditing}"
                            ?disabled="${this.isSaving}"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ` : html`
                <div class="notes-display" .innerHTML="${this.notes}"></div>
                <button class="button primary edit-button" @click="${this.startEditing}">
                    Edit Notes
                </button>
            `}
        `;
    }
}

customElements.define('account-private-notes', AccountPrivateNotes);
