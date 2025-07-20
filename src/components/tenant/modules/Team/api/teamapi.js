import axios from 'axios';
import subdomainInterceptors from '../../../../../Intreceptors/getSubdomainInterceptors';

// export const fetchTeamById = async (team_id) => {
//   const subdomain = localStorage.getItem("subdomain");
//   const token = localStorage.getItem("access_token");

//   try {
//     const response = await axios.get(`https://api.streamway.solutions/${subdomain}/team/`, {
//       params: { team_id },
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
    
//     throw error;
//   }
// };
export const fetchTeamById = async (team_id) => {
  const subdomain = localStorage.getItem("subdomain");
  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.get(`http://localhost:8000/${subdomain}/team/`, {
      params: { team_id },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    
    throw error;
  }
};

// export const addMember = async (team_id, user_id) => {
//   const subdomain = localStorage.getItem("subdomain");
//   const token = localStorage.getItem("access_token");
  
//   try {
//     const response = await axios.post(
//       `https://api.streamway.solutions/${subdomain}/team_members/`, 
//       { team: team_id, employee: user_id },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response;
//   } catch (error) {
    
//     return error.response || { error: "Unknown error occurred" };
//   }
// };
export const addMember = async (team_id, user_id) => {
  const subdomain = localStorage.getItem("subdomain");
  const token = localStorage.getItem("access_token");
  
  try {
    const response = await axios.post(
      `http://localhost:8000/${subdomain}/team_members/`, 
      { team: team_id, employee: user_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error) {
    
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
    
    throw error;
  }
};

export const getMembers = async (team_id) =>{
  try{
    const response = await subdomainInterceptors.get(`/team_members/?team=${team_id}`);
    return response.data.team_member;
  }
  catch(error){
    
  }
}