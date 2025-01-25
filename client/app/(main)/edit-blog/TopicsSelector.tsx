import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Topic {
  value: string;
  label: string;
}

interface TopicSelectorProps {
  selectedTopics?: Topic[];
  setSelectedTopics: (topics: Topic[]) => void;
  topics: Topic[];
  title?: string;
}

export function TopicSelector({
  selectedTopics = [],
  setSelectedTopics,
  topics,
  title,
}: TopicSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelectTopic = (topic: Topic) => {
    if (!selectedTopics.some((t) => t.value === topic.value)) {
      setSelectedTopics([...selectedTopics, topic]);
    }
    setOpen(false);
  };

  const handleRemoveTopic = (topicToRemove: Topic) => {
    setSelectedTopics(
      selectedTopics.filter((topic) => topic.value !== topicToRemove.value)
    );
  };

  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap gap-2'>
        {selectedTopics.map((topic) => (
          <Badge
            key={topic.value}
            variant='secondary'
            className='text-sm flex-1 flex justify-between text-nowrap'
          >
            {topic.label}
            <Button
              variant='ghost'
              size='sm'
              className='ml-2 h-auto p-0 text-base'
              onClick={() => handleRemoveTopic(topic)}
            >
              <X className='h-3 w-3' />
            </Button>
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='h-8 border-dashed flex-1'
            >
              <Plus className='mr-2 h-4 w-4' />
              {title || 'Add topic'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandInput placeholder='Search topics...' className='h-9' />
              <CommandEmpty>No topic found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className='h-[200px]'>
                  {topics.map((topic) => (
                    <CommandItem
                      key={topic.value}
                      onSelect={() => handleSelectTopic(topic)}
                      className='cursor-pointer'
                    >
                      {topic.label}
                      <Check
                        className={`ml-auto h-4 w-4 ${
                          selectedTopics.some((t) => t.value === topic.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        }`}
                      />
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
