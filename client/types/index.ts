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
  relationship: 'following' | 'follower' | 'me';
};

type Blog = {
  _id: string;
  title: string;
  nLikes: number;
  nComments: number;
  nShares: number;
  conversationId: string;
  isPublished: string;
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
  invitedUsers: string[];
  CoAuthors: CoAuthor[];
  authorProfileUrl: string;
};

interface PartialUser {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileUrl: string;
}

interface CoAuthor extends PartialUser {
  role?: string;
}

interface Message {
  _id: string;
  senderId: string;
  senderUsername: string;
  message: string;
  blogId: string;
  createdAt: Date;

  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
}

type Notification = {
  _id: string;
  userId: string;
  blogId?: {
    id: string;
    title: string;
  };
  author?: {
    id: string;
    username: string;
    profileUrl: string;
  };
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  status?: 'accepted' | 'rejected' | 'pending';
};

export type { Profile, Blog, CoAuthor, PartialUser, Message, Notification };
