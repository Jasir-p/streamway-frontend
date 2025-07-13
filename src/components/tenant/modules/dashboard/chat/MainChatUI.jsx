// components/chat/ChatUI.jsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Search, User, Plus } from 'lucide-react';
import DashboardLayout from '../../../dashboard/DashbordLayout';
import { useSelector } from 'react-redux';
import { fetchGroupMessage, GroupChatPersonal } from '../../../../../Intreceptors/ChatsApi';
import { useWebSocket } from './WebSocketHandler';
import MainChat from './MainChat';
import GroupChat from './GroupChat';
import { getUser } from '../../../../../Intreceptors/LeadsApi';

export default function ChatUI() {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  // Use refs to store stable references
  const reconnectTimeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);
  const lastFetchRef = useRef(0);
  const connectionAttemptsRef = useRef(0);
  const maxConnectionAttempts = 5;
  
  const userID = useSelector((state) => state.profile.id);
  const role = useSelector((state) => state.auth.role);
  const subdomain = localStorage.getItem('subdomain');
  const token = localStorage.getItem("access_token");
  
  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(() => ({
    userID,
    role,
    subdomain,
    token
  }), [userID, role, subdomain, token]);
  
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

  // Debounced fetchChats to prevent excessive API calls
  const fetchChats = useCallback(async (forceUpdate = false) => {
    if (isUnmountedRef.current) return;
    
    const now = Date.now();
    if (!forceUpdate && now - lastFetchRef.current < 1000) {
            return;
    }
    lastFetchRef.current = now;
    
    try {
            const groups = await GroupChatPersonal(role === 'owner' ? null : userID);
      
      if (isUnmountedRef.current) return;
      
            setGroupChats(groups || []);
      
      // Fetch available users for group management only if we don't have them
      if (availableUsers.length === 0 || forceUpdate) {
        const users = await getUser(role === 'owner' ? role : userID);
        if (isUnmountedRef.current) return;
        setAvailableUsers(users || []);
      }
      
      // Update active chat if it exists in the new group list
      if (forceUpdate && activeChat) {
        const updatedChat = groups?.find(g => g.id === activeChat.id);
        if (updatedChat) {
                    setActiveChat(updatedChat);
        } else {
                    setMessages([]);
          setActiveChat(null);
        }
      } else if (!activeChat && groups?.length > 0) {
        // Set active chat to first group chat if available and no current active chat
        const firstChat = groups[0];
        setActiveChat(firstChat);
        fetchMessages(firstChat.id);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, [userID, role, availableUsers.length, activeChat?.id]);

  const fetchMessages = useCallback(async (chatId) => {
    if (isUnmountedRef.current || !chatId) return;
    
    try {
            const data = await fetchGroupMessage(chatId);
      
      if (isUnmountedRef.current) return;
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (!isUnmountedRef.current) {
        setMessages([]);
      }
    }
  }, []);

  // Stable message handler with memoization
  const handleMessage = useCallback((data) => {
    if (isUnmountedRef.current) return;
    
    try {
            
      switch(data.type) {
        case 'chat':
        case 'message':
          if (data.message) {
            setMessages(prev => {
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
                    setShowCreateGroupModal(false);
          // Delay the fetch to ensure server has processed the creation
          setTimeout(() => {
            fetchChats(true);
            if (data.group) {
              setActiveChat(data.group);
              fetchMessages(data.group.id);
            }
          }, 500);
          break;
          
        case 'group_updated':
        case 'user_added':
        case 'user_removed':
                    // Delay the fetch to ensure server has processed the update
          setTimeout(() => {
            fetchChats(true);
            if (activeChat && activeChat.id === data.group_id) {
              fetchMessages(data.group_id);
            }
          }, 500);
          break;
          
        case 'group_deleted':
                    if (activeChat && activeChat.id === data.group_id) {
            setActiveChat(null);
            setMessages([]);
          }
          setTimeout(() => fetchChats(true), 500);
          break;
          
        case 'error':
          console.error('WebSocket error:', data);
          setConnectionError(data.message || 'Unknown error occurred');
          break;
          
        default:
                }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }, [fetchChats, fetchMessages, activeChat?.id]);

  // Stable connection handler with rate limiting
  const handleConnection = useCallback((event) => {
    if (isUnmountedRef.current) return;
    
    switch(event.type) {
      case 'connected':
                connectionAttemptsRef.current = 0;
        setConnectionError(null);
        break;
        
      case 'disconnected':
                
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        // Only attempt to reconnect if we haven't exceeded max attempts
        if (connectionAttemptsRef.current < maxConnectionAttempts) {
          connectionAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, connectionAttemptsRef.current), 10000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (token && subdomain && !isUnmountedRef.current) {
              console.log(`Attempting to reconnect... (attempt ${connectionAttemptsRef.current})`);
              reconnect(token, subdomain);
            }
          }, delay);
        } else {
          setConnectionError('Connection failed. Please refresh the page.');
        }
        break;
        
      case 'error':
        console.error('WebSocket connection error:', event);
        setConnectionError('Connection failed. Retrying...');
        break;
    }
  }, [token, subdomain, reconnect]);

  // Set up WebSocket event handlers ONCE with stable dependencies
  useEffect(() => {
    if (!addMessageHandler || !addConnectionHandler) return;
    
    const removeMessageHandler = addMessageHandler(handleMessage);
    const removeConnectionHandler = addConnectionHandler(handleConnection);

    return () => {
      removeMessageHandler?.();
      removeConnectionHandler?.();
    };
  }, [addMessageHandler, addConnectionHandler]); // Removed unstable dependencies

  // Initial WebSocket connection - only run once when userData changes
  useEffect(() => {
    if (userData.token && userData.subdomain && !isUnmountedRef.current) {
            connect(null, userData.token, userData.subdomain, 'chat');
    }
  }, [userData.token, userData.subdomain, connect]);

  // Handle active chat changes with debouncing
  useEffect(() => {
    if (!activeChat || !isConnected || !userData.token || !userData.subdomain) return;
    
    if (activeChat.id !== currentRoomId && !isUnmountedRef.current) {
            
      // Clear any existing timeout
      const timeoutId = setTimeout(() => {
        if (!isUnmountedRef.current) {
          connect(activeChat.id, userData.token, userData.subdomain, 'chat');
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeChat?.id, isConnected, currentRoomId, connect, userData.token, userData.subdomain]);

  // Initial fetch - only run once
  useEffect(() => {
    fetchChats();
  }, []); // Empty dependency array - only run once

  // Cleanup
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
      console.warn('Cannot send message: missing text or active chat');
      return false;
    }
    
    if (!isConnected) {
      console.warn('Cannot send message: not connected');
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
      console.error('Error creating group:', error);
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
      } else {
        setConnectionError('Failed to delete group');
      }
      
      return success;
      
    } catch (error) {
      console.error('Error deleting group:', error);
      setConnectionError('Error deleting group');
      return false;
    }
  }, [isConnected, sendMessage]);

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
      console.error('Error adding user to group:', error);
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
      console.error('Error removing user from group:', error);
      setConnectionError('Error removing user from group');
      return false;
    }
  }, [isConnected, sendMessage]);

  // Memoized utility functions
  const formatParticipants = useCallback((participants) => {
    if (!participants || participants.length === 0) return "No members";
    return participants.map(p => p.name).join(', ');
  }, []);

  const getParticipantCount = useCallback((participants) => {
    return participants?.length || 0;
  }, []);

  const handleCreateGroupClick = useCallback(() => {
    setShowCreateGroupModal(true);
  }, []);

  const handleManualRefresh = useCallback(() => {
        fetchChats(true);
  }, [fetchChats]);

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
                <h1 className="text-xl font-semibold text-gray-800">Group Chats</h1>
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
                    placeholder="Search groups..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleManualRefresh}
                  className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 p-1 rounded"
                >
                  🔄 Refresh
                </button>
              </div>
            )}
          </div>

          {/* Add Group Button */}
          {sidebarOpen && (
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

          {/* Group Chat List */}
          <div className="flex-1 overflow-y-auto">
            {sidebarOpen ? (
              <div className="p-2">
                {groupChats.length > 0 ? (
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
                )}
              </div>
            ) : (
              <div className="p-2 space-y-2">
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
                
                {groupChats.slice(0, 8).map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      activeChat?.id === chat.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <span className="font-medium text-sm">
                      {chat.room_name?.charAt(0)?.toUpperCase() || 'G'}
                    </span>
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
            <GroupChat
              key={activeChat.id}
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
          ) : (
            <MainChat
              onCreateGroup={handleCreateGroup}
              availableUsers={availableUsers}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}