import { useState } from 'react';
import { Link } from '@/lib/router';
import { MessageSquare, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VoteButtons } from './VoteButtons';
import { cn, formatRelativeTime } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { mockDb } from '@/lib/mockSupabase';
import type { Comment, User } from '@/types';

interface CommentWithAuthor extends Comment {
  author: User;
}

interface CommentProps {
  comment: CommentWithAuthor;
  postId: string;
  depth?: number;
  onReply?: () => void;
}

function CommentItem({ comment, postId, depth = 0, onReply }: CommentProps) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReplies, setLocalReplies] = useState<CommentWithAuthor[]>([]);

  const handleReply = async () => {
    if (!user || !replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await mockDb.createComment({
        content: replyContent.trim(),
        post_id: postId,
        author_id: user.id,
        parent_id: comment.id,
      });

      const commentWithAuthor: CommentWithAuthor = {
        ...newComment,
        author: user,
      };

      setLocalReplies(prev => [...prev, commentWithAuthor]);
      setReplyContent('');
      setIsReplying(false);
      onReply?.();
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxDepth = 6;
  const shouldIndent = depth < maxDepth;

  return (
    <div className={cn(
      'group',
      depth > 0 && shouldIndent && 'ml-4 pl-4 border-l-2 border-muted'
    )}>
      {/* Comment Content */}
      <div className="flex gap-3 py-3">
        {/* Vote Buttons */}
        <div className="flex-shrink-0">
          <VoteButtons
            commentId={comment.id}
            initialUpvotes={comment.upvotes}
            initialDownvotes={comment.downvotes}
            initialUserVote={comment.user_vote}
            orientation="vertical"
            size="sm"
          />
        </div>

        {/* Comment Body */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm mb-1">
            <img
              src={comment.author.avatar_url}
              alt={comment.author.username}
              className="w-5 h-5 rounded-full"
            />
            <Link
              to={`/user/${comment.author.id}`}
              className="font-medium hover:underline"
            >
              u/{comment.author.username}
            </Link>
            <span className="text-muted-foreground">
              {formatRelativeTime(comment.created_at)}
            </span>
          </div>

          {/* Content */}
          <div className="text-sm whitespace-pre-wrap mb-2">
            {comment.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() => setIsReplying(!isReplying)}
              disabled={!user}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Reply
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs">Report</DropdownMenuItem>
                {user?.id === comment.author_id && (
                  <DropdownMenuItem className="text-xs text-red-500">
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="What are your thoughts?"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyContent.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Replying...' : 'Reply'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {localReplies.length > 0 && (
        <div className="mt-1">
          {localReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CommentThreadProps {
  comments: CommentWithAuthor[];
  postId: string;
}

export function CommentThread({ comments, postId }: CommentThreadProps) {
  return (
    <div className="space-y-0">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          depth={0}
        />
      ))}
    </div>
  );
}
