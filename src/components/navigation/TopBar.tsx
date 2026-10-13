import React from 'react';
import { Sun, Moon, Sparkles, TrendingUp, Compass, Bookmark, ArrowRightLeft, FileSpreadsheet, ShieldAlert } from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'explorer'
  | 'analysis'
  | 'compare'
  | 'opportunities'
  | 'watchlist'
  | 'bi_memo'
  | 'reports';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenPricing: () => void;
  watchlistCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  onOpenPricing,
  watchlistCount
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* ZONE 1: Brand Wordmark (Single text element, 1 line) */}
        <div 
          onClick={() => onSelectTab('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            T
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            TrendMarket
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
            Intelligence
          </span>
        </div>

        {/* ZONE 2: 4-5 Navigation Links (1-2 word labels, single line) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'dashboard'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('explorer')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'explorer'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Explorer
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('analysis')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'analysis'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Analyse Marché
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('opportunities')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'opportunities'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Opportunités
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('compare')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'compare'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Comparer A/B
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('bi_memo')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'bi_memo'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Mode B2B
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('watchlist')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              activeTab === 'watchlist'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {watchlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* ZONE 3: 1 Primary Action + Utility Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isDarkMode ? 'Passer en thème clair' : 'Passer en thème sombre'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            type="button"
            onClick={onOpenPricing}
            className="min-h-[44px] px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            Offres Pro
          </button>
        </div>
      </div>
    </header>
  );
};
