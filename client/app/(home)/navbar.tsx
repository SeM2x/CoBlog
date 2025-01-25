import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40'>
      <div className='container mx-auto flex h-16 items-center justify-between'>
        <Link href='/' className='flex items-center space-x-2'>
          <span className='font-heading text-2xl font-bold text-primary'>
            CoBlog
          </span>
        </Link>
        <div className='flex items-center space-x-4'>
          <Link
            href='#features'
            className='text-sm font-medium hover:text-primary'
          >
            Features
          </Link>
          <Link
            href='#about'
            className='text-sm font-medium hover:text-primary'
          >
            About
          </Link>
          <Link
            href='#contact'
            className='text-sm font-medium hover:text-primary'
          >
            Contact
          </Link>
          <Button variant='outline'>
            <Link href='/login'>Log In</Link>
          </Button>
          <Button>
            <Link href='/register'>Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
