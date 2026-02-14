import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatNumber, calculateScore } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { mockDb } from '@/lib/mockSupabase';

interface VoteButtonsProps {
  postId?: string;
  commentId?: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote?: 'up' | 'down' | null;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md';
  onVote?: (newScore: number) => void;
}

export function VoteButtons({
  postId,
  commentId,
  initialUpvotes,
  initialDownvotes,
  initialUserVote = null,
  orientation = 'vertical',
  size = 'md',
  onVote,
}: VoteButtonsProps) {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(initialUserVote);

  const score = calculateScore(upvotes, downvotes);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      // Could show a login modal here
      return;
    }

    try {
      await mockDb.vote(user.id, postId || null, commentId || null, voteType);

      // Update local state based on vote action
      if (userVote === voteType) {
        // Removing vote
        if (voteType === 'up') {
          setUpvotes(prev => prev - 1);
        } else {
          setDownvotes(prev => prev - 1);
        }
        setUserVote(null);
      } else if (userVote) {
        // Changing vote
        if (voteType === 'up') {
          setUpvotes(prev => prev + 1);
          setDownvotes(prev => prev - 1);
        } else {
          setUpvotes(prev => prev - 1);
          setDownvotes(prev => prev + 1);
        }
        setUserVote(voteType);
      } else {
        // New vote
        if (voteType === 'up') {
          setUpvotes(prev => prev + 1);
        } else {
          setDownvotes(prev => prev + 1);
        }
        setUserVote(voteType);
      }

      onVote?.(calculateScore(
        voteType === 'up' 
          ? (userVote === 'up' ? upvotes - 1 : upvotes + 1)
          : upvotes,
        voteType === 'down'
          ? (userVote === 'down' ? downvotes - 1 : downvotes + 1)
          : downvotes
      ));
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const buttonSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  const scoreSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div
      className={cn(
        'flex items-center bg-muted/50 rounded-lg border border-border/50',
        orientation === 'vertical' ? 'flex-col py-1' : 'flex-row px-2 gap-1'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          buttonSize,
          'hover:bg-transparent hover:text-emerald-400',
          userVote === 'up' && 'text-emerald-400'
        )}
        onClick={() => handleVote('up')}
        disabled={!user}
      >
        <ArrowBigUp className={iconSize} />
      </Button>

      <span
        className={cn(
          scoreSize,
          'font-semibold tabular-nums',
          score > 0 && 'text-emerald-400',
          score < 0 && 'text-red-400',
          score === 0 && 'text-muted-foreground'
        )}
      >
        {formatNumber(score)}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          buttonSize,
          'hover:bg-transparent hover:text-red-400',
          userVote === 'down' && 'text-red-400'
        )}
        onClick={() => handleVote('down')}
        disabled={!user}
      >
        <ArrowBigDown className={iconSize} />
      </Button>
    </div>
  );
}
