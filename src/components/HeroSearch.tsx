import React from 'react';
import { Search, MapPin, SlidersHorizontal, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { CitéFilterOption, RoomType } from '../types';
import { formatFG } from '../utils/formatters';

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCite: string;
  setSelectedCite: (cite: string) => void;
  cites: CitéFilterOption[];
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (only: boolean) => void;
  totalRoomsCount: number;
  filteredCount: number;
  onResetFilters: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCite,
  setSelectedCite,
  cites,
  maxPrice,
  setMaxPrice,
  selectedType,
  setSelectedType,
  onlyAvailable,
  setOnlyAvailable,
  totalRoomsCount,
  filteredCount,
  onResetFilters,
}) => {
  return (
    <div className="bg-gradient-to-b from-emerald-50/70 via-stone-50 to-white pt-8 pb-10 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Hero Statement */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-3">
            <span>Guinée · Région de Labé</span>
            <span aria-hidden="true">·</span>
            <span>Centre Universitaire de Hafia</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight text-balance leading-tight">
            Trouvez votre logement étudiant fiable et abordable à Hafia.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed text-pretty">
            Fini les arnaques, le bouche-à-oreille risqué et les pertes de temps. LogeStudent certifie les cités et chambres autour du campus avec garantie anti-double réservation.
          </p>
        </div>

        {/* Search & Filter Console (Fulfills Section 5 of Cahier des charges: "Recherche par critères - cité, prix, disponibilité") */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Recherche mot-clé ou secteur
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: lit, bureau, douche interne, Cité..."
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900 transition"
                />
              </div>
            </div>

            {/* Cité Dropdown */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Cité / Secteur à Hafia
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedCite}
                  onChange={(e) => setSelectedCite(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900 transition"
                >
                  <option value="all">Toutes les cités de Hafia</option>
                  <option value="Cité Université Hafia">Cité Université Hafia (300m)</option>
                  <option value="Hafia Centre">Hafia Centre (800m)</option>
                  <option value="Axe Popodara - Hafia">Axe Popodara - Hafia (1.2 km)</option>
                  <option value="Cité Safatou">Cité Safatou (1.8 km)</option>
                  <option value="Quartier Ley-Saré">Quartier Ley-Saré (2.5 km)</option>
                </select>
              </div>
            </div>

            {/* Room Type */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Type de chambre
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900 transition"
              >
                <option value="all">Tous types de logements</option>
                <option value="individuelle">Chambre simple (Douche commune)</option>
                <option value="partagee">Chambre partagée (2 pers.)</option>
                <option value="studio">Studio autonome (Douche & Cuisine privatives)</option>
              </select>
            </div>

            {/* Max Price Slider */}
            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Budget max / mois
                </label>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  {formatFG(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="400000"
                step="20000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-mono mt-1">
                <span>100 000 FG</span>
                <span>400 000 FG</span>
              </div>
            </div>
          </div>

          {/* Secondary Filters Bar */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700 hover:text-stone-900">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>Uniquement les chambres disponibles immédiatement</span>
              </label>

              {(searchQuery || selectedCite !== 'all' || selectedType !== 'all' || maxPrice < 400000 || onlyAvailable) && (
                <button
                  onClick={onResetFilters}
                  className="text-emerald-700 hover:underline font-semibold"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>

            <div className="text-stone-500 font-medium">
              <span className="font-bold text-stone-900">{filteredCount}</span> logement{filteredCount > 1 ? 's' : ''} trouvé{filteredCount > 1 ? 's' : ''} sur {totalRoomsCount} répertoriés
            </div>
          </div>
        </div>

        {/* Guarantees according to Cahier des Charges */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-stone-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <div className="font-semibold text-stone-900">Anti-Arnaque & Bailleurs Vérifiés</div>
              <div className="text-stone-500">Adresses certifiées à Hafia et Labé</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-stone-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <div className="font-semibold text-stone-900">Anti-Double Réservation</div>
              <div className="text-stone-500">Chaque chambre réservée est verrouillée</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-stone-200">
            <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <div className="font-semibold text-stone-900">Tarification Transparente en FG</div>
              <div className="text-stone-500">Prix direct propriétaire, 0 frais d'intermédiaire</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
