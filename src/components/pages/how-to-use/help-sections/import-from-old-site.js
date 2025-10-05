import { LitElement, html, css } from 'lit';
import exportListImage from '../../../../assets/export-list.jpg';
import uploadCsvImage from '../../../../assets/upload-csv.jpg';
import importItemsImage from '../../../../assets/import-items.jpg';

export class ImportFromOldSiteHelp extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
            }

            .help-section {
                margin-bottom: var(--spacing-large);
            }

            .help-section:last-child {
                margin-bottom: 0;
            }

            .section-title {
                font-size: var(--font-size-medium);
                font-weight: 600;
                color: var(--text-color-dark);
                margin: 0 0 var(--spacing-normal) 0;
                border-bottom: 2px solid var(--purple-light);
                padding-bottom: var(--spacing-small);
            }

            .help-content {
                line-height: 1.6;
                color: var(--text-color-medium-dark);
            }

            .help-content p {
                margin: 0 0 var(--spacing-normal) 0;
            }

            .help-content p:last-child {
                margin-bottom: 0;
            }

            .step-list {
                list-style: none;
                padding: 0;
                margin: var(--spacing-normal) 0;
                counter-reset: step-counter;
            }

            .step-list li {
                padding: var(--spacing-normal) 0;
                padding-left: var(--spacing-large);
                position: relative;
                counter-increment: step-counter;
            }

            .step-list li::before {
                content: counter(step-counter);
                background: var(--primary-color);
                color: white;
                font-weight: bold;
                position: absolute;
                left: 0;
                top: var(--spacing-normal);
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-small);
            }

            .help-link {
                color: var(--primary-color);
                text-decoration: none;
                font-weight: 500;
            }

            .help-link:hover {
                text-decoration: underline;
            }

            .screenshot-placeholder {
                background: var(--background-medium);
                border: 2px dashed var(--border-color);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-x-large);
                margin: var(--spacing-normal) 0;
                text-align: center;
                color: var(--text-color-medium);
                font-style: italic;
            }

            .tip-box {
                background: var(--blue-light);
                border: 1px solid var(--blue-normal);
                border-radius: var(--border-radius-normal);
                padding: var(--spacing-normal);
                margin: var(--spacing-normal) 0;
            }

            .tip-box .tip-title {
                font-weight: 600;
                color: var(--blue-darker);
                margin: 0 0 var(--spacing-small) 0;
            }

            .tip-box p {
                margin: 0;
                color: var(--text-color-dark);
            }

            .demo-image {
                width: 100%;
                max-width: 500px;
                height: auto;
                border-radius: var(--border-radius-normal);
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-1-soft);
                margin: var(--spacing-normal) 0;
                display: block;
            }

            .image-caption {
                font-size: var(--font-size-small);
                color: var(--text-color-medium-dark);
                font-style: italic;
                margin: var(--spacing-x-small) 0 0 0;
            }
        `;
    }

    render() {
        return html`
            <div class="help-section">
                <h2 class="section-title">Import Your Wishlist from the Old Site</h2>
                <div class="help-content">
                    <p>If you're migrating from the previous wishlist site, you can easily export your data and import it here. Follow these simple steps:</p>
                </div>
            </div>

            <div class="help-section">
                <h2 class="section-title">Step-by-Step Instructions</h2>
                <div class="help-content">
                    <ol class="step-list">
                        <li>
                            <strong>Export from the old site:</strong><br>
                            Go to the old wishlist site and locate the export feature. Select all the lists to export, and click the export button to download your wishlist data as a CSV file.
                            <img src="${exportListImage}" alt="Export list from old site" class="demo-image" loading="lazy">
                            <p class="image-caption">Click the export button on the old site to download your wishlist.</p>
                        </li>
                        <li>
                            <strong>Navigate to Import page:</strong><br>
                            On this site, go to the <a href="/import" class="help-link">Import Wishlist</a> page and selector your CSV file. Then click Process CSV file.
                            <img src="${uploadCsvImage}" alt="Upload CSV file" class="demo-image" loading="lazy">
                            <p class="image-caption">Click "Import from CSV" on the Import Wishlist page.</p>
                        </li>
                        <li>
                            <strong>Import from CSV:</strong><br>
                            Once the items are processed, select the items you want to import, select the list(s) to add them to, edit the item names, publicity, and priority as necessary, and click Import Items.
                            <img src="${importItemsImage}" alt="Import items preview" class="demo-image" loading="lazy">
                            <p class="image-caption">Select the items you want to import and choose your destination list.</p>
                        </li>
                        <li>
                            <strong>Review and confirm:</strong><br>
                            Your items will be imported into your wishlist. Review them to make sure everything looks correct.
                        </li>
                    </ol>

                    <div class="tip-box">
                        <div class="tip-title">💡 Tip</div>
                        <p>Make sure to export all your data from the old site before it becomes unavailable. You can import multiple CSV files if needed.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('import-from-old-site-help', ImportFromOldSiteHelp);
