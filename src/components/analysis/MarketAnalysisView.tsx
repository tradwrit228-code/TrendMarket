import React, { useState } from 'react';
import { 
  LineChart as LineChartIcon, 
  Calendar, 
  Users, 
  Layers, 
  ShieldAlert, 
  Lightbulb, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Copy, 
  Printer, 
  Share2, 
  Check, 
  TrendingUp, 
  Info,
  Clock,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Bookmark
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  MarketAnalysisReport, 
  GeoRegion, 
  GEO_SCOPES, 
  SectorId, 
  SECTORS 
} from '../../lib/types/marketIntelligence';
import { MarketScoreBadge } from '../common/MarketScoreBadge';
import { SourceBadge } from '../common/SourceBadge';
import { UniversalMarketSearch } from '../common/UniversalMarketSearch';

interface MarketAnalysisViewProps {
  report: MarketAnalysisReport | null;
  loading: boolean;
  error: string | null;
  onSearchMarket: (marketName: string, sector?: SectorId, region?: GeoRegion) => void;
  selectedRegion: GeoRegion;
  onChangeRegion: (region: GeoRegion) => void;
  onOpenDataSources: () => void;
  onSaveReport?: (report: MarketAnalysisReport) => void;
}

export const MarketAnalysisView: React.FC<MarketAnalysisViewProps> = ({
  report,
  loading,
  error,
  onSearchMarket,
  selectedRegion,
  onChangeRegion,
  onOpenDataSources,
  onSaveReport,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [savedLocally, setSavedLocally] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'seasonality' | 'competition' | 'action_plan'>('overview');

  const handleSave = () => {
    if (!report || !onSaveReport) return;
    onSaveReport(report);
    setSavedLocally(true);
    setTimeout(() => setSavedLocally(false), 2500);
  };

  // Format Recharts data for seasonality
  const seasonalityChartData = report?.seasonalityCurve.map((s) => ({
    month: s.month.slice(0, 3),
    fullName: s.month,
    demandIndex: s.demandIndex,
    commercialActivity: s.commercialActivity,
    notes: s.notes,
  })) || [];

  // Format historical interest data
  const historicalData = report?.historicalInterest.periods.map((p, idx) => ({
    period: p,
    interest: report.historicalInterest.values[idx] || 0,
  })) || [];

  const handleCopySummary = () => {
    if (!report) return;
    const text = `=== RAPPORT D'INTELLIGENCE COMMERCIALE : ${report.marketName.toUpperCase()} ===\nZone : ${report.countryLabel}\nDate : ${report.createdAt}\nScore d'opportunité : ${report.opportunityScore.totalScore}/100 (${report.opportunityScore.ratingLabel})\n\nSYNTHÈSE :\n${report.executiveSummary}\n\nPOTENTIEL COMMERCIAL :\nNiveau : ${report.commercialPotential.level} | ROI estimé : ${report.commercialPotential.estimatedPaybackMonths} mois\nCible : ${report.commercialPotential.targetAudience}\nTicket moyen : ${report.commercialPotential.ticketMoyen}\n\nRECOMMANDATIONS COMMERCIALES :\n${report.actionableRecommendations.map(r => `- ${r.phase} (${r.timeframe}) : ${r.action} -> ${r.expectedResult}`).join('\n')}`;
    
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!report) return;
    const content = `# Market Intelligence Report: ${report.marketName}
**Zone géographique:** ${report.countryLabel}  
**Date d'analyse:** ${report.createdAt}  
**Score d'Opportunité Propriétaire:** ${report.opportunityScore.totalScore}/100 (${report.opportunityScore.ratingLabel})

## 1. Synthèse Exécutive
${report.executiveSummary}

## 2. Analyse de la Demande
${report.demandOverview}

## 3. Saisonnalité Commerciale
| Mois | Indice Demande | Activité | Notes Terrain |
| --- | --- | --- | --- |
${report.seasonalityCurve.map(s => `| ${s.month} | ${s.demandIndex}/100 | ${s.commercialActivity} | ${s.notes} |`).join('\n')}

## 4. Paysage Concurrentiel
${report.competitionOverview}

### Acteurs Clés Identifiés :
${report.keyActors.map(a => `### ${a.name} (Part estimée : ${a.marketShareEstimate})
- **Positionnement :** ${a.positioning}
- **Forces :** ${a.strength}
- **Faiblesses :** ${a.weakness}
`).join('\n')}

**Espace Concurrentiel Inexploité :**  
${report.competitiveGapSummary}

## 5. Produits Associés & Écosystème
${report.associatedProducts.map(p => `- ${p}`).join('\n')}

### Tendances Émergentes :
${report.emergingSubTrends.map(t => `- ${t}`).join('\n')}

### Signaux Faibles :
${report.weakSignals.map(w => `- ${w}`).join('\n')}

## 6. Risques & Opportunités
### Risques :
${report.risks.map(r => `- **${r.title}** (Gravité: ${r.severity}) : ${r.mitigationStrategy}`).join('\n')}

### Opportunités :
${report.opportunities.map(o => `- **${o.title}** (${o.impact}) : ${o.description}`).join('\n')}

## 7. Plan d'Action Commercial
${report.actionableRecommendations.map(r => `### ${r.phase} (${r.timeframe})
- **Action :** ${r.action}
- **Résultat attendu :** ${r.expectedResult}
`).join('\n')}

## 8. Traçabilité & Sources des Données
${report.dataSources.map(d => `- **${d.title}** (${d.organization}) - ${d.dataType} (${d.freshness})`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrendMarket_Report_${report.marketName.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* 1. Universal Search Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Market Analysis — Dossier d'Intelligence Marché
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Générez une analyse commerciale exhaustive pour n'importe quel marché, produit ou filière (ex: Manioc au Togo, Mobile Money, Anacarde...).
          </p>
        </div>

        <UniversalMarketSearch
          onSearchMarket={onSearchMarket}
          selectedRegion={selectedRegion}
          onChangeRegion={onChangeRegion}
          placeholder="Entrez un marché à analyser (ex: Manioc, Soja Bio, Pompage Solaire, Coton...)"
        />
      </div>

      {/* 2. Loading State */}
      {loading && (
        <div className="p-16 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Analyse et contextualisation des signaux en cours...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Validation des données institutionnelles, modélisation de la saisonnalité et calcul du score d'opportunité.
            </p>
          </div>
        </div>
      )}

      {/* 3. Error State */}
      {error && !loading && (
        <div className="p-6 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 text-xs">
          <span className="font-semibold block mb-1">Erreur lors de la génération du rapport :</span>
          <span>{error}</span>
        </div>
      )}

      {/* 4. Populated Market Intelligence Report */}
      {report && !loading && (
        <div className="space-y-8 print:p-0">
          {/* Executive Header Card */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Dossier d'Intelligence Commerciale</span>
                  <span aria-hidden="true">·</span>
                  <span>{report.countryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{report.createdAt}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Marché : {report.marketName}
                </h2>

                <SourceBadge
                  source={report.dataSources[0]?.organization || "Observatoire Économique UEMOA"}
                  lastUpdated={report.createdAt}
                  confidenceScore={report.confidenceScore}
                  onOpenDataSources={onOpenDataSources}
                  className="mt-3"
                />
              </div>

              {/* Score and Export Toolbar */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3">
                <MarketScoreBadge score={report.opportunityScore} size="lg" showDetails />

                {/* Export buttons */}
                <div className="flex items-center gap-1.5 print:hidden">
                  {onSaveReport && (
                    <button
                      type="button"
                      onClick={handleSave}
                      className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                        savedLocally 
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                      title="Sauvegarder dans ma base Cloud SQL"
                    >
                      {savedLocally ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
                      <span className="hidden sm:inline-block text-[11px]">{savedLocally ? 'Enregistré' : 'Enregistrer'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="p-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Copier la synthèse"
                  >
                    {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadMarkdown}
                    className="p-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Télécharger en Markdown (.md)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Imprimer / Exporter PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Executive Summary Prose */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider block mb-1.5">
                Synthèse Décisionnelle Dirigeant
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {report.executiveSummary}
              </p>
            </div>

            {/* Commercial Potential KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 block mb-1">Potentiel Commercial</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {report.commercialPotential.level}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 block mb-1">Retour s/ Investissement</span>
                <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {report.commercialPotential.estimatedPaybackMonths} mois
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 block mb-1">Ticket Moyen Estimé</span>
                <span className="text-xs font-medium text-slate-900 dark:text-slate-200 line-clamp-1">
                  {report.commercialPotential.ticketMoyen}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 block mb-1">Cible Prioritaire</span>
                <span className="text-xs font-medium text-slate-900 dark:text-slate-200 line-clamp-1">
                  {report.commercialPotential.targetAudience}
                </span>
              </div>
            </div>
          </div>

          {/* Sectional Nav Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs overflow-x-auto print:hidden">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1. Demande & Dynamique
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seasonality')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'seasonality'
                  ? 'bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2. Saisonnalité Mensuelle
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('competition')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'competition'
                  ? 'bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3. Concurrence & Acteurs Clés
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('action_plan')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'action_plan'
                  ? 'bg-white text-slate-900 dark:bg-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              4. Risques & Plan d'Action
            </button>
          </div>

          {/* TAB 1: DEMANDE & DYNAMIQUE */}
          {(activeTab === 'overview' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'overview' ? 'hidden print:block' : ''}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Historical chart */}
                <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Évolution de l'Intérêt Commercial dans le Temps
                  </h3>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                        <XAxis dataKey="period" stroke="#94A3B8" fontSize={11} />
                        <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="interest" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#interestGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Demand Overview Text */}
                <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Analyse Approfondie de la Demande
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {report.demandOverview}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      Produits Dérivés Associés à Forte Marge :
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {report.associatedProducts.map((p, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Signals breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-3">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                    Tendances Émergentes Directes
                  </span>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {report.emergingSubTrends.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-3">
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
                    Signaux Faibles (Précurseurs de rupture)
                  </span>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {report.weakSignals.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAISONNALITE */}
          {(activeTab === 'seasonality' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'seasonality' ? 'hidden print:block' : ''}`}>
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Cycle de Saisonnalité Commerciale Annuelle (12 Mois)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Anticipez les pics de demande et les périodes de récolte/production pour optimiser vos flux de trésorerie.
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={seasonalityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="seasonGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="demandIndex" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#seasonGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Seasonality Data Table */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th className="py-2 pr-4 font-semibold">Période</th>
                        <th className="py-2 px-4 font-semibold">Indice Demande</th>
                        <th className="py-2 px-4 font-semibold">Activité Commerciale</th>
                        <th className="py-2 pl-4 font-semibold">Recommandation Terrain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {report.seasonalityCurve.map((point, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-white">
                            {point.month}
                          </td>
                          <td className="py-2.5 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                            {point.demandIndex}/100
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              point.commercialActivity === 'pic' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : point.commercialActivity === 'moyen'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                            }`}>
                              {point.commercialActivity.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2.5 pl-4 text-slate-600 dark:text-slate-300">
                            {point.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONCURRENCE & ACTEURS */}
          {(activeTab === 'competition' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'competition' ? 'hidden print:block' : ''}`}>
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Cartographie des Acteurs & Parts de Marché Estimées
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {report.competitionOverview}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {report.keyActors.map((actor, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-3">
                      <div>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          Part estimée : {actor.marketShareEstimate}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {actor.name}
                        </h4>
                      </div>

                      <div className="text-xs space-y-1.5">
                        <div className="text-slate-700 dark:text-slate-300">
                          <span className="font-medium text-slate-900 dark:text-slate-200">Positionnement :</span> {actor.positioning}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-400">
                          <span className="font-medium">Force :</span> {actor.strength}
                        </div>
                        <div className="text-rose-700 dark:text-rose-400">
                          <span className="font-medium">Faiblesse :</span> {actor.weakness}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Competitive Gap Callout */}
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
                  <span className="font-semibold text-blue-900 dark:text-blue-300 block mb-1">
                    Opportunité de Différenciation Stratégique (Competitive Gap) :
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {report.competitiveGapSummary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RISQUES & PLAN D'ACTION */}
          {(activeTab === 'action_plan' || typeof window !== 'undefined') && (
            <div className={`space-y-6 ${activeTab !== 'action_plan' ? 'hidden print:block' : ''}`}>
              {/* Risks & Opportunities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risks */}
                <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
                  <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Matrice des Risques & Atténuation</span>
                  </h3>
                  <div className="space-y-3">
                    {report.risks.map((risk, i) => (
                      <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white">{risk.title}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                            risk.severity === 'Élevé' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {risk.severity}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          <span className="font-medium text-slate-800 dark:text-slate-200">Parade :</span> {risk.mitigationStrategy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opportunities */}
                <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Opportunités de Croissance Majeures</span>
                  </h3>
                  <div className="space-y-3">
                    {report.opportunities.map((opp, i) => (
                      <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white">{opp.title}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {opp.impact}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          {opp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Plan Roadmap */}
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Plan d'Action Commercial Opérationnel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Étapes chronologiques concrètes pour lancer et rentabiliser votre positionnement sur ce marché.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {report.actionableRecommendations.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                            {step.phase}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 font-medium">{step.timeframe}</span>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {step.action}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          <span className="font-medium text-slate-800 dark:text-slate-200">Résultat attendu :</span> {step.expectedResult}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Actionnable</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. Data Sources & Transparency Footer */}
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Sources des Données & Traçabilité
              </span>
              <button
                type="button"
                onClick={onOpenDataSources}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Consulter la charte de transparence
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {report.dataSources.map((ds, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="font-semibold text-slate-900 dark:text-white block truncate">{ds.title}</span>
                  <span className="text-[11px] text-slate-500 block truncate">{ds.organization}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Fraîcheur : {ds.freshness}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
