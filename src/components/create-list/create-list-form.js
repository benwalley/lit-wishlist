import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons.js";
import '../pages/account/avatar.js'
import '../global/custom-input.js'
import '../groups/your-groups-list.js'
import '../../svg/user.js'
import '../../svg/group.js'
import {messagesState} from "../../state/messagesStore.js";
import {customFetch} from "../../helpers/fetchHelpers.js";


export class CreateListForm extends LitElement {
    static properties = {
        listName: {type: String},
        description: {type: String},
        groups: {type: Array},
    };

    constructor() {
        super();
        this.listName = '';
        this.description = '';
        this.groups = [];
    }

    async _handleSubmit(e) {
        e.preventDefault();
        const validationSuccess = this._validateForm();
        if (!validationSuccess) return;
        const formData = {
            listName: this.listName,
            description: this.description,
            visibleToGroups: this.groups
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Send necessary data if any
        }

        console.log('Submitting Form Data:', formData);

        const response = await customFetch('/lists/create', options, true);
        document.dispatchEvent(
            new CustomEvent('fetch-lists', {
                bubbles: true,
                composed: true,
            })
        );
        this._closeModal();

    }

    _closeModal() {
        this.listName = '';
        this.description = '';
        this.groups = [];
        const modal = this.closest('custom-modal');
        if (modal && typeof modal.closeModal === 'function') {
            modal.closeModal();
        }
    }

    _validateForm() {
        const inputs = this.shadowRoot.querySelectorAll('custom-input');
        let allValid = true;

        inputs.forEach((input) => {
            if (!input.validate()) {
                allValid = false;
            }
        });

        if (!allValid) {
            messagesState.addMessage('Please complete all required fields', 'error');
            return false;
        }

        return true;
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                
                h2 {
                    margin-top: 0;
                }

                .top-section {
                    display: grid;
                    gap: var(--spacing-normal);
                    grid-template-columns: 100px 1fr;
                    align-items: flex-end;
                    padding: var(--spacing-normal);
                    padding-top: 0;
                }

               
                
                .groups-section,
                .users-section {
                    padding: var(--spacing-normal);
                    box-sizing: border-box;
                    margin: 0 auto;
                    width: 100%;
                    background: var(--background-color);
                    border-radius: var(--border-radius-normal);
                    border: 1px solid var(--border-color);
                }

                .users-section {
                    --background-base: var(--secondary-color);
                }


                .full-width {
                    grid-column: 1 / span 2;
                }

                .section-heading {
                    margin: 0;
                }

                .section-subheading h3 {
                    margin: 0;
                    display: flex;
                    flex-direction: row;
                    gap: 7px;
                    align-items: center;
                }

                .section-subheading-description {
                    margin: 0;
                    font-size: 0.9em;
                }
                
                .save-button-container {
                    box-sizing: border-box;
                    width: 100%;
                    display: flex;
                }
            `
        ];
    }

    render() {
        return html`
            <form action="" @submit="${this._handleSubmit}">
                <div class="top-section">
                    <h2  class="full-width">Create New List</h2>
                    <custom-avatar size="100" .username="${this.listName}"></custom-avatar>
                    <custom-input placeholder="List Name" 
                                  label="List Name"
                                  required="true"
                                  .value="${this.listName}"
                                  @value-changed="${(e) => this.listName = e.detail.value}"
                    ></custom-input>
                    <custom-input class="full-width" 
                                  label="Description"
                                  .value="${this.description}"
                                  @value-changed="${(e) => this.description = e.detail.value}"
                    ></custom-input>
                </div>
                <div class="groups-section">
                    <div class="full-width section-subheading">
                        <h3>
                            <group-icon style="width: 1em; height: 1em"></group-icon>
                            Select Groups
                        </h3>
                        <em class="full-width section-subheading-description">This list will be visible to anyone who is a part of the seleccted groups</em>
                    </div>

                    <your-groups-list
                            class="full-width"
                            @selection-changed="${this._handleGroupChange}"
                    ></your-groups-list>
                </div>
                <div class="users-section">
                    <div class="full-width section-subheading">
                        <h3>
                            <user-icon style="width: 1em; height: 1em"></user-icon>
                            Select Users
                        </h3>
                        <em class="full-width section-subheading-description">
                            In addition to users in the selected groups, any selected users will be able to see this list.
                        </em>
                    </div>

                    <your-groups-list class="full-width"></your-groups-list>
                </div>

                <div class="save-button-container">
                    <button class="fullWidth primary save-button">Save List</button>
                </div>
            </form>
        `;
    }

    _handleGroupChange(e) {
        console.log(e.detail.selectedGroups)
        this.groups = e.detail.selectedGroups;
    }
}

customElements.define('create-list-form', CreateListForm);
