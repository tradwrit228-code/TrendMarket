import React from 'react';
import { TrendingUp, Compass, ArrowRight, BarChart3, MessageSquare } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenPricing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenPricing }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-blue-600 selection:text-white">
      {/* VIBE MOTION DESIGN SYSTEM INJECTED STYLES */}
      <style>{`
        @keyframes heroReveal {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-hero-reveal {
          animation: heroReveal 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float {
          animation: floatSlow 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-hero-reveal, .animate-float, * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-28 lg:pt-36 lg:pb-40 border-b border-slate-200 dark:border-slate-800">
        {/* Background gradient decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 to-indigo-600/15 dark:from-blue-600/10 dark:to-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-float" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight animate-hero-reveal">
            Anticipez les marchés de demain avec <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">TrendMarket</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal animate-hero-reveal" style={{ animationDelay: '150ms' }}>
            Plateforme d’intelligence économique et d’analyse prédictive. Suivez les tendances, détectez les signaux faibles et prenez des décisions éclairées.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-hero-reveal" style={{ animationDelay: '300ms' }}>
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-base shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer group"
            >
              <span>Accéder à la plateforme</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button
              onClick={onOpenPricing}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] font-semibold text-base transition-all duration-200 cursor-pointer shadow-sm"
            >
              Découvrir les Tarifs
            </button>
          </div>

          {/* Key metrics / trust banner */}
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto animate-hero-reveal" style={{ animationDelay: '450ms' }}>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">100%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Données Supabase & PostgreSQL</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">UEMOA+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Couverture Régionale & Mondiale</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">IA Avancée</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Génération de Notes BI & Analyses</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">Temps Réel</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Scores d'Opportunité & Momendums</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Une suite complète d'intelligence économique</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg">
            Conçu pour les analystes, investisseurs et preneurs de décision exigeants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Explorateur de Marché</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Filtrez par secteur (Agro, Fintech, Énergie, etc.) et par zone géographique pour identifier instantanément les marchés porteurs.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Analyse Deep-Dive & IA</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Générez des rapports d'analyse complets avec scores de demande, de concurrence, de risque et des recommandations stratégiques.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Détecteur d'Opportunités</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Repérez les signaux de croissance émergents avant la concurrence grâce à des algorithmes de scoring avancés.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">T</div>
            <span className="font-bold text-slate-900 dark:text-white">TrendMarket</span>
            <span>© 2026 • Market Intelligence SaaS</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onEnterApp} className="hover:text-blue-600 transition-colors cursor-pointer">Application</button>
            <button onClick={onOpenPricing} className="hover:text-blue-600 transition-colors cursor-pointer">Tarifs</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
