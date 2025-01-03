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

export { notifications };
