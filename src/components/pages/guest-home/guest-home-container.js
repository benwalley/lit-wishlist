import {LitElement, html, css} from 'lit';
import {observeState} from 'lit-element-state';
import {userState} from "../../../state/userStore.js";
import './login-account.js';
import '../../global/custom-input.js'
import {navigate} from "../../../router/main-router.js";
import posthog from 'posthog-js'


export class GuestHomeContainer extends observeState(LitElement) {
    static styles = css`
        :host {
            display: block;
            font-family: Arial, sans-serif;
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


        .right {
            background-color: var(--primary-color);
            position: relative;
        }

        .right:after {
            content: '';
            width: 50vw;
            position: absolute;
            top: 0;
            left: calc(100% - 1px);
            background: var(--primary-color);
            display: block;
            height: 100%;
        }

        .form-container {
            width: 80%;
            max-width: 400px;
            padding: var(--spacing-large) 0;
        }

        h2 {
            margin-bottom: 1rem;
            font-size: var(--font-size-x-large);
        }

        .details {
            font-size: var(--font-size-small);
        }

        form {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-normal);
        }

        input {
            padding: 0.5rem;
            font-size: 1rem;
        }

        button {
            padding: 0.5rem;
            font-size: 1rem;
            cursor: pointer;
            border: none;
            background-color: #0078d4;
            color: white;
            border-radius: 5px;
        }

        button:hover {
            background-color: #005bb5;
        }
    `;

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
            navigate('/account')
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
                                <h2>Search</h2>
                                <form @submit=${this._handleSearchSubmit}>
                                    <custom-input type="text"
                                                  placeholder="Search for a list or a user"
                                                  required></custom-input>
                                    <button class="button full-width secondary" type="submit">Search</button>
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
