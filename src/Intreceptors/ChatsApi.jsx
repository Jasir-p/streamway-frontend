import subdomainInterceptors from "./getSubdomainInterceptors"
import axios from "axios";



export const GroupChatPersonal = async (userID) => {
  try {
    const params = {
      group_chat: true,
      ...(userID && { user: userID }) // only include 'user' if userId exists
    };

    const response = await subdomainInterceptors.get('api/rooms/', {
      params
    });

    return response.data;
  } catch (error) {
    
    throw error;
  }
};




export const fetchGroupMessage = async (roomId) => {
  const subdomain = localStorage.getItem("subdomain");
  const accessToken = localStorage.getItem("access_token");

  if (!subdomain) {
    
    throw new Error("Subdomain is required");
  }

  if (!accessToken) {
    
    throw new Error("User is not authenticated");
  }




  try {
    const response = await axios.get(
      `https://api.streamway.solutions/${subdomain}/api/rooms/${roomId}/messages/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    
    throw error;
  }
};


