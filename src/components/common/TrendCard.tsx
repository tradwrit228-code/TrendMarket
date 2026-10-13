import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';
import { MarketTrendItem, GEO_SCOPES } from '../../lib/types/marketIntelligence';
import { MarketScoreBadge } from './MarketScoreBadge';
import { WatchlistButton } from './WatchlistButton';

interface TrendCardProps {
  item: MarketTrendItem;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onAnalyze: (marketName: string, sectorId: string, region: string) => void;
  onCompareWith?: (item: MarketTrendItem) => void;
  className?: string;
}

export const TrendCard: React.FC<TrendCardProps> = ({
  item,
  isBookmarked,
  onToggleBookmark,
  onAnalyze,
  className = '',
}) => {
  const geo = GEO_SCOPES[item.region] || GEO_SCOPES.togo;

  const isPositive = item.momentum > 0;
  const isNeutral = item.momentum === 0;

  return (
    <div 
      className={`group relative flex flex-col justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all ${className}`}
    >
      <div>
        {/* Top Meta Line: Clean unboxed metadata with bullet separators */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>{geo.flag} {geo.label}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{item.stage}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 dark:text-slate-300">Concurrence {item.competitionLevel}</span>
          </div>

          <WatchlistButton
            item={{
              type: 'market',
              name: item.name,
              category: item.sectorId,
              region: item.region,
              currentMomentum: item.momentum,
              currentScore: item.opportunityScore,
              alertThreshold: 10,
            }}
            isBookmarked={isBookmarked}
            onToggle={onToggleBookmark}
          />
        </div>

        {/* Title */}
        <h3 
          onClick={() => onAnalyze(item.name, item.sectorId, item.region)}
          className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors leading-snug line-clamp-2"
        >
          {item.name}
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {item.shortDescription}
        </p>

        {/* Commercial Takeaway (Action oriented) */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-200 block mb-0.5">Décision commerciale :</span>
          <span className="line-clamp-2">{item.commercialTakeaway}</span>
        </div>
      </div>

      {/* Bottom KPI & Action Row */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Momentum Indicator */}
          <div className="flex items-center gap-1 font-mono text-xs font-semibold tabular-nums">
            {isPositive ? (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                +{item.momentum}%
              </span>
            ) : isNeutral ? (
              <span className="flex items-center gap-0.5 text-slate-500">
                <Minus className="w-3.5 h-3.5" />
                0%
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400">
                <TrendingDown className="w-3.5 h-3.5" />
                {item.momentum}%
              </span>
            )}
            <span className="text-slate-400 font-normal">mom.</span>
          </div>

          {/* Opportunity Score */}
          <MarketScoreBadge score={item.opportunityScore} size="sm" />
        </div>

        {/* Analyze CTA */}
        <button
          type="button"
          onClick={() => onAnalyze(item.name, item.sectorId, item.region)}
          className="min-h-[44px] inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
        >
          <span>Analyser</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
