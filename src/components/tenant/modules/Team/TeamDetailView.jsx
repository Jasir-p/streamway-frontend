

import { useState } from 'react';
import DashboardLayout from '../../dashboard/DashbordLayout';
import DashbordLoading from '../../../common/DashbordLoading';

import TeamForm from './TeamForm';
import { useTeam } from './hooks/useTeam';
import { useTeamActions } from './hooks/useTeamActions';
import TeamHeader from './components/TeamHeader';
import TeamStats from './components/TeamStats';
import TeamLead from './components/TeamLead';
import MembersList from './components/MembersList';
import TabNavigation from './components/TabNavigation';
import TabContent from './components/TabContent';
import TeamModal from './components/TeamModal';
import { useTeamPermissions } from '../../authorization/useTeamPermissions';



const TeamDetailView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
    const {canAdd,canDelete,canEdit,canView}= useTeamPermissions()

  const { team, members,tasks, loading, fetchTeam, team_id,employees,completeCount,pendingCount,completionRatio } = useTeam();
  const { 
    loading: actionLoading,
    handleAddMember,
    handleRemoveMember,
    handleUpdateTeamLead,
    handleUpdateTeam
  } = useTeamActions(team_id, fetchTeam);

  const handleModal = (type, memberId = null) => {
    setModalType(type);
    setSelectedMemberId(memberId);
    setIsModalOpen(true);
  };
  console.log(tasks);
  
  const handleModalSubmit = async (data) => {
    let success = false;
    
    switch (modalType) {
      case 'Member':
        success = await handleAddMember(data.employee);
        break;
      case 'Team Lead':
        success = await handleUpdateTeamLead(data.employee);
        break;
      case 'Remove Member':
        success = await handleRemoveMember(selectedMemberId);
        break;
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleEditSubmit = async (teamData) => {
    const success = await handleUpdateTeam(teamData);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  if (loading && !team) {
    return <DashbordLoading />;
  }

  if (!team) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[300px]">
          <p className="text-lg">No team data found. Please check the team ID and try again.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <div className="w-full sm:w-3/4">
            <div className="bg-white rounded-lg shadow-md">
              <TeamHeader team={team} onEditClick={() => setIsEditModalOpen(true) } canEdit={canEdit} />
              <TeamStats team={team} 
              completeCount={completeCount}
              pendingCount={pendingCount}
              completionRatio={completionRatio} />
              <TeamLead 
                teamLead={team.team_lead} 
                onChangeTeamLead={() => handleModal('Team Lead')}
                canEdit={canEdit} 
                
              />
            </div>
          </div>

          <div className="w-full sm:w-1/4 mt-6 sm:mt-0">
            <MembersList
              members={members}
              onAddMember={() => handleModal('Member')}
              onRemoveMember={(memberId) => handleModal('Remove Member', memberId)}
              canEdit={canEdit}
            />
          </div>
        </div>

        <div className="mt-8">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-4">
            <TabContent
              activeTab={activeTab}
              team={team}
              members={members}
              tasks={tasks}
              onChangeTeamLead={() => handleModal('Team Lead')}
              onRemoveMember={(memberId) => handleModal('Remove Member', memberId)}
              canEdit ={canEdit}
            />
          </div>
        </div>

        {isModalOpen && (
          <TeamModal
            isOpen={isModalOpen}
            modalType={modalType}
            loading={actionLoading}
            team={team}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            members={members}
            employees={employees}
          />
        )}

        {isEditModalOpen && (
          <TeamForm
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleEditSubmit}
            team={team}
            type="edit"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeamDetailView;