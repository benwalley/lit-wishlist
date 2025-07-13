import { LitElement, html, css } from 'lit';
import './group-list-item.js';
import '../../svg/check.js';
import buttonStyles from '../../css/buttons.js'
import helperStyles from '../../css/helpers.js'
import {cachedFetch} from "../../helpers/caching.js";
import {observeState} from "lit-element-state";
import {userState} from "../../state/userStore.js";
import {listenInitialUserLoaded} from "../../events/eventListeners.js";

class GroupListComponent extends observeState(LitElement) {
    static properties = {
        groups: { type: Array },
        apiEndpoint: { type: String },
        selectedGroups: { type: Array },
        loading: { type: Boolean },
    };

    constructor() {
        super();
        this.groups = [];
        this.apiEndpoint = '/groups/current';
        this.selectedGroups = []; // Using an array for selected groups
        this.loading = true;
    }

    static get styles() {
        return [
            buttonStyles,
            helperStyles,
            css`
                :host {
                    display: block;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-x-small);
                }

                .title {
                    font-weight: bold;
                    font-size: var(--font-size-small);
                    color: var(--text-color-dark);
                }

                .selection-info {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-x-small);
                }

                .selected-count {
                    font-size: var(--font-size-x-small);
                    color: var(--primary-color);
                    font-weight: bold;
                }

                .action-buttons {
                    display: flex;
                    gap: var(--spacing-x-small);
                }

                button {
                    border: none;
                    background: none;
                    padding: var(--spacing-x-small) var(--spacing-small);
                    border-radius: var(--border-radius-small);
                    font-size: var(--font-size-x-small);
                    cursor: pointer;
                    transition: var(--transition-normal);
                }

                .select-all {
                    color: var(--primary-color);
                }

                .select-all:hover {
                    background-color: var(--purple-light);
                }

                .clear {
                    color: var(--text-color-medium-dark);
                }

                .clear:hover {
                    background-color: var(--grayscale-150);
                }

                .groups-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-x-small);
                    max-height: 250px;
                    overflow-y: auto;
                    padding: var(--spacing-x-small);
                }

                .groups-container::-webkit-scrollbar {
                    width: 8px;
                }

                .groups-container::-webkit-scrollbar-track {
                    background: var(--background-color);
                    border-radius: 4px;
                }

                .groups-container::-webkit-scrollbar-thumb {
                    background: var(--grayscale-300);
                    border-radius: 4px;
                }

                .groups-container::-webkit-scrollbar-thumb:hover {
                    background: var(--grayscale-400);
                }

                .empty-state {
                    padding: var(--spacing-normal);
                    text-align: center;
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-small);
                }

                .loading {
                    padding: var(--spacing-small);
                    text-align: center;
                    color: var(--text-color-medium-dark);
                    font-size: var(--font-size-small);
                }
            `
        ];
    }

    connectedCallback() {
        super.connectedCallback();

        // Only fetch data if user is authenticated
        if (userState.userData?.id) {
            this.fetchGroups();
        } else {
            this.loading = false; // Stop loading state
        }

        // Bind methods
        this.toggleGroupSelection = this.toggleGroupSelection.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.clearSelection = this.clearSelection.bind(this);

        this.addEventListener('group-selected', this._handleGroupSelected);

        listenInitialUserLoaded(() => this.fetchGroups())
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('group-selected', this._handleGroupSelected);
    }

    async fetchGroups() {
        // Don't fetch if user is not authenticated
        if (!userState.userData?.id) {
            this.loading = false;
            return;
        }

        try {
            this.loading = true;
            const response = await cachedFetch(this.apiEndpoint, {}, true);
            this.groups = await response;

            // Optionally select all groups by default
            // this.selectedGroups = this.groups.filter(g => g && g.id).map(g => g.id);

            this._dispatchSelectionChangedEvent();
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            this.loading = false;
        }
    }

    _handleGroupSelected(e) {
        if (!e || !e.detail || !e.detail.group || !e.detail.group.id) {
            console.error('Invalid group selection event', e);
            return;
        }

        const groupId = e.detail.group.id;
        this.toggleGroupSelection(groupId);
    }

    toggleGroupSelection(groupId) {
        // Toggle selection using array methods
        if (this.selectedGroups.includes(groupId)) {
            this.selectedGroups = this.selectedGroups.filter(id => id !== groupId);
        } else {
            this.selectedGroups = [...this.selectedGroups, groupId];
        }

        this._dispatchSelectionChangedEvent();
    }

    selectAll() {
        // Set selectedGroups to all group IDs
        this.selectedGroups = this.groups
            .filter(group => group && group.id)
            .map(group => group.id);
        this._dispatchSelectionChangedEvent();
    }

    clearSelection() {
        this.selectedGroups = [];
        this._dispatchSelectionChangedEvent();
    }

    _dispatchSelectionChangedEvent() {
        const selectedGroups = this.selectedGroups
            .map(id => this.groups.find(group => group && group.id === id))
            .filter(Boolean);

        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: {
                selectedGroups,
                count: this.selectedGroups.length
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        if (this.loading) {
            return html`
                <div class="loading">Loading groups...</div>
            `;
        }

        if (!this.groups || this.groups.length === 0) {
            return html`
                <div class="empty-state">No groups found</div>
            `;
        }

        return html`
            <div class="header">
                <div class="selection-info">
                    <div class="title">Groups</div>
                    ${this.selectedGroups.length > 0 ? html`
                        <div class="selected-count">(${this.selectedGroups.length} selected)</div>
                    ` : ''}
                </div>

                <div class="action-buttons">
                    ${this.groups.length > 0 ? html`
                        <button class="select-all" @click=${this.selectAll}>Select All</button>
                    ` : ''}

                    ${this.selectedGroups.length > 0 ? html`
                        <button class="clear" @click=${this.clearSelection}>Clear</button>
                    ` : ''}
                </div>
            </div>

            <div class="groups-container">
                ${this.groups.map(item => html`
                    <group-list-item
                            .group="${item}"
                            ?isSelected=${item && item.id && this.selectedGroups.includes(item.id)}
                    ></group-list-item>
                `)}
            </div>
        `;
    }
}

customElements.define('your-groups-list', GroupListComponent);
