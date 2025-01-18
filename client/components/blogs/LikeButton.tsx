import React, { startTransition, useOptimistic } from 'react';
import { Button } from '../ui/button';
import { ThumbsUp } from 'lucide-react';
import { toggleBlogLike } from '@/lib/actions/blogs';

const LikeButton = ({
  blogId,
  nReactions,
  variant = 'icon',
  className,
  isLiked,
}: {
  blogId: string;
  nReactions: number;
  variant?: 'icon' | 'text';
  className?: string;
  isLiked?: boolean;
}) => {
  const [likes, setLikes] = useOptimistic(nReactions || 0);
  const [like, setlike] = useOptimistic(isLiked || false);

  const handleLike = async () => {
    startTransition(async () => {
      setlike(!like);
      if (like) {
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
        className={`w-4 h-4 mr-2 ${like ? 'fill-current text-primary' : ''}`}
      />
      {likes} {variant === 'text' ? 'Likes' : ''}
    </Button>
  );
};

export default LikeButton;
