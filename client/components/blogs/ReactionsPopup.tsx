'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { Book, Lightbulb, Coffee, Heart, Star, Pen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type ReactionType =
  | 'like'
  | 'insightful'
  | 'inspiring'
  | 'enjoyable'
  | 'favorite'
  | 'wellWritten';

interface ReactionIcon {
  icon: React.ElementType;
  label: string;
  color: string;
}

export const reactionIcons: Record<ReactionType, ReactionIcon> = {
  like: { icon: Heart, label: 'Like', color: 'text-red-500' },
  insightful: {
    icon: Lightbulb,
    label: 'Insightful',
    color: 'text-yellow-500',
  },
  inspiring: { icon: Book, label: 'Inspiring', color: 'text-blue-500' },
  enjoyable: { icon: Coffee, label: 'Enjoyable', color: 'text-orange-500' },
  favorite: { icon: Star, label: 'Favorite', color: 'text-purple-500' },
  wellWritten: { icon: Pen, label: 'Well Written', color: 'text-green-500' },
};

interface ReactionsPopupProps {
  onReact: (reaction: ReactionType) => void;
  currentReaction: ReactionType | null;
}

const ReactionsPopup: React.FC<ReactionsPopupProps> = ({
  onReact,
  currentReaction,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className='absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 shadow-lg rounded-full p-1 flex space-x-1 border border-gray-200 dark:border-gray-700'
    >
      <TooltipProvider delayDuration={0}>
        {Object.entries(reactionIcons).map(
          ([key, { icon: Icon, label, color }]) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    currentReaction === key
                      ? 'bg-gray-200 dark:bg-gray-600'
                      : ''
                  }`}
                  onClick={() => onReact(key as ReactionType)}
                >
                  <Icon
                    className={`w-5 h-5 ${color} ${
                      currentReaction === key ? 'fill-current' : ''
                    }`}
                  />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='text-xs bg-muted text-accent-foreground'
              >
                {label}
              </TooltipContent>
            </Tooltip>
          )
        )}
      </TooltipProvider>
    </motion.div>
  );
};

export default ReactionsPopup;
