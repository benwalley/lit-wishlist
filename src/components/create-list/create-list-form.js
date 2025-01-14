import {LitElement, html, css} from 'lit';
import buttonStyles from "../../css/buttons.js";
import '../pages/account/avatar.js'
import '../global/custom-input.js'
import '../groups/your-groups-list.js'
import '../../svg/user.js'
import '../../svg/group.js'


export class CreateListForm extends LitElement {
    static properties = {
        name: {type: String},
        description: {type: String},
        groups: {type: Array},
    };

    constructor() {
        super();
        this.name = '';
        this.description = '';
        this.groups = [];
    }
    static get styles() {
        return [
            buttonStyles,
            css`
                form {

                }

                .top-section {
                    display: grid;
                    gap: var(--spacing-normal);
                    grid-template-columns: 100px 1fr;
                    align-items: flex-end;
                    padding: var(--spacing-normal)
                }

                .groups-section {
                    padding: var(--spacing-normal);
                    background: light-dark(var(--lavender-300), var(--lavender-900))
                }

                .users-section {
                    padding: var(--spacing-normal);
                    background: light-dark(var(--mint-200), var(--mint-900))
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
            `
        ];
    }

    render() {
        return html`
            <form action="">
                <div class="top-section">
                    <h2  class="full-width">Create New List</h2>
                    <custom-avatar size="100" .username="${this.name}"></custom-avatar>
                    <custom-input placeholder="List Name" 
                                  label="List Name"
                                  .value="${this.name}"
                                  @value-changed="${(e) => this.name = e.detail.value}"
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
                            @selected-groups-changed="${this._handleGroupChange}"
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

                
                <button class="full-width">Save List</button>
            </form>
        `;
    }

    _handleGroupChange(e) {
        console.log(e.detail.selectedGroups)
        this.groups = e.detail.selectedGroups;
    }
}

customElements.define('create-list-form', CreateListForm);
