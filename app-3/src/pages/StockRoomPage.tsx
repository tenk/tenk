import { useState, useEffect } from 'react';
import { Link, useParams } from '@/lib/router';
import { Users, Plus, Info, Bell, Share2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PostCard } from '@/components/PostCard';
import { StockCard } from '@/components/StockCard';
import { CreatePostDialog } from '@/components/CreatePostDialog';
import { TenkAnalysis } from '@/components/TenkAnalysis';
import { mockDb } from '@/lib/mockSupabase';
import { formatNumber } from '@/lib/utils';
import type { Post, StockRoom, User } from '@/types';

interface PostWithData extends Post {
  author: User;
  stock_room: StockRoom;
}

export function StockRoomPage() {
  const { name } = useParams<{ name: string }>();
  const [stockRoom, setStockRoom] = useState<StockRoom | null>(null);
  const [posts, setPosts] = useState<PostWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!name) return;
      
      setIsLoading(true);
      
      // Fetch stock room
      const room = await mockDb.getStockRoomByName(name);
      if (room) {
        setStockRoom(room);
        
        // Fetch posts for this stock room
        const postsData = await mockDb.getPosts(room.id);
        
        // Enrich posts with author data
        const enrichedPosts: PostWithData[] = await Promise.all(
          postsData.map(async (post) => {
            const author = await mockDb.getUserById(post.author_id);
            return {
              ...post,
              author: author!,
              stock_room: room,
            };
          })
        );
        
        setPosts(enrichedPosts);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [name]);

  if (isLoading) {
    return (
      <div className="container py-6">
        <Skeleton className="h-48 w-full mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!stockRoom) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Stock Room Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The stock room you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600/90 to-purple-700/90 text-white border-b border-white/10">
        <div className="container py-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border border-white/20">
              {stockRoom.name.slice(0, 2)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">s/{stockRoom.name}</h1>
              <p className="text-white/80">{stockRoom.display_name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formatNumber(stockRoom.member_count)} members
                </span>
                <span>•</span>
                <span>{posts.length} posts</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isJoined ? "secondary" : "default"}
                className={isJoined ? "bg-white/20 text-white hover:bg-white/30" : "bg-white text-blue-600 hover:bg-white/90"}
                onClick={() => setIsJoined(!isJoined)}
              >
                {isJoined ? 'Joined' : 'Join'}
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Create Post Button */}
            <div className="mb-4">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground h-12 glass-card"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                  You
                </div>
                Create a post in s/{stockRoom.name}...
              </Button>
            </div>

            {/* Posts Tabs */}
            <Tabs defaultValue="hot" className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="hot">Hot</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="top">Top</TabsTrigger>
              </TabsList>

              <TabsContent value="hot" className="space-y-4">
                {posts.length === 0 ? (
                  <Card className="glass-card">
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground mb-4">
                        No posts yet in this stock room.
                      </p>
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Post
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                {[...posts]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </TabsContent>

              <TabsContent value="top" className="space-y-4">
                {[...posts]
                  .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
                  .map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stock Info Card */}
            <StockCard ticker={stockRoom.name} />

            {/* Tenk-Analysis Card */}
            <Card className="glass-card border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tenk-Analysis</h3>
                    <p className="text-xs text-muted-foreground">AI Filing Analyst</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Ask questions about {stockRoom.display_name} filings, the omnibus account structure, 
                  or regulatory changes affecting foreign investors.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[10px]">Omnibus Guide</Badge>
                  <Badge variant="outline" className="text-[10px]">Tax Info</Badge>
                  <Badge variant="outline" className="text-[10px]">KRX Disclosures</Badge>
                </div>
              </CardContent>
            </Card>

            {/* About Card */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  About
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stockRoom.description}
                </p>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Ticker: </span>
                    <span className="font-medium">{stockRoom.ticker}</span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="text-muted-foreground">Created: </span>
                    <span className="font-medium">
                      {new Date(stockRoom.created_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Rules Card */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Community Rules</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="font-medium text-muted-foreground">1.</span>
                    Be respectful and constructive
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-muted-foreground">2.</span>
                    No financial advice - share opinions only
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-muted-foreground">3.</span>
                    Cite sources for news and data
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-muted-foreground">4.</span>
                    No spam or self-promotion
                  </li>
                </ol>
              </CardContent>
            </Card>

            {/* Related Stock Rooms */}
            <Card className="glass-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Related Rooms</h3>
                <div className="space-y-2">
                  {['SAMSUNG', 'SKHYNIX', 'LGENERGY'].filter(n => n !== stockRoom.name).slice(0, 3).map((roomName) => (
                    <Link
                      key={roomName}
                      to={`/s/${roomName}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                        {roomName.slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium">s/{roomName}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        stockRooms={[stockRoom]}
        defaultStockRoom={stockRoom.id}
      />

      {/* Tenk-Analysis Chat */}
      <TenkAnalysis stockRoomName={stockRoom.name} ticker={stockRoom.ticker} />
    </div>
  );
}
