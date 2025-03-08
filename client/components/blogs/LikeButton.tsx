'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ReactionsPopup, {
  type ReactionType,
  reactionIcons,
} from './ReactionsPopup';
import { toggleBlogLike } from '@/lib/actions/blogs';
import { cn } from '@/lib/utils';

type ReactionCounts = Partial<Record<ReactionType, number>>;

interface ReactionButtonProps {
  blogId: string;
  initialReactions: ReactionCounts;
  userReaction?: ReactionType | null;
  variant?: 'icon' | 'text';
  className?: string;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  blogId,
  initialReactions,
  userReaction: initialUserReaction,
  variant = 'icon',
  className,
}) => {
  const [reactionCounts, setReactionCounts] = useState(initialReactions);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(
    initialUserReaction || null
  );
  const [showReactions, setShowReactions] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShowReactions = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowReactions(true);
    }, 350);
  };

  const handleHideReactions = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleReaction = async (reaction: ReactionType) => {
    handleHideReactions();
    if (userReaction === reaction) {
      setUserReaction(null);
      setReactionCounts((prev) => ({
        ...prev,
        [reaction]: Math.max(0, (prev[reaction] || 0) - 1),
      }));
    } else {
      if (userReaction) {
        setReactionCounts((prev) => ({
          ...prev,
          [userReaction]: Math.max(0, (prev[userReaction] || 0) - 1),
        }));
      }
      setUserReaction(reaction);
      setReactionCounts((prev) => ({
        ...prev,
        [reaction]: (prev[reaction] || 0) + 1,
      }));
    }

    if (blogId) await toggleBlogLike(blogId);
  };

  const totalReactions = Object.values(reactionCounts).reduce(
    (a, b) => a + (b || 0),
    0
  );
  const CurrentIcon = userReaction
    ? reactionIcons[userReaction].icon
    : reactionIcons.clap.icon;

  return (
    <div
      className='relative'
      onMouseEnter={handleShowReactions}
      onMouseLeave={handleHideReactions}
    >
      <Button
        ref={buttonRef}
        variant='ghost'
        size='sm'
        className={cn('gap-2', className)}
        onClick={() => {
          if (userReaction) {
            setUserReaction(null);
          } else handleReaction('clap');
          handleHideReactions();
        }}
        aria-label='React to blog post'
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <CurrentIcon
            className={cn(
              'w-5 h-5',
              userReaction && reactionIcons[userReaction].color,
              !userReaction &&
                'fill-accent-foreground stroke-accent-foreground border-accent-foreground'
            )}
          />
        </motion.div>
        {variant === 'text' && <span>{totalReactions}</span>}
      </Button>
      <AnimatePresence>
        {showReactions && (
          <div
            ref={popupRef}
            onMouseEnter={handleShowReactions}
            onMouseLeave={handleHideReactions}
          >
            <ReactionsPopup
              onReact={handleReaction}
              currentReaction={userReaction}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionButton;
