import React, { useState } from 'react';
import { Sun, Moon, Sparkles, TrendingUp, Compass, Bookmark, ArrowRightLeft, FileSpreadsheet, ShieldAlert, User as UserIcon, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const { user, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

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

        {/* ZONE 3: Auth + 1 Primary Action + Utility Tools */}
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
            className="hidden sm:inline-flex min-h-[44px] px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap cursor-pointer"
          >
            Offres Pro
          </button>

          {/* User Authentication Status */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Menu utilisateur"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Utilisateur'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline-block text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                      {user.displayName || 'Compte Market Intelligence'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onSelectTab('watchlist');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                      <span>Mes Watchlists Cloud SQL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onSelectTab('reports');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Analyses enregistrées</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              disabled={authLoading}
              className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap cursor-pointer shadow-sm flex items-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
