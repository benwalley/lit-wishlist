import {customFetch} from "../../../../helpers/fetchHelpers.js";
import {triggerUpdateQa, triggerUpdateUser} from "../../../../events/eventListeners.js";
import {messagesState} from "../../../../state/messagesStore.js";
import {cachedFetch} from "../../../../helpers/caching.js";

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

export async function createQA(qaData) {
    try {
        if(!qaData.questionText?.length) {
            return {success: false, message: 'You must enter a question.'}
        };
        const data = {
            questionText: qaData.questionText,
            userId: qaData.userId,
            isAnonymous: qaData.isAnonymous || false,
            sharedWithUserIds: qaData.sharedWithUserIds || [],
            sharedWithGroupIds: qaData.sharedWithGroupIds || [],
            dueDate: qaData.dueDate ? qaData.dueDate : null,
        }
        if(qaData.answerText) {
            data.answerText = qaData.answerText;
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const responseData = await customFetch('/qa/create', options, true);
        return {success: true, qaData: responseData}

    } catch (e) {
        console.log(e)
        handleQAError('There was an error saving your question. Please try again.')
        return {success: false, message: 'There was an error saving your question. Please try again.'}
    }
}


export async function updateQuestion(questionData) {
    try {
        if(!questionData.questionId) {
            handleQAError('You must have question id')
            return {success: false, message: 'You must have a question id.'}
        }
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

        const updatedValue = await customFetch(`/qa/question/${questionData.questionId}`, options, true);
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
            method: 'POST',
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
        const response = await cachedFetch(`/qa/user/${userId}`, {}, true);
        return {success: true, qaItems: response}
    } catch (e) {
        handleQAError('There was an error fetching the Q&A items. Please try again.')
        return {success: false, message: 'There was an error fetching the Q&A items. Please try again.'}
    }
}

export async function getAskedQAItems(userId) {
    try {
        const response = await cachedFetch(`/qa/userAsked/${userId}`, {}, true);
        return {success: true, qaItems: response}
    } catch (e) {
        handleQAError('There was an error fetching the Q&A items. Please try again.')
        return {success: false, message: 'There was an error fetching the Q&A items. Please try again.'}
    }
}

export async function deleteQA(questionData) {
    try {
        const questionId = questionData.id;
        if(!questionId) return {success: false, message: 'Message ID not provided'}
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const deletedQuestion = await customFetch(`/qa/question/${questionId}`, options, true);
        return deletedQuestion;

    } catch (e) {
        handleQAError('There was an error deleting your question. Please try again.')
        return {success: false, message: 'There was an error deleting your question. Please try again.'}
    }
}

export async function forceDeleteQA(questionData) {
    try {
        const questionId = questionData.id;
        if(!questionId) return {success: false, message: 'Message ID not provided'}
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const deletedQuestion = await customFetch(`/qa/question/force/${questionId}`, options, true);
        return deletedQuestion;

    } catch (e) {
        handleQAError('There was an error deleting your question. Please try again.')
        return {success: false, message: 'There was an error deleting your question. Please try again.'}
    }
}

function handleQAError(error) {
    messagesState.addMessage(error, 'error')
    triggerUpdateQa();
}
