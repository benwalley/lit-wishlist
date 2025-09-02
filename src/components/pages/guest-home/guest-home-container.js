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
import '../../../svg/group.js';
import '../../../svg/gift.js';


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
                                <h1>Free Online Wishlist Maker</h1>
                                <p class="details">Create and share wishlists for birthdays, Christmas, weddings, and any special occasion. Join thousands who use our free wishlist maker to coordinate gifts with family and friends.</p>
                                <ul class="details">
                                    <li>
                                        <div class="display-icon">
                                            <empty-heart-icon></empty-heart-icon>
                                        </div>
                                        <div class="right-side">
                                            <h3>Create Unlimited Wishlists</h3>
                                            <p>Birthday lists, Christmas wishlists, wedding registries & more</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="display-icon">
                                            <group-icon></group-icon>
                                        </div>
                                        <div class="right-side">
                                            <h3>Share with Family & Friends</h3>
                                            <p>Easy sharing and group coordination to avoid duplicate gifts</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="display-icon">
                                            <gift-icon></gift-icon>
                                        </div>
                                        <div class="right-side">
                                            <h3>Track gift giving</h3>
                                            <p>Know what you're giving everyone and coordinate with others</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="display-icon">
                                            <star-icon></star-icon>
                                        </div>
                                        <div class="right-side">
                                            <h3>Import from Amazon & More</h3>
                                            <p>Add items from Amazon, organize events, and control privacy</p>
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
