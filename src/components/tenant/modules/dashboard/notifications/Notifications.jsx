import { useState, useEffect } from 'react';
import { Bell, Filter, Search, CheckSquare, MessageCircle, Clock, User, X, MoreHorizontal } from 'lucide-react';
import { useNotificationWebSocket } from './WebsocketNottification'; // Updated import path

// Fallback icon component for unknown types
const FallbackIcon = () => <Bell className="w-4 h-4" />;

export default function NotificationsModal({ isOpen = true, onClose = () => {}, setCount }) {
  const {
    isConnected,
    connectionStatus,
    lastMessage,
    currentRoomId, // This will always be null for notifications
    connect,
    disconnect,
    sendMessage,
    reconnect,
    addMessageHandler,
    addConnectionHandler,
    getConnectionStatus,
  } = useNotificationWebSocket();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const subdomain = localStorage.getItem('subdomain');
    const token = localStorage.getItem('access_token');

    if (token && subdomain) {
      console.log('Making initial Notification WebSocket connection...', { subdomain });
      // Updated call - notifications don't need roomId, only token and subdomain
      connect(token, subdomain);

      const messageCleanup = addMessageHandler((data) => {
        console.log('📨 Raw notification message received:', data);
        try {
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          console.log('📨 Parsed notification received:', parsedData);

          if (Array.isArray(parsedData)) {
            let unreadCount = 0;
            
            parsedData.forEach((notification) => {
              const isRead = notification.is_read || false;
              if (!isRead) unreadCount += 1;
              
              const newNotification = {
                id: notification.id,
                type: (notification.type || 'task').toLowerCase(), // Normalize type to lowercase
                title: notification.message || 'New notification',
                message: notification.message || '',
                user: notification.user || null,
                time: notification.timestamp || 'Just now',
                read: isRead,
              };
              console.log('Adding notification:', newNotification); // Debug
              setNotifications((prev) => [newNotification, ...prev]);
            });
            
            setCount(unreadCount);
          } else if (parsedData && typeof parsedData === 'object') {
            // Handle single notification object
            const isRead = parsedData.is_read || false;
            const newNotification = {
              id: parsedData.id,
              type: (parsedData.type || 'task').toLowerCase(),
              title: parsedData.message || 'New notification',
              message: parsedData.message || '',
              user: parsedData.user || null,
              time: parsedData.timestamp || 'Just now',
              read: isRead,
            };
            
            console.log('Adding single notification:', newNotification);
            setNotifications((prev) => [newNotification, ...prev]);
            
            if (!isRead) {
              setCount((prevCount) => prevCount + 1);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket notification message:', error);
        }
      });

      // Optional: Add connection status handler
      const connectionCleanup = addConnectionHandler((event) => {
        console.log('📡 Notification WebSocket connection event:', event);
        if (event.type === 'connected') {
          console.log('✅ Successfully connected to notification WebSocket');
        } else if (event.type === 'error') {
          console.error('❌ Notification WebSocket connection error:', event.error);
        }
      });

      return () => {
        console.log('Cleaning up Notification WebSocket connection');
        messageCleanup();
        connectionCleanup();
        disconnect(); // Properly disconnect the WebSocket
      };
    } else {
      console.warn('No token or subdomain found, skipping Notification WebSocket connection');
    }
  }, [connect, addMessageHandler, addConnectionHandler, disconnect, setCount]);

  console.log('Notifications state:', notifications);
  console.log('WebSocket connection status:', { isConnected, connectionStatus });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      (filter === 'task' && notification.type === 'task') ||
      (filter === 'chat' && notification.type === 'chat') ||
      (filter === 'due' && notification.type === 'due');

    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

const markAsRead = (id) => {

  sendMessage({
    type: "mark_as_read",
    notification_ids: [id], 
  });


  setNotifications((prev) =>
    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
  );

  // Decrease unread count safely
  setCount((prevCount) => Math.max(0, prevCount - 1));
};


  const removeNotification = (id) => {
    const notificationToRemove = notifications.find(n => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    
    // Update count if removing an unread notification
    if (notificationToRemove && !notificationToRemove.read) {
      setCount((prevCount) => Math.max(0, prevCount - 1));
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setCount(0); 
  };

  const getIcon = (type) => {
    console.log('Getting icon for type:', type); // Debug
    const icons = {
      task: CheckSquare,
      chat: MessageCircle,
      due: Clock,
    };
    const Icon = icons[type.toLowerCase()] || FallbackIcon;
    return <Icon className="w-4 h-4" />;
  };

  const getIconColors = (type) => {
    const colors = {
      task: 'text-blue-600 bg-blue-50',
      chat: 'text-green-600 bg-green-50',
      due: 'text-orange-600 bg-orange-50',
    };
    return colors[type.toLowerCase()] || 'text-gray-600 bg-gray-50'; 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">
                  {unreadCount} unread messages
                  {/* Show connection status for debugging */}
                  <span className="ml-2 text-xs">
                    ({isConnected ? '🟢 Connected' : '🔴 Disconnected'})
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div className="flex items-center justify-between">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All notifications</option>
              <option value="unread">Unread only</option>
              <option value="task">Task updates</option>
              <option value="chat">Messages</option>
              <option value="due">Due dates</option>
            </select>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-sm text-gray-500">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative px-6 py-4 hover:bg-gray-50 transition-colors group ${
                    !notification.read ? 'bg-blue-25' : ''
                  }`}
                >
                  {!notification.read && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className={`p-2.5 rounded-lg ${getIconColors(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4
                          className={`text-sm font-medium text-gray-900 ${
                            !notification.read ? 'font-semibold' : ''
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 leading-relaxed">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.time}
                          </span>
                          {notification.user && (
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {notification.user}
                            </span>
                          )}
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
}