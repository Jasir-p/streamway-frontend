import axios from 'axios';
import subdomainInterceptors from '../../../../../Intreceptors/getSubdomainInterceptors';

export const fetchTeamById = async (team_id) => {
  const subdomain = localStorage.getItem("subdomain");
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`http://${subdomain}.localhost:8000/team/`, {
      params: { team_id },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching team:", error.response?.data || error.message);
    throw error;
  }
};

export const addMember = async (team_id, user_id) => {
  const subdomain = localStorage.getItem("subdomain");
  const token = localStorage.getItem("access_token");
  
  try {
    const response = await axios.post(
      `http://${subdomain}.localhost:8000/team_members/`, 
      { team: team_id, employee: user_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error) {
    console.error("Error adding member:", error.response?.data || error.message);
    return error.response || { error: "Unknown error occurred" };
  }
};

export const removeMember = async (team_id, selectedMemberId) => {
  try {
    const response = await subdomainInterceptors.delete('/team_members/', { 
      data: { team: team_id, member_id: selectedMemberId }
    });
    return response;
  } catch (error) {
    console.error("Error removing member:", error.response?.data || error.message);
    throw error;
  }
};

export const getMembers = async (team_id) =>{
  try{
    const response = await subdomainInterceptors.get(`/team_members/?team=${team_id}`);
    return response.data.team_member;
  }
  catch(error){
    console.error("Error fetching members:", error.response?.data || error.message);
  }
}