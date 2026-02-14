import { useState, useEffect } from 'react';
import { Link } from '@/lib/router';
import { TrendingUp, Users, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { mockDb } from '@/lib/mockSupabase';
import { formatNumber } from '@/lib/utils';
import type { StockRoom } from '@/types';

interface StockRoomListProps {
  limit?: number;
  showCreateButton?: boolean;
}

export function StockRoomList({ limit, showCreateButton = true }: StockRoomListProps) {
  const [stockRooms, setStockRooms] = useState<StockRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStockRooms = async () => {
      setIsLoading(true);
      const rooms = await mockDb.getStockRooms();
      setStockRooms(limit ? rooms.slice(0, limit) : rooms);
      setIsLoading(false);
    };

    fetchStockRooms();
  }, [limit]);

  const filteredRooms = stockRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Stock Rooms
          </CardTitle>
          {showCreateButton && (
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Create
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Room List */}
        <div className="space-y-1">
          {filteredRooms.map((room, index) => (
            <Link
              key={room.id}
              to={`/s/${room.name}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <span className="text-sm font-medium text-muted-foreground w-5">
                {index + 1}
              </span>
              
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                {room.name.slice(0, 2)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                  s/{room.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {room.display_name}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                {formatNumber(room.member_count)}
              </div>
            </Link>
          ))}

          {filteredRooms.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No stock rooms found
            </p>
          )}
        </div>

        {!limit && (
          <Button variant="outline" className="w-full" asChild>
            <Link to="/stock-rooms">View All Stock Rooms</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
