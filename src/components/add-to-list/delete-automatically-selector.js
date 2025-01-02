import {LitElement, html, css} from 'lit';

class DeleteAutomaticallySelector extends LitElement {
    static styles = css`
        :host {
            display: block;
            font-family: Arial, sans-serif;
        }

        h3 {
            margin: 0 0 10px;
        }

        input[type="date"] {
            padding: 5px;
            font-size: 1em;
        }
    `;

    constructor() {
        super();
        this.defaultDate = this.calculateDefaultDate();
    }

    calculateDefaultDate() {
        const today = new Date();
        const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
        return nextYear.toISOString().split('T')[0];
    }

    render() {
        return html`
            <div style="position: relative; display: flex; flex-direction: column;">
                <h3 style="margin-right: auto;">Delete automatically?</h3>
                <custom-tooltip>You will always be able to see your deleted items on your account page, under Deleted
                    Items.
                </custom-tooltip>
                <input type="date" .value="${this.defaultDate}"/>
            </div>
        `;
    }
}

customElements.define('delete-automatically-selector', DeleteAutomaticallySelector);
