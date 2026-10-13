import React from 'react';
import { FileText, Trash2, ArrowUpRight, Calendar, Bookmark, LineChart, ArrowRightLeft } from 'lucide-react';
import { SavedAnalysis, GEO_SCOPES } from '../../lib/types/marketIntelligence';

interface HistoryReportsViewProps {
  savedAnalyses: SavedAnalysis[];
  onDeleteSaved: (id: string) => void;
  onOpenAnalysis: (item: SavedAnalysis) => void;
}

export const HistoryReportsView: React.FC<HistoryReportsViewProps> = ({
  savedAnalyses,
  onDeleteSaved,
  onOpenAnalysis,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Historique & Rapports Enregistrés
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Retrouvez vos dossiers d'analyses, comparaisons passées et notes de stratégie B2B.
        </p>
      </div>

      {savedAnalyses.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
          <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Aucun rapport archivé pour le moment
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Vos analyses de marché et confrontations comparatives sauvegardées apparaîtront automatiquement ici.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedAnalyses.map((item) => {
            const geo = GEO_SCOPES[item.region] || GEO_SCOPES.togo;
            return (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-medium">
                      {item.type === 'market_analysis' ? (
                        <LineChart className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span className="capitalize">{item.type.replace('_', ' ')}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteSaved(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Supprimer des archives"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {geo.flag} {item.savedAt}
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenAnalysis(item)}
                    className="min-h-[44px] flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>Consulter</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
