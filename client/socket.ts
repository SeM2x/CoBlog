import io from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER || 'http://api.techerudites.tech:5000';

const socket = io(SOCKET_URL, { secure: false });

export default socket;
