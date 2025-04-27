import {customFetch} from "../../../../helpers/fetchHelpers.js";
import {triggerUpdateQa, triggerUpdateUser} from "../../../../events/eventListeners.js";
import {messagesState} from "../../../../state/messagesStore.js";
import {cachedFetch} from "../../../../helpers/caching.js";
import {showConfirmation} from "../../../global/custom-confirm/confirm-helper.js";

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

/**
 * Helper function to show delete confirmation and handle question deletion
 * @param {Object} question - The question object to delete
 * @returns {Promise<boolean>} - True if deletion was successful
 */
export async function handleDeleteQuestion(question) {
    try {
        // Check if we should show shared users/groups in the confirmation
        const sharedWithUsers = question.sharedWithUsers || [];
        const sharedWithGroups = question.sharedWithGroups || [];
        const totalSharedEntities = sharedWithUsers.length + sharedWithGroups.length;
        
        // Create submessage with shared info if applicable
        let submessage = 'The users who answered this question will still see it with a message telling them it was deleted';
        
        if (totalSharedEntities > 1) {
            submessage += '<br><br><strong>This question is shared with:</strong><br>';
            
            if (sharedWithGroups.length > 0) {
                submessage += '<strong>Groups:</strong> ';
                submessage += sharedWithGroups.map(group => group.groupName).join(', ');
                submessage += '<br>';
            }
            
            if (sharedWithUsers.length > 0) {
                submessage += '<strong>Users:</strong> ';
                submessage += sharedWithUsers.map(user => user.name).join(', ');
            }
        }

        // Show confirmation dialog
        const confirmed = await showConfirmation({
            message: 'Are you sure you want to delete this question?',
            submessage: submessage,
            heading: 'Delete Item?',
            confirmLabel: 'Yes, Delete',
            cancelLabel: 'No, Keep it'
        });

        if (!confirmed) {
            return false;
        }

        // Proceed with deletion
        const response = await deleteQA(question);
        if (response.success) {
            messagesState.addMessage('Question deleted successfully', 'success');
            triggerUpdateQa();
            return true;
        } else {
            messagesState.addMessage('Failed to delete question', 'error');
            return false;
        }
    } catch (error) {
        console.error('Error deleting question:', error);
        messagesState.addMessage('An error occurred while deleting the question', 'error');
        return false;
    }
}

function handleQAError(error) {
    messagesState.addMessage(error, 'error')
    triggerUpdateQa();
}
