import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../../state/userStore.js";
import {globalState} from "../../../state/globalStore.js";
import './auth-form-container.js';
import '../../global/loading-screen.js'
import '../../global/custom-input.js'
import {navigate} from "../../../router/main-router.js";
import buttonStyles from "../../../css/buttons.js";
import '../../../svg/empty-heart.js';
import '../../../svg/star.js';


export class GuestHomeContainer extends observeState(LitElement) {
    static get styles() {
        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    height: 100%;
                }
                
                h1 {
                    font-size: var(--font-size-xx-large);
                    margin: 0;
                }
                
                .left {
                    max-width: 500px;
                }
                
                .form-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                }
                
                .details {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-normal);
                    padding-left: 0;
                    margin: 0;
                    
                    li {
                        display: flex;
                        flex-direction: row;
                        gap: var(--spacing-small);
                        align-items: center;
                        
                        h3 {
                            margin: 0;
                        }
                        
                        p {
                            margin: 0;
                        }
                        
                        .display-icon {
                            background: var(--fancy-purple-gradient);
                            width: 40px;
                            height: 40px;
                            border-radius: var(--border-radius-normal);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: var(--light-text-color);
                            font-size: var(--font-size-large);
                        }
                    }
                }

                .container {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap-reverse;
                    gap: var(--spacing-large);
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-large) var(--spacing-normal-variable);
                    height: 100%;
                    box-sizing: border-box;
                    background: var(--background-dark-gradient);
                }
            `
        ];
    }

    firstUpdated() {
        this._checkAuthentication();
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
            html`<loading-screen></loading-screen>` : html`
                    <div class="container">
                        <!-- Left Section -->
                        <div class="left">
                            <div class="form-container">
                                <h1>Welcome!</h1>
                                <p class="details">Log in or create an account to experience all of the amazing features we have to offer.</p>
                                <ul class="details">
                                    <li>
                                        <div class="display-icon">
                                            <empty-heart-icon></empty-heart-icon>
                                        </div>
                                        <div class="right-side">
                                            <h3>Save your wishlist online</h3>
                                            <p>Never lose track of what you want</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="display-icon">
                                            <group-icon></group-icon>
                                        </div>
                                        <div class="right-side">
                                            <h3>Create or join groups</h3>
                                            <p>Connect with family and friends</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="display-icon">
                                            <gift-icon></gift-icon>
                                        </div>
                                        <div class="right-side">
                                            <h3>Track gift giving</h3>
                                            <p>Know what you're giving everyone</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="display-icon">
                                            <star-icon></star-icon>
                                        </div>
                                        <div class="right-side">
                                            <h3>And many more features!</h3>
                                            <p>Discover all our amazing tools</p>
                                        </div>
                                    </li>
                                </ul>

                                
                            </div>
                        </div>

                        <!-- Right Section -->
                        <div class="right">
                            <auth-form-container></auth-form-container>
                        </div>
                    </div>
            `;
    }

}

customElements.define('guest-home', GuestHomeContainer);
