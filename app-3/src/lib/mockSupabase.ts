import type { User, StockRoom, Post, Comment, Vote, StockData } from '@/types';

// In-memory data store
class MockDataStore {
  users: User[] = [];
  stockRooms: StockRoom[] = [];
  posts: Post[] = [];
  comments: Comment[] = [];
  votes: Vote[] = [];
  currentUser: User | null = null;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create sample stock rooms
    this.stockRooms = [
      {
        id: '1',
        name: 'SAMSUNG',
        display_name: 'Samsung Electronics',
        description: 'Discussion about Samsung Electronics (005930.KS) - Korea\'s largest electronics company.',
        ticker: '005930.KS',
        created_at: new Date().toISOString(),
        created_by: 'system',
        member_count: 15420,
      },
      {
        id: '2',
        name: 'HYUNDAI',
        display_name: 'Hyundai Motor',
        description: 'Hyundai Motor Company (005380.KS) - Global automotive manufacturer.',
        ticker: '005380.KS',
        created_at: new Date().toISOString(),
        created_by: 'system',
        member_count: 8930,
      },
      {
        id: '3',
        name: 'SKHYNIX',
        display_name: 'SK Hynix',
        description: 'SK Hynix (000660.KS) - Leading memory semiconductor manufacturer.',
        ticker: '000660.KS',
        created_at: new Date().toISOString(),
        created_by: 'system',
        member_count: 6210,
      },
      {
        id: '4',
        name: 'NAVER',
        display_name: 'Naver Corp',
        description: 'Naver (035420.KS) - Korea\'s largest search engine and tech company.',
        ticker: '035420.KS',
        created_at: new Date().toISOString(),
        created_by: 'system',
        member_count: 4560,
      },
      {
        id: '5',
        name: 'KAKAO',
        display_name: 'Kakao Corp',
        description: 'Kakao (035720.KS) - Mobile messaging and platform company.',
        ticker: '035720.KS',
        created_at: new Date().toISOString(),
        created_by: 'system',
        member_count: 3890,
      },
      {
        id: '6',
        name: 'LGENERGY',
        display_name: 'LG Energy Solution',
        description: 'LG Energy Solution (373220.KS) - Global battery manufacturer.',
        ticker: '373220.KS',
        created_at: new Date().toISOString(),
        created_by: 'system',
        member_count: 7230,
      },
      {
        id: '7',
        name: 'CELLTRION',
        display_name: 'Celltrion',
        description: 'Celltrion (068270.KS) - Biopharmaceutical company.',
        ticker: '068270.KS',
        created_at: new Date().toISOString(),
        created_by: 'system',
        member_count: 2150,
      },
      {
        id: '8',
        name: 'SAMSUNGBIO',
        display_name: 'Samsung Biologics',
        description: 'Samsung Biologics (207940.KS) - Biopharmaceutical contract manufacturer.',
        ticker: '207940.KS',
        created_at: new Date().toISOString(),
        created_by: 'system',
        member_count: 1890,
      },
    ];

    // Create sample users
    const sampleUsers: User[] = [
      {
        id: 'user1',
        email: 'investor@example.com',
        username: 'KInvestor',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KInvestor',
        created_at: new Date().toISOString(),
        karma: 1250,
      },
      {
        id: 'user2',
        email: 'trader@example.com',
        username: 'SeoulTrader',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SeoulTrader',
        created_at: new Date().toISOString(),
        karma: 890,
      },
      {
        id: 'user3',
        email: 'analyst@example.com',
        username: 'StockAnalyst',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StockAnalyst',
        created_at: new Date().toISOString(),
        karma: 2340,
      },
    ];
    this.users = sampleUsers;

    // Create sample posts
    this.posts = [
      {
        id: 'post1',
        title: 'Samsung Q4 Earnings Preview - What to Expect?',
        content: 'With Samsung\'s Q4 earnings coming up next week, I\'m seeing strong momentum in the semiconductor division. The $SAMSUNG stock has been consolidating around 72,000 KRW. What\'s everyone\'s take on the earnings call?\n\nI\'m particularly interested in:\n- Memory chip pricing trends\n- Foundry business outlook\n- Smartphone shipment numbers\n\nAlso keeping an eye on $SKHYNIX for comparison.',
        stock_room_id: '1',
        author_id: 'user1',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        upvotes: 45,
        downvotes: 3,
        comment_count: 12,
        tickers: ['SAMSUNG', 'SKHYNIX'],
      },
      {
        id: 'post2',
        title: 'Hyundai\'s EV Strategy Looking Strong',
        content: 'Hyundai Motor\'s electric vehicle lineup is gaining serious traction in the US and European markets. The Ioniq 5 and Ioniq 6 are getting great reviews. $HYUNDAI might be undervalued compared to other EV players.\n\nKey points:\n- Record EV sales in Q3\n- New Georgia plant coming online\n- Solid battery partnerships\n\nThoughts on the $LGENERGY partnership?',
        stock_room_id: '2',
        author_id: 'user2',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        upvotes: 32,
        downvotes: 1,
        comment_count: 8,
        tickers: ['HYUNDAI', 'LGENERGY'],
      },
      {
        id: 'post3',
        title: 'SK Hynix HBM3E Memory - Game Changer for AI?',
        content: 'SK Hynix\'s new HBM3E memory chips are getting massive orders from NVIDIA and other AI chip makers. This could be a huge revenue driver for $SKHYNIX in 2024.\n\nThe AI boom is real, and memory is at the center of it. $SAMSUNG is also in this space but SK Hynix seems to have the edge in HBM technology right now.',
        stock_room_id: '3',
        author_id: 'user3',
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        upvotes: 67,
        downvotes: 2,
        comment_count: 23,
        tickers: ['SKHYNIX', 'SAMSUNG'],
      },
      {
        id: 'post4',
        title: 'Naver Webtoon IPO - Impact on Stock Price?',
        content: 'With Naver Webtoon\'s potential IPO in the US, how do you think this will affect $NAVER stock? The webtoon business has been growing rapidly globally.\n\nCould be a major catalyst for the stock. Also watching $KAKAO for comparison in the content space.',
        stock_room_id: '4',
        author_id: 'user1',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        upvotes: 28,
        downvotes: 5,
        comment_count: 15,
        tickers: ['NAVER', 'KAKAO'],
      },
      {
        id: 'post5',
        title: 'Kakao Pay Regulatory Issues - Buying Opportunity?',
        content: 'Kakao Pay has been facing some regulatory scrutiny lately, causing the stock to dip. Is this a good entry point for long-term investors?\n\nThe fintech business fundamentals remain strong, and $KAKAO has a massive user base to leverage.',
        stock_room_id: '5',
        author_id: 'user2',
        created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        upvotes: 19,
        downvotes: 7,
        comment_count: 9,
        tickers: ['KAKAO'],
      },
      {
        id: 'post6',
        title: 'LG Energy Solution - Battery Market Dominance',
        content: 'LG Energy Solution continues to sign major supply deals with global automakers. The EV battery market is exploding and $LGENERGY is positioned perfectly.\n\nRecent wins:\n- Toyota partnership expansion\n- New European facility announcements\n- Solid-state battery R&D progress\n\nThis is a long-term hold for me.',
        stock_room_id: '6',
        author_id: 'user3',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        upvotes: 41,
        downvotes: 2,
        comment_count: 11,
        tickers: ['LGENERGY'],
      },
    ];

    // Create sample comments
    this.comments = [
      {
        id: 'comment1',
        content: 'Great analysis! I\'m also bullish on Samsung\'s semiconductor recovery. The memory cycle seems to be turning.',
        post_id: 'post1',
        author_id: 'user2',
        parent_id: undefined,
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        upvotes: 8,
        downvotes: 0,
      },
      {
        id: 'comment2',
        content: 'Agreed! The HBM3 margins are going to be fantastic. SK Hynix is leading but Samsung is catching up fast.',
        post_id: 'post1',
        author_id: 'user3',
        parent_id: 'comment1',
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        upvotes: 5,
        downvotes: 0,
      },
      {
        id: 'comment3',
        content: 'I\'m concerned about smartphone demand though. The global market is still soft.',
        post_id: 'post1',
        author_id: 'user1',
        parent_id: undefined,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        upvotes: 3,
        downvotes: 1,
      },
      {
        id: 'comment4',
        content: 'The Ioniq 5 is an amazing car. I own one and the quality is exceptional. Hyundai is definitely competing with Tesla now.',
        post_id: 'post2',
        author_id: 'user3',
        parent_id: undefined,
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        upvotes: 12,
        downvotes: 0,
      },
      {
        id: 'comment5',
        content: 'HBM3E is going to be massive for AI training. SK Hynix has the best technology right now.',
        post_id: 'post3',
        author_id: 'user1',
        parent_id: undefined,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        upvotes: 15,
        downvotes: 0,
      },
    ];
  }

  // Auth methods
  async signUp(email: string, _password: string, username: string): Promise<User> {
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user${Date.now()}`,
      email,
      username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      created_at: new Date().toISOString(),
      karma: 0,
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    return newUser;
  }

  async signIn(email: string, _password: string): Promise<User> {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    this.currentUser = user;
    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Stock room methods
  async getStockRooms(): Promise<StockRoom[]> {
    return [...this.stockRooms].sort((a, b) => b.member_count - a.member_count);
  }

  async getStockRoomByName(name: string): Promise<StockRoom | null> {
    return this.stockRooms.find(r => r.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async createStockRoom(room: Omit<StockRoom, 'id' | 'created_at' | 'member_count'>): Promise<StockRoom> {
    const newRoom: StockRoom = {
      ...room,
      id: `room${Date.now()}`,
      created_at: new Date().toISOString(),
      member_count: 1,
    };
    this.stockRooms.push(newRoom);
    return newRoom;
  }

  // Post methods
  async getPosts(stockRoomId?: string): Promise<Post[]> {
    let posts = [...this.posts];
    if (stockRoomId) {
      posts = posts.filter(p => p.stock_room_id === stockRoomId);
    }
    return posts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getTrendingPosts(): Promise<Post[]> {
    return [...this.posts]
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
      .slice(0, 10);
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.posts.find(p => p.id === id) || null;
  }

  async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes' | 'comment_count'>): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: `post${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      comment_count: 0,
    };
    this.posts.push(newPost);
    return newPost;
  }

  // Comment methods
  async getComments(postId: string): Promise<Comment[]> {
    return this.comments
      .filter(c => c.post_id === postId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  async createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: `comment${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };
    this.comments.push(newComment);
    
    // Update comment count on post
    const post = this.posts.find(p => p.id === comment.post_id);
    if (post) {
      post.comment_count += 1;
    }
    
    return newComment;
  }

  // Vote methods
  async vote(userId: string, postId: string | null, commentId: string | null, voteType: 'up' | 'down'): Promise<void> {
    const existingVoteIndex = this.votes.findIndex(v => 
      v.user_id === userId && 
      v.post_id === postId && 
      v.comment_id === commentId
    );

    if (existingVoteIndex >= 0) {
      const existingVote = this.votes[existingVoteIndex];
      if (existingVote.vote_type === voteType) {
        // Remove vote if same type
        this.votes.splice(existingVoteIndex, 1);
        this.updateVoteCount(postId, commentId, voteType, 'remove');
      } else {
        // Change vote type
        this.updateVoteCount(postId, commentId, existingVote.vote_type, 'remove');
        this.updateVoteCount(postId, commentId, voteType, 'add');
        existingVote.vote_type = voteType;
      }
    } else {
      // New vote
      this.votes.push({
        id: `vote${Date.now()}`,
        user_id: userId,
        post_id: postId,
        comment_id: commentId,
        vote_type: voteType,
        created_at: new Date().toISOString(),
      });
      this.updateVoteCount(postId, commentId, voteType, 'add');
    }
  }

  private updateVoteCount(postId: string | null, commentId: string | null, voteType: 'up' | 'down', action: 'add' | 'remove') {
    const delta = action === 'add' ? 1 : -1;
    
    if (postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        if (voteType === 'up') {
          post.upvotes += delta;
        } else {
          post.downvotes += delta;
        }
      }
    } else if (commentId) {
      const comment = this.comments.find(c => c.id === commentId);
      if (comment) {
        if (voteType === 'up') {
          comment.upvotes += delta;
        } else {
          comment.downvotes += delta;
        }
      }
    }
  }

  async getUserVote(userId: string, postId?: string, commentId?: string): Promise<'up' | 'down' | null> {
    const vote = this.votes.find(v => 
      v.user_id === userId && 
      v.post_id === postId && 
      v.comment_id === commentId
    );
    return vote?.vote_type || null;
  }

  // User methods
  async getUserById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  // Stock data (mock)
  async getStockData(ticker: string): Promise<StockData | null> {
    const stockDataMap: Record<string, StockData> = {
      '005930.KS': {
        ticker: '005930.KS',
        name: 'Samsung Electronics',
        price: 72500,
        change: 1200,
        change_percent: 1.68,
        volume: 15234567,
        market_cap: 432500000000000,
        high_52w: 86500,
        low_52w: 63500,
        pe_ratio: 12.4,
      },
      '005380.KS': {
        ticker: '005380.KS',
        name: 'Hyundai Motor',
        price: 198500,
        change: 3500,
        change_percent: 1.79,
        volume: 2345678,
        market_cap: 165200000000000,
        high_52w: 215000,
        low_52w: 165000,
        pe_ratio: 8.2,
      },
      '000660.KS': {
        ticker: '000660.KS',
        name: 'SK Hynix',
        price: 158500,
        change: 4200,
        change_percent: 2.72,
        volume: 3456789,
        market_cap: 115400000000000,
        high_52w: 175000,
        low_52w: 98500,
        pe_ratio: -15.2,
      },
      '035420.KS': {
        ticker: '035420.KS',
        name: 'Naver',
        price: 198000,
        change: -1500,
        change_percent: -0.75,
        volume: 1234567,
        market_cap: 32500000000000,
        high_52w: 245000,
        low_52w: 185000,
        pe_ratio: 28.5,
      },
      '035720.KS': {
        ticker: '035720.KS',
        name: 'Kakao',
        price: 42500,
        change: -800,
        change_percent: -1.85,
        volume: 2345678,
        market_cap: 18900000000000,
        high_52w: 68500,
        low_52w: 39500,
        pe_ratio: 45.2,
      },
      '373220.KS': {
        ticker: '373220.KS',
        name: 'LG Energy Solution',
        price: 385000,
        change: 5500,
        change_percent: 1.45,
        volume: 987654,
        market_cap: 89800000000000,
        high_52w: 465000,
        low_52w: 325000,
        pe_ratio: 32.1,
      },
      '068270.KS': {
        ticker: '068270.KS',
        name: 'Celltrion',
        price: 68500,
        change: 1200,
        change_percent: 1.78,
        volume: 1234567,
        market_cap: 18900000000000,
        high_52w: 78500,
        low_52w: 58500,
        pe_ratio: 22.3,
      },
      '207940.KS': {
        ticker: '207940.KS',
        name: 'Samsung Biologics',
        price: 785000,
        change: 8500,
        change_percent: 1.09,
        volume: 234567,
        market_cap: 52500000000000,
        high_52w: 895000,
        low_52w: 685000,
        pe_ratio: 85.4,
      },
    };

    return stockDataMap[ticker] || null;
  }
}

// Export singleton instance
export const mockDb = new MockDataStore();

// Mock Supabase client interface
export const mockSupabase = {
  auth: {
    signUp: async ({ email }: { email: string; password: string }) => {
      const username = email.split('@')[0];
      const user = await mockDb.signUp(email, 'password', username);
      return { data: { user }, error: null };
    },
    signInWithPassword: async ({ email }: { email: string; password: string }) => {
      try {
        const user = await mockDb.signIn(email, 'password');
        return { data: { user }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    signOut: async () => {
      await mockDb.signOut();
      return { error: null };
    },
    getUser: async () => {
      const user = mockDb.getCurrentUser();
      return { data: { user }, error: null };
    },
    onAuthStateChange: () => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },
  from: (table: string) => ({
    select: () => ({
      eq: (_column: string, value: string) => ({
        single: async () => {
          if (table === 'stock_rooms') {
            const room = await mockDb.getStockRoomByName(value);
            return { data: room, error: null };
          }
          if (table === 'posts') {
            const post = await mockDb.getPostById(value);
            return { data: post, error: null };
          }
          if (table === 'users') {
            const user = await mockDb.getUserById(value);
            return { data: user, error: null };
          }
          return { data: null, error: null };
        },
        order: () => ({
          data: async () => {
            if (table === 'comments') {
              const comments = await mockDb.getComments(value);
              return { data: comments, error: null };
            }
            return { data: [], error: null };
          },
        }),
      }),
      order: () => ({
        data: async () => {
          if (table === 'stock_rooms') {
            const rooms = await mockDb.getStockRooms();
            return { data: rooms, error: null };
          }
          if (table === 'posts') {
            const posts = await mockDb.getPosts();
            return { data: posts, error: null };
          }
          return { data: [], error: null };
        },
      }),
      data: async () => {
        if (table === 'stock_rooms') {
          const rooms = await mockDb.getStockRooms();
          return { data: rooms, error: null };
        }
        if (table === 'posts') {
          const posts = await mockDb.getPosts();
          return { data: posts, error: null };
        }
        return { data: [], error: null };
      },
    }),
    insert: (data: unknown) => ({
      select: () => ({
        single: async () => {
          if (table === 'stock_rooms') {
            const room = await mockDb.createStockRoom(data as Omit<StockRoom, 'id' | 'created_at' | 'member_count'>);
            return { data: room, error: null };
          }
          if (table === 'posts') {
            const post = await mockDb.createPost(data as Omit<Post, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes' | 'comment_count'>);
            return { data: post, error: null };
          }
          if (table === 'comments') {
            const comment = await mockDb.createComment(data as Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes'>);
            return { data: comment, error: null };
          }
          return { data: null, error: null };
        },
      }),
    }),
  }),
  rpc: () => ({
    data: async () => {
      return { data: null, error: null };
    },
  }),
};

export default mockSupabase;
