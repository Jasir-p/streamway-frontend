// hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  
  const socketRef = useRef(null);
  const messageHandlersRef = useRef(new Set());
  const connectionHandlersRef = useRef(new Set());
  const reconnectTimeoutRef = useRef(null);

  const notifyMessageHandlers = useCallback((data) => {
    messageHandlersRef.current.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('❗ Error in message handler:', error);
      }
    });
  }, []);

  const notifyConnectionHandlers = useCallback((event) => {
    connectionHandlersRef.current.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('❗ Error in connection handler:', error);
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
    setCurrentRoomId(null);
    setCurrentType(null);
  }, []);

  const connect = useCallback((roomId, token, subdomain, type) => {
    console.log('🔌 Connecting to WebSocket:', { roomId, type, subdomain });
    
    // Validate required parameters
    if (!token || !subdomain || !type) {
      const error = new Error(`Missing required parameters: ${!token ? 'token ' : ''}${!subdomain ? 'subdomain ' : ''}${!type ? 'type' : ''}`);
      console.error('❌ WebSocket connection failed:', error.message);
      setConnectionStatus('error');
      const connectionEvent = { type: 'error', error, roomId, wsType: type };
      notifyConnectionHandlers(connectionEvent);
      return;
    }
    
    // Close previous connection if exists
    if (socketRef.current) {
      socketRef.current.close();
    }

    setCurrentRoomId(roomId);
    setCurrentType(type);
    setConnectionStatus('connecting');

    // Build WebSocket URL based on whether roomId exists
    const wsUrl = roomId
      ? `ws://localhost:8000/${subdomain}/ws/${type}/${roomId}/?token=${token}`
      : `ws://localhost:8000/${subdomain}/ws/${type}/?token=${token}`;

    console.log('🌐 WebSocket URL:', wsUrl);

    try {
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log(`✅ WebSocket Connected to ${type}${roomId ? ` room: ${roomId}` : ''}`);
        setIsConnected(true);
        setConnectionStatus('connected');
        const event = { type: 'connected', roomId, wsType: type };
        notifyConnectionHandlers(event);
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📨 WebSocket received:", data);
        setLastMessage(data);
        notifyMessageHandlers(data);
      };

      socketRef.current.onclose = (event) => {
        console.log(`🔌 WebSocket Disconnected from ${type}${roomId ? ` room: ${roomId}` : ''}`, event);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        const connectionEvent = { type: 'disconnected', roomId, wsType: type, event };
        notifyConnectionHandlers(connectionEvent);
      };

      socketRef.current.onerror = (error) => {
        console.error('❌ WebSocket Error:', error);
        setIsConnected(false);
        setConnectionStatus('error');
        const connectionEvent = { type: 'error', error, roomId, wsType: type };
        notifyConnectionHandlers(connectionEvent);
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
      const connectionEvent = { type: 'error', error, roomId, wsType: type };
      notifyConnectionHandlers(connectionEvent);
    }
  }, [notifyConnectionHandlers, notifyMessageHandlers]);

  const sendMessage = useCallback((messageData) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify(messageData));
        console.log("📤 WebSocket sent:", messageData);
        return true;
      } catch (error) {
        console.error('❌ Failed to send message:', error);
        return false;
      }
    }
    console.warn('⚠️ WebSocket not connected. Cannot send message:', messageData);
    return false;
  }, []);

  const reconnect = useCallback((token, subdomain) => {
    if (currentRoomId !== null && currentType) {
      console.log('🔄 Reconnecting WebSocket...');
      connect(currentRoomId, token, subdomain, currentType);
    }
  }, [currentRoomId, currentType, connect]);

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
      currentRoomId,
      currentType,
      status: connectionStatus
    };
  }, [isConnected, currentRoomId, currentType, connectionStatus]);

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
    currentRoomId,
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

// Context Provider for sharing WebSocket across components
import { createContext, useContext } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const webSocket = useWebSocket();
  
  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

// Fixed useWebSocketConnection hook with proper parameter handling
export const useWebSocketConnection = (roomId, token, subdomain, type, autoConnect = false) => {
  const webSocket = useWebSocket();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (autoConnect && token && subdomain && type) {
      console.log('🚀 Auto-connecting WebSocket:', { roomId, type, subdomain });
      webSocket.connect(roomId, token, subdomain, type);
      setIsReady(true);
    }
  }, [webSocket, roomId, token, subdomain, type, autoConnect]);

  const connectToRoom = useCallback((newRoomId) => {
    if (token && subdomain && type) {
      webSocket.connect(newRoomId, token, subdomain, type);
    } else {
      console.error('❌ Cannot connect: missing required parameters', { token: !!token, subdomain: !!subdomain, type: !!type });
    }
  }, [webSocket, token, subdomain, type]);

  return {
    ...webSocket,
    connectToRoom,
    isReady
  };
};

// Specialized hooks for different WebSocket types
export const useChatWebSocket = (roomId, token, subdomain, autoConnect = false) => {
  return useWebSocketConnection(roomId, token, subdomain, 'chat', autoConnect);
};

export const useNotificationWebSocket = (token, subdomain, autoConnect = false) => {
  return useWebSocketConnection(null, token, subdomain, 'notification', autoConnect);
};