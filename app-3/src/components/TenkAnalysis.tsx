import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  FileText, 
  X, 
  Sparkles, 
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

interface TenkAnalysisProps {
  stockRoomName: string;
  ticker?: string;
}

const SUGGESTED_QUESTIONS = [
  "What are the benefits of the omnibus account structure?",
  "How does the IRC abolition affect foreign investors?",
  "What are the tax implications for dividend income?",
  "Explain the reporting requirements for US taxpayers",
  "What changed with the January 2024 regulations?",
];

export function TenkAnalysis({ stockRoomName }: TenkAnalysisProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your Korean filings analyst for ${stockRoomName}. I can help you understand corporate disclosures, regulatory changes, and the new omnibus account benefits. What would you like to know?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (question: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerQuestion = question.toLowerCase();
    
    // Omnibus-related questions
    if (lowerQuestion.includes('omnibus') || lowerQuestion.includes('account')) {
      if (lowerQuestion.includes('benefit') || lowerQuestion.includes('advantage')) {
        return `The Omnibus Account structure offers several key benefits for foreign investors in ${stockRoomName}:

**Instant Market Access**: Trade immediately without the previous 5-day IRC registration delay.

**Consolidated Reporting**: All your Korean holdings are under one account structure, dramatically simplifying tax reporting.

**Reduced Documentation**: No need to register each stock individually - your broker handles KRX reporting.

**Lower Costs**: Eliminates the per-transaction registration fees that previously applied.

**Tax Efficiency**: Automatic withholding at 22% (or treaty rate) with consolidated year-end tax documents.`;
      }
      
      if (lowerQuestion.includes('setup') || lowerQuestion.includes('open')) {
        return `To set up an Omnibus Account for trading ${stockRoomName}:

1. **Verify Broker Support**: Check if your brokerage (Interactive Brokers, Fidelity, etc.) supports Korean omnibus accounts.

2. **Submit Application**: Complete the omnibus account agreement with your broker.

3. **Provide Documents**: 
   - Valid passport
   - Proof of residence
   - W-8BEN form (for US taxpayers)

4. **Wait for Activation**: Typically 1-2 business days (vs. 5+ days under old system).

5. **Fund & Trade**: Transfer funds and start trading immediately!`;
      }
    }
    
    // Tax-related questions
    if (lowerQuestion.includes('tax') || lowerQuestion.includes('dividend')) {
      return `Tax implications for ${stockRoomName} investments:

**Dividend Withholding**: 22% automatically withheld at source for non-residents. This may be reduced if your country has a tax treaty with Korea.

**Capital Gains**: Currently exempt for most foreign investors trading on KOSPI/KOSDAQ.

**US Taxpayers**: 
- Report foreign accounts on FBAR (if >$10,000 aggregate)
- File FATCA Form 8938 (if thresholds met)
- Claim foreign tax credit for withheld dividends

**Tax Treaties**: Check if your country has a double taxation agreement with Korea. Many reduce the dividend withholding to 10-15%.`;
    }
    
    // IRC abolition questions
    if (lowerQuestion.includes('irc') || lowerQuestion.includes('abolition') || lowerQuestion.includes('january') || lowerQuestion.includes('2024')) {
      return `The January 2024 IRC (Integrated Registration Code) abolition was a landmark reform:

**What Changed**:
- IRC system: Required separate 5-day registration for EACH stock
- Omnibus system: Single account covers all Korean holdings

**Impact on ${stockRoomName} Investors**:
- Execution speed: Immediate vs. 5-day delay
- Administrative burden: 90% reduction in paperwork
- Market access: Enabled through global brokers
- Cost savings: No per-stock registration fees

**Historical Context**: This was the most significant foreign investment reform in 30 years, aligning Korea with major markets like Japan and Hong Kong.`;
    }
    
    // Reporting questions
    if (lowerQuestion.includes('report') || lowerQuestion.includes('fbar') || lowerQuestion.includes('fatca')) {
      return `Reporting requirements for ${stockRoomName} holdings:

**Korean Side (Handled by Broker)**:
- KRX transaction reporting
- Dividend withholding and reporting
- Year-end tax summary (simplified under omnibus)

**Your Responsibilities**:
- **US Persons**: FBAR filing if aggregate foreign accounts >$10,000
- **US Persons**: FATCA Form 8938 if foreign assets exceed thresholds
- **All Investors**: Report investment income in home country tax return
- **Keep Records**: Maintain transaction records for 5 years

**Good News**: The omnibus structure provides consolidated reporting, making this much easier than before!`;
    }
    
    // Default response
    return `Based on my analysis of ${stockRoomName}'s filings and the current regulatory environment:

The Omnibus Account structure has significantly improved market access for foreign investors. Key points to consider:

1. **Execution**: Trades settle immediately without registration delays
2. **Costs**: Lower overall fees compared to the old IRC system  
3. **Compliance**: Simplified reporting while maintaining regulatory standards
4. **Access**: Available through major global brokerages

For specific questions about ${stockRoomName}'s financial disclosures, dividend history, or corporate actions, please let me know what you'd like to explore further.`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await generateResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        sources: ['KRX Disclosure Database', 'Omnibus Account Guidelines', 'NTS Tax Bulletin 2024-01'],
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
      >
        <Bot className="w-5 h-5 mr-2" />
        Ask the Filings
        <Sparkles className="w-4 h-4 ml-2 text-yellow-300" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[450px] h-[600px] flex flex-col shadow-2xl border-primary/20 z-50 glass-card">
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Tenk-Analysis</CardTitle>
              <p className="text-xs text-muted-foreground">AI Filing Analyst • {stockRoomName}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex flex-col',
              message.role === 'user' ? 'items-end' : 'items-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                message.role === 'user'
                  ? 'bg-primary/20 text-foreground border border-primary/30'
                  : 'bg-muted text-foreground border border-border'
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground mb-1">Sources:</p>
                  <div className="flex flex-wrap gap-1">
                    {message.sources.map((source, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] px-1 py-0">
                        <FileText className="w-2 h-2 mr-1" />
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Analyzing filings...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Suggested Questions (only show for first message) */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                }}
                className="text-[10px] px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              >
                {q.length > 35 ? q.slice(0, 35) + '...' : q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about filings, regulations, or omnibus accounts..."
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[9px] text-muted-foreground mt-2 text-center">
          AI-generated responses. Verify with official sources before making investment decisions.
        </p>
      </div>
    </Card>
  );
}
