import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';
import { toast } from 'sonner';

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
        });

        newSocket.emit('setup', user);

        newSocket.on('connected', () => console.log('Connected to socket'));

        newSocket.on('notification_received', (notification) => {
            dispatch(addNotification(notification));
            
            // Show a live toast for high-priority notifications
            toast(notification.title, {
                description: notification.message,
                action: notification.link ? {
                    label: 'View',
                    onClick: () => window.location.href = notification.link
                } : null
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, user?._id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
