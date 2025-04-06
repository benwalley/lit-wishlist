import {LitElement, html, css} from 'lit';
import buttonStyles from "../../../../css/buttons"; // Assuming path is correct
import '../../../global/custom-tooltip.js'
import '../../../global/custom-modal.js'
import './qa-page-question.js';
import './add-qa-popup.js'


export class CustomElement extends LitElement {
    static properties = {

        questions: {type: Array},
        modalOpen: {type: Boolean},
    };

    constructor() {
        super();
        this.modalOpen = true;
        this.questions = [
            {
                id: 1,
                text: 'What is your favorite color?',
                answers: [
                    {
                        answerId: 101,
                        answerText: 'Red',
                        user: {id: 'u1', name: 'Bob', imageUrl: 'https://via.placeholder.com/32/c93a3a/ffffff?text=B'}
                    },
                    {
                        answerId: 102,
                        answerText: 'Yellow',
                        user: {id: 'u2', name: 'Tom', imageUrl: 'https://via.placeholder.com/32/d4c93b/ffffff?text=T'}
                    },
                    {
                        answerId: 103,
                        answerText: 'A vibrant shade of orange!',
                        user: {id: 'u3', name: 'Bill', imageUrl: 'https://via.placeholder.com/32/d48d3b/ffffff?text=B'}
                    },
                    {
                        answerId: 104,
                        answerText: '#3498db (Blue)',
                        user: {id: 'u4', name: 'Alice', imageUrl: 'https://via.placeholder.com/32/3498db/ffffff?text=A'}
                    }
                ],
                sharedUsers: [
                    {id: 'g1', name: 'Design Team'},
                    {id: 'g2', name: 'Engineering Team'}
                ],
                sharedGroups: [
                    {id: 'u1', name: 'Bob'},
                    {id: 'u2', name: 'Tom'}
                ]
            },
            {
                id: 2,
                text: 'How does Lit update the DOM?',
                answers: [
                    {
                        answerId: 201,
                        answerText: 'Uses tagged template literals and efficient part updates.',
                        user: {id: 'u4', name: 'Alice', imageUrl: 'https://via.placeholder.com/32/3498db/ffffff?text=A'}
                    },
                    {
                        answerId: 202,
                        answerText: 'Through its reactive update cycle.',
                        user: {
                            id: 'u5',
                            name: 'Charlie',
                            imageUrl: 'https://via.placeholder.com/32/2ecc71/ffffff?text=C'
                        }
                    }
                ]
            },
            {
                id: 3,
                text: 'When should you use `state: true`?',
                answers: [] // Example question with no answers yet
            }
        ];
    }

    static get styles() {

        return [
            buttonStyles,
            css`
                :host {
                    display: block;
                    padding: var(--spacing-normal);
                    font-size: var(--font-size-normal);
                    color: var(--text-color-dark);
                }

                .header-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-normal);
                    padding-bottom: var(--spacing-normal);
                    border-bottom: 1px solid var(--border-color);
                }

                h1 {
                    margin: 0;
                    font-size: var(--font-size-large);
                    font-weight: 600;
                }

                .questions-list {
                    display: grid;
                    gap: var(--spacing-normal);
                }
            `
        ];
    }

    _handleAddQuestion(event) {
        // add saving logic.
        console.log(event.detail);
        this.modalOpen = !this.modalOpen;
    }

    _handleSaveQuestion() {
        this.modalOpen = false;
    }

    render() {
        return html`
            <div class="header-container">
                <h1>Questions and Answers</h1>
                <button
                        class="button primary"
                        @click=${this._handleAddQuestion}
                >
                    Add Question
                </button>
            </div>

            <div class="questions-list">
                ${this.questions.length === 0
                        ? html`<p>No questions have been added yet.</p>`
                        : this.questions.map(question => html`
                            <qa-page-question .question="${question}"></qa-page-question>
                        `)
                }
            </div>
            <custom-modal .isOpen="${this.modalOpen}" 
                          noPadding 
                          maxWidth="700px"
                          @cancel-popup="${() => this.modalOpen = false}"
                          @submit-question="${this._handleSaveQuestion}"
            >
                <add-qa-popup></add-qa-popup>
            </custom-modal>
        `;
    }
}

customElements.define('qa-page-container', CustomElement);
