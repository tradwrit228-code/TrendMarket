import React, { useState } from 'react';
import { 
  Briefcase, 
  Target, 
  FileText, 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Printer, 
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { 
  SectorId, 
  SECTORS, 
  GeoRegion, 
  GEO_SCOPES, 
  BIOkObjective, 
  BIStrategicMemo 
} from '../../lib/types/marketIntelligence';
import { generateBIMemo } from '../../lib/data/marketIntelligenceData';

interface BusinessIntelligenceViewProps {
  onAnalyzeMarket: (market: string, sector: string, region: string) => void;
  selectedRegion: GeoRegion;
  onChangeRegion: (region: GeoRegion) => void;
}

export const BusinessIntelligenceView: React.FC<BusinessIntelligenceViewProps> = ({
  onAnalyzeMarket,
  selectedRegion,
  onChangeRegion,
}) => {
  const [sector, setSector] = useState<SectorId>('agroalimentaire');
  const [market, setMarket] = useState('Transformation locale du Manioc');
  const [objective, setObjective] = useState<BIOkObjective>('high_potential_market');
  const [memo, setMemo] = useState<BIStrategicMemo | null>(() => {
    return generateBIMemo('agroalimentaire', 'togo', 'Transformation locale du Manioc', 'high_potential_market');
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateBIMemo(sector, selectedRegion, market, objective);
      setMemo(generated);
      setIsGenerating(false);
    }, 400);
  };

  const handleDownloadMarkdown = () => {
    if (!memo) return;
    const content = `# Note Stratégique d'Intelligence Commerciale B2B
**Marché:** ${memo.marketName}  
**Zone Économique:** ${GEO_SCOPES[memo.region]?.label || memo.region}  
**Date d'émission:** ${memo.generatedAt}

## Synthèse Exécutive
${memo.executiveSummary}

## Contexte Macroéconomique Régional
${memo.macroEconomicContext}

## Facteurs d'Accélération Majeurs
${memo.keyDrivers.map(d => `- ${d}`).join('\n')}

## Recommandation de Positionnement Stratégique
${memo.strategicPositioningAdvice}

## Grille Tarifaire Suggérée & Marges Revendeurs
- **Entrée de gamme:** ${memo.suggestedPricingStructure.entryLevel}
- **Cœur de gamme:** ${memo.suggestedPricingStructure.standard}
- **Offre B2B Premium:** ${memo.suggestedPricingStructure.premiumB2B}
- **Marge de distribution préconisée:** ${memo.suggestedPricingStructure.distributionMarginRecommendation}

## Canaux de Commercialisation Terrain
${memo.recommendedGoToMarketChannels.map(c => `- ${c}`).join('\n')}

## Conformité Réglementaire & Juridique Locale
${memo.regulatoryAndLocalConsiderations.map(r => `- ${r}`).join('\n')}

## Feuille de Route d'Exécution en 3 Jalons
${memo.executionRoadmap.map(s => `### Jalon ${s.stepNumber} : ${s.title}
${s.actions.map(a => `- ${a}`).join('\n')}
`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TrendMarket_B2B_Memo_${memo.marketName.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Context */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Mode Business Intelligence B2B
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono">
              Executive Memo
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Générez une note de cadrage stratégique structurée selon votre secteur, votre pays et votre objectif commercial.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
          {/* Sector */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Secteur
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Pays / Zone Cible
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => onChangeRegion(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              {Object.values(GEO_SCOPES).map((g) => (
                <option key={g.id} value={g.id}>{g.flag} {g.label}</option>
              ))}
            </select>
          </div>

          {/* Market */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Marché ou Produit
            </label>
            <input
              type="text"
              required
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              placeholder="ex: Manioc, Soja, Solaire..."
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {/* Objective */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Objectif Stratégique
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="high_potential_market">Identifier un marché à fort potentiel</option>
              <option value="new_product_launch">Lancer une nouvelle offre</option>
              <option value="demand_decline_hedge">Anticiper une baisse de demande</option>
              <option value="competitive_niche">Trouver une niche compétitive</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isGenerating ? 'Élaboration de la note...' : 'Générer la Note Stratégique B2B'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Structured Executive Memo Output */}
      {memo && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs text-slate-500 font-mono">
                Réf : {memo.id} · {memo.generatedAt}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                Note de Cadrage Stratégique : {memo.marketName}
              </h2>
              <span className="text-xs text-slate-500">
                Zone : {GEO_SCOPES[memo.region]?.label || memo.region} ({GEO_SCOPES[memo.region]?.currency})
              </span>
            </div>

            <div className="flex items-center gap-2 print:hidden">
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

          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-blue-900 dark:text-blue-300 block mb-1">
              Synthèse Décisionnelle :
            </span>
            <p>{memo.executiveSummary}</p>
          </div>

          {/* Macro context & Drivers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-2">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Contexte Économique & Intégration Régionale :
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {memo.macroEconomicContext}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-2">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Moteurs de Marché Clés :
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                {memo.keyDrivers.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">›</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggested Pricing & Go-To-Market */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-xs">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              Structure Tarifaire Conseillée & Rémunération du Réseau
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50">
                <span className="text-slate-500 block mb-1">Offre d'Entrée</span>
                <span className="font-medium text-slate-900 dark:text-white block">{memo.suggestedPricingStructure.entryLevel}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50">
                <span className="text-slate-500 block mb-1">Cœur de Gamme</span>
                <span className="font-medium text-slate-900 dark:text-white block">{memo.suggestedPricingStructure.standard}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50">
                <span className="text-slate-500 block mb-1">Contrat B2B Premium</span>
                <span className="font-medium text-slate-900 dark:text-white block">{memo.suggestedPricingStructure.premiumB2B}</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 italic">
              {memo.suggestedPricingStructure.distributionMarginRecommendation}
            </p>
          </div>

          {/* Channels & Regulatory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Canaux de Commercialisation Terrain Prioritaires :
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                {memo.recommendedGoToMarketChannels.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Obligations Juridiques & Réglementaires Locales :
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                {memo.regulatoryAndLocalConsiderations.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Execution Roadmap */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-3 text-xs">
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              Feuille de Route d'Exécution en 3 Jalons
            </span>
            <div className="space-y-3">
              {memo.executionRoadmap.map((step) => (
                <div key={step.stepNumber} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
                  <span className="font-bold text-blue-600 dark:text-blue-400 block">
                    Jalon {step.stepNumber} : {step.title}
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {step.actions.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
