import { Profile } from '@/types';
import { create } from 'zustand';

interface BlogState {
  blogs: { id: string; title: string }[];
  addBlog: (blog: { id: string; title: string }) => void;
  updateBlog: (id: string, blog: { id: string; title: string }) => void;
  deleteBlog: (id: string) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  blogs: [],
  addBlog: (blog) => set((state) => ({ blogs: [...state.blogs, blog] })),
  updateBlog: (id, updatedBlog) =>
    set((state) => ({
      blogs: state.blogs.map((blog) =>
        blog.id === id ? { ...blog, ...updatedBlog } : blog
      ),
    })),
  deleteBlog: (id) =>
    set((state) => ({
      blogs: state.blogs.filter((blog) => blog.id !== id),
    })),
}));

interface UserState {
  user: Profile | null;
  setUser: (user: Profile) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
