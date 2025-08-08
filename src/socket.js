import { Server } from 'socket.io';

let io;

export function initSocket(server, clientOrigin = '*') {
  io = new Server(server, {
    cors: { origin: clientOrigin }
  });

  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    // Allow clients to subscribe to a specific vehicle room
    socket.on('subscribe', ({ vehicleId }) => {
      if (!vehicleId) return;
      socket.join(`vehicle:${vehicleId}`);
    });

    socket.on('unsubscribe', ({ vehicleId }) => {
      if (!vehicleId) return;
      socket.leave(`vehicle:${vehicleId}`);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
