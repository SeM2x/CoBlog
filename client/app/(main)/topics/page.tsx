'use client';

import { useState, useEffect, JSX } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getTopics } from '@/lib/actions/blogs';
import {
  Monitor,
  Cpu,
  Paintbrush,
  Briefcase,
  Heart,
  Smile,
  Atom,
  Film,
  BookOpen,
  Trophy,
  Globe,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Subtopic {
  name: string;
  slug: string;
}

interface Topic {
  _id: string;
  name: string;
  subtopics: Subtopic[];
}

export default function SelectTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const topicIcons: Record<string, JSX.Element> = {
    Technology: <Monitor className='h-6 w-6 text-primary' />,
    Programming: <Cpu className='h-6 w-6 text-primary' />,
    Design: <Paintbrush className='h-6 w-6 text-primary' />,
    Business: <Briefcase className='h-6 w-6 text-primary' />,
    'Health & Wellness': <Heart className='h-6 w-6 text-primary' />,
    Lifestyle: <Smile className='h-6 w-6 text-primary' />,
    Science: <Atom className='h-6 w-6 text-primary' />,
    Entertainment: <Film className='h-6 w-6 text-primary' />,
    Education: <BookOpen className='h-6 w-6 text-primary' />,
    Sports: <Trophy className='h-6 w-6 text-primary' />,
    Politics: <Globe className='h-6 w-6 text-primary' />,
    Art: <Paintbrush className='h-6 w-6 text-primary' />,
  };

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, success } = await getTopics();
      if (success) {
        setTopics(data);
      } else {
        throw new Error('Failed to fetch topics');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Failed to load topics. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    const currentSubtopics = topics.find(
      (topic) => topic._id === topicId
    )?.subtopics;
    const includesSelectedSubtopic = currentSubtopics?.find((subtopic) =>
      selectedSubtopics.includes(subtopic.slug)
    );
    if (!includesSelectedSubtopic)
      setSelectedTopics((prev) =>
        prev.includes(topicId)
          ? prev.filter((t) => t !== topicId)
          : [...prev, topicId]
      );
  };

  const toggleSubtopic = (topicId: string, subtopicSlug: string) => {
    setSelectedSubtopics((prev) =>
      prev.includes(subtopicSlug)
        ? prev.filter((s) => s !== subtopicSlug)
        : [...prev, subtopicSlug]
    );
    if (!selectedTopics.includes(topicId)) {
      setSelectedTopics((prev) => [...prev, topicId]);
    }
  };

  const router = useRouter();

  const handleSubmit = async () => {
    console.log('Selected topics:', selectedTopics);
    console.log('Selected subtopics:', selectedSubtopics);
    toast({
      title: 'Topics Saved',
      description: 'Your selected topics have been saved successfully.',
    });
    router.push('/dashboard');
    // TODO: Implement API call to save selected topics and subtopics
    // Redirect to dashboard or next step
  };

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6'>Select Your Interests</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardContent className='p-4'>
                <Skeleton className='h-6 w-3/4 mb-4' />
                <div className='grid grid-cols-2 gap-2'>
                  {[...Array(4)].map((_, subIndex) => (
                    <Skeleton key={subIndex} className='h-8 w-full' />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Select Your Interests</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-4'>
        {topics.map((topic) => (
          <Card
            key={topic._id}
            className={`cursor-pointer transition-colors ${
              selectedTopics.includes(topic._id)
                ? 'bg-primary/10 ring-2 ring-primary'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => toggleTopic(topic._id)}
          >
            <CardContent className='p-4 flex items-center gap-4'>
              {topicIcons[topic.name] || (
                <Monitor className='h-6 w-6 text-gray-400' />
              )}
              <div className='w-full'>
                <h2 className='text-xl font-semibold mb-2'>{topic.name}</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {topic.subtopics.map((subtopic) => (
                    <Button
                      key={subtopic.slug}
                      variant={
                        selectedSubtopics.includes(subtopic.slug)
                          ? 'default'
                          : 'outline'
                      }
                      className='w-full justify-start truncate !pr-10'
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubtopic(topic._id, subtopic.slug);
                      }}
                    >
                      {subtopic.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className='sticky bottom-0 py-4 bg-inherit'>
        <div className='w-full sm:w-fit min-w-52 rounded-lg bg-background mx-auto space-x-1 shadow'>
          <Button
            size='lg'
            onClick={handleSubmit}
            disabled={
              selectedTopics.length === 0 && selectedSubtopics.length === 0
            }
            className='w-full'
          >
           Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
