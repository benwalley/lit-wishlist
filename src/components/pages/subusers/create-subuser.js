import { LitElement, html, css } from 'lit';
import { observeState } from 'lit-element-state';
import { createSubuser } from '../../../helpers/api/subusers.js';
import { messagesState } from '../../../state/messagesStore.js';
import { triggerUpdateUser } from '../../../events/eventListeners.js';
import '../../global/custom-input.js';
import buttonStyles from '../../../css/buttons.js';

class CreateSubuser extends observeState(LitElement) {
    static get properties() {
        return {
            username: { type: String },
            password: { type: String },
            confirmPassword: { type: String },
            loading: { type: Boolean }
        };
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                }

                .create-subuser-container {
                    background: var(--background-light);
                    border-radius: var(--border-radius-large);
                    border: 1px solid var(--border-color);
                    overflow: hidden;
                }

                .create-subuser-header {
                    padding: 20px 24px;
                    background: var(--header-background);
                    border-bottom: 1px solid var(--border-color);
                }

                .create-subuser-title {
                    font-size: var(--font-size-large);
                    font-weight: 600;
                    color: var(--text-color-dark);
                    margin: 0;
                }

                .create-subuser-subtext {
                    font-size: var(--font-size-small);
                    color: var(--text-color-medium-dark);
                    margin: var(--spacing-x-small) 0 0 0;
                    line-height: 1.4;
                }

                .create-subuser-form {
                    padding: 24px;
                }

                .form-grid {
                    display: grid;
                    gap: 20px;
                    margin-bottom: 24px;
                }

                @media (min-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-label {
                    font-weight: 600;
                    color: var(--text-color-dark);
                    font-size: var(--font-size-small);
                }

                .form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .description {
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-small);
                    margin-bottom: 20px;
                    line-height: 1.5;
                }
            `
        ];
    }

    constructor() {
        super();
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.loading = false;
    }

    handleUsernameChange(e) {
        this.username = e.detail.value;
    }

    handlePasswordChange(e) {
        this.password = e.detail.value;
    }

    handleConfirmPasswordChange(e) {
        this.confirmPassword = e.detail.value;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.username.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
            messagesState.addMessage('Please fill in all fields', 'error');
            return;
        }

        if (this.password !== this.confirmPassword) {
            messagesState.addMessage('Passwords do not match', 'error');
            return;
        }

        this.loading = true;

        const response = await createSubuser({
            username: this.username.trim(),
            password: this.password
        });

        if (response.success) {
            messagesState.addMessage('Subuser created successfully', 'success');
            this.username = '';
            this.password = '';
            this.confirmPassword = '';
            triggerUpdateUser();
        } else {
            messagesState.addMessage(response.error || 'Failed to create subuser', 'error');
        }

        this.loading = false;
    }

    handleClear() {
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
    }

    render() {
        return html`
            <div class="create-subuser-container">
                <div class="create-subuser-header">
                    <h3 class="create-subuser-title">Create New Subuser</h3>
                    <p class="create-subuser-subtext">You must create a password for the subuser. They can log in using this password or you can log in through your parent account.</p>
                </div>
                
                <div class="create-subuser-form">
                    <form @submit="${this.handleSubmit}">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Username</label>
                                <custom-input
                                    .value="${this.username}"
                                    @value-changed="${this.handleUsernameChange}"
                                    placeholder="Enter username"
                                    required
                                ></custom-input>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <custom-input
                                    .value="${this.password}"
                                    @value-changed="${this.handlePasswordChange}"
                                    placeholder="Enter password"
                                    type="password"
                                    required
                                ></custom-input>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Confirm Password</label>
                                <custom-input
                                    .value="${this.confirmPassword}"
                                    @value-changed="${this.handleConfirmPasswordChange}"
                                    placeholder="Confirm password"
                                    type="password"
                                    required
                                ></custom-input>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button 
                                type="button" 
                                class="button secondary"
                                @click="${this.handleClear}"
                                ?disabled="${this.loading}"
                            >
                                Clear
                            </button>
                            <button 
                                type="submit" 
                                class="button primary"
                                ?disabled="${this.loading}"
                            >
                                ${this.loading ? 'Creating...' : 'Create Subuser'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}

customElements.define('create-subuser', CreateSubuser);
