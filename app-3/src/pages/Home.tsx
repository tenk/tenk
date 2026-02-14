import { useState, useEffect } from 'react';
import { Flame, Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard } from '@/components/PostCard';
import { StockRoomList } from '@/components/StockRoomList';
import { InvestorGateway } from '@/components/InvestorGateway';
import { CreatePostDialog } from '@/components/CreatePostDialog';
import { mockDb } from '@/lib/mockSupabase';
import type { Post, StockRoom, User } from '@/types';

interface PostWithData extends Post {
  author: User;
  stock_room: StockRoom;
  user_vote?: 'up' | 'down' | null;
}

export function Home() {
  const [posts, setPosts] = useState<PostWithData[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<PostWithData[]>([]);
  const [stockRooms, setStockRooms] = useState<StockRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch stock rooms
      const rooms = await mockDb.getStockRooms();
      setStockRooms(rooms);

      // Fetch all posts
      const postsData = await mockDb.getPosts();
      
      // Enrich posts with author and stock room data
      const enrichedPosts: PostWithData[] = await Promise.all(
        postsData.map(async (post) => {
          const author = await mockDb.getUserById(post.author_id);
          const stock_room = rooms.find(r => r.id === post.stock_room_id)!;
          return {
            ...post,
            author: author!,
            stock_room,
            user_vote: null,
          };
        })
      );

      setPosts(enrichedPosts);

      // Get trending posts (sorted by score)
      const trending = [...enrichedPosts]
        .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
        .slice(0, 10);
      setTrendingPosts(trending);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Investor Gateway */}
          <InvestorGateway />

          {/* Create Post Button */}
          <div>
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground h-12 glass-card"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                You
              </div>
              Create a post...
            </Button>
          </div>

          {/* Feed Tabs */}
          <Tabs defaultValue="hot" className="w-full">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="hot" className="gap-1">
                <Flame className="w-4 h-4" />
                Hot
              </TabsTrigger>
              <TabsTrigger value="new" className="gap-1">
                <Sparkles className="w-4 h-4" />
                New
              </TabsTrigger>
              <TabsTrigger value="top" className="gap-1">
                <TrendingUp className="w-4 h-4" />
                Top
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hot" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                trendingPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </TabsContent>

            <TabsContent value="top" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                [...posts]
                  .sort((a, b) => b.upvotes - a.upvotes)
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Welcome Card */}
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-purple-600/10 p-6 glass-card">
            <h2 className="text-lg font-semibold mb-2">
              Welcome to K-Equity Hub
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              The premier community for foreign investors in Korean markets. 
              Navigate the new omnibus account era with confidence.
            </p>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setIsCreateDialogOpen(true)}>
                Create Post
              </Button>
              <Button variant="outline" className="flex-1">
                <BookOpen className="w-4 h-4 mr-1" />
                Guide
              </Button>
            </div>
          </div>

          {/* Stock Rooms */}
          <StockRoomList limit={5} />

          {/* Trending Tickers */}
          <div className="rounded-xl border border-border/50 p-4 glass-card">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending Tickers
            </h3>
            <div className="space-y-2">
              {['SAMSUNG', 'SKHYNIX', 'HYUNDAI', 'LGENERGY'].map((ticker) => (
                <div
                  key={ticker}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium">${ticker}</span>
                  <span className="text-sm text-emerald-400">+2.4%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-muted-foreground space-x-2">
            <a href="#" className="hover:underline">About</a>
            <span>•</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>•</span>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        stockRooms={stockRooms}
      />
    </div>
  );
}
