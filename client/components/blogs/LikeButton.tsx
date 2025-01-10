import React, { useState } from 'react';
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
  const [likes, setLikes] = useState(nReactions || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (blogId) await toggleBlogLike(blogId);
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
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
      {nReactions} {variant === 'text' ? 'Likes' : ''}
    </Button>
  );
};

export default LikeButton;
