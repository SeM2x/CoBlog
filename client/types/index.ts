type Profile = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  viewsCount: number;
  preference: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  profileUrl: string;
};

type Blog = {
  _id: string;
  title: string;
  nLikes: number;
  nComments: number;
  nShares: number;
  conversationId: string;
  isPublished: true;
  status: 'published' | 'draft';
  content: string;
  Topics: string[];
  subTopics: string[];
  authorId: string;
  authorEmail: string;
  authorUsername: string;
  roomId: string;
  imagesUrl: string[];
  CoAuthorId: string[];
  minuteRead: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blogId?: string;
};

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export type { Profile, Blog, User, Message };
