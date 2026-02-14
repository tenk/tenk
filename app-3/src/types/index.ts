// User types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  karma: number;
}

// Stock Room (Sub-community) types
export interface StockRoom {
  id: string;
  name: string; // e.g., "SAMSUNG", "HYUNDAI"
  display_name: string; // e.g., "Samsung Electronics", "Hyundai Motor"
  description: string;
  ticker: string; // e.g., "005930.KS"
  created_at: string;
  created_by: string;
  member_count: number;
  icon_url?: string;
}

// Post types
export interface Post {
  id: string;
  title: string;
  content: string;
  stock_room_id: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  tickers: string[]; // Extracted $TICKER tags
}

// Comment types (nested/threaded)
export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  parent_id: string | null | undefined;
  created_at: string;
  updated_at: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[]; // Nested replies
  user_vote?: 'up' | 'down' | null;
}

// Vote types
export interface Vote {
  id: string;
  user_id: string;
  post_id?: string | null;
  comment_id?: string | null;
  vote_type: 'up' | 'down';
  created_at: string;
}

// Stock data types
export interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap?: number;
  high_52w?: number;
  low_52w?: number;
  pe_ratio?: number;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Extended types with joined data
export interface PostWithAuthor extends Post {
  author: User;
  stock_room: StockRoom;
  user_vote?: 'up' | 'down' | null;
}

export interface CommentWithAuthor extends Comment {
  author: User;
}

export interface StockRoomWithMembership extends StockRoom {
  is_member?: boolean;
}
