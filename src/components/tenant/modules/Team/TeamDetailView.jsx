import { useEffect, useState } from 'react';
import { Users, FileText, Activity, Plus, X, Edit, Save } from 'lucide-react';
import SettingsLayout from '../../settings/Settings';
import Navbar from '../../../common/Navbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from "../../../../redux/slice/UsersSlice";
import { useToast } from '../../../common/ToastNotification';
import TeamForm from './TeamForm';
import { updateTeam } from '../../../../redux/slice/TeamSlice';
import DashboardLayout from '../../dashboard/DashbordLayout';
import { UserDropdown } from '../../../common/ToolBar';
import { partialUpdateTeam } from '../../../../redux/slice/TeamSlice';




const fetchTeamById = async (team_id) => {
  const subdomain = localStorage.getItem("subdomain");
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`http://${subdomain}.localhost:8000/team/`, {
      params: { team_id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("fetch", response.data);
    return response.data;
  } catch (error) {
    console.log("error fetching team", error.response?.data || error.message);
    return error;
  }
};

export const addMember = async (team_id, user_id) => {
  const subdomain = localStorage.getItem("subdomain");
  const token = localStorage.getItem("access_token");
  const data = {
    "team": team_id,
    "employee": user_id
  }
  try {
    const response = await axios.post(`http://${subdomain}.localhost:8000/team_members/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("add member", response.data);
    return response;
  } catch (error) {
    console.log("error adding member", error.response?.data || error.message);
    return error.response || { error: "Unknown error occurred" };
  }
};

const TeamDetailView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const { team_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: editErrors } } = useForm();
  const { users, error,status } = useSelector((state) => state.users);
  const [modalType, setModalType] = useState(null);
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const defaultStats = {
    completion_rate: 0,
    tasks_completed: 0,
    tasks_pending: 0
  };

  const handleModal = (type) =>{
    setModalType(type);
    setIsModalOpen(true);
  }
  const fetchTeam = async () => {
    console.log("Fetching team with ID:", team_id);
    setLoading(true);
    try {
      const data = await fetchTeamById(team_id);
      if (data && data.team) {
        setTeam(data.team);
        setMembers(data.team.members || []);
      } else {
        console.log("No team data returned or invalid format");
      }
    } catch (error) {
      console.error("Error in fetch team effect:", error);
    } finally {
      setLoading(false);
    }
  };

const onTeamLeadChange = async (data) =>{
  setLoading(true);
  const teamData ={
    team_id: team_id,
    team_lead: data.employee
  }
  try {
  const result = await dispatch(partialUpdateTeam(teamData)).unwrap();
  showSuccess('Team Lead updated successfully');
  setIsModalOpen(false);
  reset();
} catch (err) {
  console.error(err);
  showError('Failed to update Team Lead');
}

}
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("Submitting data:", data);
      const user_id = data.employee;
      const result = await addMember(team_id, user_id);
  
      if (result.status === 201) {
        await fetchTeam();
        setIsModalOpen(false);
        reset();
        showSuccess("Team member added successfully!");
      } else {
        console.log("Backend Error Response:", result.data);
        const errorMessage = result.data?.error?.employee?.[0] || "Failed to add team member. Please try again.";
        showError(errorMessage);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      console.log("Full error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.employee?.[0] || 
        error.response?.data?.error ||         
        "Failed to add member";             
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onEditSubmit = async (team_data) => {
    setLoading(true);
    const data ={team_id:team.id,...team_data}
    console.log(data)
    try {
      const result = await dispatch(updateTeam(data));
      console.log(updateTeam.fulfilled.match(result))
      
      if (updateTeam.fulfilled.match(result)) {
        console.log("haiiii");
        
        await fetchTeam();
        setIsEditModalOpen(false);
        resetEdit();
        showSuccess("Team updated successfully!");
      } else {
        const errorMessage = result.data?.error || "Failed to update team. Please try again.";
        showError(errorMessage);
      }
    } catch (error) {
      console.error("Error updating team:", error);
      const errorMessage = error.response?.data?.error || "Failed to update team";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    resetEdit(team);
    setIsEditModalOpen(true);
  };

  const activities = [
    {
      id: 1,
      user: { name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      description: 'Completed feature A.',
      timestamp: '2025-03-06 10:30 AM',
    },
    {
      id: 2,
      user: { name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
      description: 'Fixed bug #345.',
      timestamp: '2025-03-05 04:45 PM',
    },
    {
      id: 3,
      user: { name: 'James Brown', avatar: null },
      description: 'Reviewed pull request #67.',
      timestamp: '2025-03-05 02:15 PM',
    },
  ];

  useEffect(() => {
    if (!team_id) return;
    fetchTeam();
  }, [team_id]);

  console.log("Current state:", { team, members, loading });

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return 'bg-green-100 text-green-800';
      case false:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !team) {
    return (
      <DashboardLayout>
     
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[300px]">
          <p className="text-lg">Loading team details...</p>
        </div>
      </DashboardLayout>
    );
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
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{team.name || 'Team Name'}</h1>
                  <p className="text-sm text-gray-600">Updated on {team.updated_at ? new Date(team.updated_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                <button 
                  onClick={openEditModal}
                  className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Team</span>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Team Overview</h2>
                    <p className="text-sm text-gray-600">Completion Rate: {team.completion_rate || defaultStats.completion_rate}%</p>
                  </div>
                </div>

                {/* Team Lead Section */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800">Team Lead</h3>
                  {team.team_lead ? (
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {team.team_lead.avatar ? (
                          <img src={team.team_lead.avatar} alt={team.team_lead.name} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <span className="text-lg font-semibold">{team.team_lead.name ? team.team_lead.name.split(' ').map((n) => n[0]).join('') : 'TL'}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-md font-medium text-gray-900">{team.team_lead.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{team.team_lead.role?.name || 'No role'}</p>
                        <p className="text-sm text-gray-500">{team.team_lead.email || 'No email'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">No team lead assigned</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{team.tasks_completed || defaultStats.tasks_completed}</p>
                    <p className="text-sm text-gray-500">Tasks Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{team.tasks_pending || defaultStats.tasks_pending}</p>
                    <p className="text-sm text-gray-500">Tasks Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-1/4 mt-6 sm:mt-0">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <button className="flex text-sm items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg
               hover:bg-blue-700 transition duration-200 w-full justify-center" onClick={() => handleModal('Member')}>
                <Plus className="w-5 h-5" />
                <span>Add Member</span>
              </button>

              <ul className="mt-4 space-y-4">
                {members && members.length > 0 ? (
                  members.map((member) => (
                    <li key={member.id} className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <span>{member.name ? member.name.split(' ').map((n) => n[0]).join('') : 'U'}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{member.role.name || 'No position'}</p>
                        <span className={`mt-1 inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(member.status)}`}>
                          {member.status || 'Unknown'}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center py-4 text-gray-500">No members found</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Add Member Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{modalType}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(modalType === 'Member' ? onSubmit :onTeamLeadChange )}>
                <div className="mb-4">
                  
                  <select
                    {...register("employee", { required: "Member selection is required" })}
                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:outline-none transition-all"
                    disabled={loading}
                  >
                    <option value="">Select {modalType}</option>
                    {users.filter(user => (!team.team_lead || user.id !== team.team_lead.id)&& !members.some(member=>member.id ===user.id)).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role?.name || "No Role"})
                      </option>
                    ))}
                  </select>
                  {errors.employee && 
                    <div className="text-red-500 text-sm mt-1">{errors.employee.message}</div>
                  }
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Team Modal */}
        {isEditModalOpen &&(
          <TeamForm
          isOpen={isEditModalOpen}
          onClose={()=>setIsModalOpen(false)}
          onSubmit={onEditSubmit}
          team={team}
          type='edit'
          />
        )}
        <div className="mt-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'overview' ? 'bg-gray-300' : 'bg-transparent'}`}
            >
              <FileText className="w-5 h-5 text-gray-600" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'members' ? 'bg-gray-300' : 'bg-transparent'}`}
            >
              <Users className="w-5 h-5 text-gray-600" />
              <span>Members</span>
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${activeTab === 'activities' ? 'bg-gray-300' : 'bg-transparent'}`}
            >
              <Activity className="w-5 h-5 text-gray-600" />
              <span>Recent Activities</span>
            </button>
          </div>
          <div className="mt-4">
            {activeTab === 'overview' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900">Overview</h3>
                <p className="mt-4 text-gray-600">This is an overview of your team's performance, tasks, and achievements. You can check the most recent team activities in this section.</p>
                
                {team.description && (
                  <div className="mt-4">
                    <h4 className="text-lg font-medium text-gray-800">Team Description</h4>
                    <p className="mt-2 text-gray-600">{team.description}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
                
                {/* Team Lead Display */}
                {team.team_lead && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-700">Team Lead</h4>
                    <div className="flex items-center mt-2 space-x-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        {team.team_lead.avatar ? (
                          <img src={team.team_lead.avatar} alt={team.team_lead.name} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <span className="text-lg font-semibold">
                            {team.team_lead.name.split(' ').map((n) => n[0]).join('')}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-md font-medium text-gray-900">{team.team_lead.name}</p>
                        <p className="text-sm text-gray-600">{team.team_lead.role?.name || "No Role"}</p>
                        <p className="text-sm text-gray-500">{team.team_lead.email || "No email"}</p>
                      </div>
                    </div>

                    {/* Change Team Lead Button */}
                    <div className="mt-3">
                      <button
                         onClick={() => handleModal('Team Lead')}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Change Team Lead
                      </button>
                    </div>
                  </div>
                )}

                
                <h4 className="font-medium text-gray-700 mt-6 mb-2">Team Members</h4>
                <ul className="space-y-4">
                  {members && members.length > 0 ? (
                    members.map((member) => (
                      <li key={member.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="h-full w-full object-cover rounded-full" />
                          ) : (
                            <span>{member.name ? member.name.split(' ').map((n) => n[0]).join('') : 'U'}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{member.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{member.role?.name || 'No position'}</p>
                          <span className={`mt-1 inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(member.is_active)}`}>
                            {member.is_active?'active': 'inactive'}
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center py-4 text-gray-500">No members found</li>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900">Recent Activities</h3>
                <ul className="mt-4 space-y-4">
                  {activities.map((activity) => (
                    <li key={activity.id} className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                        {activity.user.avatar ? (
                          <img src={activity.user.avatar} alt={activity.user.name} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <span>{activity.user.name.split(' ').map((n) => n[0]).join('')}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.user.name}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeamDetailView;