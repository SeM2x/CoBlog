'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BarChart2,
  Edit3,
  MessageSquare,
  Share2,
  Feather,
  BookOpen,
  TrendingUp,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='h-full'>
        <CardHeader>
          <CardTitle className='flex items-center text-xl'>
            {icon}
            <span className='ml-2'>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('write');
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='py-20 px-4 text-center bg-gradient-to-b from-primary/10 to-background'>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='container mx-auto'
        >
          <h1 className='text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60'>
            Elevate Your Writing with CoBlog
          </h1>
          <p className='text-xl mb-8 max-w-2xl mx-auto text-muted-foreground'>
            Empower your content creation with collaborative tools, insightful
            analytics, and a global audience.
          </p>
          <Link href='/register'>
            <Button size='lg'>Get Started for Free</Button>
          </Link>
        </motion.div>
      </section>

      {/* Key Features Section */}
      <section className='py-20 px-4'>
        <div className='container mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Powerful Features for Modern Content Creators
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <FeatureCard
              icon={<Edit3 className='h-6 w-6 text-primary' />}
              title='Real-time Collaboration'
              description='Work seamlessly with your team in real-time, seeing changes as they happen.'
            />
            <FeatureCard
              icon={<Users className='h-6 w-6 text-primary' />}
              title='Team Management'
              description='Easily manage roles and permissions for your entire content team.'
            />
            <FeatureCard
              icon={<BarChart2 className='h-6 w-6 text-primary' />}
              title='Advanced Analytics'
              description='Gain deep insights into your audience and content performance.'
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-20 px-4 bg-secondary/10'>
        <div className='container mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            How CoBlog Works
          </h2>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full max-w-3xl mx-auto'
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='write'>Write</TabsTrigger>
              <TabsTrigger value='collaborate'>Collaborate</TabsTrigger>
              <TabsTrigger value='publish'>Publish</TabsTrigger>
            </TabsList>
            <TabsContent value='write' className='mt-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Feather className='h-6 w-6 mr-2 text-primary' />
                    Intuitive Writing Experience
                  </CardTitle>
                  <CardDescription>
                    Our distraction-free editor lets you focus on what matters
                    most - your content.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Badge variant='outline' className='mr-2'>
                      Rich Text Editing
                    </Badge>
                    Format your content with ease using our powerful editor.
                  </div>
                  <div>
                    <Badge variant='outline' className='mr-2'>
                      Markdown Support
                    </Badge>
                    Write in Markdown and see real-time previews.
                  </div>
                  <div>
                    <Badge variant='outline' className='mr-2'>
                      Auto-save
                    </Badge>
                    Never lose your work with automatic saving.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='collaborate' className='mt-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <MessageSquare className='h-6 w-6 mr-2 text-primary' />
                    Seamless Collaboration
                  </CardTitle>
                  <CardDescription>
                    Work together with your team in real-time, streamlining the
                    content creation process.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Badge variant='outline' className='mr-2'>
                      Real-time Editing
                    </Badge>
                    See changes as they happen, just like in Google Docs.
                  </div>
                  <div>
                    <Badge variant='outline' className='mr-2'>
                      Commenting System
                    </Badge>
                    Leave feedback and discuss ideas right within the document.
                  </div>
                  <div>
                    <Badge variant='outline' className='mr-2'>
                      Task Assignment
                    </Badge>
                    Delegate tasks and track progress effortlessly.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='publish' className='mt-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center'>
                    <Share2 className='h-6 w-6 mr-2 text-primary' />
                    Effortless Publishing
                  </CardTitle>
                  <CardDescription>
                    Reach your audience across multiple platforms with just a
                    few clicks.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Badge variant='outline' className='mr-2'>
                      Multi-platform Support
                    </Badge>
                    Publish to WordPress, Medium, and more simultaneously.
                  </div>
                  <div>
                    <Badge variant='outline' className='mr-2'>
                      Scheduling
                    </Badge>
                    Plan your content calendar and schedule posts in advance.
                  </div>
                  <div>
                    <Badge variant='outline' className='mr-2'>
                      SEO Tools
                    </Badge>
                    Optimize your content for search engines before publishing.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='py-20 px-4'>
        <div className='container mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Why Choose CoBlog?
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            <div className='space-y-6'>
              <div className='flex items-center space-x-4'>
                <BookOpen className='h-8 w-8 text-primary' />
                <div>
                  <h3 className='text-xl font-semibold'>
                    Centralized Content Hub
                  </h3>
                  <p className='text-muted-foreground'>
                    Keep all your content organized in one place.
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <TrendingUp className='h-8 w-8 text-primary' />
                <div>
                  <h3 className='text-xl font-semibold'>
                    Improve Content Quality
                  </h3>
                  <p className='text-muted-foreground'>
                    Collaborate effectively to create better content.
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <Search className='h-8 w-8 text-primary' />
                <div>
                  <h3 className='text-xl font-semibold'>
                    Boost Discoverability
                  </h3>
                  <p className='text-muted-foreground'>
                    Optimize your content for better search engine rankings.
                  </p>
                </div>
              </div>
            </div>
            <div className='space-y-6'>
              <div className='flex items-center space-x-4'>
                <Bell className='h-8 w-8 text-primary' />
                <div>
                  <h3 className='text-xl font-semibold'>Stay Updated</h3>
                  <p className='text-muted-foreground'>
                    Get notified of changes and comments in real-time.
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <Settings className='h-8 w-8 text-primary' />
                <div>
                  <h3 className='text-xl font-semibold'>
                    Customizable Workflow
                  </h3>
                  <p className='text-muted-foreground'>
                    Tailor the platform to fit your team&apos;s unique needs.
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <HelpCircle className='h-8 w-8 text-primary' />
                <div>
                  <h3 className='text-xl font-semibold'>Dedicated Support</h3>
                  <p className='text-muted-foreground'>
                    Get help when you need it with our responsive support team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='py-20 px-4'>
        <div className='container mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            What Our Users Say
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <TestimonialCard
              name='Sarah Johnson'
              role='Content Manager'
              company='TechCorp'
              avatar='/avatars/sarah-johnson.jpg'
              quote='CoBlog has revolutionized our content creation process. The collaborative features are a game-changer!'
            />
            <TestimonialCard
              name='Michael Chen'
              role='Freelance Writer'
              company='Self-employed'
              avatar='/avatars/michael-chen.jpg'
              quote="As a freelancer, CoBlog's analytics help me understand my audience better and improve my writing."
            />
            <TestimonialCard
              name='Emily Rodriguez'
              role='Editor-in-Chief'
              company='Global News Network'
              avatar='/avatars/emily-rodriguez.jpg'
              quote="The SEO tools in CoBlog have significantly increased our organic traffic. It's an essential part of our toolkit."
            />
          </div>
        </div>
      </section>
      {/* Call-to-Action Section */}
      <section className='py-20 px-4 bg-primary/60 dark:bg-primary/75 text-primary-foreground'>
        <div className='container mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-6'>
            Ready to Transform Your Content Creation?
          </h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Join thousands of content creators who are already using CoBlog to
            streamline their workflow and reach a wider audience.
          </p>
          <Link href='/register'>
            <Button size='lg' variant='secondary'>
              Start Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-secondary text-secondary-foreground py-12 px-4'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>CoBlog</h3>
              <p className='text-sm'>
                Empowering content creators with collaborative tools and
                insights.
              </p>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Product</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link href='/features'>Features</Link>
                </li>
                <li>
                  <Link href='/pricing'>Pricing</Link>
                </li>
                <li>
                  <Link href='/roadmap'>Roadmap</Link>
                </li>
                <li>
                  <Link href='/changelog'>Changelog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Company</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link href='/about'>About Us</Link>
                </li>
                <li>
                  <Link href='/careers'>Careers</Link>
                </li>
                <li>
                  <Link href='/press'>Press</Link>
                </li>
                <li>
                  <Link href='/contact'>Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Legal</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link href='/terms'>Terms of Service</Link>
                </li>
                <li>
                  <Link href='/privacy'>Privacy Policy</Link>
                </li>
                <li>
                  <Link href='/cookies'>Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-8 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center'>
            <p className='text-sm'>&copy; 2025 CoBlog. All rights reserved.</p>
            <div className='flex space-x-4 mt-4 md:mt-0'>
              <Link href='#' aria-label='Facebook'>
                <Facebook className='h-6 w-6' />
              </Link>
              <Link href='#' aria-label='Twitter'>
                <Twitter className='h-6 w-6' />
              </Link>
              <Link href='#' aria-label='LinkedIn'>
                <Linkedin className='h-6 w-6' />
              </Link>
              <Link href='#' aria-label='GitHub'>
                <Github className='h-6 w-6' />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const TestimonialCard = ({
  name,
  role,
  company,
  avatar,
  quote,
}: {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
}) => (
  <Card className='bg-primary/5'>
    <CardHeader>
      <div className='flex items-center'>
        <Avatar className='h-10 w-10'>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className='ml-4'>
          <CardTitle className='text-lg'>{name}</CardTitle>
          <CardDescription>
            {role}, {company}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className='italic'>&quot;{quote}&quot;</p>
    </CardContent>
  </Card>
);
