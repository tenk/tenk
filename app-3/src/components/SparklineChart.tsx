import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  isPositive?: boolean;
}

export function SparklineChart({ 
  data, 
  width = 120, 
  height = 40, 
  className,
  isPositive = true 
}: SparklineChartProps) {
  const pathD = useMemo(() => {
    if (data.length < 2) return '';
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      return { x, y };
    });
    
    // Create smooth line
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (!pathD) return '';
    return `${pathD} L ${width - 2} ${height} L 2 ${height} Z`;
  }, [pathD, width, height]);

  const strokeColor = isPositive ? 'hsl(var(--up))' : 'hsl(var(--down))';

  return (
    <svg 
      width={width} 
      height={height} 
      className={cn('overflow-visible', className)}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Gradient Definition */}
      <defs>
        <linearGradient id={`sparkline-gradient-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area Fill */}
      <path
        d={areaPath}
        fill={`url(#sparkline-gradient-${isPositive})`}
        className="opacity-50"
      />
      
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-path"
      />
      
      {/* End Point Dot */}
      {data.length > 0 && (
        <circle
          cx={width - 2}
          cy={2 + (height - 4) * (1 - (data[data.length - 1] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1))}
          r={2}
          fill={strokeColor}
          className="animate-pulse"
        />
      )}
    </svg>
  );
}
