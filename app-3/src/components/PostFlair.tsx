import { cn } from '@/lib/utils';

export type FlairType = 'DD/Analysis' | 'Regulatory News' | 'Dividend Info' | 'Tax Question' | 'General';

interface PostFlairProps {
  flair: FlairType;
  className?: string;
}

const FLAIR_CONFIG: Record<FlairType, { 
  label: string; 
  className: string;
  icon?: string;
}> = {
  'DD/Analysis': {
    label: 'DD/Analysis',
    className: 'bg-blue-500/15 text-blue-400 border-blue-500/25 hover:bg-blue-500/25',
  },
  'Regulatory News': {
    label: 'Regulatory News',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/25',
  },
  'Dividend Info': {
    label: 'Dividend Info',
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25',
  },
  'Tax Question': {
    label: 'Tax Question',
    className: 'bg-purple-500/15 text-purple-400 border-purple-500/25 hover:bg-purple-500/25',
  },
  'General': {
    label: 'General',
    className: 'bg-slate-500/15 text-slate-400 border-slate-500/25 hover:bg-slate-500/25',
  },
};

export function PostFlair({ flair, className }: PostFlairProps) {
  const config = FLAIR_CONFIG[flair] || FLAIR_CONFIG['General'];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border transition-colors',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function FlairSelector({ 
  value, 
  onChange,
  className 
}: { 
  value: FlairType; 
  onChange: (flair: FlairType) => void;
  className?: string;
}) {
  const flairs: FlairType[] = ['DD/Analysis', 'Regulatory News', 'Dividend Info', 'Tax Question', 'General'];
  
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {flairs.map((flair) => (
        <button
          key={flair}
          type="button"
          onClick={() => onChange(flair)}
          className={cn(
            'transition-all',
            value === flair ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-60 hover:opacity-100'
          )}
        >
          <PostFlair flair={flair} />
        </button>
      ))}
    </div>
  );
}
