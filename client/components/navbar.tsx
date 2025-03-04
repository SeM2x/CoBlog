'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  User,
  LogOut,
  Menu,
  PenSquare,
  Sun,
  Moon,
  FileText,
  FilePenLine,
  Settings,
  CircleHelp,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DialogTitle } from '@/components/ui/dialog';
import { signOut } from 'next-auth/react';
import NotificationsMenu from './notifications-menu';
import { useUserStore } from '@/lib/store';
import { Notification } from '@/types';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';

export function Navbar({ notifications }: { notifications?: Notification[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Profile',
      href: '/profile',
      icon: <User className='mr-2 h-4 w-4' />,
    },
    {
      name: 'My Blogs',
      href: '/my-blogs',
      icon: <FileText className='mr-2 h-4 w-4' />,
    },
    {
      name: 'Create Blog',
      href: '/new-blog',
      icon: <FilePenLine className='mr-2 h-4 w-4' />,
    },
    { separator: true },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className='mr-2 h-4 w-4' />,
    },
    {
      name: 'Help',
      href: '/help',
      icon: <CircleHelp className='mr-2 h-4 w-4' />,
    },
  ];

  const user = useUserStore((state) => state.user);

  const { theme, setTheme } = useTheme();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get('keyword'));

  useEffect(() => {
    setSearch(searchParams.get('keyword'));
  }, [searchParams]);
  return (
    <nav className='sticky top-0 z-40 w-full border-b border-light-border dark:border-dark-border bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 gap-4'>
        <div className='flex items-center space-x-4 flex-1'>
          <Link href='/' className='flex items-center space-x-2'>
            <span className='font-heading text-2xl font-bold text-primary'>
              CoBlog
            </span>
          </Link>
          <div className='hidden md:block w-full max-w-sm lg:max-w-lg'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-light-secondary dark:text-dark-secondary' />
              <Input
                placeholder='Search blogs, tags, or users...'
                className='pl-8'
                value={search || ''}
                onChange={(e) => setSearch(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/search?keyword=${e.currentTarget.value}`);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          <Link href='/new-blog'>
            <Button>
              <PenSquare className='mr-2 h-4 w-4' />
              Create Blog
            </Button>
          </Link>
          <NotificationsMenu notifications={notifications} />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-9 w-9 rounded-full'>
                <Avatar className='h-9 w-9 border'>
                  <AvatarImage
                    src={user?.profileUrl}
                    alt='my-profile-picture'
                  />
                  <AvatarFallback>{user?.username[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              {navItems.map((item, index) =>
                item.separator ? (
                  <DropdownMenuSeparator key={index} />
                ) : (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href!}>
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                )
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className='hover:!text-red-500'
              >
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
              <div className='flex flex-col py-4 h-full justify-between'>
                <div className='flex flex-col space-y-4'>
                  <DialogTitle>
                    <Link href='/' className='flex items-center space-x-2'>
                      <span className='font-heading text-2xl font-bold text-primary'>
                        CoBlog
                      </span>
                    </Link>
                  </DialogTitle>
                  <div className='relative'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 text-light-secondary dark:text-dark-secondary' />
                    <Input
                      placeholder='Search blogs, tags, or users...'
                      className='pl-8'
                    />
                  </div>

                  {navItems.map(
                    (item) =>
                      !item.separator && (
                        <Link
                          key={item.name}
                          href={item.href!}
                          className='text-sm font-medium text-light-primary dark:text-dark-primary hover:text-primary'
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                  )}
                </div>
                <div className='flex flex-col space-y-2'>
                  <Button
                    onClick={() =>
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                    variant='secondary'
                    className='mt-auto'
                  >
                    {theme === 'dark' ? (
                      <Sun className='mr-2 h-4 w-4' />
                    ) : (
                      <Moon className='mr-2 h-4 w-4' />
                    )}
                    {theme === 'dark' ? 'Light' : 'Dark'} mode
                  </Button>
                  <Button
                    onClick={() => signOut()}
                    variant='ghost'
                    className='!text-red-500 hover:!bg-red-50'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
