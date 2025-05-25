import {deleteProposalWithConfirmation} from './api/proposals.js';
import {listenDeleteProposal, triggerProposalDeleted, triggerUpdateItem} from '../events/eventListeners.js';

/**
 * Handles proposal deletion events globally
 * This should be initialized once in the main app
 */
export function initializeProposalHelpers() {
    // Listen for delete proposal events
    listenDeleteProposal(async (event) => {
        const { proposal } = event.detail;
        
        const result = await deleteProposalWithConfirmation(proposal);
        
        if (result.success) {
            // Trigger an event that components can listen to for updating their local state
            triggerProposalDeleted(result.proposalId);
            // Trigger a general update that will cause components to reload their data
            triggerUpdateItem();
        }
        // Error handling is already done in the deleteProposalWithConfirmation function
    });
}