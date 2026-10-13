import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  Crosshair, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { OpportunitySignal, GEO_SCOPES } from '../../lib/types/marketIntelligence';
import { MarketScoreBadge } from './MarketScoreBadge';

interface OpportunityCardProps {
  signal: OpportunitySignal;
  onAnalyzeMarket?: (marketName: string, sectorId: string, region: string) => void;
  className?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  signal,
  onAnalyzeMarket,
  className = '',
}) => {
  const geo = GEO_SCOPES[signal.region] || GEO_SCOPES.togo;

  // Signal badge style
  const getBadgeStyle = () => {
    switch (signal.signalType) {
      case 'emerging_opportunity':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: Sparkles
        };
      case 'growth_opportunity':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          icon: TrendingUp
        };
      case 'competitive_opportunity':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          icon: Crosshair
        };
      case 'declining_market':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: TrendingDown
        };
      case 'saturated_market':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: AlertTriangle
        };
      case 'high_risk_market':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: ShieldAlert
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Sparkles
        };
    }
  };

  const badgeConfig = getBadgeStyle();
  const IconComponent = badgeConfig.icon;

  return (
    <div className={`p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 flex flex-col justify-between ${className}`}>
      <div>
        {/* Header line */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${badgeConfig.bg}`}>
              <IconComponent className="w-3.5 h-3.5" />
              <span>{signal.signalTypeLabel}</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {geo.flag} {geo.label}
            </span>
          </div>

          <MarketScoreBadge score={signal.score} size="sm" />
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
          {signal.title}
        </h4>

        {/* Signal Description */}
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {signal.signalDescription}
        </p>

        {/* KPI Strip */}
        <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 text-center">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Momentum</span>
            <span className={`text-xs font-mono font-bold tabular-nums ${signal.momentumPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {signal.momentumPercent >= 0 ? `+${signal.momentumPercent}%` : `${signal.momentumPercent}%`}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Confiance</span>
            <span className="text-xs font-mono font-bold tabular-nums text-slate-900 dark:text-slate-200">
              {signal.confidenceScore}%
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Potentiel</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {signal.potentialLevel}
            </span>
          </div>
        </div>

        {/* Why it matters */}
        <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-200 block mb-0.5">Pourquoi c'est important :</span>
          <p className="line-clamp-3 leading-relaxed">{signal.whyItMatters}</p>
        </div>

        {/* Recommended Action */}
        <div className="mt-3 p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-blue-900 dark:text-blue-300 block mb-0.5">Action recommandée :</span>
          <p className="leading-relaxed">{signal.recommendedAction}</p>
        </div>
      </div>

      {/* Target Audience & Footer CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
          Cible : {signal.targetProfile}
        </span>

        {onAnalyzeMarket && (
          <button
            type="button"
            onClick={() => onAnalyzeMarket(signal.title, signal.sectorId, signal.region)}
            className="min-h-[44px] inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
          >
            <span>Dossier complet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
