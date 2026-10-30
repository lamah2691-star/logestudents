import React, { useState, useMemo } from 'react';
import { Room } from '../types';
import { CitéFilterOption } from '../types';
import { RoomCard } from './RoomCard';
import { formatFG } from '../utils/formatters';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  AlertCircle, 
  Search, 
  MapPin, 
  Home
} from 'lucide-react';

interface ResidenceViewProps {
  rooms: Room[];
  cites: CitéFilterOption[];
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

export const ResidenceView: React.FC<ResidenceViewProps> = ({
  rooms,
  cites,
  onSelectRoom,
  onBookRoom,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCite, setSelectedCite] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(400000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'price_asc' | 'price_desc'>('distance');
  const [selectedAmenity, setSelectedAmenity] = useState<'all' | 'forage' | 'solaire' | 'sanitaire_interne'>('all');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCite('all');
    setSelectedType('all');
    setMaxPrice(400000);
    setOnlyAvailable(false);
    setSelectedAmenity('all');
    setSortBy('distance');
  };

  // Filter and sort housing data
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        // Keyword Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = room.title.toLowerCase().includes(query);
          const matchesCite = room.cite.toLowerCase().includes(query);
          const matchesDesc = room.description.toLowerCase().includes(query);
          const matchesAddress = room.addressDescription.toLowerCase().includes(query);
          if (!matchesTitle && !matchesCite && !matchesDesc && !matchesAddress) {
            return false;
          }
        }

        // Cité / Quartier filter
        if (selectedCite !== 'all' && room.cite !== selectedCite) {
          return false;
        }

        // Room Type filter
        if (selectedType !== 'all' && room.type !== selectedType) {
          return false;
        }

        // Max price filter
        if (room.pricePerMonthFG > maxPrice) {
          return false;
        }

        // Availability filter
        if (onlyAvailable && room.status !== 'disponible') {
          return false;
        }

        // Amenity Quick filter
        if (selectedAmenity === 'forage' && !room.amenities.runningWater) {
          return false;
        }
        if (selectedAmenity === 'solaire' && !room.amenities.solarPower) {
          return false;
        }
        if (selectedAmenity === 'sanitaire_interne' && !room.amenities.privateBathroom) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return a.distanceToCampusMins - b.distanceToCampusMins;
        }
        if (sortBy === 'price_asc') {
          return a.pricePerMonthFG - b.pricePerMonthFG;
        }
        if (sortBy === 'price_desc') {
          return b.pricePerMonthFG - a.pricePerMonthFG;
        }
        return 0;
      });
  }, [rooms, searchQuery, selectedCite, selectedType, maxPrice, onlyAvailable, selectedAmenity, sortBy]);

  return (
    <section className="py-8 sm:py-12 bg-stone-50 min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header with Title and description */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                URL : /residence
              </span>
              <span className="text-xs text-stone-500">Catalogue certifié de Hafia</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Toutes les résidences &amp; chambres d'étudiants
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Explorez toutes les concessions vérifiées à Hafia. Prix transparents en Francs Guinéens (FG) sans frais d'intermédiaire.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-stone-500 hidden sm:inline">Trier par :</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Trier les logements"
                className="text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-xs"
              >
                <option value="distance">Proximité campus (croissante)</option>
                <option value="price_asc">Prix le plus bas (FG)</option>
                <option value="price_desc">Prix le plus haut (FG)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Recherche par mot-clé</label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ex: Cité Espoir, Forage, Douche..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Quarter / Cité filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Quartier à Hafia</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <select
                  value={selectedCite}
                  onChange={(e) => setSelectedCite(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white cursor-pointer"
                >
                  <option value="all">Toutes les cités de Hafia</option>
                  {cites
                    .filter((c) => c.id !== 'all')
                    .map((cite) => (
                      <option key={cite.id} value={cite.name}>
                        {cite.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Housing type filter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Type de chambre</label>
              <div className="relative">
                <Home className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white cursor-pointer"
                >
                  <option value="all">Tous les types de chambres</option>
                  <option value="individuelle">Chambre individuelle</option>
                  <option value="studio">Studio indépendant</option>
                  <option value="partagee">Chambre partagée (colocation)</option>
                </select>
              </div>
            </div>

            {/* Price slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-stone-700">Budget max / mois</label>
                <span className="text-xs font-mono font-bold text-emerald-800 tabular-nums">
                  {formatFG(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={400000}
                step={20000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg mt-2"
              />
            </div>
          </div>

          {/* Quick toggle available & reset */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-stone-700">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span>Afficher uniquement les chambres disponibles</span>
            </label>

            <button
              onClick={handleResetFilters}
              className="text-stone-500 hover:text-stone-900 font-medium cursor-pointer transition"
            >
              Réinitialiser les critères
            </button>
          </div>
        </div>

        {/* Amenity Quick Filters Bar (Interactive functional segment buttons) */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-stone-500 font-medium shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtre rapide :
          </span>
          <button
            onClick={() => setSelectedAmenity('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedAmenity === 'all'
                ? 'bg-stone-900 text-white font-medium shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            Tous les équipements
          </button>
          <button
            onClick={() => setSelectedAmenity('forage')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedAmenity === 'forage'
                ? 'bg-emerald-700 text-white font-medium shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            💧 Eau forage garantie
          </button>
          <button
            onClick={() => setSelectedAmenity('solaire')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedAmenity === 'solaire'
                ? 'bg-emerald-700 text-white font-medium shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            ☀️ Kit Solaire 24h
          </button>
          <button
            onClick={() => setSelectedAmenity('sanitaire_interne')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedAmenity === 'sanitaire_interne'
                ? 'bg-emerald-700 text-white font-medium shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            🚿 Douche interne
          </button>
        </div>

        {/* Result summary counter */}
        <div className="text-xs text-stone-500 flex items-center justify-between">
          <span>
            Affichage de <strong className="text-stone-800 font-semibold">{filteredRooms.length}</strong> logement{filteredRooms.length > 1 ? 's' : ''} sur un total de {rooms.length} à Hafia
          </span>
        </div>

        {/* Housing Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onSelectRoom={onSelectRoom}
                onBookRoom={onBookRoom}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center max-w-md mx-auto bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800">
              Aucun logement ne correspond exactement à vos critères
            </h3>
            <p className="text-xs text-stone-500 mt-1.5 mb-6">
              Essayez d'élargir votre budget maximal ou de sélectionner un quartier plus large autour du campus d'Hafia.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser tous les filtres
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
