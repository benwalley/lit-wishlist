import { customFetch } from '../fetchHelpers.js';
import {showConfirmation} from '../../components/global/custom-confirm/confirm-helper.js';
import {messagesState} from '../../state/messagesStore.js';

export async function createProposal(proposalData) {
    const { itemId, participants } = proposalData;

    const requestData = {
        itemId: itemId,
        proposalParticipants: participants.map(participant => ({
            userId: participant.userId,
            amountRequested: participant.amountRequested,
            isBuying: participant.isBuying
        }))
    };

    const response = await customFetch('/proposals/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    }, true);

    return response;
}

export async function updateProposal(proposalData) {
    const { itemId, proposalId, participants } = proposalData;
    if(!proposalId) return {success: false, error: 'Proposal ID is required'};

    const requestData = {
        itemId: itemId,
        proposalParticipants: participants.map(participant => ({
            userId: participant.userId,
            amountRequested: participant.amountRequested,
            isBuying: participant.isBuying
        }))
    };

    const response = await customFetch(`/proposals/${proposalId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    }, true);

    return response;
}

/**
 * Deletes a proposal with user confirmation dialog
 * @param {Object} proposal - The proposal object to delete
 * @returns {Promise<Object>} Result object with success status
 */
export async function deleteProposalWithConfirmation(proposal) {
    try {
        const confirmed = await showConfirmation({
            heading: 'Delete Proposal',
            message: `Are you sure you want to delete this proposal for "${proposal.item?.name || 'Unknown Item'}"? This action cannot be undone.`,
            confirmLabel: 'Delete Proposal',
            cancelLabel: 'Cancel'
        });

        if (!confirmed) {
            return { success: false, cancelled: true };
        }

        const response = await customFetch(`/proposals/${proposal.id}`, {
            method: 'DELETE'
        }, true);

        if (response.success) {
            messagesState.addMessage('Proposal deleted successfully');
            return { success: true, data: response.data, proposalId: proposal.id };
        } else {
            messagesState.addMessage(response.error || 'Failed to delete proposal', 'error');
            return { success: false, error: response.error };
        }
    } catch (error) {
        console.error('Error deleting proposal:', error);
        messagesState.addMessage('Error deleting proposal. Please try again.', 'error');
        return { success: false, error: error.message };
    }
}

/**
 * Deletes a proposal without confirmation
 * @param {number} proposalId - The ID of the proposal to delete
 * @returns {Promise<Object>} API response
 */
export async function deleteProposal(proposalId) {
    return await customFetch(`/proposals/${proposalId}`, {
        method: 'DELETE'
    }, true);
}

/**
 * Accepts a proposal participation for the current user
 * @param {number} proposalId - The ID of the proposal
 * @returns {Promise<Object>} API response
 */
export async function acceptProposal(proposalId) {
    return await customFetch(`/proposals/accept/${proposalId}`, {
        method: 'POST'
    }, true);
}

/**
 * Declines a proposal participation for the current user
 * @param {number} proposalId - The ID of the proposal
 * @returns {Promise<Object>} API response
 */
export async function declineProposal(proposalId) {
    return await customFetch(`/proposals/decline/${proposalId}`, {
        method: 'POST'
    }, true);
}
