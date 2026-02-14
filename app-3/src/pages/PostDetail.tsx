import { useState, useEffect } from 'react';
import { Link, useParams } from '@/lib/router';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCard } from '@/components/PostCard';
import { CommentThread } from '@/components/CommentThread';
import { StockRoomList } from '@/components/StockRoomList';
import { StockCard } from '@/components/StockCard';
import { useAuth } from '@/contexts/AuthContext';
import { mockDb } from '@/lib/mockSupabase';
import type { Post, Comment, StockRoom, User } from '@/types';

interface CommentWithAuthor extends Comment {
  author: User;
}

interface PostWithData extends Post {
  author: User;
  stock_room: StockRoom;
}

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<PostWithData | null>(null);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      // Fetch post
      const postData = await mockDb.getPostById(id);
      if (postData) {
        const author = await mockDb.getUserById(postData.author_id);
        const rooms = await mockDb.getStockRooms();
        const stock_room = rooms.find(r => r.id === postData.stock_room_id)!;
        
        setPost({
          ...postData,
          author: author!,
          stock_room,
        });

        // Fetch comments
        const commentsData = await mockDb.getComments(id);
        const enrichedComments: CommentWithAuthor[] = await Promise.all(
          commentsData.map(async (comment) => {
            const commentAuthor = await mockDb.getUserById(comment.author_id);
            return {
              ...comment,
              author: commentAuthor!,
            };
          })
        );
        
        setComments(enrichedComments);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!user || !commentContent.trim() || !id) return;

    setIsSubmitting(true);
    try {
      const newComment = await mockDb.createComment({
        content: commentContent.trim(),
        post_id: id,
        author_id: user.id,
        parent_id: null,
      });

      const commentWithAuthor: CommentWithAuthor = {
        ...newComment,
        author: user,
      };

      setComments(prev => [...prev, commentWithAuthor]);
      setCommentContent('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <Skeleton className="h-48 w-full mb-6" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The post you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Link>
          </Button>

          {/* Post */}
          <PostCard post={post} />

          {/* Comment Section */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {comments.length} Comments
              </h3>

              {/* Comment Input */}
              {user ? (
                <div className="mb-6 space-y-3">
                  <Textarea
                    placeholder="What are your thoughts?"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!commentContent.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Commenting...' : 'Comment'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Card className="mb-6 bg-muted/50">
                  <CardContent className="py-6 text-center">
                    <p className="text-muted-foreground mb-3">
                      Log in or sign up to leave a comment
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" asChild>
                        <Link to="/login">Log In</Link>
                      </Button>
                      <Button asChild>
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments */}
              {comments.length > 0 ? (
                <CommentThread comments={comments} postId={post.id} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stock Info */}
          <StockCard ticker={post.stock_room.name} />

          {/* Stock Room Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">
                s/{post.stock_room.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {post.stock_room.description}
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/s/${post.stock_room.name}`}>
                  View Community
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Related Tickers */}
          {post.tickers.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Mentioned Tickers</h3>
                <div className="space-y-2">
                  {post.tickers.map((ticker) => (
                    <StockCard key={ticker} ticker={ticker} compact />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stock Rooms */}
          <StockRoomList limit={5} />
        </div>
      </div>
    </div>
  );
}
