import { useState } from 'react';
import { Link } from '@/lib/router';
import { MessageSquare, Share2, MoreHorizontal, Link2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { VoteButtons } from './VoteButtons';
import { StockCard } from './StockCard';
import { PostFlair, type FlairType } from './PostFlair';
import { cn, formatRelativeTime, formatNumber } from '@/lib/utils';
import type { PostWithAuthor } from '@/types';

interface PostCardProps {
  post: PostWithAuthor;
  compact?: boolean;
}

// Parse flair from title
function parseFlair(title: string): { flair: FlairType | null; cleanTitle: string } {
  const flairMatch = title.match(/^\[(DD\/Analysis|Regulatory News|Dividend Info|Tax Question)\]\s*/);
  if (flairMatch) {
    return {
      flair: flairMatch[1] as FlairType,
      cleanTitle: title.replace(flairMatch[0], ''),
    };
  }
  return { flair: null, cleanTitle: title };
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const { flair, cleanTitle } = parseFlair(post.title);

  const renderContent = (content: string) => {
    // Split content by ticker tags
    const parts = content.split(/(\$[A-Z]+)/g);
    
    return parts.map((part, index) => {
      const tickerMatch = part.match(/\$([A-Z]+)/);
      if (tickerMatch) {
        const ticker = tickerMatch[1];
        return (
          <HoverCard key={index} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Link
                to={`/s/${ticker}`}
                className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium text-sm hover:underline mx-0.5"
              >
                ${ticker}
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-0" align="start">
              <StockCard ticker={ticker} compact />
            </HoverCardContent>
          </HoverCard>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const content = showFullContent || post.content.length < 300
    ? post.content
    : post.content.slice(0, 300) + '...';

  return (
    <Card className={cn(
      'hover:border-primary/30 transition-all duration-200 glass-card',
      compact && 'border-0 shadow-none hover:bg-muted/30'
    )}>
      <CardContent className={cn('p-0', compact ? 'py-2' : 'p-4')}>
        <div className="flex gap-4">
          {/* Vote Buttons */}
          <div className="flex-shrink-0">
            <VoteButtons
              postId={post.id}
              initialUpvotes={post.upvotes}
              initialDownvotes={post.downvotes}
              initialUserVote={post.user_vote}
              orientation="vertical"
              size={compact ? 'sm' : 'md'}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link 
                to={`/s/${post.stock_room.name}`}
                className="font-medium text-foreground hover:underline flex items-center gap-1"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                  {post.stock_room.name.slice(0, 2)}
                </span>
                s/{post.stock_room.name}
              </Link>
              <span>•</span>
              <span>Posted by</span>
              <Link 
                to={`/user/${post.author.id}`}
                className="hover:underline"
              >
                u/{post.author.username}
              </Link>
              <span>•</span>
              <span>{formatRelativeTime(post.created_at)}</span>
            </div>

            {/* Title with Flair */}
            <Link to={`/post/${post.id}`}>
              <h3 className={cn(
                'font-semibold text-foreground hover:underline mb-2 flex items-center gap-2',
                compact ? 'text-base' : 'text-lg'
              )}>
                {flair && <PostFlair flair={flair} />}
                <span>{cleanTitle}</span>
              </h3>
            </Link>

            {/* Content */}
            <div className={cn(
              'text-muted-foreground whitespace-pre-wrap',
              compact ? 'text-sm' : 'text-base'
            )}>
              {renderContent(content)}
              {!showFullContent && post.content.length > 300 && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto font-normal"
                  onClick={() => setShowFullContent(true)}
                >
                  Read more
                </Button>
              )}
            </div>

            {/* Ticker Tags */}
            {post.tickers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tickers.map((ticker) => (
                  <HoverCard key={ticker} openDelay={200} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Link
                        to={`/s/${ticker}`}
                        className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-xs font-medium hover:bg-muted/80 transition-colors"
                      >
                        ${ticker}
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto p-0" align="start">
                      <StockCard ticker={ticker} compact />
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className={cn(
        'flex items-center gap-2',
        compact ? 'px-2 py-1' : 'px-4 py-2'
      )}>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          asChild
        >
          <Link to={`/post/${post.id}`}>
            <MessageSquare className="w-4 h-4 mr-1" />
            {formatNumber(post.comment_count)} Comments
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground ml-auto"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link2 className="w-4 h-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
