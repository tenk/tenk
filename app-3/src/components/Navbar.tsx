import { useState } from 'react';
import { Link, useNavigate } from '@/lib/router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  TrendingUp,
  LogOut,
  User,
  Menu,
  X,
  MessageSquare,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onCreatePost?: () => void;
}

export function Navbar({ onCreatePost }: NavbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stock-rooms?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="hidden font-bold text-lg sm:inline-block">
            K-Equity Hub
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search stock rooms..."
              className="pl-9 w-full bg-muted/50 border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/stock-rooms')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Stock Rooms
          </Button>

          {user ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={onCreatePost}
                className="ml-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 gap-2">
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="max-w-[80px] truncate">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate(`/user/${user.id}`)}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden border-t border-border/50 bg-background',
          isMobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="container py-4 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/');
              setIsMobileMenuOpen(false);
            }}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/stock-rooms');
              setIsMobileMenuOpen(false);
            }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Stock Rooms
          </Button>

          {user ? (
            <>
              <Button
                variant="default"
                className="w-full justify-start"
                onClick={() => {
                  onCreatePost?.();
                  setIsMobileMenuOpen(false);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(`/user/${user.id}`);
                  setIsMobileMenuOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400"
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
              >
                Log In
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  navigate('/signup');
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
