import { server } from './server';

const socketIo = require('socket.io');

const socketConfig = {
  cors: {
    origin: 'http://localhost:3000',
  },
};
const io = socketIo(server, socketConfig);

const hostname = '0.0.0.0';
const port = '5000';

io.on('connection', (socket) => {
  socket.on('send_message', (details) => {
    io.emit('sent_message', details);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
