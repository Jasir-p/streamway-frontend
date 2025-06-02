import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, User, MessageSquare, Users } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useSelector } from 'react-redux';
import { fetchGroupMessage, GroupChatPersonal } from '../../../../../Intreceptors/ChatsApi';
import { format } from 'date-fns';

export default function ChatUI() {
  const [activeTab, setActiveTab] = useState('group'); // Default to group
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userID = useSelector((state) => state.profile.id);
  const role = useSelector((state) =>state.auth.role)

  // Set up WebSocket connection
  useEffect(() => {
    // Close previous connection if exists
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Only establish connection if there's an active chat
    if (!activeChat) return;

    const subdomain = localStorage.getItem('subdomain');
    const roomID = activeChat.id;
    
    // Create connection with room ID
    const token = localStorage.getItem("access_token");
    console.log(token);
    socketRef.current = new WebSocket(`ws://${subdomain}.localhost:8000/ws/chat/${roomID}/?token=${token}`);
    
    socketRef.current.onopen = () => {
      console.log(`WebSocket Connected to room: ${roomID}`);
      setSocketConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("send",data,messages);
      
      if (data.type === 'chat') {

        setMessages(prev => [...prev, data.message]);
      }
    };

    socketRef.current.onclose = () => {
      console.log(`WebSocket Disconnected from room: ${roomID}`);
      setSocketConnected(false);
      
      // Don't automatically reconnect here - we'll reconnect when needed
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setSocketConnected(false);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [activeChat]); // Reconnect when active chat changes

  // Initial data fetching
  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      // Replace with actual API endpoints
      const personal = null;
      const groups = await GroupChatPersonal(userID);
      console.log('Group chats:', groups);
      
      setPersonalChats(personal || []);
      setGroupChats(groups || []);
      
      // Set active chat to first group chat if available
      if (groups?.length > 0) {
        const firstChat = groups[0];
        setActiveChat(firstChat);
        fetchMessages(firstChat.id);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      // Replace with actual API endpoint
      const data = await fetchGroupMessage(chatId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current || !activeChat) return;
    
    // Check socket connection state
    if (socketRef.current.readyState !== WebSocket.OPEN) {
      console.log('Socket not connected, attempting to reconnect...');
      // Attempt to reconnect
      const subdomain = localStorage.getItem('subdomain');
      const token = localStorage.getItem("access_token");
      console.log(token);
      socketRef.current = new WebSocket(
        `ws://${subdomain}.localhost:8000/ws/chat/${activeChat.id}/?token=${token}`
      );
      
      // Set up a temporary handler to send message once connected
      socketRef.current.onopen = () => {
        sendMessageToSocket();
        setSocketConnected(true);
        
        // Reset onopen handler to normal behavior
        socketRef.current.onopen = () => {
          console.log(`WebSocket Connected to room: ${activeChat.id}`);
          setSocketConnected(true);
        };
      };
      
      return;
    }
    
    sendMessageToSocket();
  };
  
  const sendMessageToSocket = () => {
    if (!activeChat || !message.trim()) return;
    
    const messageData = {
      type: 'chat',
      chatId: activeChat.id,
      roomId: activeChat.id, // Explicitly include roomId
      message: message.trim(),
      sender: userID
    };

    socketRef.current.send(JSON.stringify(messageData));
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const firstChat = tab === 'personal' ? personalChats[0] : groupChats[0];
    if (firstChat) {
      setActiveChat(firstChat);
      fetchMessages(firstChat.id);
    }
  };

  const selectChat = (chat) => {
    if (activeChat?.id === chat.id) return; // Don't reselect the same chat
    
    setActiveChat(chat);
    fetchMessages(chat.id);
  };

  // Format participants to display names
  const formatParticipants = (participants) => {
    if (!participants || participants.length === 0) return "No members";
    
    // Display participant names for the tooltip
    return participants.map(p => p.name).join(', ');
  };

  // Get participant count
  const getParticipantCount = (participants) => {
    return participants?.length || 0;
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-100">
        <div className={`${sidebarOpen ? 'w-64' : 'w-0 lg:w-64'} bg-white border-r border-gray-200 transition-all duration-300`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Messages</h2>
              <User size={20} className="text-gray-600" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full p-2 pl-8 rounded-md bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search size={16} className="absolute left-2 top-3 text-gray-400" />
            </div>
          </div>
          <div className="overflow-y-auto h-full pb-20">
            <div className="flex p-2 border-b border-gray-200">
              <button
                className={`flex-1 py-2 text-center ${activeTab === 'personal' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                onClick={() => handleTabChange('personal')}
              >
                Personal
              </button>
              <button
                className={`flex-1 py-2 text-center ${activeTab === 'group' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                onClick={() => handleTabChange('group')}
              >
                Groups
              </button>
            </div>
            {activeTab === 'personal' ? (
              personalChats?.length > 0 ? (
                personalChats.map(chat => (
                  <div
                    key={chat.id}
                    className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${activeChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                    onClick={() => selectChat(chat)}
                  >
                    <div className="relative">
                      <img src={chat.avatar || "/api/placeholder/40/40"} alt={chat.name} className="w-10 h-10 rounded-full" />
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No personal chats found</div>
              )
            ) : (
              groupChats?.length > 0 ? (
                groupChats.map(chat => (
                  <div
                    key={chat.id}
                    className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${activeChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                    onClick={() => selectChat(chat)}
                  >
                    <div className="relative">
                      <img src="/api/placeholder/40/40" alt={chat.room_name} className="w-10 h-10 rounded-full bg-gray-200" />
                      <div 
                        className="absolute bottom-0 right-0 bg-gray-100 rounded-full text-xs px-1 border border-gray-200"
                        title={formatParticipants(chat.participents)}
                      >
                        {getParticipantCount(chat.participents)}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{chat.room_name}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(chat.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.participents?.length > 0 
                          ? `${chat.participents[0].name}${chat.participents.length > 1 ? ` & ${chat.participents.length - 1} more` : ''}`
                          : "No members"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No group chats found</div>
              )
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <button className="lg:hidden mr-2" onClick={() => setSidebarOpen(prev => !prev)}>
                    <MessageSquare size={20} />
                  </button>
                  <img 
                    src="/api/placeholder/40/40" 
                    alt={activeChat.room_name || activeChat.name} 
                    className="w-10 h-10 rounded-full bg-gray-200" 
                  />
                  <div className="ml-3">
                    <h2 className="font-medium">{activeChat.room_name || activeChat.name}</h2>
                    <p className="text-xs text-gray-500">
                      {activeTab === 'personal' 
                        ? (activeChat.online ? 'Online' : 'Offline') 
                        : `${getParticipantCount(activeChat.participents)} members`}
                    </p>
                    {!socketConnected && <span className="text-xs text-red-500">Reconnecting...</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-600 hover:text-gray-800">
                    <Phone size={20} />
                  </button>
                  {activeTab === 'group' && (
                    <button className="text-gray-600 hover:text-gray-800" title={formatParticipants(activeChat.participents)}>
                      <Users size={20} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {messages.length > 0 ? (
                    messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.sender?.id === userID || (!msg.sender && role==="owner") ? 'justify-end' : ''}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender?.id === userID || (!msg.sender  && role ==="owner")? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        <p className="text-xs font-bold mb-1">
                          {msg.sender?.id
                            ? msg.sender.id !== userID
                              ? msg.sender.name
                              : "You"
                            : "Owner"}
                        </p>
                          <p>{msg.content}</p>
                          <span className="text-xs mt-1 block opacity-70">{msg.timestamp ? format(new Date(msg.timestamp), 'hh:mm a, MMM d') : ''}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">No messages yet</div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t border-gray-200 p-4">
                <form onSubmit={sendMessage} className="flex items-center space-x-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-2 border rounded-md resize-none"
                    placeholder="Type your message..."
                    rows="2"
                  />
                  <button 
                    type="submit" 
                    disabled={!message.trim() || !socketConnected}
                    className={`${message.trim() && socketConnected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'} text-white p-2 rounded-full h-10 w-10 flex items-center justify-center`}
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Select a conversation</h3>
                <p className="text-gray-500 mt-2">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}