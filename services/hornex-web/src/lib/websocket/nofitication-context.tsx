import { dataLoader as dataLoader } from '../request/api';
import { makeClientReqObj } from '../request/util';
import { get, set } from 'es-cookie';
import React, { createContext, useEffect, useReducer, useState } from 'react';

// const { fetch: getNotifications } = dataLoader<>('');

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'tournament' | 'invite' | 'team' | 'match';
  duration: number;
};

export const NotificationContext = createContext<{
  notifications: Notification[];
}>({
  notifications: [],
});

export const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'test',
      message: 'test',
      type: 'invite',
      duration: 5000,
    },
  ]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used within a NotificationContext'
    );
  }
  return context;
};
