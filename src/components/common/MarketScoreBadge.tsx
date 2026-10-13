import React from 'react';
import { MarketOpportunityScore } from '../../lib/types/marketIntelligence';

interface MarketScoreBadgeProps {
  score: MarketOpportunityScore | number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
  onClickDetails?: () => void;
}

export const MarketScoreBadge: React.FC<MarketScoreBadgeProps> = ({
  score,
  size = 'md',
  showDetails = false,
  className = '',
  onClickDetails
}) => {
  const numericScore = typeof score === 'number' ? score : score.totalScore;
  const ratingLabel = typeof score === 'object' ? score.ratingLabel : 
    numericScore >= 80 ? 'Opportunité Stratégique' :
    numericScore >= 65 ? 'Fort Potentiel' :
    numericScore >= 45 ? 'Potentiel Modéré' :
    numericScore >= 30 ? 'Vigilance' : 'Saturé';

  // Determine color token based on score value
  const colorClasses = 
    numericScore >= 80 ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
    numericScore >= 65 ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
    numericScore >= 45 ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
    'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';

  const badgePadding = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';
  const numberText = size === 'lg' ? 'text-lg font-bold' : size === 'sm' ? 'text-xs font-semibold' : 'text-sm font-bold';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div 
        onClick={onClickDetails}
        className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${colorClasses} ${badgePadding} ${onClickDetails ? 'cursor-pointer hover:opacity-90' : ''}`}
        title="Score propriétaire d'opportunité commerciale (0-100)"
      >
        <span className="text-slate-500 dark:text-slate-400 font-normal">Score :</span>
        <span className={`font-mono tabular-nums ${numberText}`}>{numericScore}</span>
        <span className="text-slate-400 dark:text-slate-500 font-normal">/100</span>
      </div>

      {showDetails && (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {ratingLabel}
        </span>
      )}
    </div>
  );
};
