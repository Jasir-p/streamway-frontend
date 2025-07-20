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
        
      }
    });
  }, []);

  const notifyConnectionHandlers = useCallback((event) => {
    connectionHandlersRef.current.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        
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
    
    
    // Validate required parameters
    if (!token || !subdomain || !type) {
      const error = new Error(`Missing required parameters: ${!token ? 'token ' : ''}${!subdomain ? 'subdomain ' : ''}${!type ? 'type' : ''}`);
      
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
      ? `wss://api.streamway.solutions/${subdomain}/ws/${type}/${roomId}/?token=${token}`
      : `wss://api.streamway.solutions/${subdomain}/ws/${type}/?token=${token}`;

      //  const wsUrl = roomId
      // ? `ws://localhost:8000/${subdomain}/ws/${type}/${roomId}/?token=${token}`
      // : `ws://localhost:8000/${subdomain}/ws/${type}/?token=${token}`;


    

    try {
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {

        setIsConnected(true);
        setConnectionStatus('connected');
        const event = { type: 'connected', roomId, wsType: type };
        notifyConnectionHandlers(event);
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        setLastMessage(data);
        notifyMessageHandlers(data);
      };

      socketRef.current.onclose = (event) => {
        
        setIsConnected(false);
        setConnectionStatus('disconnected');
        const connectionEvent = { type: 'disconnected', roomId, wsType: type, event };
        notifyConnectionHandlers(connectionEvent);
      };

      socketRef.current.onerror = (error) => {
        
        setIsConnected(false);
        setConnectionStatus('error');
        const connectionEvent = { type: 'error', error, roomId, wsType: type };
        notifyConnectionHandlers(connectionEvent);
      };

    } catch (error) {
      
      setConnectionStatus('error');
      const connectionEvent = { type: 'error', error, roomId, wsType: type };
      notifyConnectionHandlers(connectionEvent);
    }
  }, [notifyConnectionHandlers, notifyMessageHandlers]);

  const sendMessage = useCallback((messageData) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify(messageData));
        
        return true;
      } catch (error) {
        
        return false;
      }
    }
    
    return false;
  }, []);

  const reconnect = useCallback((token, subdomain) => {
    if (currentRoomId !== null && currentType) {
      
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
      
      webSocket.connect(roomId, token, subdomain, type);
      setIsReady(true);
    }
  }, [webSocket, roomId, token, subdomain, type, autoConnect]);

  const connectToRoom = useCallback((newRoomId) => {
    if (token && subdomain && type) {
      webSocket.connect(newRoomId, token, subdomain, type);
    } else {
      
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