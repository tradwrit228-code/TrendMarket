import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  ArrowUpRight, 
  Search,
  Filter
} from 'lucide-react';
import { WatchlistItem, WatchlistType, GEO_SCOPES, GeoRegion } from '../../lib/types/marketIntelligence';
import { MarketScoreBadge } from '../common/MarketScoreBadge';

interface WatchlistViewProps {
  watchlist: WatchlistItem[];
  onRemoveItem: (id: string) => void;
  onAddItem: (item: Omit<WatchlistItem, 'id' | 'addedAt' | 'lastCheckedAt' | 'status'>) => void;
  onAnalyzeMarket: (name: string, category: string, region: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlist,
  onRemoveItem,
  onAddItem,
  onAnalyzeMarket,
}) => {
  const [filterType, setFilterType] = useState<WatchlistType | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<WatchlistType>('market');
  const [newCategory, setNewCategory] = useState('Agroalimentaire');
  const [newRegion, setNewRegion] = useState<GeoRegion>('togo');

  const filtered = watchlist.filter(w => filterType === 'all' || w.type === filterType);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddItem({
      type: newType,
      name: newName.trim(),
      category: newCategory,
      region: newRegion,
      currentMomentum: 20,
      currentScore: 80,
      alertThreshold: 10,
    });

    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Mes Marchés sous Surveillance (Watchlist)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Suivi personnalisé des opportunités, produits, concurrents et mots-clés stratégiques.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter à la Watchlist</span>
        </button>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            filterType === 'all'
              ? 'bg-slate-900 text-white dark:bg-blue-600'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Tous ({watchlist.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('market')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            filterType === 'market'
              ? 'bg-slate-900 text-white dark:bg-blue-600'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Marchés
        </button>
        <button
          type="button"
          onClick={() => setFilterType('product')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            filterType === 'product'
              ? 'bg-slate-900 text-white dark:bg-blue-600'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Produits
        </button>
        <button
          type="button"
          onClick={() => setFilterType('company')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            filterType === 'company'
              ? 'bg-slate-900 text-white dark:bg-blue-600'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Entreprises
        </button>
        <button
          type="button"
          onClick={() => setFilterType('keyword')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            filterType === 'keyword'
              ? 'bg-slate-900 text-white dark:bg-blue-600'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Mots-clés
        </button>
      </div>

      {/* 3. Items List */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
          <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Aucun élément sous surveillance
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ajoutez un marché depuis l'Explorer, ou cliquez sur le bouton ci-dessus pour définir une cible à suivre.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
          >
            Créer ma première alerte
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const geo = GEO_SCOPES[item.region] || GEO_SCOPES.togo;
            return (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="capitalize">{item.type} · {geo.flag} {geo.label}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Supprimer de la watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-mono text-xs font-semibold tabular-nums">
                      {item.currentMomentum >= 0 ? (
                        <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          +{item.currentMomentum}%
                        </span>
                      ) : (
                        <span className="flex items-center text-rose-600 dark:text-rose-400">
                          <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          {item.currentMomentum}%
                        </span>
                      )}
                      <span className="text-slate-400 font-normal">mom.</span>
                    </div>

                    <MarketScoreBadge score={item.currentScore} size="sm" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Ajouté : {item.addedAt}
                  </span>

                  <button
                    type="button"
                    onClick={() => onAnalyzeMarket(item.name, item.category, item.region)}
                    className="min-h-[44px] flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>Analyser</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Add to Watchlist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form 
            onSubmit={handleCreate}
            className="max-w-md w-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ajouter un élément à surveiller
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Annuler
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nom du marché, produit ou entreprise
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ex: Anacarde biologique, Mobile Money..."
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Typologie
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full h-10 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="market">Marché</option>
                    <option value="product">Produit</option>
                    <option value="company">Entreprise</option>
                    <option value="category">Catégorie</option>
                    <option value="keyword">Mot-clé</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Zone géographique
                  </label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value as any)}
                    className="w-full h-10 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {Object.values(GEO_SCOPES).map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.flag} {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Enregistrer dans la Watchlist
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
