import {LitElement, html, css} from 'lit';
import '../../../svg/ordered.js';
import '../../../svg/arrived.js';
import '../../../svg/wrapped.js';
import '../../../svg/given.js';
import formStyles from '../../../css/forms.js'
import {customFetch} from '../../../helpers/fetchHelpers.js';
import {messagesState} from '../../../state/messagesStore.js';

export class TrackingStatus extends LitElement {
    static properties = {
        itemId: {type: String},
        selected: {type: String},
        loading: {type: Boolean}
    };

    constructor() {
        super();
        this.itemId = '';
        this.selected = '';
        this.loading = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchStatus();
    }

    async fetchStatus() {
        if (!this.itemId) return;

        try {
            // In the future, this would fetch from an API endpoint
            // For now, it's just a mock - we'll simulate getting data

            // Placeholder for API call
            // const response = await customFetch(`/tracking/${this.itemId}`, {}, true);
            // if (response.success && response.data?.status) {
            //    this.selected = response.data.status;
            // }
        } catch (error) {
            console.error('Error fetching tracking status:', error);
        }
    }

    async handleStatusChange(e) {
        if (this.loading) return;

        const newStatus = e.target.value;
        if (this.selected === newStatus) return;

        this.loading = true;

        try {
            const oldStatus = this.selected;
            this.selected = newStatus;

            // Force update of the select class
            this.requestUpdate();

            // In the future: Save to API
            // const response = await customFetch(`/tracking/${this.itemId}`, {
            //    method: 'PUT',
            //    headers: { 'Content-Type': 'application/json' },
            //    body: JSON.stringify({ status: newStatus }),
            // }, true);

            // if (!response.success) {
            //    this.selected = oldStatus; // Revert if API call fails
            //    throw new Error('Failed to update status');
            // }

            const statusNames = {
                '': 'Not started',
                'ordered': 'Ordered',
                'arrived': 'Arrived',
                'wrapped': 'Wrapped',
                'given': 'Given'
            };

            const statusName = statusNames[newStatus] || 'Not started';
            messagesState.addMessage(`Item status updated to ${statusName.toLowerCase()}`);

        } catch (error) {
            messagesState.addMessage('Failed to update tracking status', 'error');
            console.error('Error updating tracking status:', error);
        } finally {
            this.loading = false;
        }
    }

    static get styles() {
        return [
            formStyles,
            css`
                :host {
                    display: inline-block;
                }

                select {
                    appearance: none;
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius-normal);
                    padding: 3px 10px;
                    padding-right: 30px;
                    font-size: var(--font-size-small);
                    font-family: inherit;
                    color: var(--text-color-dark);
                    cursor: pointer;
                    min-width: 140px;
                    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 8px center;
                    background-size: 16px;
                    transition: var(--transition-200);
                }


                .loading {
                    opacity: 0.7;
                    pointer-events: none;
                }

                /* Option styles - these only work in some browsers */
                option {
                    padding: 8px;
                }

                /* Status-specific backgrounds */
                .status-not-started {
                    background-color: var(--delete-red-light);
                    color: var(--delete-red);
                    border-color: var(--delete-red);
                }

                .status-ordered {
                    background-color: var(--purple-light);
                    color: var(--purple-normal);
                    border-color: var(--purple-normal);
                }

                .status-arrived {
                    background-color: var(--info-yellow-light);
                    color: var(--info-yellow);
                    border-color: var(--info-yellow);
                }

                .status-wrapped {
                    background-color: var(--blue-light);
                    color: var(--blue-normal);
                    border-color: var(--blue-normal);
                }

                .status-given {
                    background-color: var(--green-light);
                    color: var(--green-normal);
                    border-color: var(--green-normal);
                }

                /* Status-specific option colors */
                .not-started {
                    color: var(--grayscale-400);
                }

                .ordered {
                    color: var(--green-normal);
                }

                .arrived {
                    color: var(--info-yellow);
                }

                .wrapped {
                    color: var(--blue-normal);
                }

                .given {
                    color: var(--purple-normal);
                }
            `
        ];
    }

    getStatusClass() {
        const statusMap = {
            '': 'status-not-started',
            'ordered': 'status-ordered',
            'arrived': 'status-arrived',
            'wrapped': 'status-wrapped',
            'given': 'status-given'
        };

        return statusMap[this.selected] || 'status-not-started';
    }

    render() {
        return html`
            <div class="${this.loading ? 'loading' : ''}">
              
            </div>
        `;
    }
}

customElements.define('tracking-status', TrackingStatus);
