import { LitElement, html, css } from 'lit';
import './group-list-item.js';
import { customFetch } from "../../helpers/fetchHelpers.js";
import '../../svg/check.js';

class GroupListComponent extends LitElement {
    static properties = {
        groups: { type: Array },
        apiEndpoint: { type: String },
        selectedGroups: { type: Object },
        loading: { type: Boolean },
    };

    constructor() {
        super();
        this.groups = [];
        this.apiEndpoint = '/groups/current';
        this.selectedGroups = new Set();
        this.loading = true;
    }

    static styles = css`
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
            max-height: 300px;
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
    `;

    connectedCallback() {
        super.connectedCallback();
        this.fetchGroups();

        // Bind methods
        this.toggleGroupSelection = this.toggleGroupSelection.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.clearSelection = this.clearSelection.bind(this);

        this.addEventListener('group-selected', this._handleGroupSelected);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('group-selected', this._handleGroupSelected);
    }

    async fetchGroups() {
        try {
            this.loading = true;
            const response = await customFetch(this.apiEndpoint, {}, true);
            this.groups = await response;

            // Select all groups by default (optional, can be removed)
            // this.selectedGroups = new Set(this.groups.map(g => g.id));

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
        // Toggle selection status
        if (this.selectedGroups.has(groupId)) {
            this.selectedGroups.delete(groupId);
        } else {
            this.selectedGroups.add(groupId);
        }

        this._dispatchSelectionChangedEvent();
        this.requestUpdate();
    }

    selectAll() {
        // Add all group IDs to the selection
        this.groups.forEach(group => {
            if (group && group.id) {
                this.selectedGroups.add(group.id);
            }
        });
        this._dispatchSelectionChangedEvent();
        this.requestUpdate();
    }

    clearSelection() {
        this.selectedGroups.clear();
        this._dispatchSelectionChangedEvent();
        this.requestUpdate();
    }

    _dispatchSelectionChangedEvent() {
        const selectedGroups = Array.from(this.selectedGroups)
            .map(id => this.groups.find(group => group && group.id === id))
            .filter(Boolean);

        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: {
                selectedGroups,
                count: this.selectedGroups.size
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
                    ${this.selectedGroups.size > 0 ? html`
                        <div class="selected-count">(${this.selectedGroups.size} selected)</div>
                    ` : ''}
                </div>
                
                <div class="action-buttons">
                    ${this.groups.length > 0 ? html`
                        <button class="select-all" @click=${this.selectAll}>Select All</button>
                    ` : ''}
                    
                    ${this.selectedGroups.size > 0 ? html`
                        <button class="clear" @click=${this.clearSelection}>Clear</button>
                    ` : ''}
                </div>
            </div>
            
            <div class="groups-container">
                ${this.groups.map(item => html`
                    <group-list-item 
                        .group="${item}" 
                        ?isSelected=${item && item.id && this.selectedGroups.has(item.id)}
                    ></group-list-item>
                `)}
            </div>
        `;
    }
}

customElements.define('your-groups-list', GroupListComponent);
