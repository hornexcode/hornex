export type WebSocketContextState = {
  isConnected: boolean;
  addListener: (
    type: MessageType,
    callback: (event: MessageEvent) => void
  ) => void;
};

export type Message = {
  type: string;
  message: string;
  [key: string]: string | boolean | number | object;
};

export type MessageType = 'team_invitation';

export type ListenerType = Record<
  MessageType,
  ((event: MessageEvent) => void)[]
>;
