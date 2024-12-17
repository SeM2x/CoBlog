'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DialogTitle } from '@/components/ui/dialog';
import { ModeToggle } from './mode-toggle';
import { signOut } from 'next-auth/react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Create Blog', href: '/blogs/new' },
    { name: 'My Blogs', href: '/my-blogs' },
  ];

  return (
    <nav className='sticky top-0 z-40 w-full border-b border-light-border dark:border-dark-border bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-md'>
      <div className='container mx-auto flex h-16 items-center px-4'>
        <Link href='/' className='flex items-center space-x-2'>
          <span className='font-heading text-2xl font-bold text-primary'>
            CoBlog
          </span>
        </Link>
        <div className='hidden md:flex ml-6 space-x-4'>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='text-sm font-medium text-light-primary dark:text-dark-primary hover:text-primary'
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <form className='block w-full max-w-xs lg:max-w-lg ml-4'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-light-secondary dark:text-dark-secondary' />
              <Input
                placeholder='Search blogs, tags, or users...'
                className='pl-8 bg-background'
              />
            </div>
          </form>
          <div>
            <ModeToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='/avatars/01.png' alt='@shadcn' />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <Link href='/profile' className='block w-full'>
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='md:hidden'>
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
                <DialogTitle className='mb-4'>Menu</DialogTitle>
                <nav className='flex flex-col space-y-4'>
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
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
