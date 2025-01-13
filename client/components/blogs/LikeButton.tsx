import React, { startTransition, useOptimistic, useState } from 'react';
import { Button } from '../ui/button';
import { ThumbsUp } from 'lucide-react';
import { toggleBlogLike } from '@/lib/actions/blogs';

const LikeButton = ({
  blogId,
  nReactions,
  variant = 'icon',
  className,
}: {
  blogId: string;
  nReactions: number;
  variant?: 'icon' | 'text';
  className?: string;
}) => {
  const [likes, setLikes] = useOptimistic(nReactions || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    startTransition(async () => {
      if (isLiked) {
        if (likes === 0) return;
        setLikes((prev) => prev - 1);
      } else {
        setLikes((prev) => prev + 1);
      }
      if (blogId) await toggleBlogLike(blogId);
    });
  };

  return (
    <Button
      onClick={handleLike}
      className={className}
      variant='ghost'
      size='sm'
    >
      <ThumbsUp
        className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current text-primary' : ''}`}
      />
      {likes} {variant === 'text' ? 'Likes' : ''}
    </Button>
  );
};

export default LikeButton;
