import React from 'react';
import { X, ShieldCheck, Database, Layers, CheckCircle2, Globe, FileCheck } from 'lucide-react';

interface DataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DataSourceRecord {
  id: string;
  name: string;
  provider: string;
  sourceType: string;
  baseUrl: string;
  description: string;
  isActive: boolean;
}

export const DataSourcesModal: React.FC<DataSourcesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [dbSources, setDbSources] = React.useState<DataSourceRecord[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      fetch('/api/data-sources')
        .then((res) => res.json())
        .then((data) => {
          if (data?.sources) {
            setDbSources(data.sources);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl w-full p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Transparence & Traçabilité des Données
              </h2>
              <span className="text-xs text-slate-500">Charte de Gouvernance des Données TrendMarket</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <span className="font-semibold text-blue-900 dark:text-blue-300 block mb-1">
              Principe Fondamental : Zéro Hallucination Métrique
            </span>
            <p>
              TrendMarket applique une séparation stricte entre les données quantitatives et la couche d'interprétation. <strong>L'intelligence artificielle n'invente jamais de chiffres ou de volumes de marché</strong> : elle synthétise, structure et traduit des séries macroéconomiques réelles en recommandations d'affaires actionnables.
            </p>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white text-sm pt-2">
            Sources Institutionnelles Partenaires & Référentiels :
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dbSources.length > 0 ? (
              dbSources.map((src) => (
                <div key={src.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white block">{src.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-mono">
                      {src.provider}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {src.description}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">UEMOA & BCEAO</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Statistiques monétaires, volumes Mobile Money, taux d'inflation et mercuriales régionales officielles.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">FAO & Ministères Agricoles</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Recensements agricoles (Togo DSID), cours vivriers des grands marchés et bilans céréaliers annuels.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">TradeMap (ITC) & Douanes</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Flux d'import-export transfrontaliers, barrières tarifaires CEDEAO et traçabilité des filières d'exportation.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Grounded Search Index</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Échantillonnage en direct des publications professionnelles, journaux officiels et signaux du web indexés.
                  </p>
                </div>
              </>
            )}
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white text-sm pt-2">
            Pipeline de Traitement & Validation :
          </h3>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
            RAW DATA → SANITIZATION → NORMALIZATION → ANALYTICS ENGINE → SIGNAL DETECTION → INTERPRETATION LAYER
          </div>

          <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tous les rapports disposent d'un horodatage vérifiable et d'un score de confiance explicite.</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
        >
          Fermer la charte
        </button>
      </div>
    </div>
  );
};
