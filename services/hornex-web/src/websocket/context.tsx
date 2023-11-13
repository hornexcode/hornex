import ws from './app';
import { ListenerType, MessageType, WebSocketContextState } from './types';
import { createContext, useContext, useEffect, useState } from 'react';

const initialState: WebSocketContextState = {
  isConnected: false,
  addListener: (
    type: MessageType,
    callback: (event: MessageEvent) => void
  ) => {},
};

export const WebSocketContext =
  createContext<WebSocketContextState>(initialState);

export const WebSocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [listers, setListeners] = useState<ListenerType>({
    team_invitation: [(event: MessageEvent) => {}],
  });

  useEffect(() => {
    ws.onmessage = (event) => {
      if (Object.keys(listers).includes(event.type)) {
        const messageType = event.type as MessageType;

        listers[messageType].forEach((listener) => {
          listener(event);
        });
      }
    };
  }, [listers]);

  const addListener = (
    type: MessageType,
    listener: (event: MessageEvent) => void
  ) => {
    setListeners((listers) => {
      return { ...listers, [type]: [...listers[type], listener] };
    });
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, addListener }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      'useWebSocket must be used within a WebSocketContextProvider'
    );
  }
  return context;
};
