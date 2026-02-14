import { useState } from 'react';
import { Router, Routes, Route } from '@/lib/router';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { TickerMarquee } from '@/components/TickerMarquee';
import { Home } from '@/pages/Home';
import { StockRoomPage } from '@/pages/StockRoomPage';
import { StockRooms } from '@/pages/StockRooms';
import { PostDetail } from '@/pages/PostDetail';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { Toaster } from '@/components/ui/sonner';
import { mockDb } from '@/lib/mockSupabase';
import { CreatePostDialog } from '@/components/CreatePostDialog';
import type { StockRoom } from '@/types';

function Layout() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [stockRooms, setStockRooms] = useState<StockRoom[]>([]);

  const handleCreatePost = async () => {
    const rooms = await mockDb.getStockRooms();
    setStockRooms(rooms);
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background terminal-grid">
      <TickerMarquee />
      <Navbar onCreatePost={handleCreatePost} />
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock-rooms" element={<StockRooms />} />
          <Route path="/s/:name" element={<StockRoomPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </main>
      <CreatePostDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        stockRooms={stockRooms}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
