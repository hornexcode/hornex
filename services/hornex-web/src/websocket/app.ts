const ws = new WebSocket(
  `${process.env.NEXT_PUBLIC_API_WS_URL}/ws/notifications`
);

ws.onopen = () => {
  console.log('WebSocket connected');
  ws.onmessage = (messageEvent) => {
    console.log('MSG DATA:', messageEvent.data);
  };
};

ws.onclose = (closeEvent) => {
  console.log('WebSocket disconnected with: ', closeEvent);
};

export default ws;
