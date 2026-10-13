import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Crosshair, 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  Sliders, 
  Info,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { 
  OpportunitySignal, 
  SignalType, 
  GeoRegion, 
  GEO_SCOPES, 
  SectorId, 
  SECTORS,
  DEFAULT_SCORE_WEIGHTS
} from '../../lib/types/marketIntelligence';
import { OpportunityCard } from '../common/OpportunityCard';

interface OpportunityDetectorViewProps {
  opportunities: OpportunitySignal[];
  selectedRegion: GeoRegion;
  onChangeRegion: (region: GeoRegion) => void;
  onAnalyzeMarket: (marketName: string, sectorId: string, region: string) => void;
}

export const OpportunityDetectorView: React.FC<OpportunityDetectorViewProps> = ({
  opportunities,
  selectedRegion,
  onChangeRegion,
  onAnalyzeMarket,
}) => {
  const [selectedType, setSelectedType] = useState<SignalType | 'all'>('all');
  const [selectedSector, setSelectedSector] = useState<SectorId | 'all'>('all');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const currentGeo = GEO_SCOPES[selectedRegion] || GEO_SCOPES.togo;

  // Filter opportunities
  const filtered = useMemo(() => {
    return opportunities.filter((op) => {
      const matchType = selectedType === 'all' || op.signalType === selectedType;
      const matchSector = selectedSector === 'all' || op.sectorId === selectedSector;
      return matchType && matchSector;
    });
  }, [opportunities, selectedType, selectedSector]);

  const signalCategories = [
    { id: 'all', label: 'Tous les Signaux' },
    { id: 'emerging_opportunity' as SignalType, label: 'Émergents (Emerging)', icon: Sparkles },
    { id: 'growth_opportunity' as SignalType, label: 'Croissance (Growth)', icon: TrendingUp },
    { id: 'competitive_opportunity' as SignalType, label: 'Niches Compétitives', icon: Crosshair },
    { id: 'declining_market' as SignalType, label: 'En Déclin', icon: TrendingDown },
    { id: 'saturated_market' as SignalType, label: 'Saturés', icon: AlertTriangle },
    { id: 'high_risk_market' as SignalType, label: 'Risque Élevé', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & Methodology Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Opportunity Detector
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono">
              Signal Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Moteur de détection automatique d'opportunités, anomalies de marché et signaux concurrentiels en {currentGeo.label}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Region selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
            <span className="text-slate-400 pl-1.5">{currentGeo.flag}</span>
            <select
              value={selectedRegion}
              onChange={(e) => onChangeRegion(e.target.value as GeoRegion)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {Object.values(GEO_SCOPES).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Proprietary Score Formula Explainer Button */}
          <button
            type="button"
            onClick={() => setShowFormulaModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Pondération du Score</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Pills Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {signalCategories.map((cat) => {
            const isSelected = selectedType === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedType(cat.id as any)}
                className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Opportunities Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Aucun signal détecté pour cette typologie dans {currentGeo.label}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedType('all');
              setSelectedSector('all');
            }}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sig) => (
            <OpportunityCard
              key={sig.id}
              signal={sig}
              onAnalyzeMarket={onAnalyzeMarket}
            />
          ))}
        </div>
      )}

      {/* 4. Opportunity Score Explanation Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-xl w-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Market Opportunity Score — Transparence de Calcul
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFormulaModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Fermer
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Le <strong>Market Opportunity Score</strong> est un indicateur propriétaire composite calibré pour les marchés émergents. Il mesure l'attractivité nette d'un marché en pondérant la traction commerciale face aux barrières à l'entrée.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <code>
                Opportunity Score = <br />
                &nbsp;&nbsp;+ (Demand Momentum × 25%)<br />
                &nbsp;&nbsp;+ (Growth Rate × 20%)<br />
                &nbsp;&nbsp;+ (Market Interest × 15%)<br />
                &nbsp;&nbsp;+ (Competitive Gap × 15%)<br />
                &nbsp;&nbsp;+ (Search Momentum × 15%)<br />
                &nbsp;&nbsp;- (Saturation Penalty × 10%)<br />
                &nbsp;&nbsp;- (Risk Factor × 10%)
              </code>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Principes de gouvernance :
              </span>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Les pondérations sont étalonnées selon les séries macroéconomiques régionales (UEMOA / CEDEAO).</li>
                <li>Le score ne constitue pas une vérité scientifique absolue, mais un modèle d'aide à la décision.</li>
                <li>Toutes les données sources sous-jacentes conservent leur traçabilité d'origine.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white dark:bg-blue-600 text-xs font-semibold cursor-pointer"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
