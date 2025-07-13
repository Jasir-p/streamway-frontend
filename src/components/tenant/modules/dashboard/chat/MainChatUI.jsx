// components/chat/ChatUI.jsx
import React, { useState, useEffect, useCallback,useRef } from 'react';
import { Search, User, Plus } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useSelector } from 'react-redux';
import { fetchGroupMessage, GroupChatPersonal } from '../../../../../Intreceptors/ChatsApi';
import { useWebSocket } from './WebSocketHandler';
import MainChat from './MainChat';
import PersonalChat from './PersonalChat';
import GroupChat from './GroupChat';
import { getUser } from '../../../../../Intreceptors/LeadsApi';

export default function ChatUI() {
  const [activeTab, setActiveTab] = useState('group');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [initialConnectionMade, setInitialConnectionMade] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  // Use refs to store stable references
  const reconnectTimeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);
  
  const userID = useSelector((state) => state.profile.id);
  const role = useSelector((state) => state.auth.role);
  const subdomain = localStorage.getItem('subdomain');
  const token = localStorage.getItem("access_token");
  // Use WebSocket hook
const {
    isConnected,
    connectionStatus,
    lastMessage,
    currentRoomId,
    currentType,
    connect,
    disconnect,
    sendMessage,
    reconnect,
    addMessageHandler,
    addConnectionHandler,
    getConnectionStatus
  } = useWebSocket();

  // Stable function references using useCallback with proper dependencies
  const fetchChats = useCallback(async () => {
    if (isUnmountedRef.current) return;
    
    try {
      
      const personal = null; // TODO: Implement personal chat fetching
      const groups = await GroupChatPersonal(role === 'owner' ? null : userID);
      
      
      if (isUnmountedRef.current) return;
      
      setPersonalChats(personal || []);
      setGroupChats(groups || []);
      
      // Fetch available users for group management
      const users = await getUser(role === 'owner' ? role : userID);
      if (isUnmountedRef.current) return;
      
      setAvailableUsers(users || []);
      
      // Set active chat to first group chat if available and no current active chat
      if (groups?.length > 0) {
        setActiveChat(prevActiveChat => {
          if (!prevActiveChat) {
            const firstChat = groups[0];
            // Fetch messages for first chat
            fetchMessages(firstChat.id);
            return firstChat;
          }
          return prevActiveChat;
        });
      }
    } catch (error) {
      
    }
  }, [userID, role]);

  const fetchMessages = useCallback(async (chatId) => {
    if (isUnmountedRef.current) return;
    
    try {
      
      const data = await fetchGroupMessage(chatId);
      
      
      if (isUnmountedRef.current) return;
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      
      if (!isUnmountedRef.current) {
        setMessages([]);
      }
    }
  }, []);

  // Handle incoming WebSocket messages with stable callback
  const handleMessage = useCallback((data) => {
    if (isUnmountedRef.current) return;
    
    
    
    try {
      switch(data.type) {
        case 'chat':
        case 'message':
          // Handle incoming chat messages
          if (data.message) {
            setMessages(prev => {
              // Avoid duplicate messages
              const messageExists = prev.some(msg => 
                msg.id === data.message.id || 
                (msg.content === data.message.content && 
                 msg.sender === data.message.sender && 
                 Math.abs(new Date(msg.timestamp) - new Date(data.message.timestamp)) < 1000)
              );
              
              if (!messageExists) {
                return [...prev, data.message];
              }
              return prev;
            });
          }
          break;
          
        case 'GROUP_CREATED':
        case 'group_created':
          
          fetchChats(); 
          if (data.group) {
            
            // Optionally switch to the new group
            setActiveChat(data.group);
            setActiveTab('group');
          }
          setShowCreateGroupModal(false);
          break;
          
        case 'group_updated':
          
          fetchChats();
          break;
          
        case 'user_added':
          
          fetchChats();
          // Update current active chat if it's the affected group
          setActiveChat(prevChat => {
            if (prevChat && prevChat.id === data.group_id) {
              fetchMessages(data.group_id);
            }
            return prevChat;
          });
          break;
          
        case 'user_removed':
          
          fetchChats();
          // Update current active chat if it's the affected group
          setActiveChat(prevChat => {
            if (prevChat && prevChat.id === data.group_id) {
              fetchMessages(data.group_id);
            }
            return prevChat;
          });
          break;
          
        case 'group_deleted':
          
          fetchChats();
          // If the deleted group was active, clear it
          setActiveChat(prevChat => {
            if (prevChat && prevChat.id === data.group_id) {
              setMessages([]);
              // Reconnect to general chat
              if (token && subdomain) {
                connect(null, token, subdomain, 'chat');
              }
              return null;
            }
            return prevChat;
          });
          break;
          
        case 'error':
          
          setConnectionError(data.message || 'Unknown error occurred');
          break;
          
        default:
          
      }
    } catch (error) {
      
    }
  }, [fetchChats, fetchMessages, token, subdomain, connect]);

  // Handle connection status changes with stable callback
  const handleConnection = useCallback((event) => {
    if (isUnmountedRef.current) return;
    
    
    
    switch(event.type) {
      case 'connected':
        
        setConnectionError(null);
        break;
        
      case 'disconnected':
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        // Attempt to reconnect after a delay
        reconnectTimeoutRef.current = setTimeout(() => {
          if (token && subdomain && !isUnmountedRef.current) {
            
            reconnect(token, subdomain);
          }
        }, 3000);
        break;
        
      case 'error':
        
        setConnectionError('Connection failed. Retrying...');
        break;
    }
  }, [token, subdomain, reconnect]);

  // Set up WebSocket event handlers ONCE
  useEffect(() => {
    if (!addMessageHandler || !addConnectionHandler) return;
    
    const removeMessageHandler = addMessageHandler(handleMessage);
    const removeConnectionHandler = addConnectionHandler(handleConnection);

    return () => {
      removeMessageHandler?.();
      removeConnectionHandler?.();
    };
  }, [addMessageHandler, addConnectionHandler]); // Remove handleMessage and handleConnection from deps

  // Initial WebSocket connection - only run once
  useEffect(() => {
    if (token && subdomain && !initialConnectionMade && !isUnmountedRef.current) {
      
      connect(null, token, subdomain, 'chat');
      setInitialConnectionMade(true);
    }
  }, [token, subdomain]); // Remove connect and initialConnectionMade from deps

  // Handle active chat changes - switch rooms (with debouncing)
  useEffect(() => {
    if (activeChat && isConnected && activeChat.id !== currentRoomId && !isUnmountedRef.current) {
      
      // Add small delay to prevent rapid switching
      const timeoutId = setTimeout(() => {
        if (!isUnmountedRef.current) {
          connect(activeChat.id, token, subdomain, 'chat');
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeChat?.id, isConnected, currentRoomId]);


  useEffect(() => {
    fetchChats();
  }, []);
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  const handleSendMessage = useCallback((message) => {
    const messageText = typeof message === "string" ? message.trim() : "";

    if (!messageText || !activeChat) {
      
      return false;
    }
    
    if (!isConnected) {
      
      setConnectionError('Not connected to chat server');
      return false;
    }
    
    const messageData = {
      type: 'chat',
      chatId: activeChat.id,
      roomId: activeChat.id,
      message: messageText,
      sender: userID,
      timestamp: new Date().toISOString()
    };

    
    const success = sendMessage(messageData);
    
    if (!success) {
      setConnectionError('Failed to send message');
    }
    
    return success;
  }, [activeChat, userID, sendMessage, isConnected]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    const chats = tab === 'personal' ? personalChats : groupChats;
    const firstChat = chats[0];
    
    if (firstChat && firstChat.id !== activeChat?.id) {
      setActiveChat(firstChat);
      fetchMessages(firstChat.id);
    } else if (!firstChat) {
      setActiveChat(null);
      setMessages([]);
      // Connect to general chat when no specific chat is selected
      if (isConnected && currentRoomId && token && subdomain) {
        connect(null, token, subdomain, 'chat');
      }
    }
  }, [personalChats, groupChats, activeChat?.id, fetchMessages, isConnected, currentRoomId, token, subdomain, connect]);

  const selectChat = useCallback((chat) => {
    if (activeChat?.id === chat.id) return;
    
    
    setActiveChat(chat);
    fetchMessages(chat.id);
  }, [activeChat?.id, fetchMessages]);

  // Group management functions with better error handling
  const handleCreateGroup = useCallback(async (groupData) => {
    try {
      
      
      if (!isConnected) {
        setConnectionError('Not connected to chat server. Cannot create group.');
        return false;
      }
      
      if (!groupData.name || !groupData.name.trim()) {
        setConnectionError('Group name is required');
        return false;
      }
      
      const sendGroupData = {
        type: 'addgroup',
        room_name: groupData.name.trim(),
        participants: groupData.participants || []
      };
      
      const success = sendMessage(sendGroupData);
      
      if (success) {
        
        setConnectionError(null);
      } else {
        setConnectionError('Failed to send group creation message');
      }
      
      return success;
      
    } catch (error) {
      
      setConnectionError('Error creating group');
      return false;
    }
  }, [isConnected, sendMessage]);

  const handleDeleteGroup = useCallback(async (groupId) => {
    try {
      
      
      if (!isConnected) {
        setConnectionError('Not connected to chat server. Cannot delete group.');
        return false;
      }
      
      const deleteGroupData = {
        type: 'removegroup',
        room_id: groupId
      };
      
      const success = sendMessage(deleteGroupData);
      
      if (success) {
        
        setConnectionError(null);
        
        // If the deleted group was active, clear active chat
        if (activeChat?.id === groupId) {
          setActiveChat(null);
          setMessages([]);
          // Reconnect to general WebSocket (no room)
          if (token && subdomain) {
            connect(null, token, subdomain, 'chat');
          }
        }
      } else {
        setConnectionError('Failed to delete group');
      }
      
      return success;
      
    } catch (error) {
      
      setConnectionError('Error deleting group');
      return false;
    }
  }, [isConnected, sendMessage, activeChat?.id, connect, token, subdomain]);

  const handleAddUser = useCallback(async (groupId, userId) => {
    try {
      
      
      if (!isConnected) {
        setConnectionError('Not connected to chat server. Cannot add user.');
        return false;
      }
      
      const addUserData = {
        type: 'adduser',
        group_id: groupId,
        user_id: userId
      };
      
      const success = sendMessage(addUserData);
      
      if (success) {
        
        setConnectionError(null);
      } else {
        setConnectionError('Failed to add user to group');
      }
      
      return success;
      
    } catch (error) {
      
      setConnectionError('Error adding user to group');
      return false;
    }
  }, [isConnected, sendMessage]);

  const handleRemoveUser = useCallback(async (groupId, userId) => {
    try {
      
      
      if (!isConnected) {
        setConnectionError('Not connected to chat server. Cannot remove user.');
        return false;
      }
      
      const removeUserData = {
        type: 'removeuser',
        group_id: groupId,
        user_id: userId
      };
      
      const success = sendMessage(removeUserData);
      
      if (success) {
        
        setConnectionError(null);
      } else {
        setConnectionError('Failed to remove user from group');
      }
      
      return success;
      
    } catch (error) {
      
      setConnectionError('Error removing user from group');
      return false;
    }
  }, [isConnected, sendMessage]);

  // Utility functions - memoized to prevent re-renders
  const formatParticipants = useCallback((participants) => {
    if (!participants || participants.length === 0) return "No members";
    return participants.map(p => p.name).join(', ');
  }, []);

  const getParticipantCount = useCallback((participants) => {
    return participants?.length || 0;
  }, []);



  const handleCreateGroupClick = useCallback(() => {
    if (activeTab === 'group') {
      setShowCreateGroupModal(true);
    }
  }, [activeTab]);

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-100">

        

        {/* Error notification */}
        {connectionError && (
          <div className="fixed top-16 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow z-50 max-w-sm">
            <div className="flex">
              <div className="py-1">
                <span className="text-sm">{connectionError}</span>
              </div>
              <div className="pl-3">
                <button
                  onClick={() => setConnectionError(null)}
                  className="text-red-700 hover:text-red-900"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h1 className="text-xl font-semibold text-gray-800">Chats</h1>
              )}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? '←' : '→'}
              </button>
            </div>
            
            {sidebarOpen && (
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Chat Tabs */}
          {sidebarOpen && (
            <div className="flex border-b border-gray-200">
             
              <button
                onClick={() => handleTabChange('group')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'group'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Groups
              </button>
            </div>
          )}

          {/* Add Group Button - Shows when on group tab */}
          {sidebarOpen && activeTab === 'group' && (
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={handleCreateGroupClick}
                disabled={!isConnected}
                className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
                  isConnected
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create New Group</span>
              </button>
            </div>
          )}

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {sidebarOpen ? (
              <div className="p-2">
                {activeTab === 'personal' ? (
                  personalChats.length > 0 ? (
                    personalChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => selectChat(chat)}
                        className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                          activeChat?.id === chat.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {chat.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {chat.lastMessage || 'No messages yet'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No personal chats yet</p>
                      <p className="text-xs mt-1">Start a conversation to see it here</p>
                    </div>
                  )
                ) : (
                  groupChats.length > 0 ? (
                    groupChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => selectChat(chat)}
                        className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                          activeChat?.id === chat.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {chat.room_name?.charAt(0)?.toUpperCase() || 'G'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {chat.room_name || 'Unnamed Group'}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {getParticipantCount(chat.participents)} members • {formatParticipants(chat.participents)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <p>No group chats yet</p>
                      <p className="text-xs mt-1">Create a group to get started</p>
                    </div>
                  )
                )}
              </div>
            ) : (
              // Collapsed sidebar - show minimal chat indicators
              <div className="p-2 space-y-2">
                {/* Add Group Button for collapsed sidebar */}
                {activeTab === 'group' && (
                  <button
                    onClick={handleCreateGroupClick}
                    disabled={!isConnected}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors mb-2 ${
                      isConnected
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    title="Create New Group"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
                
                {(activeTab === 'personal' ? personalChats : groupChats)
                  .slice(0, 8)
                  .map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => selectChat(chat)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                        activeChat?.id === chat.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {activeTab === 'personal' ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <span className="font-medium text-sm">
                          {chat.room_name?.charAt(0)?.toUpperCase() || 'G'}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <span className="text-white font-medium text-sm">
                    {role?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {role || 'User'}
                  </div>
                  <div className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            activeTab === 'personal' ? (
              <PersonalChat
                chat={activeChat}
                messages={messages}
                onSendMessage={handleSendMessage}
                currentUser={userID}
                isConnected={isConnected}
                users={availableUsers}
              />
            ) : (
              <GroupChat
                chat={activeChat}
                messages={messages}
                onSendMessage={handleSendMessage}
                currentUser={userID}
                role={role}
                availableUsers={availableUsers}
                onCreateGroup={handleCreateGroup}
                getParticipantCount={getParticipantCount}
                onAddUser={handleAddUser}
                onRemoveUser={handleRemoveUser}
                onDeleteGroup={handleDeleteGroup}
                showCreateGroupModal={showCreateGroupModal}
                setShowCreateGroupModal={setShowCreateGroupModal}
                isConnected={isConnected}
              />
            )
          ) : (
            <MainChat
              onCreateGroup={handleCreateGroup}
              availableUsers={availableUsers}
              // isConnected={isConnected}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}