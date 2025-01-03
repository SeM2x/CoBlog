'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import TipTapEditor from '@/components/tiptap';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { BlogChat } from './blogChat';
import { CreateBlogModal } from '@/components/createBlogModal';
import { Blog, PartialUser } from '@/types';
import { useUserStore } from '@/lib/store';
import generateTipTapToken from '@/lib/utils/tiptap-token';
import {
  BarChart2,
  Globe,
  Lock,
  MoreHorizontal,
  PlusCircle,
  Settings,
  Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import InviteModal from './InviteModal';
import DeleteModal from './DeleteModal';
import PermissionsModal from './PermissionsModal';

const currentUser = {
  id: '1',
  username: 'John Doe',
  profileUrl: '/avatars/john-doe.jpg',
};

const intialCollaborators = [
  { id: '2', username: 'Alice Johnson', profileUrl: '/profileUrls/alice-johnson.jpg' },
  { id: '3', username: 'Bob Smith', profileUrl: '/profileUrls/bob-smith.jpg' },
  { id: '4', username: 'Charlie Brown', profileUrl: '/profileUrls/charlie-brown.jpg' },
];

export default function CreateBlog({ blog }: { blog?: Blog }) {
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');

  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null);
  const [doc, setDoc] = useState<Y.Doc | null>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the blog post to your backend
    console.log('Blog post:', { title, content });
  };

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      console.log('blog', blog.content);
    }
  }, [blog]);

  useEffect(() => {
    if (blog && user) {
      const createProvider = async () => {
        const secret = process.env.NEXT_PUBLIC_TIPTAP_APP_SECRET || '';
        const token = await generateTipTapToken(user.id, secret);
        //console.log('token', token);
        const doc = new Y.Doc();
        const provider = new TiptapCollabProvider({
          name: blog._id,
          appId: process.env.NEXT_PUBLIC_TIPTAP_APP_ID || '',
          token,
          document: doc,
        });
        setDoc(doc);
        setProvider(provider);
      };

      createProvider();
    }
  }, [blog, user]);

  useEffect(() => {
    if (provider && user) {
      provider.setAwarenessField('user', {
        name: user.username,
      });
    }
  }, [provider, user]);

  const [isPublic, setIsPublic] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [managePermissionsOpen, setManagePermissionsOpen] = useState(false);
  //const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [collaborators, setCollaborators] =
    useState<PartialUser[]>(
      intialCollaborators
    );
  const handleVisibilityChange = () => {
    setIsPublic(!isPublic);
  };

  const handleInviteCollaborators = (
    newCollaborators: PartialUser[]
  ) => {
    setCollaborators([...collaborators, ...newCollaborators]);
    setIsInviteModalOpen(false);
  };

  const handleRoleChange = (
    collaboratorId: string,
    newRole: 'owner' | 'editor' | 'viewer'
  ) => {
    setCollaborators((prevCollaborators) =>
      prevCollaborators.map((collaborator) =>
        collaborator.id === collaboratorId
          ? { ...collaborator, role: newRole }
          : collaborator
      )
    );
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    setCollaborators((prevCollaborators) =>
      prevCollaborators.filter(
        (collaborator) => collaborator.id !== collaboratorId
      )
    );
  };

  return (
    <div className='relative min-h-screen border container mx-auto px-4 py-8 max-w-4xl space-y-4'>
      <div className='flex gap-4 flex-col sm:flex-row sm:justify-between sm:items-center'>
        <div className='flex items-center space-x-2'>
          {collaborators.map((collaborator) => (
            <Avatar key={collaborator.id} className='h-8 w-8'>
              <AvatarImage src={collaborator.profileUrl} alt={collaborator.username} />
              <AvatarFallback>{collaborator.username[0]}</AvatarFallback>
            </Avatar>
          ))}
          <Button
            variant='outline'
            className='rounded-full'
            onClick={() => setIsInviteModalOpen(true)}
          >
            <PlusCircle className='h-4 w-4' />
            Invite
          </Button>
        </div>
        <div className='flex items-center space-x-4'>
          <Button variant='outline'>Save Draft</Button>
          <Button onClick={handlePublish}>Publish</Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onSelect={handleVisibilityChange}>
                {isPublic ? (
                  <Globe className='w-4 h-4 mr-2' />
                ) : (
                  <Lock className='w-4 h-4 mr-2' />
                )}
                {isPublic ? 'Make Private' : 'Make Public'}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setManagePermissionsOpen(true)}>
                <Settings className='w-4 h-4 mr-2' />
                Manage Permissions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <BarChart2 className='w-4 h-4 mr-2' />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsDeleteModalOpen(true)}
                className='text-red-600'
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Delete Blog
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='space-y-2'>
        {provider && doc && (
          <TipTapEditor
            provider={provider}
            doc={doc}
            title={title}
            setTitle={setTitle}
            content={content}
            onChange={setContent}
          />
        )}
      </div>
      {blog && (
        <BlogChat
          blog={blog}
          currentUser={currentUser}
          collaborators={collaborators}
        />
      )}
      <CreateBlogModal isOpen={!blog} />
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteCollaborators}
        existingCollaborators={collaborators}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
      <PermissionsModal
        isOpen={managePermissionsOpen}
        onClose={() => setManagePermissionsOpen(false)}
        collaborators={collaborators}
        handleRemoveCollaborator={handleRemoveCollaborator}
        handleRoleChange={handleRoleChange}
      />
    </div>
  );
}
