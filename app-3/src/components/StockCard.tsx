import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Building2, DollarSign, Activity, BarChart3, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn, formatKRW, formatNumber } from '@/lib/utils';
import { mockDb } from '@/lib/mockSupabase';
import { SparklineChart } from './SparklineChart';
import type { StockData } from '@/types';

interface StockCardProps {
  ticker: string;
  compact?: boolean;
}

// Generate mock historical data for sparkline
function generateSparklineData(basePrice: number, points: number = 30): number[] {
  const data: number[] = [basePrice];
  for (let i = 1; i < points; i++) {
    const change = (Math.random() - 0.5) * 0.02;
    data.push(data[i - 1] * (1 + change));
  }
  return data;
}

// KRW to USD conversion (mock rate)
const KRW_TO_USD = 0.00075;

export function StockCard({ ticker, compact = false }: StockCardProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [sparklineData, setSparklineData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      // Find the stock room to get the actual ticker
      const rooms = await mockDb.getStockRooms();
      const room = rooms.find(r => r.name === ticker);
      
      if (room) {
        const data = await mockDb.getStockData(room.ticker);
        setStockData(data);
        if (data) {
          setSparklineData(generateSparklineData(data.price));
        }
      }
      setIsLoading(false);
    };

    fetchStockData();
  }, [ticker]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-sm bg-card/50">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    );
  }

  if (!stockData) {
    return (
      <Card className="w-full max-w-sm bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">${ticker}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Stock data not available
          </p>
        </CardContent>
      </Card>
    );
  }

  const isPositive = stockData.change >= 0;
  const usdPrice = stockData.price * KRW_TO_USD;

  if (compact) {
    return (
      <Card className="inline-flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors cursor-pointer border-border/50">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full',
            isPositive ? 'bg-emerald-400' : 'bg-red-400'
          )} />
          <span className="font-medium text-sm">{stockData.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <SparklineChart 
            data={sparklineData} 
            width={60} 
            height={20} 
            isPositive={isPositive}
          />
          <span className="font-semibold tabular-nums">
            ₩{formatNumber(stockData.price)}
          </span>
          <span className={cn(
            'flex items-center text-xs',
            isPositive ? 'text-emerald-400' : 'text-red-400'
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-0.5" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-0.5" />
            )}
            {isPositive ? '+' : ''}{stockData.change_percent.toFixed(2)}%
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm overflow-hidden glass-card">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{stockData.name}</h3>
              <Badge variant="outline" className="text-[10px]">
                <Globe className="w-2 h-2 mr-1" />
                KRX
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{stockData.ticker}</p>
          </div>
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
            isPositive 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
              : 'bg-red-500/15 text-red-400 border border-red-500/25'
          )}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {isPositive ? '+' : ''}{stockData.change_percent.toFixed(2)}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Sparkline Chart */}
        <div className="mb-4">
          <SparklineChart 
            data={sparklineData} 
            width={280} 
            height={50} 
            isPositive={isPositive}
          />
        </div>

        {/* Price Display */}
        <div className="flex items-baseline gap-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">KRW</p>
            <span className="text-2xl font-bold tabular-nums">
              ₩{formatNumber(stockData.price)}
            </span>
          </div>
          <div className="text-muted-foreground">|</div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">USD</p>
            <span className="text-lg font-semibold tabular-nums text-muted-foreground">
              ${usdPrice.toFixed(2)}
            </span>
          </div>
          <div className={cn(
            'text-sm font-medium ml-auto',
            isPositive ? 'text-emerald-400' : 'text-red-400'
          )}>
            {isPositive ? '+' : ''}{formatNumber(stockData.change)}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Volume</p>
              <p className="font-medium tabular-nums">{formatNumber(stockData.volume)}</p>
            </div>
          </div>

          {stockData.market_cap && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Market Cap</p>
                <p className="font-medium tabular-nums">{formatKRW(stockData.market_cap)}</p>
              </div>
            </div>
          )}

          {stockData.pe_ratio && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">P/E Ratio</p>
                <p className="font-medium tabular-nums">{stockData.pe_ratio.toFixed(2)}</p>
              </div>
            </div>
          )}

          {stockData.high_52w && stockData.low_52w && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">52W Range</p>
                <p className="font-medium text-xs tabular-nums">
                  ₩{formatNumber(stockData.low_52w)} - ₩{formatNumber(stockData.high_52w)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
