import React from 'react';
import { ShieldCheck, Database, Calendar } from 'lucide-react';

interface SourceBadgeProps {
  source: string;
  lastUpdated?: string;
  confidenceScore?: number;
  className?: string;
  onOpenDataSources?: () => void;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  source,
  lastUpdated,
  confidenceScore,
  className = '',
  onOpenDataSources,
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
        <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span className="truncate max-w-[220px]">{source}</span>
      </span>

      {lastUpdated && (
        <>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Mis à jour : {lastUpdated}</span>
          </span>
        </>
      )}

      {typeof confidenceScore === 'number' && (
        <>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono tabular-nums font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>Confiance {confidenceScore}%</span>
          </span>
        </>
      )}

      {onOpenDataSources && (
        <>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <button
            type="button"
            onClick={onOpenDataSources}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Méthodologie
          </button>
        </>
      )}
    </div>
  );
};
