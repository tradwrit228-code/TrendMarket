import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles, Clock, Globe2, ChevronDown } from 'lucide-react';
import { GeoRegion, GEO_SCOPES, SectorId, SECTORS } from '../../lib/types/marketIntelligence';

interface UniversalMarketSearchProps {
  onSearchMarket: (query: string, sector?: SectorId, region?: GeoRegion) => void;
  selectedRegion: GeoRegion;
  onChangeRegion: (region: GeoRegion) => void;
  className?: string;
  placeholder?: string;
}

const POPULAR_SEARCH_SUGGESTIONS = [
  { label: 'Transformation du Manioc', sector: 'agroalimentaire' as SectorId, region: 'togo' as GeoRegion },
  { label: 'Filière Soja Bio', sector: 'agriculture' as SectorId, region: 'togo' as GeoRegion },
  { label: 'Mobile Money B2B & Caisses', sector: 'fintech' as SectorId, region: 'west_africa' as GeoRegion },
  { label: 'Pompage Solaire Maraîcher', sector: 'energie' as SectorId, region: 'togo' as GeoRegion },
  { label: 'Logistique Dernier Kilomètre', sector: 'transport' as SectorId, region: 'west_africa' as GeoRegion },
  { label: 'SaaS Facturation SYSCOHADA', sector: 'technologie' as SectorId, region: 'west_africa' as GeoRegion },
];

export const UniversalMarketSearch: React.FC<UniversalMarketSearchProps> = ({
  onSearchMarket,
  selectedRegion,
  onChangeRegion,
  className = '',
  placeholder = "Rechercher un marché, produit, culture, entreprise ou opportunité (ex: Manioc, Mobile Money, Solaire...)"
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tm_recent_searches');
        return saved ? JSON.parse(saved) : ['Manioc au Togo', 'Mobile Money', 'Soja Bio'];
      } catch {
        return ['Manioc au Togo', 'Mobile Money'];
      }
    }
    return [];
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = (searchQuery: string, sector?: SectorId, region?: GeoRegion) => {
    const q = searchQuery.trim();
    if (!q) return;

    // Save to recents
    const updated = [q, ...recentSearches.filter(s => s.toLowerCase() !== q.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('tm_recent_searches', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    setIsOpen(false);
    onSearchMarket(q, sector, region || selectedRegion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleExecuteSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const currentGeo = GEO_SCOPES[selectedRegion] || GEO_SCOPES.togo;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        {/* Geo Selector Pill Button */}
        <div className="relative shrink-0">
          <label htmlFor="geo-scope-select" className="sr-only">Zone géographique</label>
          <div className="relative inline-flex items-center w-full sm:w-auto">
            <span className="absolute left-3 text-base pointer-events-none">{currentGeo.flag}</span>
            <select
              id="geo-scope-select"
              value={selectedRegion}
              onChange={(e) => onChangeRegion(e.target.value as GeoRegion)}
              className="w-full sm:w-auto h-12 pl-9 pr-8 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {Object.values(GEO_SCOPES).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.flag} {g.label} ({g.currency})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-12 pl-10 pr-24 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Effacer le texte"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => handleExecuteSearch(query)}
              className="h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
            >
              Analyser
            </button>
          </div>
        </div>
      </div>

      {/* Autocomplete & Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl max-h-[420px] overflow-y-auto">
          {/* Quick suggestions header */}
          <div className="mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Suggestions de marchés stratégiques ({currentGeo.label})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {POPULAR_SEARCH_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(item.label);
                    handleExecuteSearch(item.label, item.sector, item.region);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                >
                  <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    {item.sector}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Recherches récentes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((rec, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(rec);
                      handleExecuteSearch(rec);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{rec}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
