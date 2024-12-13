'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { signOut, useSession } from 'next-auth/react';

const Header = () => {
  const pathname = usePathname();
  const user = useSession().data?.user;

  return (
    <header className='border-b'>
      <div className='container mx-auto flex items-center justify-between px-4 py-4'>
        <Link href='/' className='text-2xl font-bold'>
          CoBlog
        </Link>
        <nav>
          <ul className='flex items-center space-x-4'>
            <li>
              <Link href='/' className={pathname === '/' ? 'font-bold' : ''}>
                Home
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link
                    href='/dashboard'
                    className={pathname === '/dashboard' ? 'font-bold' : ''}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href='/notifications'
                    className={pathname === '/notifications' ? 'font-bold' : ''}
                  >
                    Notifications
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/profile/${user.id}`}
                    className={
                      pathname.startsWith('/profile') ? 'font-bold' : ''
                    }
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Button onClick={() => signOut()}>Sign Out</Button>
                </li>
              </>
            )}
            {!user && (
              <li>
                <Link href='/login'>
                  <Button>Sign In</Button>
                </Link>
              </li>
            )}
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
