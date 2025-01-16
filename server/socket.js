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
    io.emit('message_sent', details);
  });

  socket.on('publish_blog', (details) => {
    io.emit('blog_published', details);
  });

  socket.on('accept_invite', (details) => {
    io.emit('invite_accepted', details);
  });

  socket.on('send_notification', (details) => {
    io.emit('notification_sent', details);
  });
});

module.exports = io;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
