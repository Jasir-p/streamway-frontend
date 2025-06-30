import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { updateTeam,partialUpdateTeam } from '../../../../../redux/slice/TeamSlice';
import { useToast } from '../../../../common/ToastNotification';
import { addMember,removeMember } from '../api/teamapi';

export const useTeamActions = (team_id, fetchTeam) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();

  const handleAddMember = async (user_id) => {
    setLoading(true);
    try {
      const result = await addMember(team_id, user_id);
      if (result.status === 201) {
        await fetchTeam();
        showSuccess("Team member added successfully!");
        return true;
      } else {
        const errorMessage = result.data?.error?.employee?.[0] || "Failed to add team member";
        showError(errorMessage);
        return false;
      }
    } catch (error) {
      showError("Failed to add member");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    setLoading(true);
    try {
      const result = await removeMember(team_id, memberId);
      if (result.status === 200 || result.status === 204) {
        await fetchTeam();
        showSuccess("Team member removed successfully!");
        return true;
      } else {
        showError("Failed to remove team member");
        return false;
      }
    } catch (error) {
      showError("Failed to remove member");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeamLead = async (user_id) => {
    setLoading(true);
    try {
      const result = await dispatch(partialUpdateTeam({
        team_id,
        team_lead: user_id
      })).unwrap();
      showSuccess('Team Lead updated successfully');
      await fetchTeam();
      return true;
    } catch (error) {
      showError('Failed to update Team Lead');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async (teamData) => {
    setLoading(true);
    try {
      const result = await dispatch(updateTeam({
        team_id,
        ...teamData
      }));
      
      if (updateTeam.fulfilled.match(result)) {
        await fetchTeam();
        showSuccess("Team updated successfully!");
        return true;
      } else {
        showError("Failed to update team");
        return false;
      }
    } catch (error) {
      showError("Failed to update team");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleAddMember,
    handleRemoveMember,
    handleUpdateTeamLead,
    handleUpdateTeam
  };
};