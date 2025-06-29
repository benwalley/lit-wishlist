import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../../state/userStore.js";
import {globalState} from "../../../state/globalStore.js";
import './login-account.js';
import '../../global/custom-input.js'
import {navigate} from "../../../router/main-router.js";
import buttonStyles from "../../../css/buttons.js";
import posthog from 'posthog-js'


export class GuestHomeContainer extends observeState(LitElement) {
    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    font-family: var(--font-family, Arial, sans-serif);
                    height: 100%;
                }

                .container {
                    display: flex;
                    height: 100%;
                }

                .left,
                .right {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .left {
                    background: var(--background-color);
                    color: var(--text-color-dark);
                }

                .right {
                    background: linear-gradient(135deg, var(--primary-color) 0%, var(--purple-darker, #6b46c1) 100%);
                    position: relative;
                    color: white;
                }

                .right:after {
                    content: '';
                    width: 50vw;
                    position: absolute;
                    top: 0;
                    left: calc(100% - 1px);
                    background: linear-gradient(135deg, var(--primary-color) 0%, var(--purple-darker, #6b46c1) 100%);
                    display: block;
                    height: 100%;
                }

                .form-container {
                    width: 80%;
                    max-width: 400px;
                    padding: var(--spacing-large) 0;
                    z-index: 1;
                    position: relative;
                }

                h2 {
                    margin: 0 0 var(--spacing-normal) 0;
                    font-size: var(--font-size-xx-large);
                    font-weight: 700;
                    color: inherit;
                }

                .right h2 {
                    color: white;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .details {
                    font-size: var(--font-size-normal);
                    line-height: 1.6;
                    color: var(--text-color-medium-dark);
                    margin-bottom: var(--spacing-normal);
                }

                .details ul {
                    margin: var(--spacing-small) 0;
                    padding-left: var(--spacing-normal);
                }

                .details li {
                    margin-bottom: var(--spacing-x-small);
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    margin-top: var(--spacing-normal);
                }

                .search-description {
                    font-size: var(--font-size-small);
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: var(--spacing-normal);
                    line-height: 1.5;
                }

                /* Responsive design */
                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                    }
                    
                    .right:after {
                        display: none;
                    }
                    
                    .form-container,
                    .right .form-container {
                        width: 90%;
                        max-width: none;
                        padding: var(--spacing-normal);
                    }
                }
            `
        ];
    }

    firstUpdated() {
        this._checkAuthentication();

        console.log('running')
        posthog.init('phc_aEi6XYV0q46bbooESvEozRA2sU59b3STJDlui1McYt4',
            {
                api_host: 'https://us.i.posthog.com',
                person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
            }
        )
        posthog.capture('my event', { property: 'value' })
    }

    // Lifecycle method called whenever the component updates
    updated(changedProperties) {
        super.updated(changedProperties);
        // Check authentication status whenever the component updates
        this._checkAuthentication();
    }

    /**
     * Checks if the user is authenticated.
     * If authenticated, redirects to the '/account' page.
     */
    _checkAuthentication() {
        // Ensure that user data has finished loading
        if (!(userState.loadingUser) && userState.userData?.id) {
            navigate(globalState.landingPage)
        }
    }

    render() {
        return userState.loadingUser ?
            'loading...' : html`
                    <div class="container">
                        <!-- Left Section -->
                        <div class="left">
                            <div class="form-container">
                                <h2>Welcome!</h2>
                                <p class="details">Log in or create an account to experience all of the features:</p>
                                <ul class="details">
                                    <li>Save your wishlist online</li>
                                    <li>Create or join groups with your family and friends</li>
                                    <li>Track what you're giving everyone</li>
                                    <li>And many more features!</li>
                                </ul>

                                <login-account-tabs></login-account-tabs>
                            </div>
                        </div>

                        <!-- Right Section -->
                        <div class="right">
                            <div class="form-container">
                                <h2>Discover Lists</h2>
                                <p class="search-description">
                                    Find and explore public wishlists from friends, family, and the community. 
                                    Search by name or username to discover what others are wishing for.
                                </p>
                                <form @submit=${this._handleSearchSubmit}>
                                    <custom-input type="text"
                                                  placeholder="Search for a list or user..."
                                                  required></custom-input>
                                    <button class="button primary shadow full-width" type="submit">Search Lists</button>
                                </form>
                            </div>
                        </div>
                    </div>
            `;
    }

    _handleSearchSubmit(event) {
        event.preventDefault();
        console.log('Search submitted');
    }
}

customElements.define('guest-home', GuestHomeContainer);
