import React, { useState, useEffect, useCallback } from 'react';
import { TopBar, ActiveTab } from './components/navigation/TopBar';
import { MobileTabBar } from './components/navigation/MobileTabBar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { MarketExplorer } from './components/explorer/MarketExplorer';
import { MarketAnalysisView } from './components/analysis/MarketAnalysisView';
import { OpportunityDetectorView } from './components/opportunities/OpportunityDetectorView';
import { ComparisonView } from './components/compare/ComparisonView';
import { WatchlistView } from './components/watchlist/WatchlistView';
import { BusinessIntelligenceView } from './components/b2b/BusinessIntelligenceView';
import { HistoryReportsView } from './components/reports/HistoryReportsView';
import { MonetizationModal } from './components/pricing/MonetizationModal';
import { DataSourcesModal } from './components/provenance/DataSourcesModal';
import { 
  GeoRegion, 
  SectorId, 
  MarketTrendItem, 
  OpportunitySignal, 
  MarketAnalysisReport, 
  WatchlistItem, 
  SavedAnalysis 
} from './lib/types/marketIntelligence';
import { 
  INITIAL_MARKET_TRENDS, 
  INITIAL_OPPORTUNITY_SIGNALS, 
  generateDynamicMarketAnalysis 
} from './lib/data/marketIntelligenceData';
import { CompareData, generateClientFallbackData } from './lib/fallbackData';
import { performDirectWebSearch } from './lib/directWebSearch';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, token } = useAuth();

  // --- THEME STATE ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('color-theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  }, [isDarkMode]);

  // --- ACTIVE TAB ROUTING ---
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as ActiveTab;
      if (tab && ['dashboard', 'explorer', 'analysis', 'compare', 'opportunities', 'watchlist', 'bi_memo', 'reports'].includes(tab)) {
        return tab;
      }
    }
    return 'dashboard';
  });

  // --- GEOGRAPHIC SCOPE STATE ---
  const [selectedRegion, setSelectedRegion] = useState<GeoRegion>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('region') as GeoRegion;
      if (r) return r;
    }
    return 'togo'; // Default to Togo as primary emerging anchor
  });

  // --- MARKET TRENDS & OPPORTUNITIES STATE ---
  const [trends, setTrends] = useState<MarketTrendItem[]>(INITIAL_MARKET_TRENDS);
  const [opportunities, setOpportunities] = useState<OpportunitySignal[]>(INITIAL_OPPORTUNITY_SIGNALS);

  // Fetch live trending items on mount or region change
  useEffect(() => {
    let isMounted = true;
    const fetchMarketData = async () => {
      try {
        const [trendsRes, oppRes] = await Promise.all([
          fetch(`/api/markets/trending?region=${selectedRegion}`),
          fetch(`/api/opportunities?region=${selectedRegion}`)
        ]);

        if (trendsRes.ok) {
          const trendsJson = await trendsRes.json();
          if (isMounted && trendsJson.items?.length > 0) {
            setTrends(trendsJson.items);
          }
        }

        if (oppRes.ok) {
          const oppJson = await oppRes.json();
          if (isMounted && oppJson.signals?.length > 0) {
            setOpportunities(oppJson.signals);
          }
        }
      } catch (err) {
        // Fallback already pre-loaded
      }
    };

    fetchMarketData();
    return () => { isMounted = false; };
  }, [selectedRegion]);

  // --- SINGLE MARKET ANALYSIS REPORT STATE ---
  const [analysisReport, setAnalysisReport] = useState<MarketAnalysisReport | null>(() => {
    return generateDynamicMarketAnalysis('Manioc', 'agroalimentaire', 'togo');
  });
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Function to trigger Deep-Dive Market Analysis
  const handleAnalyzeMarket = useCallback(async (marketName: string, sector?: string, region?: string) => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    setActiveTab('analysis');

    const targetRegion = (region as GeoRegion) || selectedRegion;
    const targetSector = (sector as SectorId) || 'commerce';

    // Update URL query parameters
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'analysis');
      url.searchParams.set('market', marketName);
      url.searchParams.set('region', targetRegion);
      window.history.replaceState({}, '', url.toString());
    }

    try {
      const res = await fetch('/api/market/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marketName,
          sector: targetSector,
          region: targetRegion,
          useAI: true,
        }),
      });

      if (res.ok) {
        const reportJson = await res.json();
        setAnalysisReport(reportJson);
      } else {
        throw new Error("Erreur de réponse de l'API");
      }
    } catch (err: any) {
      // Deterministic high-accuracy client fallback
      const fallbackReport = generateDynamicMarketAnalysis(marketName, targetSector, targetRegion);
      setAnalysisReport(fallbackReport);
    } finally {
      setAnalysisLoading(false);
    }
  }, [selectedRegion]);

  // --- A/B COMPARISON STATE ---
  const [termA, setTermA] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('a') || 'Netflix';
    }
    return 'Netflix';
  });

  const [termB, setTermB] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('b') || 'Disney+';
    }
    return 'Disney+';
  });

  const [category, setCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('cat') || 'Streaming & Médias';
    }
    return 'Streaming & Médias';
  });

  const [searchMode, setSearchMode] = useState<'direct_web' | 'ai'>('direct_web');
  const [compareResult, setCompareResult] = useState<CompareData | null>(() => {
    return generateClientFallbackData('Netflix', 'Disney+', 'Streaming & Médias');
  });
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  // Execute A/B Comparison
  const handleExecuteCompare = useCallback(async () => {
    if (!termA.trim() || !termB.trim()) return;
    setCompareLoading(true);
    setCompareError(null);

    // Deep linking update
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'compare');
      url.searchParams.set('a', termA);
      url.searchParams.set('b', termB);
      url.searchParams.set('cat', category);
      window.history.replaceState({}, '', url.toString());
    }

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          termA: termA.trim(),
          termB: termB.trim(),
          category: category.trim() || 'Général',
          mode: searchMode,
          useDirectWeb: searchMode === 'direct_web',
          userLang: 'fr-FR',
        }),
      });

      if (!response.ok) throw new Error("Erreur de confrontation");
      const data = await response.json();
      setCompareResult(data);
    } catch (err: any) {
      if (searchMode === 'direct_web') {
        try {
          const directData = await performDirectWebSearch(termA, termB, category, 'fr-FR');
          setCompareResult(directData);
          setCompareLoading(false);
          return;
        } catch (directErr) {
          // ignore
        }
      }
      const fallback = generateClientFallbackData(termA, termB, category);
      setCompareResult(fallback);
    } finally {
      setCompareLoading(false);
    }
  }, [termA, termB, category, searchMode]);

  // --- WATCHLIST STATE ---
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tm_watchlist');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'wl-1',
        type: 'market',
        name: 'Transformation du Manioc',
        category: 'Agroalimentaire',
        region: 'togo',
        currentMomentum: 34,
        currentScore: 86,
        addedAt: '12 Octobre 2026',
        lastCheckedAt: '13 Octobre 2026',
        alertThreshold: 10,
        status: 'active'
      },
      {
        id: 'wl-2',
        type: 'market',
        name: 'Paiements B2B Mobile Money',
        category: 'Fintech',
        region: 'west_africa',
        currentMomentum: 42,
        currentScore: 89,
        addedAt: '10 Octobre 2026',
        lastCheckedAt: '13 Octobre 2026',
        alertThreshold: 10,
        status: 'active'
      },
      {
        id: 'wl-3',
        type: 'market',
        name: 'Pompage Solaire Maraîcher',
        category: 'Énergie',
        region: 'togo',
        currentMomentum: 39,
        currentScore: 87,
        addedAt: '09 Octobre 2026',
        lastCheckedAt: '13 Octobre 2026',
        alertThreshold: 10,
        status: 'active'
      }
    ];
  });

  // --- POSTGRESQL / CLOUD SQL DATA SYNCHRONIZATION ---
  useEffect(() => {
    if (!user || !token) return;

    let isSubscribed = true;
    const fetchUserData = async () => {
      try {
        const [wlRes, repRes] = await Promise.all([
          fetch('/api/user/watchlists', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/user/analyses', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (wlRes.ok && isSubscribed) {
          const wlJson = await wlRes.json();
          if (wlJson.items && wlJson.items.length > 0) {
            const mapped: WatchlistItem[] = wlJson.items.map((dbItem: any) => ({
              id: String(dbItem.id),
              type: (dbItem.itemType as any) || 'market',
              name: dbItem.name,
              category: dbItem.sector || 'Général',
              region: (dbItem.region as any) || 'global',
              currentMomentum: dbItem.initialMomentum ?? 35,
              currentScore: 82,
              addedAt: new Date(dbItem.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
              lastCheckedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
              alertThreshold: 10,
              status: 'active'
            }));
            setWatchlist(mapped);
          }
        }

        if (repRes.ok && isSubscribed) {
          const repJson = await repRes.json();
          if (repJson.items && repJson.items.length > 0) {
            const mapped: SavedAnalysis[] = repJson.items.map((dbItem: any) => {
              let parsedPayload = null;
              try {
                parsedPayload = JSON.parse(dbItem.reportData);
              } catch {
                // ignore
              }
              return {
                id: String(dbItem.id),
                type: 'market_analysis',
                title: `Marché : ${dbItem.marketName}`,
                category: dbItem.sectorId,
                region: (dbItem.region as any) || 'togo',
                savedAt: new Date(dbItem.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                summary: dbItem.executiveSummary,
                payload: parsedPayload,
              };
            });
            setSavedAnalyses(prev => {
              const dbIds = new Set(mapped.map(m => m.id));
              return [...mapped, ...prev.filter(p => !dbIds.has(p.id))];
            });
          }
        }
      } catch (err) {
        console.error('Failed to load user database data:', err);
      }
    };

    fetchUserData();
    return () => { isSubscribed = false; };
  }, [user, token]);

  const handleToggleWatchlist = async (item: any) => {
    const existingIndex = watchlist.findIndex(w => w.name.toLowerCase() === item.name.toLowerCase());
    let updated: WatchlistItem[];
    if (existingIndex >= 0) {
      const removedItem = watchlist[existingIndex];
      updated = watchlist.filter((_, idx) => idx !== existingIndex);
      setWatchlist(updated);
      try {
        localStorage.setItem('tm_watchlist', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      if (token && !isNaN(Number(removedItem.id))) {
        try {
          await fetch(`/api/user/watchlists/${removedItem.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (e) {
          console.error('Error removing from DB watchlist:', e);
        }
      }
    } else {
      const newItem: WatchlistItem = {
        ...item,
        id: `wl-${Date.now()}`,
        addedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        lastCheckedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'active'
      };
      updated = [newItem, ...watchlist];
      setWatchlist(updated);
      try {
        localStorage.setItem('tm_watchlist', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      if (token) {
        try {
          const res = await fetch('/api/user/watchlists', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              itemType: item.type || 'market',
              name: item.name,
              sector: item.category || 'Général',
              region: item.region || selectedRegion,
              initialMomentum: item.currentMomentum || 35,
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.item?.id) {
              setWatchlist(curr => curr.map(w => w.name === item.name ? { ...w, id: String(data.item.id) } : w));
            }
          }
        } catch (e) {
          console.error('Error persisting to DB watchlist:', e);
        }
      }
    }
  };

  const handleRemoveWatchlistItem = async (id: string) => {
    const updated = watchlist.filter(w => w.id !== id);
    setWatchlist(updated);
    try {
      localStorage.setItem('tm_watchlist', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    if (token && !isNaN(Number(id))) {
      try {
        await fetch(`/api/user/watchlists/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.error('Error removing from DB watchlist:', e);
      }
    }
  };

  const isBookmarked = (name: string) => {
    return watchlist.some(w => w.name.toLowerCase() === name.toLowerCase());
  };

  // --- SAVED ANALYSES (HISTORIQUE) STATE ---
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tm_saved_reports');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 'rep-1',
        type: 'market_analysis',
        title: 'Filière Manioc & Farines Standardisées au Togo',
        category: 'Agroalimentaire',
        region: 'togo',
        savedAt: '12 Octobre 2026',
        summary: 'Demande urbaine en forte hausse, opportunité sur le packaging étanche 1kg et la certification ITRA.',
        payload: null
      },
      {
        id: 'rep-2',
        type: 'comparison',
        title: 'Wave vs Orange Money (Zone UEMOA)',
        category: 'Fintech',
        region: 'west_africa',
        savedAt: '10 Octobre 2026',
        summary: 'Confrontation sur les commissions marchandes et l’interopérabilité régionale.',
        payload: null
      }
    ];
  });

  const handleSaveAnalysis = async (reportToSave: MarketAnalysisReport) => {
    const newSaved: SavedAnalysis = {
      id: `rep-${Date.now()}`,
      type: 'market_analysis',
      title: `Marché : ${reportToSave.marketName}`,
      category: reportToSave.sectorId,
      region: reportToSave.region,
      savedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      summary: reportToSave.executiveSummary,
      payload: reportToSave
    };

    setSavedAnalyses(prev => [newSaved, ...prev]);
    try {
      localStorage.setItem('tm_saved_reports', JSON.stringify([newSaved, ...savedAnalyses]));
    } catch (e) {
      // ignore
    }

    if (token) {
      try {
        const res = await fetch('/api/user/analyses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            marketName: reportToSave.marketName,
            sectorId: reportToSave.sectorId,
            region: reportToSave.region,
            opportunityScore: reportToSave.opportunityScore.totalScore,
            executiveSummary: reportToSave.executiveSummary,
            reportData: reportToSave,
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.item?.id) {
            setSavedAnalyses(curr => curr.map(s => s.id === newSaved.id ? { ...s, id: String(data.item.id) } : s));
          }
        }
      } catch (err) {
        console.error('Error persisting analysis report to PostgreSQL:', err);
      }
    }
  };

  const handleDeleteSaved = async (id: string) => {
    const updated = savedAnalyses.filter(s => s.id !== id);
    setSavedAnalyses(updated);
    try {
      localStorage.setItem('tm_saved_reports', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    if (token && !isNaN(Number(id))) {
      try {
        await fetch(`/api/user/analyses/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.error('Error deleting analysis from PostgreSQL:', e);
      }
    }
  };

  const handleOpenSavedAnalysis = (item: SavedAnalysis) => {
    if (item.payload) {
      setAnalysisReport(item.payload);
      setActiveTab('analysis');
    } else {
      const cleanName = item.title.replace('Marché : ', '').replace('Filière ', '').replace(' (Zone UEMOA)', '');
      handleAnalyzeMarket(cleanName, item.category as SectorId, item.region);
    }
  };

  // --- MODALS STATE ---
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);

  // Tab switch handler with URL sync
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      {/* 1. TOP BAR NAVIGATION (Top Bar Contract) */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenPricing={() => setIsPricingOpen(true)}
        watchlistCount={watchlist.length}
      />

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 lg:pb-12">
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            trends={trends}
            opportunities={opportunities}
            selectedRegion={selectedRegion}
            onChangeRegion={setSelectedRegion}
            onSearchMarket={(q) => handleAnalyzeMarket(q)}
            onAnalyzeMarket={handleAnalyzeMarket}
            onSelectTab={handleSelectTab}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === 'explorer' && (
          <MarketExplorer
            trends={trends}
            selectedRegion={selectedRegion}
            onChangeRegion={setSelectedRegion}
            onAnalyzeMarket={handleAnalyzeMarket}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === 'analysis' && (
          <MarketAnalysisView
            report={analysisReport}
            loading={analysisLoading}
            error={analysisError}
            onSearchMarket={(m, s, r) => handleAnalyzeMarket(m, s, r)}
            selectedRegion={selectedRegion}
            onChangeRegion={setSelectedRegion}
            onOpenDataSources={() => setIsDataSourcesOpen(true)}
            onSaveReport={handleSaveAnalysis}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunityDetectorView
            opportunities={opportunities}
            selectedRegion={selectedRegion}
            onChangeRegion={setSelectedRegion}
            onAnalyzeMarket={handleAnalyzeMarket}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonView
            termA={termA}
            setTermA={setTermA}
            termB={termB}
            setTermB={setTermB}
            category={category}
            setCategory={setCategory}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            result={compareResult}
            loading={compareLoading}
            error={compareError}
            onExecuteCompare={handleExecuteCompare}
            onOpenDataSources={() => setIsDataSourcesOpen(true)}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            watchlist={watchlist}
            onRemoveItem={handleRemoveWatchlistItem}
            onAddItem={handleToggleWatchlist}
            onAnalyzeMarket={handleAnalyzeMarket}
          />
        )}

        {activeTab === 'bi_memo' && (
          <BusinessIntelligenceView
            onAnalyzeMarket={handleAnalyzeMarket}
            selectedRegion={selectedRegion}
            onChangeRegion={setSelectedRegion}
          />
        )}

        {activeTab === 'reports' && (
          <HistoryReportsView
            savedAnalyses={savedAnalyses}
            onDeleteSaved={handleDeleteSaved}
            onOpenAnalysis={handleOpenSavedAnalysis}
          />
        )}
      </main>

      {/* 3. MOBILE THUMB-FRIENDLY TAB BAR */}
      <MobileTabBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        watchlistCount={watchlist.length}
      />

      {/* 4. MODALS */}
      <MonetizationModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />

      <DataSourcesModal
        isOpen={isDataSourcesOpen}
        onClose={() => setIsDataSourcesOpen(false)}
      />

      {/* 5. FOOTER (Quiet, zero telemetry slop) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">TrendMarket</span>
            <span>· Market Intelligence pour PME & Décideurs (Togo, UEMOA & Global)</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => setIsDataSourcesOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Provenance des Données
            </button>
            <button
              type="button"
              onClick={() => setIsPricingOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Offres & Tarifs
            </button>
            <span>© {new Date().getFullYear()} TrendMarket</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
