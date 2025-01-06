'use client';

import { useState } from 'react';
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
import { Search, User, LogOut, Menu, PenSquare, Sun, Moon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DialogTitle } from '@/components/ui/dialog';
import { signOut } from 'next-auth/react';
import NotificationsMenu from './notifications-menu';
import { useUserStore } from '@/lib/store';
import { Notification } from '@/types';
import { useTheme } from 'next-themes';

export function Navbar({ notifications }: { notifications?: Notification[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My Blogs', href: '/my-blogs' },
    { name: 'Create Blog', href: '/new-blog' },
  ];

  const user = useUserStore((state) => state.user);

  const { theme, setTheme } = useTheme();
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage
                    src={user?.profileUrl}
                    alt='my-profile-picture'
                  />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <DropdownMenuItem asChild>
                <Link href='/profile'>
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className='mr-2 h-4 w-4' />
                ) : (
                  <Moon className='mr-2 h-4 w-4' />
                )}
                <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {navItems.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href}>{item.name}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className='mr-2 h-4 w-4 text-red-500' />
                <span className='text-red-500'>Log out</span>
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

                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className='text-sm font-medium text-light-primary dark:text-dark-primary hover:text-primary'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
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
