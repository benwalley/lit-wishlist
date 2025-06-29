import { LitState } from 'lit-element-state';
import { getInvitedGroups, acceptGroupInvitation, declineGroupInvitation } from '../helpers/api/groups.js';

class GroupInvitationsState extends LitState {
    static get stateVars() {
        return {
            invitations: [],
            invitationCount: 0,
            loading: false,
            error: null
        };
    }

    async fetchInvitations() {
        try {
            this.loading = true;
            this.error = null;
            
            const result = await getInvitedGroups();
            
            if (result.success) {
                this.setInvitations(result.data || []);
            } else {
                this.error = 'Failed to load group invitations';
                this.invitations = [];
                this.invitationCount = 0;
            }
        } catch (err) {
            this.error = 'An error occurred loading group invitations';
            this.invitations = [];
            this.invitationCount = 0;
        } finally {
            this.loading = false;
        }
    }

    setInvitations(invitations) {
        this.invitations = invitations;
        this.invitationCount = invitations.length;
    }

    removeInvitation(groupId) {
        this.invitations = this.invitations.filter(invitation => invitation.id !== groupId);
        this.invitationCount = this.invitations.length;
    }

    async acceptInvitation(groupId) {
        try {
            const result = await acceptGroupInvitation(groupId);
            if (result.success) {
                this.removeInvitation(groupId);
                return result;
            } else {
                throw new Error('Failed to accept invitation');
            }
        } catch (error) {
            throw error;
        }
    }

    async declineInvitation(groupId) {
        try {
            const result = await declineGroupInvitation(groupId);
            if (result.success) {
                this.removeInvitation(groupId);
                return result;
            } else {
                throw new Error('Failed to decline invitation');
            }
        } catch (error) {
            throw error;
        }
    }
}

export const groupInvitationsState = new GroupInvitationsState();