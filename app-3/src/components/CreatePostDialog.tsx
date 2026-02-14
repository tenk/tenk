import { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { Link2, Image, Hash, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { mockDb } from '@/lib/mockSupabase';
import { FlairSelector, type FlairType } from './PostFlair';
import type { StockRoom } from '@/types';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockRooms: StockRoom[];
  defaultStockRoom?: string;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  stockRooms,
  defaultStockRoom,
}: CreatePostDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(defaultStockRoom || '');
  const [flair, setFlair] = useState<FlairType>('General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('text');

  const handleSubmit = async () => {
    if (!user || !title.trim() || !selectedRoom) return;

    setIsSubmitting(true);
    try {
      // Extract tickers from content
      const tickerRegex = /\$([A-Z]+)/g;
      const tickers: string[] = [];
      let match;
      while ((match = tickerRegex.exec(content)) !== null) {
        if (!tickers.includes(match[1])) {
          tickers.push(match[1]);
        }
      }

      // Prepend flair to title
      const fullTitle = flair !== 'General' ? `[${flair}] ${title}` : title;

      const newPost = await mockDb.createPost({
        title: fullTitle,
        content: content.trim(),
        stock_room_id: selectedRoom,
        author_id: user.id,
        tickers,
      });

      onOpenChange(false);
      setTitle('');
      setContent('');
      setSelectedRoom('');
      setFlair('General');
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertTicker = () => {
    const ticker = prompt('Enter ticker symbol (e.g., SAMSUNG):');
    if (ticker) {
      setContent(prev => prev + `$${ticker.toUpperCase()}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Flair Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Post Flair <span className="text-red-400">*</span></label>
            <FlairSelector value={flair} onChange={setFlair} />
          </div>

          {/* Stock Room Selection */}
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Select a stock room" />
            </SelectTrigger>
            <SelectContent>
              {stockRooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[8px] text-white font-bold">
                      {room.name.slice(0, 2)}
                    </span>
                    s/{room.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Title */}
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="image" disabled>
                <Image className="w-4 h-4 mr-1" />
                Image
              </TabsTrigger>
              <TabsTrigger value="link" disabled>
                <Link2 className="w-4 h-4 mr-1" />
                Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-4">
              <div className="relative">
                <Textarea
                  placeholder="What are your thoughts? Use $TICKER to tag stocks (e.g., $SAMSUNG)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={insertTicker}
                  >
                    <Hash className="w-4 h-4 mr-1" />
                    Add Ticker
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview */}
          {content && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Preview</p>
              <div className="text-sm whitespace-pre-wrap">
                {content.split(/(\$[A-Z]+)/g).map((part, i) => {
                  if (part.match(/\$[A-Z]+/)) {
                    return (
                      <span
                        key={i}
                        className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium"
                      >
                        {part}
                      </span>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </div>
          )}

          {/* Flair Guidelines */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
            <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Flair Guidelines:</p>
              <ul className="space-y-0.5">
                <li><strong>DD/Analysis</strong> - In-depth research and analysis</li>
                <li><strong>Regulatory News</strong> - Policy changes, KRX announcements</li>
                <li><strong>Dividend Info</strong> - Dividend dates, yields, distributions</li>
                <li><strong>Tax Question</strong> - Tax implications, reporting questions</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !selectedRoom || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
