import { useState, useEffect } from 'react';
import { Link } from '@/lib/router';
import { Search, TrendingUp, Users, Plus, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { mockDb } from '@/lib/mockSupabase';
import { formatNumber } from '@/lib/utils';
import type { StockRoom } from '@/types';

export function StockRooms() {
  const [stockRooms, setStockRooms] = useState<StockRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStockRooms = async () => {
      setIsLoading(true);
      const rooms = await mockDb.getStockRooms();
      setStockRooms(rooms);
      setIsLoading(false);
    };

    fetchStockRooms();
  }, []);

  const filteredRooms = stockRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularRooms = [...stockRooms].sort((a, b) => b.member_count - a.member_count);
  const newRooms = [...stockRooms].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Stock Rooms</h1>
          <p className="text-muted-foreground mt-1">
            Join communities for your favorite Korean stocks
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Stock Room
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, ticker, or company..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        // Search Results
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <StockRoomCard key={room.id} room={room} />
          ))}
          {filteredRooms.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No stock rooms found</p>
            </div>
          )}
        </div>
      ) : (
        // Tabs View
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Rooms</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stockRooms.map((room) => (
                  <StockRoomCard key={room.id} room={room} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularRooms.map((room) => (
                <StockRoomCard key={room.id} room={room} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newRooms.map((room) => (
                <StockRoomCard key={room.id} room={room} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function StockRoomCard({ room }: { room: StockRoom }) {
  return (
    <Link to={`/s/${room.name}`}>
      <Card className="h-full hover:border-primary/50 transition-colors group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {room.name.slice(0, 2)}
            </div>
            <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <h3 className="font-semibold text-lg mb-1">s/{room.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {room.display_name}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {formatNumber(room.member_count)}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {room.ticker}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
