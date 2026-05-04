import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';
import { receiveMessage, markConversationReadLocal, updateMessageLocal, removeMessageLocal } from '../redux/slices/chatSlice';
import { fetchSidebarCounts } from '../redux/slices/collaborationSlice';
import { updateUserPresence } from '../redux/slices/presenceSlice';
import { toast } from 'sonner';
import { playNotificationSound } from '../utils/notificationSound';

const SocketContext = createContext();

const ENDPOINT = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.emit('setup', user);

        newSocket.on('connected', () => console.log('Connected to socket'));

        // 1. Navbar Notifications
        newSocket.on('notification_received', (notification) => {
            dispatch(addNotification(notification));
            playNotificationSound();
            toast(notification.title, {
                description: notification.message,
                action: notification.link ? {
                    label: 'View',
                    onClick: () => window.location.href = notification.link
                } : null
            });
        });

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

        return () => {
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
