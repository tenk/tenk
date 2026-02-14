import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

interface TickerData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const MOCK_TICKERS: TickerData[] = [
  { symbol: 'KOSPI', name: 'KOSPI', price: 2512.47, change: 18.32, changePercent: 0.73 },
  { symbol: 'KOSDAQ', name: 'KOSDAQ', price: 728.15, change: -4.21, changePercent: -0.58 },
  { symbol: 'KRW/USD', name: 'KRW/USD', price: 1328.50, change: -2.30, changePercent: -0.17 },
  { symbol: '005930.KS', name: 'Samsung', price: 72500, change: 1200, changePercent: 1.68 },
  { symbol: '000660.KS', name: 'SK Hynix', price: 158500, change: 4200, changePercent: 2.72 },
  { symbol: '005380.KS', name: 'Hyundai', price: 198500, change: 3500, changePercent: 1.79 },
  { symbol: '373220.KS', name: 'LG Energy', price: 385000, change: 5500, changePercent: 1.45 },
  { symbol: '035420.KS', name: 'Naver', price: 198000, change: -1500, changePercent: -0.75 },
  { symbol: '035720.KS', name: 'Kakao', price: 42500, change: -800, changePercent: -1.85 },
];

function TickerItem({ data }: { data: TickerData }) {
  const isPositive = data.change >= 0;
  
  return (
    <div className="flex items-center gap-3 px-4 py-1 whitespace-nowrap">
      <span className="font-semibold text-sm text-muted-foreground">{data.symbol}</span>
      <span className="font-bold text-sm">
        {data.symbol === 'KRW/USD' ? data.price.toFixed(2) : formatNumber(data.price)}
      </span>
      <span className={cn(
        'flex items-center gap-0.5 text-xs font-medium',
        isPositive ? 'text-[hsl(var(--up))]' : 'text-[hsl(var(--down))]'
      )}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%
      </span>
    </div>
  );
}

export function TickerMarquee() {
  const [tickers, setTickers] = useState<TickerData[]>(MOCK_TICKERS);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev => prev.map(ticker => {
        const volatility = 0.002;
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = ticker.price * (1 + change);
        const priceChange = newPrice - ticker.price;
        const changePercent = (priceChange / ticker.price) * 100;
        
        return {
          ...ticker,
          price: newPrice,
          change: ticker.change + priceChange,
          changePercent: ticker.changePercent + changePercent,
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[hsl(var(--sidebar-background))] border-b border-border overflow-hidden">
      <div className="flex items-center">
        {/* Label */}
        <div className="flex-shrink-0 px-3 py-1.5 bg-primary/10 border-r border-border">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">LIVE</span>
          </div>
        </div>
        
        {/* Scrolling Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex ticker-marquee">
            {/* Duplicate for seamless loop */}
            {[...tickers, ...tickers].map((ticker, index) => (
              <TickerItem key={`${ticker.symbol}-${index}`} data={ticker} />
            ))}
          </div>
        </div>
        
        {/* Time */}
        <div className="flex-shrink-0 px-3 py-1.5 border-l border-border">
          <span className="text-xs font-mono text-muted-foreground">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: 'Asia/Seoul',
              hour12: false 
            })} KST
          </span>
        </div>
      </div>
    </div>
  );
}
