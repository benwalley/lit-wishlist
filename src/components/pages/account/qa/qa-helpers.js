import {customFetch} from "../../../../helpers/fetchHelpers.js";
import {triggerUpdateQa, triggerUpdateUser} from "../../../../events/eventListeners.js";
import {messagesState} from "../../../../state/messagesStore.js";

export async function saveQA(qaId, question, answer) {
    try {
        const data = {

        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const userData = await customFetch('/users/', options, true);
        triggerUpdateUser()
        return {success: true, userData: userData}

    } catch (e) {
        handleQAError('There was an error saving your question. Please try again.')
        return {success: false, message: 'There was an error saving your question. Please try again.'}
    }
}

export async function createQA(question, answer, userId) {
    try {
        if(!question.length) {
            return {success: false, message: 'You must enter a question.'}
        };
        const data = {
            questionText: question,
            userId,
        }
        if(answer) {
            data.answerText = answer;
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const qaData = await customFetch('/qa/create', options, true);
        return {success: true, qaData: qaData}

    } catch (e) {
        handleQAError('There was an error saving your question. Please try again.')
        return {success: false, message: 'There was an error saving your question. Please try again.'}
    }
}

export async function updateQuestion(questionData) {
    try {
        if(!questionData.questionText?.length) {
            handleQAError('You must have question text')
            return {success: false, message: 'You must enter a question.'}
        };

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        };

        const updatedValue = await customFetch('/qa/question', options, true);
        return {success: true, updatedValue}

    } catch (e) {
        console.log(e)
        handleQAError('There was an error saving your question. Please try again.')
        return {success: false, message: 'There was an error saving your question. Please try again.'}
    }
}

export async function updateAnswer(answerData) {
    try {
        if(!answerData.answerText?.length) {
            handleQAError('You must have answer text')
            return {success: false, message: 'You must enter a answer.'}
        };

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answerData),
        };

        const updatedValue = await customFetch('/qa/answer', options, true);
        return {success: true, updatedValue}

    } catch (e) {
        console.log(e)
        handleQAError('There was an error saving your answer. Please try again.')
        return {success: false, message: 'There was an error saving your answer. Please try again.'}
    }
}

export async function getQAItems(userId) {
    try {
        const response = await customFetch(`/qa/user/${userId}`, {}, true);
        return {success: true, qaItems: response}
    } catch (e) {
        handleQAError('There was an error fetching the Q&A items. Please try again.')
        return {success: false, message: 'There was an error fetching the Q&A items. Please try again.'}
    }
}

export async function deleteQA(questionData) {
    try {
        const questionId = questionData.id;
        const answerId = questionData.answers[0]?.id;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if(questionId) {
            const deletedQuestion = await customFetch(`/qa/question/${questionId}`, options, true);
        }
        if(answerId) {
            const deletedAnswer = await customFetch(`/qa/answer/${answerId}`, options, true);
        }
        return {success: true}

    } catch (e) {
        handleQAError('There was an error saving your question. Please try again.')
        return {success: false, message: 'There was an error saving your question. Please try again.'}
    }
}

function handleQAError(error) {
    messagesState.addMessage(error, 'error')
    triggerUpdateQa();
}
