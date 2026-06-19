import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';
import { receiveMessage, markConversationReadLocal, updateMessageLocal, removeMessageLocal } from '../redux/slices/chatSlice';
import { fetchSidebarCounts } from '../redux/slices/collaborationSlice';
import { updateUserPresence } from '../redux/slices/presenceSlice';
import { toast } from 'sonner';
import { playNotificationSound } from '../utils/notificationSound';
import { NotificationToast } from '../components/common/NotificationToast';

const SocketContext = createContext();

// Socket.io treats URL paths as namespaces, so we must strip '/api/v1' etc.
// and connect to just the origin (e.g. http://localhost:8000)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const ENDPOINT = new URL(API_URL).origin;

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io(ENDPOINT, {
            withCredentials: true,
            transports: ['websocket'], // Force WebSocket to bypass polling proxy issues
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.emit('setup', user);

        newSocket.on('connected', () => console.log('✅ Socket connected to server'));

        newSocket.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err.message);
        });

        // 1. Navbar Notifications
        newSocket.on('notification_received', (notification) => {
            console.log('🔔 notification_received event fired:', notification);
            dispatch(addNotification(notification));
            playNotificationSound();
            toast.custom((t) => (
                <NotificationToast t={t} notification={notification} />
            ), {
                duration: 5000,
            });
        });
        // toast.custom used for custom toast notifications that are not present in the sonner library

        // 2. Sidebar Badge Refresh
        newSocket.on('activity_created', () => {
            dispatch(fetchSidebarCounts());
        });

        // 3. Real-time Messages (Global)
        newSocket.on('message recieved', (newMessage) => {
            dispatch(receiveMessage(newMessage));
            // Optional: Show toast for message if not on messages page
            if (window.location.pathname !== '/messages') {
                toast(`New message from ${newMessage.sender.fullname}`, {
                    description: newMessage.text,
                    action: {
                        label: 'Reply',
                        onClick: () => window.location.href = '/messages'
                    }
                });
            }
        });

        newSocket.on('messages read', ({ conversationId }) => {
            dispatch(markConversationReadLocal(conversationId));
        });

        newSocket.on('message updated', (updatedMsg) => {
            dispatch(updateMessageLocal(updatedMsg));
        });

        newSocket.on('message deleted', ({ messageId, conversationId }) => {
            dispatch(removeMessageLocal({ messageId, conversationId }));
        });

        // 4. Presence
        newSocket.on('user_status_changed', (data) => {
            dispatch(updateUserPresence(data));
        });

        setSocket(newSocket);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                if (!newSocket.connected) {
                    newSocket.connect();
                }
                // Always emit setup to ensure server knows we are active
                newSocket.emit('setup', user);
            } else if (document.visibilityState === 'hidden') {
                // User explicitly wants the socket to disconnect when leaving the window
                newSocket.disconnect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            newSocket.disconnect();
        };
    }, [isAuthenticated, user?._id, dispatch]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
