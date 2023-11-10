const ws = new WebSocket('ws://localhost:8000/ws/notifications');

ws.onopen = () => {
  console.log('WebSocket connected');
};

ws.onclose = (err) => {
  console.log('WebSocket disconnected with error: ', err);
};

export default ws;
