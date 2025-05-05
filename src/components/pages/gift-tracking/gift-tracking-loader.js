import {LitElement, html, css} from 'lit';
import '../../loading/skeleton-loader.js';

export class GiftTrackingLoader extends LitElement {
    static get styles() {
        return [
            css`
                :host {
                    display: block;
                    width: 100%;
                }
                
                .loader-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                
                .group-loader {
                    background-color: var(--color-background-secondary);
                    border-radius: var(--border-radius-normal);
                    overflow: hidden;
                }
                
                .group-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-small) var(--spacing-normal);
                    background-color: var(--color-background-tertiary);
                }
                
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-small);
                }
                
                .rows-container {
                    display: grid;
                    gap: 1px;
                    background-color: var(--color-border);
                }
                
                .loader-row {
                    display: grid;
                    grid-template-columns: 40px 2fr 80px 80px 40px;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-small);
                    align-items: center;
                    background-color: var(--color-background-secondary);
                }
                
                .small-loader {
                    height: 16px;
                }
                
                .medium-loader {
                    height: 20px;
                }
                
                .image-loader {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--border-radius-normal);
                }
                
                @media (max-width: 768px) {
                    .loader-row {
                        grid-template-columns: 40px 3fr 70px 30px;
                    }
                }
            `
        ];
    }

    render() {
        // Create 2 group loaders
        return html`
            <div class="loader-container">
                ${[1, 2].map((groupIndex) => html`
                    <div class="group-loader">
                        <div class="group-header">
                            <div class="header-left">
                                <skeleton-loader class="medium-loader" style="width: 100px;"></skeleton-loader>
                                <skeleton-loader class="small-loader" style="width: 25px; border-radius: 99px;"></skeleton-loader>
                            </div>
                            <skeleton-loader class="small-loader" style="width: 16px; height: 16px;"></skeleton-loader>
                        </div>
                        <div class="rows-container">
                            ${[1, 2, 3].map(() => html`
                                <div class="loader-row">
                                    <skeleton-loader class="image-loader"></skeleton-loader>
                                    <div>
                                        <skeleton-loader class="medium-loader" style="width: 80%;"></skeleton-loader>
                                        <skeleton-loader class="small-loader" style="width: 50%;"></skeleton-loader>
                                    </div>
                                    <skeleton-loader class="small-loader" style="width: 90%;"></skeleton-loader>
                                    <skeleton-loader class="small-loader" style="width: 80%;"></skeleton-loader>
                                    <skeleton-loader class="small-loader" style="width: 100%;"></skeleton-loader>
                                </div>
                            `)}
                        </div>
                    </div>
                `)}
            </div>
        `;
    }
}
customElements.define('gift-tracking-loader', GiftTrackingLoader);
