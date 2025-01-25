import { PartialUser } from '@/types';

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

const topics = [
  {
    _id: '676eab6593a2e4d673dd1cdc',
    name: 'Technology',
    subtopics: [
      {
        name: 'Artificial Intelligence',
        slug: 'ai',
      },
      {
        name: 'Machine Learning',
        slug: 'ml',
      },
      {
        name: 'Data Science',
        slug: 'data-science',
      },
      {
        name: 'Cybersecurity',
        slug: 'cybersecurity',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1cdd',
    name: 'Programming',
    subtopics: [
      {
        name: 'Python',
        slug: 'python',
      },
      {
        name: 'C++',
        slug: 'cpp',
      },
      {
        name: 'JavaScript',
        slug: 'javascript',
      },
      {
        name: 'Rust',
        slug: 'rust',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1cde',
    name: 'Design',
    subtopics: [
      {
        name: 'UI/UX',
        slug: 'ui-ux',
      },
      {
        name: 'Graphic Design',
        slug: 'graphic-design',
      },
      {
        name: 'Web Design',
        slug: 'web-design',
      },
      {
        name: 'Product Design',
        slug: 'product-design',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1cdf',
    name: 'Business',
    subtopics: [
      {
        name: 'Entrepreneurship',
        slug: 'entrepreneurship',
      },
      {
        name: 'Marketing',
        slug: 'marketing',
      },
      {
        name: 'Finance',
        slug: 'finance',
      },
      {
        name: 'Business Strategy',
        slug: 'business-strategy',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1ce0',
    name: 'Health & Wellness',
    subtopics: [
      {
        name: 'Nutrition',
        slug: 'nutrition',
      },
      {
        name: 'Exercise',
        slug: 'exercise',
      },
      {
        name: 'Mental Health',
        slug: 'mental-health',
      },
      {
        name: 'Healthy Living',
        slug: 'healthy-living',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1ce1',
    name: 'Lifestyle',
    subtopics: [
      {
        name: 'Travel',
        slug: 'travel',
      },
      {
        name: 'Fashion',
        slug: 'fashion',
      },
      {
        name: 'Hobbies',
        slug: 'hobbies',
      },
      {
        name: 'Home Decor',
        slug: 'home-decor',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1ce2',
    name: 'Science',
    subtopics: [
      {
        name: 'Physics',
        slug: 'physics',
      },
      {
        name: 'Chemistry',
        slug: 'chemistry',
      },
      {
        name: 'Biology',
        slug: 'biology',
      },
      {
        name: 'Astronomy',
        slug: 'astronomy',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1ce3',
    name: 'Entertainment',
    subtopics: [
      {
        name: 'Movies',
        slug: 'movies',
      },
      {
        name: 'Music',
        slug: 'music',
      },
      {
        name: 'TV Shows',
        slug: 'tv-shows',
      },
      {
        name: 'Gaming',
        slug: 'gaming',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1ce4',
    name: 'Education',
    subtopics: [
      {
        name: 'Online Learning',
        slug: 'online-learning',
      },
      {
        name: 'STEM Education',
        slug: 'stem-education',
      },
      {
        name: 'Language Learning',
        slug: 'language-learning',
      },
      {
        name: 'Higher Education',
        slug: 'higher-education',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1ce5',
    name: 'Sports',
    subtopics: [
      {
        name: 'Football',
        slug: 'football',
      },
      {
        name: 'Basketball',
        slug: 'basketball',
      },
      {
        name: 'Tennis',
        slug: 'tennis',
      },
      {
        name: 'Cricket',
        slug: 'cricket',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1ce6',
    name: 'Politics',
    subtopics: [
      {
        name: 'Government',
        slug: 'government',
      },
      {
        name: 'Elections',
        slug: 'elections',
      },
      {
        name: 'International Relations',
        slug: 'international-relations',
      },
      {
        name: 'Political Theory',
        slug: 'political-theory',
      },
    ],
  },
  {
    _id: '676eab6593a2e4d673dd1ce7',
    name: 'Art',
    subtopics: [
      {
        name: 'Painting',
        slug: 'painting',
      },
      {
        name: 'Sculpture',
        slug: 'sculpture',
      },
      {
        name: 'Photography',
        slug: 'photography',
      },
      {
        name: 'Modern Art',
        slug: 'modern-art',
      },
    ],
  },
];

export { notifications, mockUsers, topics };
