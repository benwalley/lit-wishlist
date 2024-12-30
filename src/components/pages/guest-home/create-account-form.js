import { LitElement, html, css } from 'lit';
import '../../global/custom-input.js'

export class CreateAccountForm extends LitElement {
    static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    input {
      padding: 0.5rem;
      font-size: 1rem;
    }
    button {
      padding: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
    }
  `;

    render() {
        return html`
      <form @submit=${this._handleSubmit}>
          <custom-input type="text" placeholder="Name" required label="name"></custom-input>
          <custom-input type="email" placeholder="Email" required label="Email"></custom-input>
          <custom-input type="password" placeholder="Password" required label="Password"></custom-input>
          <custom-input type="password" placeholder="Confirm Password" required label="Confirm Password"></custom-input>
        <button class="button full-width primary" type="submit">Create Account</button>
      </form>
    `;
    }

    _handleSubmit(event) {
        event.preventDefault();
        console.log('Create account form submitted');
    }
}

customElements.define('create-account-form', CreateAccountForm);
