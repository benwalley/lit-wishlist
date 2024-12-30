import {LitElement, html, css} from 'lit';
import '../global/messages-component.js'
import '../add-to-list/add-to-list-button.js'
import '../add-to-list/add-to-list-modal.js'

export class FooterContainer extends LitElement {
    static styles = css`
        :host {
            display: block;
            font-family: sans-serif;
        }

        footer {
            background-color: var(--footer-background-color);
            padding: 1.5rem;
            border-top: 1px solid #ddd;
        }

        /* Container for the columns */
        .footer-columns {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }

        /* Each column is just an unordered list in this example */
        .footer-column {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .footer-column li {
            margin: 0.5rem 0;
        }

        a {
            color: var(--text-color-dark);
            transition: color 0.2s ease;
            text-decoration: none;

            &:hover,
            &:focus,
            &:active {
                text-decoration: none;
                color: var(--secondary-color)
            }
        }
        

        /* Optional heading for each column (if you decide to use column titles) */
        .column-title {
            font-weight: bold;
            margin-bottom: 0.75rem;
            color: var(--text-color-dark);
        }

        /* Copyright section */
        .footer-copyright {
            margin-top: 1rem;
            text-align: center;
            font-size: 0.9rem;
            color: var(--text-color-dark);
        }

        /* Responsive adjustments (optional) */
        @media (max-width: 768px) {
            .footer-columns {
                grid-template-columns: 1fr 1fr;
            }
        }

        @media (max-width: 480px) {
            .footer-columns {
                grid-template-columns: 1fr;
            }
        }
    `;

    render() {
        return html`
            <footer>
                <div class="footer-columns">
                    <!-- Column 1 -->
                    <ul class="footer-column">
                        <li class="column-title">Account & Users</li>
                        <li><a href="/accounts">Account</a></li>
                        <li><a href="/subusers">Sub-users</a></li>
                        <li><a href="/groups">Groups</a></li>
                    </ul>

                    <!-- Column 2 -->
                    <ul class="footer-column">
                        <li class="column-title">Lists & More</li>
                        <li><a href="/lists">All lists</a></li>
                        <li><a href="/import/amazon">Import Amazon list</a></li>
                        <li><a href="/gifts-youre-giving">Gifts you're giving</a></li>
                    </ul>

                    <!-- Column 3 -->
                    <ul class="footer-column">
                        <li class="column-title">Finances</li>
                        <li><a href="/money">Money</a></li>
                    </ul>
                </div>

                <!-- Copyright -->
                <div class="copyright">
                    <hr />
                    <div class="footer-copyright">
                        Email <strong>Ben Walley</strong> for questions or bug reports. <a href="mailto:benwalleyorigami@gmail.com">benwalleyorigami@gmail.com</a>
                    </div>
                </div>
            </footer>
            <messages-component></messages-component>
            <add-to-list-button></add-to-list-button>
            <add-to-list-modal></add-to-list-modal>
        `;
    }
}

customElements.define('footer-container', FooterContainer);
