import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatKRW(num: number): string {
  if (num >= 1000000000000) {
    return '₩' + (num / 1000000000000).toFixed(2) + 'T';
  }
  if (num >= 1000000000) {
    return '₩' + (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return '₩' + (num / 1000000).toFixed(1) + 'M';
  }
  return '₩' + num.toLocaleString();
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
}

export function extractTickers(content: string): string[] {
  const tickerRegex = /\$([A-Z]+)/g;
  const matches = content.match(tickerRegex);
  if (!matches) return [];
  return matches.map(match => match.slice(1));
}

export function formatContentWithTickers(content: string): string {
  return content.replace(/\$([A-Z]+)/g, '<span class="ticker-tag">$1</span>');
}

export function calculateScore(upvotes: number, downvotes: number): number {
  return upvotes - downvotes;
}

export function getVoteColor(score: number): string {
  if (score > 0) return 'text-green-500';
  if (score < 0) return 'text-red-500';
  return 'text-gray-500';
}
