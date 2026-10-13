import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Target, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  AlertTriangle,
  Compass,
  LineChart,
  ArrowRightLeft
} from 'lucide-react';
import { 
  MarketTrendItem, 
  OpportunitySignal, 
  GeoRegion, 
  GEO_SCOPES, 
  WatchlistItem 
} from '../../lib/types/marketIntelligence';
import { TrendCard } from '../common/TrendCard';
import { OpportunityCard } from '../common/OpportunityCard';
import { MarketScoreBadge } from '../common/MarketScoreBadge';
import { UniversalMarketSearch } from '../common/UniversalMarketSearch';

interface ExecutiveDashboardProps {
  trends: MarketTrendItem[];
  opportunities: OpportunitySignal[];
  selectedRegion: GeoRegion;
  onChangeRegion: (region: GeoRegion) => void;
  onSearchMarket: (query: string) => void;
  onAnalyzeMarket: (marketName: string, sectorId: string, region: string) => void;
  onSelectTab: (tab: any) => void;
  watchlist: WatchlistItem[];
  onToggleWatchlist: (item: any) => void;
  isBookmarked: (name: string) => boolean;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  trends,
  opportunities,
  selectedRegion,
  onChangeRegion,
  onSearchMarket,
  onAnalyzeMarket,
  onSelectTab,
  watchlist,
  onToggleWatchlist,
  isBookmarked,
}) => {
  const currentGeo = GEO_SCOPES[selectedRegion] || GEO_SCOPES.togo;

  // Segment trends into categories
  const trendingNow = trends.filter(t => t.demandTrend === 'up').slice(0, 4);
  const emergingTrends = trends.filter(t => t.stage === 'emerging');
  const decliningMarkets = trends.filter(t => t.demandTrend === 'down');
  const topOpportunities = opportunities.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* 1. HERO EXECUTIVE SUMMARY & UNIVERSAL SEARCH */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-300">
            <span>Market Intelligence Platform</span>
            <span aria-hidden="true">·</span>
            <span>Focus : {currentGeo.flag} {currentGeo.label}</span>
            <span aria-hidden="true">·</span>
            <span>Zone {currentGeo.economicZone}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Découvrez les opportunités de marché avant tout le monde.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            TrendMarket surveille, normalise et contextualise les signaux économiques pour aider les entrepreneurs, PME et producteurs à prendre des décisions commerciales fondées sur les données.
          </p>

          {/* 3-Step Process strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2.5">
              <span className="font-mono text-blue-400 font-bold">01.</span>
              <div>
                <span className="font-semibold text-white block">Explorer</span>
                <span>Cartographier 15 secteurs et détecter les ruptures.</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2.5">
              <span className="font-mono text-blue-400 font-bold">02.</span>
              <div>
                <span className="font-semibold text-white block">Analyser</span>
                <span>Mesurer la demande réelle, la saisonnalité et les marges.</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2.5">
              <span className="font-mono text-blue-400 font-bold">03.</span>
              <div>
                <span className="font-semibold text-white block">Décider</span>
                <span>Déployer un plan d'action commercial structuré.</span>
              </div>
            </div>
          </div>

          {/* Universal Market Search Bar */}
          <div className="pt-4">
            <UniversalMarketSearch
              onSearchMarket={onSearchMarket}
              selectedRegion={selectedRegion}
              onChangeRegion={onChangeRegion}
            />
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE METRICS STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Marchés en Hausse</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {trendingNow.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Forte traction en {currentGeo.label}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Opportunités Détectées</span>
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {opportunities.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Signaux à fort potentiel identifiés
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Signaux Émergents</span>
            <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {emergingTrends.length || 2}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Nouvelles niches non saturées
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Marchés Sous Surveillance</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
            {decliningMarkets.length || 1}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Déclin ou saturation identifiés
          </p>
        </div>
      </section>

      {/* 3. SECTION: OPPORTUNITY SIGNALS TICKER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Signaux d'Opportunités Prioritaires
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Détecteur automatique de momentum, potentiel commercial et recommandations d'action.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('opportunities')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Voir tous les signaux</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              signal={opp}
              onAnalyzeMarket={onAnalyzeMarket}
            />
          ))}
        </div>
      </section>

      {/* 4. SECTION: TRENDING NOW (MARCHÉS DU MOMENT) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Marchés Porteurs & Tendances Actuelles
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Classés selon le score propriétaire d'opportunité TrendMarket (Demande + Croissance - Risque).
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('explorer')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Explorer par secteur</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingNow.map((item) => (
            <TrendCard
              key={item.id}
              item={item}
              isBookmarked={isBookmarked(item.name)}
              onToggleBookmark={() => onToggleWatchlist({
                type: 'market',
                name: item.name,
                category: item.sectorId,
                region: item.region,
                currentMomentum: item.momentum,
                currentScore: item.opportunityScore,
                alertThreshold: 10,
              })}
              onAnalyze={onAnalyzeMarket}
            />
          ))}
        </div>
      </section>

      {/* 5. WATCHLIST & QUICK TOOLS SPLIT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist preview */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ma Watchlist de Marchés ({watchlist.length})
            </h3>
            <button
              type="button"
              onClick={() => onSelectTab('watchlist')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Gérer ma surveillance
            </button>
          </div>

          {watchlist.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <p className="text-xs text-slate-500">
                Vous ne suivez aucun marché pour le moment.
              </p>
              <button
                type="button"
                onClick={() => onSelectTab('explorer')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Explorer et ajouter des marchés
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {watchlist.slice(0, 4).map((w) => (
                <div key={w.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 
                      onClick={() => onAnalyzeMarket(w.name, w.category, w.region)}
                      className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer"
                    >
                      {w.name}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {w.category} · {GEO_SCOPES[w.region]?.label || w.region}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold tabular-nums ${w.currentMomentum >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {w.currentMomentum >= 0 ? `+${w.currentMomentum}%` : `${w.currentMomentum}%`}
                    </span>
                    <MarketScoreBadge score={w.currentScore} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Decision Hub */}
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Prise de Décision Commerciale
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Passez du signal à l'exécution avec nos modules d'intelligence stratégique.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onSelectTab('analysis')}
                className="w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-500 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600">
                    Dossier d'Analyse Marché
                  </span>
                  <LineChart className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
                <span className="text-[11px] text-slate-500">
                  Saisonnalité, demande, concurrence et plan d'action.
                </span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('compare')}
                className="w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-500 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600">
                    Confrontation A / B
                  </span>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
                <span className="text-[11px] text-slate-500">
                  Comparer deux options (ex: Wave vs TMoney, Soja vs Maïs).
                </span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('bi_memo')}
                className="w-full p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-blue-500 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600">
                    Note Stratégique B2B
                  </span>
                  <Target className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
                <span className="text-[11px] text-slate-500">
                  Ciblage de prix, canaux et conformité réglementaire.
                </span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800">
            <span>Sources : Données institutionnelles UEMOA, FAO, TradeMap & Web Grounded.</span>
          </div>
        </div>
      </section>
    </div>
  );
};
