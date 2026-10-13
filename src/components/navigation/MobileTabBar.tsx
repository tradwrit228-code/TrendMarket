import React from 'react';
import { LayoutDashboard, Compass, LineChart, Sparkles, ArrowRightLeft, Bookmark } from 'lucide-react';
import { ActiveTab } from './TopBar';

interface MobileTabBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  watchlistCount: number;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  onSelectTab,
  watchlistCount,
}) => {
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer' as ActiveTab, label: 'Explorer', icon: Compass },
    { id: 'analysis' as ActiveTab, label: 'Analyse', icon: LineChart },
    { id: 'opportunities' as ActiveTab, label: 'Signaux', icon: Sparkles },
    { id: 'compare' as ActiveTab, label: 'Comparer', icon: ArrowRightLeft },
    { id: 'watchlist' as ActiveTab, label: 'Watchlist', icon: Bookmark, badge: watchlistCount },
  ];

  return (
    <nav 
      aria-label="Navigation mobile principale"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe"
    >
      <div className="grid grid-cols-6 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-blue-600 text-[9px] font-bold text-white flex items-center justify-center font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
