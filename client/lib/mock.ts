import { Message, PartialUser } from "@/types";

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: 'like',
    user: { name: 'John Doe', avatar: '/avatars/john-doe.png' },
    content: 'liked your post',
    post: 'Getting Started with Next.js 14',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 2,
    type: 'comment',
    user: { name: 'Jane Smith', avatar: '/avatars/jane-smith.png' },
    content: 'commented on your post',
    post: 'Mastering TypeScript for React Development',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 3,
    type: 'follow',
    user: { name: 'Alice Cooper', avatar: '/avatars/alice-cooper.png' },
    content: 'started following you',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 4,
    type: 'like',
    user: { name: 'Bob Johnson', avatar: '/avatars/bob-johnson.png' },
    content: 'liked your post',
    post: 'Building Responsive UIs with Tailwind CSS',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 5,
    type: 'share',
    user: { name: 'Emma Watson', avatar: '/avatars/emma-watson.png' },
    content: 'shared your post',
    post: 'Advanced React Hooks',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 6,
    type: 'mention',
    user: { name: 'David Lee', avatar: '/avatars/david-lee.png' },
    content: 'mentioned you in a comment',
    post: 'The Future of Web Development',
    time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

// Mock messages data
const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    content:
      "Hey team, I've just added a new section to the blog post. Can you please review it?",
    timestamp: new Date('2023-06-15T10:30:00'),
    status: 'read',
    type: 'text',
  },
  {
    id: '2',
    senderId: '1',
    content: "Sure, I'll take a look right away!",
    timestamp: new Date('2023-06-15T10:32:00'),
    status: 'read',
    type: 'text',
  },
  {
    id: '3',
    senderId: '3',
    content:
      "I've noticed a few typos in the introduction. I'll fix them and push the changes.",
    timestamp: new Date('2023-06-15T10:35:00'),
    status: 'read',
    type: 'text',
  },
  {
    id: '4',
    senderId: '4',
    content: "Great work everyone! I think we're almost ready to publish.",
    timestamp: new Date('2023-06-15T10:40:00'),
    status: 'read',
    type: 'text',
  },
  {
    id: '5',
    senderId: '1',
    content:
      "Agreed! Let's do a final review tomorrow morning and then we can schedule it for publication.",
    timestamp: new Date('2023-06-15T10:42:00'),
    status: 'delivered',
    type: 'text',
  },
];

const mockUsers: PartialUser[] = [
  {
    id: '1',
    username: 'Alice Johnson',
    profileUrl: '/profileUrls/alice-johnson.jpg',
  },
  { id: '2', username: 'Bob Smith', profileUrl: '/profileUrls/bob-smith.jpg' },
  {
    id: '3',
    username: 'Charlie Brown',
    profileUrl: '/profileUrls/charlie-brown.jpg',
  },
  {
    id: '4',
    username: 'Diana Prince',
    profileUrl: '/profileUrls/diana-prince.jpg',
  },
  {
    id: '5',
    username: 'Ethan Hunt',
    profileUrl: '/profileUrls/ethan-hunt.jpg',
  },
  {
    id: '6',
    username: 'Fiona Gallagher',
    profileUrl: '/profileUrls/fiona-gallagher.jpg',
  },
  {
    id: '7',
    username: 'George Lucas',
    profileUrl: '/profileUrls/george-lucas.jpg',
  },
  {
    id: '8',
    username: 'Hannah Montana',
    profileUrl: '/profileUrls/hannah-montana.jpg',
  },
];

export { notifications, mockMessages, mockUsers };
