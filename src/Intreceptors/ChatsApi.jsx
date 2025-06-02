import subdomainInterceptors from "./getSubdomainInterceptors"


export const GroupChatPersonal = async (UserID) => {
    try {
        const response = await subdomainInterceptors.get('/api/rooms/');
        return response.data;
    } catch (error) {
        console.error("Error fetching personal chat:", error);
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

