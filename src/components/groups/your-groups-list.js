import { LitElement, html, css } from 'lit';
import './group-list-item.js';
import { customFetch } from "../../helpers/fetchHelpers.js";
import { createGroup } from "../../helpers/api/groups.js";

class GroupListComponent extends LitElement {
    static properties = {
        groups: { type: Array },
        apiEndpoint: { type: String },
        selectedGroups: { type: Object },
    };

    constructor() {
        super();
        this.groups = [];
        this.apiEndpoint = '/groups/current';
        this.selectedGroups = new Set();
    }

    static styles = css`
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
    `;

    connectedCallback() {
        super.connectedCallback();
        this.fetchGroups();
    }

    async fetchGroups() {
        try {
            const response = await customFetch(this.apiEndpoint, {}, true);
            if (false) {
                throw new Error(`Failed to fetch groups: ${response.statusText}`);
            }
            this.groups = await response;
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    }

    toggleGroupSelection(groupId) {
        if (this.selectedGroups.has(groupId)) {
            this.selectedGroups.delete(groupId);
        } else {
            this.selectedGroups.add(groupId);
        }
        this.requestUpdate();
    }

    render() {
        return this.groups?.length ? html`
            <div>
                ${this.groups && this.groups.map(
                        group => html`
                            <group-list-item
                                    .group=${group}
                                    .isSelected=${this.selectedGroups.has(group.id)}
                                    @click=${() => this.toggleGroupSelection(group.id)}>
                            </group-list-item>
                        `
                )}
            </div>
        ` : html`<div>No groups found.</div>`;
    }
}

customElements.define('your-groups-list', GroupListComponent);
