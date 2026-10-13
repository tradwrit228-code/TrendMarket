import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Download, 
  Copy, 
  Printer, 
  Share2, 
  Check, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Info,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { CompareData, POPULAR_COMPARISONS } from '../../lib/fallbackData';
import { SourceBadge } from '../common/SourceBadge';

interface ComparisonViewProps {
  termA: string;
  setTermA: (val: string) => void;
  termB: string;
  setTermB: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  searchMode: 'direct_web' | 'ai';
  setSearchMode: (val: 'direct_web' | 'ai') => void;
  result: CompareData | null;
  loading: boolean;
  error: string | null;
  onExecuteCompare: () => void;
  onOpenDataSources: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  termA,
  setTermA,
  termB,
  setTermB,
  category,
  setCategory,
  searchMode,
  setSearchMode,
  result,
  loading,
  error,
  onExecuteCompare,
  onOpenDataSources,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleSwapTerms = () => {
    const temp = termA;
    setTermA(termB);
    setTermB(temp);
  };

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('a', termA);
    url.searchParams.set('b', termB);
    url.searchParams.set('cat', category);
    url.searchParams.set('mode', searchMode);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    const content = `# Confrontation Comparative: ${result.termA.name} vs ${result.termB.name}
**Catégorie:** ${category}  
**Date:** ${new Date().toLocaleDateString('fr-FR')}

## Synthèse Décisionnelle
${result.comparisonSummary}

## Métriques Clés
- **${result.termA.name}:** Score ${result.termA.trendScore}/100 | Tendance: ${result.termA.trendDirection} | Part: ${result.termA.marketShare}
- **${result.termB.name}:** Score ${result.termB.trendScore}/100 | Tendance: ${result.termB.trendDirection} | Part: ${result.termB.marketShare}
- **Différentiel (Delta):** ${result.metrics?.deltaScore || (result.termA.trendScore - result.termB.trendScore)} pts

## Facteurs Décisifs
${result.keyFactors.map(f => `- ${f}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrendMarket_Compare_${result.termA.name}_vs_${result.termB.name}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Recharts chart data
  const months = ['M-5', 'M-4', 'M-3', 'M-2', 'M-1', 'Actuel'];
  const chartData = months.map((m, idx) => ({
    name: m,
    [result?.termA.name || 'Term A']: result?.termA.monthlyData[idx] || 0,
    [result?.termB.name || 'Term B']: result?.termB.monthlyData[idx] || 0,
  }));

  const deltaScore = result?.metrics?.deltaScore ?? ((result?.termA.trendScore || 0) - (result?.termB.trendScore || 0));

  return (
    <div className="space-y-8">
      {/* 1. Comparison Form Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Confrontation Comparative A / B
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comparez le momentum, les parts d'adoption et les fiches techniques de deux entités, produits ou marchés.
          </p>
        </div>

        {/* Inputs Strip */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
          {/* Term A Input */}
          <div className="md:col-span-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Option A (Référence)
            </label>
            <input
              type="text"
              value={termA}
              onChange={(e) => setTermA(e.target.value)}
              placeholder="ex: Netflix, Wave, Soja bio..."
              className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-5">
            <button
              type="button"
              onClick={handleSwapTerms}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Inverser les deux options"
              title="Permuter A et B"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Term B Input */}
          <div className="md:col-span-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Option B (Challenger)
            </label>
            <input
              type="text"
              value={termB}
              onChange={(e) => setTermB(e.target.value)}
              placeholder="ex: Disney+, Orange Money, Maïs..."
              className="w-full h-11 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Toolbar & Execution Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Catégorie (ex: Streaming, Fintech...)"
              className="h-9 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            />

            {/* Mode selector */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSearchMode('direct_web')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  searchMode === 'direct_web' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-medium' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Recherche Web Directe
              </button>
              <button
                type="button"
                onClick={() => setSearchMode('ai')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  searchMode === 'ai' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-medium' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Moteur IA Grounded
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onExecuteCompare}
            disabled={loading}
            className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {loading ? 'Analyse comparative en cours...' : 'Comparer les 2 Options'}
          </button>
        </div>

        {/* Popular samples chips */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto text-xs text-slate-500 scrollbar-none">
          <span className="shrink-0 text-slate-400 font-medium">Exemples :</span>
          {POPULAR_COMPARISONS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setTermA(p.termA);
                setTermB(p.termB);
                setCategory(p.category);
              }}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
            >
              {p.termA} vs {p.termB}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Loading State */}
      {loading && (
        <div className="p-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Extraction et confrontation en cours...
          </h3>
          <p className="text-xs text-slate-500">
            Calcul du différentiel de momentum et contextualisation des forces et faiblesses.
          </p>
        </div>
      )}

      {/* 3. Populated Comparison Results */}
      {result && !loading && (
        <div className="space-y-8">
          {/* Executive Comparative Takeaway */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Interprétation Automatique Décisionnelle
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {result.termA.name} vs {result.termB.name}
                </h2>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1.5 print:hidden">
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Partager cette confrontation"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Télécharger en Markdown"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Imprimer"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contextual Narrative ("Ne jamais présenter une donnée brute sans contexte") */}
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-blue-900 dark:text-blue-300 block mb-1">
                Constat d'arbitrage :
              </span>
              <p>{result.comparisonSummary}</p>
            </div>

            {/* Delta Score & Momentum Differential */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60">
                <span className="text-slate-500 block mb-1">{result.termA.name}</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {result.termA.trendScore}/100
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{result.termA.marketShare}</span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 block mb-1">Différentiel de Score (Δ)</span>
                <span className={`text-xl font-bold font-mono tabular-nums ${deltaScore >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {deltaScore >= 0 ? `+${deltaScore}` : deltaScore} pts
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {deltaScore > 0 ? `Avantage net pour ${result.termA.name}` : `Avantage net pour ${result.termB.name}`}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60">
                <span className="text-slate-500 block mb-1">{result.termB.name}</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {result.termB.trendScore}/100
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{result.termB.marketShare}</span>
              </div>
            </div>
          </div>

          {/* Temporal Evolution Chart */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Évolution Temporelle Comparative (6 Derniers Mois)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey={result.termA.name} stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey={result.termB.name} stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-side Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Term A Profile */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{result.termA.name}</h4>
                  <span className="text-xs text-slate-500">{result.termA.typeLabel}</span>
                </div>
                <span className="font-mono text-sm font-bold text-blue-600">{result.termA.trendScore}/100</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{result.termA.description}</p>
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white block">Forces majeures :</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {result.termA.pros.map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <span>✓</span> <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white block">Limites & Freins :</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {result.termA.cons.map((c, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                      <span>✕</span> <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Term B Profile */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{result.termB.name}</h4>
                  <span className="text-xs text-slate-500">{result.termB.typeLabel}</span>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-600">{result.termB.trendScore}/100</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{result.termB.description}</p>
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white block">Forces majeures :</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {result.termB.pros.map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <span>✓</span> <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white block">Limites & Freins :</span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {result.termB.cons.map((c, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                      <span>✕</span> <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sources and Freshness */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <SourceBadge
              source="Indexation Directe du Marché"
              lastUpdated={new Date().toLocaleDateString('fr-FR')}
              confidenceScore={result.termA.confidenceScore || 90}
              onOpenDataSources={onOpenDataSources}
            />

            <div className="flex items-center gap-2">
              <span className="text-slate-500">Sources vérifiées :</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                {result.groundingSources.length} sources actives
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
