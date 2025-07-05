// hooks/useNotificationWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { createContext, useContext } from 'react';

export const useNotificationWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const [currentType] = useState('notification');
  
  const socketRef = useRef(null);
  const messageHandlersRef = useRef(new Set());
  const connectionHandlersRef = useRef(new Set());
  const reconnectTimeoutRef = useRef(null);

  const notifyMessageHandlers = useCallback((data) => {
    messageHandlersRef.current.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('❗ Error in notification message handler:', error);
      }
    });
  }, []);

  const notifyConnectionHandlers = useCallback((event) => {
    connectionHandlersRef.current.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('❗ Error in notification connection handler:', error);
      }
    });
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const connect = useCallback((token, subdomain) => {
    const type = 'notification';
    console.log('🔌 Connecting to Notification WebSocket:', { type, subdomain });
    
    // Validate required parameters
    if (!token || !subdomain) {
      const error = new Error(`Missing required parameters: ${!token ? 'token ' : ''}${!subdomain ? 'subdomain' : ''}`);
      console.error('❌ Notification WebSocket connection failed:', error.message);
      setConnectionStatus('error');
      const connectionEvent = { type: 'error', error, roomId: null, wsType: type };
      notifyConnectionHandlers(connectionEvent);
      return;
    }
    
    // Close previous connection if exists
    if (socketRef.current) {
      socketRef.current.close();
    }

    setConnectionStatus('connecting');

    // Build Notification WebSocket URL (no roomId required)
    const wsUrl = `wss://api.streamway.solutions/${subdomain}/ws/${type}/?token=${token}`;

    console.log('🌐 Notification WebSocket URL:', wsUrl);

    try {
      socketRef.current = new WebSocket(wsUrl);
      // socketRef.current=null

      socketRef.current.onopen = () => {
        console.log(`✅ Notification WebSocket Connected`);
        setIsConnected(true);
        setConnectionStatus('connected');
        const event = { type: 'connected', roomId: null, wsType: type };
        notifyConnectionHandlers(event);
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📨 Notification WebSocket received:", data);
        setLastMessage(data);
        notifyMessageHandlers(data);
      };

      socketRef.current.onclose = (event) => {
        console.log(`🔌 Notification WebSocket Disconnected`, event);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        const connectionEvent = { type: 'disconnected', roomId: null, wsType: type, event };
        notifyConnectionHandlers(connectionEvent);
      };

      socketRef.current.onerror = (error) => {
        console.error('❌ Notification WebSocket Error:', error);
        setIsConnected(false);
        setConnectionStatus('error');
        const connectionEvent = { type: 'error', error, roomId: null, wsType: type };
        notifyConnectionHandlers(connectionEvent);
      };

    } catch (error) {
      console.error('❌ Failed to create Notification WebSocket connection:', error);
      setConnectionStatus('error');
      const connectionEvent = { type: 'error', error, roomId: null, wsType: type };
      notifyConnectionHandlers(connectionEvent);
    }
  }, [notifyConnectionHandlers, notifyMessageHandlers]);

  const sendMessage = useCallback((messageData) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify(messageData));
        console.log("📤 Notification WebSocket sent:", messageData);
        return true;
      } catch (error) {
        console.error('❌ Failed to send notification message:', error);
        return false;
      }
    }
    console.warn('⚠️ Notification WebSocket not connected. Cannot send message:', messageData);
    return false;
  }, []);

  const reconnect = useCallback((token, subdomain) => {
    console.log('🔄 Reconnecting Notification WebSocket...');
    connect(token, subdomain);
  }, [connect]);

  const addMessageHandler = useCallback((handler) => {
    messageHandlersRef.current.add(handler);
    
    // Return cleanup function
    return () => {
      messageHandlersRef.current.delete(handler);
    };
  }, []);

  const addConnectionHandler = useCallback((handler) => {
    connectionHandlersRef.current.add(handler);
    
    // Return cleanup function
    return () => {
      connectionHandlersRef.current.delete(handler);
    };
  }, []);

  const getConnectionStatus = useCallback(() => {
    return {
      isConnected,
      readyState: socketRef.current?.readyState || WebSocket.CLOSED,
      currentRoomId: null, // Notifications don't use rooms
      currentType,
      status: connectionStatus
    };
  }, [isConnected, currentType, connectionStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // State
    isConnected,
    connectionStatus,
    lastMessage,
    currentRoomId: null, // Notifications don't use rooms
    currentType,
    
    // Methods
    connect,
    disconnect,
    sendMessage,
    reconnect,
    addMessageHandler,
    addConnectionHandler,
    getConnectionStatus
  };
};

// Context Provider for sharing Notification WebSocket across components
const NotificationWebSocketContext = createContext(null);

export const NotificationWebSocketProvider = ({ children }) => {
  const notificationWebSocket = useNotificationWebSocket();
  
  return (
    <NotificationWebSocketContext.Provider value={notificationWebSocket}>
      {children}
    </NotificationWebSocketContext.Provider>
  );
};

export const useNotificationWebSocketContext = () => {
  const context = useContext(NotificationWebSocketContext);
  if (!context) {
    throw new Error('useNotificationWebSocketContext must be used within a NotificationWebSocketProvider');
  }
  return context;
};

// Notification WebSocket connection hook with auto-connect
export const useNotificationWebSocketConnection = (token, subdomain, autoConnect = false) => {
  const notificationWebSocket = useNotificationWebSocket();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (autoConnect && token && subdomain) {
      console.log('🚀 Auto-connecting Notification WebSocket:', { subdomain });
      notificationWebSocket.connect(token, subdomain);
      setIsReady(true);
    }
  }, [notificationWebSocket, token, subdomain, autoConnect]);

  return {
    ...notificationWebSocket,
    isReady
  };
};