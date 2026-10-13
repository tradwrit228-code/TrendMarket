import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { WatchlistItem } from '../../lib/types/marketIntelligence';

interface WatchlistButtonProps {
  item: Omit<WatchlistItem, 'id' | 'addedAt' | 'lastCheckedAt' | 'status'>;
  isBookmarked: boolean;
  onToggle: () => void;
  className?: string;
  showText?: boolean;
}

export const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  isBookmarked,
  onToggle,
  className = '',
  showText = false,
}) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
        isBookmarked
          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800/60'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
      } ${className}`}
      aria-label={isBookmarked ? 'Retirer de ma Watchlist' : 'Ajouter à ma Watchlist'}
      title={isBookmarked ? 'Retirer de ma Watchlist' : 'Ajouter à ma Watchlist'}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
      ) : (
        <Bookmark className="w-4 h-4 text-slate-400 shrink-0" />
      )}
      {showText && (
        <span className="whitespace-nowrap">
          {isBookmarked ? 'Suivi actif' : 'Suivre'}
        </span>
      )}
    </button>
  );
};
