import subdomainInterceptors from "./getSubdomainInterceptors"


export const GroupChatPersonal = async (userID) => {
  try {
    const params = {
      group_chat: true,
      ...(userID && { user: userID }) // only include 'user' if userId exists
    };

    const response = await subdomainInterceptors.get('/api/rooms/', {
      params
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching group chat:", error);
    throw error;
  }
};



export const fetchGroupMessage = async(roomeId) =>{
    try {
        const response = await subdomainInterceptors.get(`/api/rooms/${roomeId}/messages
            `);
            return response.data;
            } catch (error) {
                console.error("Error fetching group message:", error);
                throw error;
                }
                };

