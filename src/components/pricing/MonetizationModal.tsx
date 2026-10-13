import React from 'react';
import { Check, X, Shield, Sparkles, Building, Zap } from 'lucide-react';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonetizationModal: React.FC<MonetizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-4xl w-full p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Offres & Abonnements B2B
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Accélérez vos décisions de marché avec TrendMarket Pro
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* FREE */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">Pour Débuter</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Formule Découverte</h3>
              <div className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
                0 FCFA <span className="text-xs font-normal text-slate-400">/ mois</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Idéal pour les étudiants, chercheurs et porteurs de projet en phase exploratoire.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>5 analyses de marché / mois</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Comparaisons A/B illimitées</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Accès aux tendances générales</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="w-3.5 text-center">✕</span>
                  <span>Watchlist limitée à 3 marchés</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              Plan Actuel
            </button>
          </div>

          {/* PRO */}
          <div className="relative p-5 rounded-xl border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between space-y-4">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider">
              Recommandé PME
            </span>

            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mb-1">Pour Entrepreneurs & PME</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">TrendMarket Pro</h3>
              <div className="mt-2 font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">
                19 000 FCFA <span className="text-xs font-normal text-slate-400">/ mois</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Pour commerçants, transformateurs, agences et PME en développement rapide.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Analyses de marché complètes illimitées</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Dossiers d'intelligence téléchargeables (Markdown / PDF)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Watchlist illimitée avec alertes de momentum</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Génération de notes de stratégie B2B</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Option de souscription Pro prête pour intégration passerelle (Mobile Money / Carte bancaire).");
                onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              Passer à l'offre Pro
            </button>
          </div>

          {/* BUSINESS / ENTERPRISE */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">Pour Groupes & Institutions</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Business & Grands Comptes</h3>
              <div className="mt-2 font-mono text-2xl font-bold text-slate-900 dark:text-white">
                79 000 FCFA <span className="text-xs font-normal text-slate-400">/ mois</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Pour institutions financières, bailleurs, coopératives d'envergure et multinationales.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tout le forfait Pro pour 10 utilisateurs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>API d'extraction directe temps réel</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Séries chronologiques brutes & export Excel</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Analyste dédié & rapports sur mesure</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Contact grand compte enregistré. Un chargé de compte prendra attache avec votre structure.");
                onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
            >
              Contacter l'équipe
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Paiements sécurisés via Flooz, TMoney, Wave, Orange Money et Cartes Bancaires (UEMOA / International). Facturation avec TVA et quittance légale.
        </p>
      </div>
    </div>
  );
};
