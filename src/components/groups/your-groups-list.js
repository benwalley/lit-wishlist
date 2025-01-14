import { LitElement, html, css } from 'lit';
import './group-list-item.js';
import { customFetch } from "../../helpers/fetchHelpers.js";
import buttonStyles from '../../css/buttons.js'
import '../../svg/checkbox-empty.js'
import '../../svg/checkbox-checked.js'

class GroupListComponent extends LitElement {
    static properties = {
        groups: { type: Array },
        apiEndpoint: { type: String },
        selectedGroups: { type: Object }, // Using a Set to manage selected group IDs
    };

    constructor() {
        super();
        this.groups = [];
        this.apiEndpoint = '/groups/current';
        this.selectedGroups = new Set();
    }

    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                }

                .group {
                    border: 1px solid #ccc;
                    padding: 10px;
                    margin: 5px 0;
                    border-radius: 5px;
                }

                .controls {
                    margin-bottom: 10px;
                }
            `,
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchGroups();
    }

    async fetchGroups() {
        try {
            const response = await customFetch(this.apiEndpoint, {}, true);
            // Normally you'd handle errors by checking response.ok, but skipping here
            this.groups = await response;

            // Select all groups by default
            this.selectedGroups = new Set(this.groups.map((g) => g.id));

            // Update the component and emit the new selection once loaded
            this.requestUpdate();
            this._emitSelectedGroupsChanged();
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    }

    /**
     * Dispatch a custom event when the selected groups change.
     */
    _emitSelectedGroupsChanged() {
        this.dispatchEvent(
            new CustomEvent('selected-groups-changed', {
                detail: {
                    selectedGroups: Array.from(this.selectedGroups),
                },
                bubbles: true,  // Set to true if you want the event to bubble up the DOM
                composed: true, // Set to true if you need the event to cross shadow DOM boundaries
            })
        );
    }

    /**
     * Toggle selection for a single group by its ID.
     */
    toggleGroupSelection(groupId) {
        if (this.selectedGroups.has(groupId)) {
            this.selectedGroups.delete(groupId);
        } else {
            this.selectedGroups.add(groupId);
        }

        // Request UI update and emit the new selection
        this.requestUpdate();
        this._emitSelectedGroupsChanged();
    }

    /**
     * Toggle selection for all groups:
     * - If all are selected, clear them.
     * - Otherwise, select them all.
     */
    toggleAllSelection() {
        if (this.selectedGroups.size === this.groups.length) {
            // Deselect all
            this.selectedGroups.clear();
        } else {
            // Select all
            this.groups.forEach((group) => this.selectedGroups.add(group.id));
        }

        // Request UI update and emit the new selection
        this.requestUpdate();
        this._emitSelectedGroupsChanged();
    }

    render() {
        const allSelected = this.selectedGroups.size === this.groups?.length;

        return html`
            <div class="controls">
                <button class="button-as-link select-all-button" @click="${this.toggleAllSelection}">
                    ${allSelected
                            ? html`<checkbox-empty-icon></checkbox-empty-icon>`
                            : html`<checkbox-checked-icon></checkbox-checked-icon>`}

                    ${allSelected ? 'Deselect All Groups' : 'Select All Groups'}
                </button>
            </div>

            ${this.groups?.length
                    ? html`
                        <div>
                            ${this.groups.map(
                                    (group) => html`
                                        <group-list-item
                                                .group=${group}
                                                .isSelected=${this.selectedGroups.has(group.id)}
                                                @click=${() => this.toggleGroupSelection(group.id)}
                                        >
                                        </group-list-item>
                                    `
                            )}
                        </div>
                    `
                    : html`<div>No groups found.</div>`}
        `;
    }
}

customElements.define('your-groups-list', GroupListComponent);
