import io from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER || 'https://talkify.techerudites.tech';

const socket = io(SOCKET_URL);

export default socket;