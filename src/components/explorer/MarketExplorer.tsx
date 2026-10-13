import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Wheat, 
  ShoppingBag, 
  Cpu, 
  CreditCard, 
  Radio, 
  GraduationCap, 
  HeartPulse, 
  Truck, 
  Zap, 
  Building2, 
  Shirt, 
  Film, 
  Palmtree, 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Filter,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { 
  SECTORS, 
  SectorId, 
  GeoRegion, 
  GEO_SCOPES, 
  MarketTrendItem 
} from '../../lib/types/marketIntelligence';
import { TrendCard } from '../common/TrendCard';
import { MarketScoreBadge } from '../common/MarketScoreBadge';

interface MarketExplorerProps {
  trends: MarketTrendItem[];
  selectedRegion: GeoRegion;
  onChangeRegion: (region: GeoRegion) => void;
  onAnalyzeMarket: (marketName: string, sectorId: string, region: string) => void;
  watchlist: any[];
  onToggleWatchlist: (item: any) => void;
  isBookmarked: (name: string) => boolean;
}

// Icon mapper for 15 sectors
const SECTOR_ICONS: Record<string, React.ElementType> = {
  Sprout,
  Wheat,
  ShoppingBag,
  Cpu,
  CreditCard,
  Radio,
  GraduationCap,
  HeartPulse,
  Truck,
  Zap,
  Building2,
  Shirt,
  Film,
  Palmtree,
  Briefcase
};

export const MarketExplorer: React.FC<MarketExplorerProps> = ({
  trends,
  selectedRegion,
  onChangeRegion,
  onAnalyzeMarket,
  onToggleWatchlist,
  isBookmarked,
}) => {
  const [selectedSector, setSelectedSector] = useState<SectorId | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'opportunity' | 'momentum' | 'growth'>('opportunity');

  const currentGeo = GEO_SCOPES[selectedRegion] || GEO_SCOPES.togo;

  // Filter trends
  const filteredTrends = useMemo(() => {
    return trends.filter((item) => {
      const matchSector = selectedSector === 'all' || item.sectorId === selectedSector;
      const matchSearch = !searchFilter.trim() || 
        item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.shortDescription.toLowerCase().includes(searchFilter.toLowerCase());
      return matchSector && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'opportunity') return b.opportunityScore - a.opportunityScore;
      if (sortBy === 'momentum') return b.momentum - a.momentum;
      return b.growthRate - a.growthRate;
    });
  }, [trends, selectedSector, searchFilter, sortBy]);

  const activeSectorObj = SECTORS.find(s => s.id === selectedSector);

  return (
    <div className="space-y-8">
      {/* 1. Header & Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Market Explorer par Secteur
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cartographie des tendances commerciales, scores d'opportunité et dynamique sectorielle en {currentGeo.label}.
          </p>
        </div>

        {/* Geographic Scope and Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
            <span className="text-slate-400 pl-1.5">Tri :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="opportunity">Score Opportunité</option>
              <option value="momentum">Momentum</option>
              <option value="growth">Taux de Croissance</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Interactive Sector Pill Bar (Filter controls) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            15 Secteurs Stratégiques
          </span>
          {selectedSector !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedSector('all')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Voir tous les secteurs
            </button>
          )}
        </div>

        {/* Clean segmented sector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedSector('all')}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedSector === 'all'
                ? 'bg-slate-900 text-white dark:bg-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Tous les secteurs ({trends.length})
          </button>

          {SECTORS.map((sector) => {
            const Icon = SECTOR_ICONS[sector.iconName] || Layers;
            const count = trends.filter(t => t.sectorId === sector.id).length;
            const isSelected = selectedSector === sector.id;

            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => setSelectedSector(sector.id)}
                className={`min-h-[40px] flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sector.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Sector Contextual Banner */}
      {activeSectorObj && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <span>{activeSectorObj.label}</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-600 dark:text-blue-400 font-normal">{activeSectorObj.marketSizeIndicator}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              {activeSectorObj.description}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400">Mots-clés porteurs :</span>
            {activeSectorObj.topTrendKeywords.map((kw, i) => (
              <span 
                key={i}
                onClick={() => onAnalyzeMarket(kw, activeSectorObj.id, selectedRegion)}
                className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 cursor-pointer transition-colors"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Text Search within current sector */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={`Filtrer parmi les marchés ${selectedSector !== 'all' ? `de ${activeSectorObj?.label}` : ''}...`}
          className="w-full h-10 pl-9 pr-4 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 5. Trend Grid */}
      {filteredTrends.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Aucun marché répertorié pour ce filtre dans {currentGeo.label}.
          </p>
          <p className="text-xs text-slate-500">
            Vous pouvez lancer une analyse directe en tapant n'importe quel mot-clé dans la recherche globale.
          </p>
          <button
            type="button"
            onClick={() => onAnalyzeMarket(searchFilter || 'Nouveau Marché', selectedSector !== 'all' ? selectedSector : 'commerce', selectedRegion)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
          >
            Lancer l'analyse de ce mot-clé
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrends.map((trend) => (
            <TrendCard
              key={trend.id}
              item={trend}
              isBookmarked={isBookmarked(trend.name)}
              onToggleBookmark={() => onToggleWatchlist({
                type: 'market',
                name: trend.name,
                category: trend.sectorId,
                region: trend.region,
                currentMomentum: trend.momentum,
                currentScore: trend.opportunityScore,
                alertThreshold: 10,
              })}
              onAnalyze={onAnalyzeMarket}
            />
          ))}
        </div>
      )}
    </div>
  );
};
