import { LitElement, html, css } from 'lit';
import { userState } from '../../state/userStore.js';
import { getGroupLists } from '../../helpers/api/lists.js';
import '../lists/list-item.js';
import '../loading/skeleton-loader.js';
import {listenUpdateList} from "../../events/eventListeners.js";

export class GroupListsList extends LitElement {
  static get properties() {
    return {
      groupData: { type: Object },
      lists: { type: Array },
      loading: { type: Boolean }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }

      .list-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
        width: 100%;
      }
      
      @media only screen and (min-width: 600px) {
        .list-container {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media only screen and (min-width: 1400px) {
        .list-container {
          grid-template-columns: 1fr 1fr 1fr;
        }
      }

      .no-lists {
        text-align: center;
        padding: var(--spacing-normal-variable);
        font-style: italic;
        color: var(--medium-text-color);
      }

      h2 {
        margin: 0;
        padding-bottom: var(--spacing-normal-variable);
      }
    `;
  }

  constructor() {
    super();
    this.groupData = {};
    this.lists = [];
    this.loading = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchLists();
    listenUpdateList(this.fetchLists.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('lists-updated', this.boundListsUpdated);
  }

  async fetchLists() {
    if (!this.groupData?.id) return;

    this.loading = true;

    // Fetch lists visible to the current group
    const response = await getGroupLists(this.groupData.id);

    if (response.success) {
      this.lists = response.data;
    } else {
      console.error('Failed to fetch group lists:', response.error);
    }

    this.loading = false;
  }

  renderSkeletons() {
    return html`
      <skeleton-loader type="list-item"></skeleton-loader>
      <skeleton-loader type="list-item"></skeleton-loader>
      <skeleton-loader type="list-item"></skeleton-loader>
    `;
  }

  renderLists() {
    if (this.lists.length === 0) {
      return html`<div class="no-lists">No lists in this group yet</div>`;
    }

    return this.lists.map(list => html`
      <list-item .itemData=${list} showOwner></list-item>
    `);
  }

  render() {
    return html`
      <div>
        <h2>Lists</h2>
        <div class="list-container">
          ${this.loading ? this.renderSkeletons() : this.renderLists()}
        </div>
      </div>
    `;
  }
}

customElements.define('group-lists-list', GroupListsList);
