let io = null;

export function initSocket(socketInstance) {
  io = socketInstance;
  io.on('connection', (socket) => {
    socket.on('send_message', (details) => {
      io.emit('message_sent', details);
    });

    socket.on('accept_invite', (details) => {
      io.emit('invite_accepted', details);
    });
  });
}

export function broadcastNotification(notification) {
  if (!io) {
    console.log('socket server not yet initialized');
  }
  io.emit('notification_sent', notification);
}

export function broadcastPublishedBlog(notification) {
  if (!io) {
    console.log('socket server not yet initialized');
  }
  io.emit('blog_published', notification);
}
