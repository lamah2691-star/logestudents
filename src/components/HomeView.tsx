import React from 'react';
import { Link } from 'react-router-dom';
import { HomeHero } from './HomeHero';
import { RoomCard } from './RoomCard';
import { Room } from '../types';
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Droplets, 
  Sparkles,
  LogIn
} from 'lucide-react';

interface HomeViewProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
  onOpenAuth: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  rooms,
  onSelectRoom,
  onBookRoom,
  onOpenAuth,
}) => {
  // Take top 3 featured housings for the home preview
  const featuredRooms = rooms.slice(0, 3);
  const totalRoomsCount = rooms.length;
  const availableRoomsCount = rooms.filter((r) => r.status === 'disponible').length;

  return (
    <div>
      {/* 1. Hero Section */}
      <HomeHero totalRoomsCount={totalRoomsCount} availableCount={availableRoomsCount} />

      {/* 2. Featured Residences Section */}
      <section className="py-12 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Sélection de logements</span>
                <span aria-hidden="true">·</span>
                <span>Hafia (Labé)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Résidences d'étudiants à la une
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Découvrez un aperçu des chambres les plus proches des amphithéâtres du Centre Universitaire.
              </p>
            </div>

            <Link
              to="/residence"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs cursor-pointer active:scale-95"
            >
              <span>Voir toutes les résidences ({totalRoomsCount} chambres)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Featured Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onSelectRoom={onSelectRoom}
                onBookRoom={onBookRoom}
              />
            ))}
          </div>

          {/* Secondary CTA to view all rooms */}
          <div className="mt-10 text-center">
            <Link
              to="/residence"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Accéder à toutes les chambres disponibles ({availableRoomsCount} chambres prêtes à louer)</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. Platform Value Proposition */}
      <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Pourquoi utiliser LogeStudent pour votre installation à Hafia ?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Conçu pour répondre aux difficultés concrètes des étudiants nouvellement orientés dans la région de Labé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Garantie Anti-Double Réservation
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Une fois votre demande validée par le bailleur, la chambre est automatiquement verrouillée sur la plateforme. Fini le risque d'arriver à Labé et de trouver sa chambre occupée.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Commodités indispensables vérifiées
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Chaque concession est auditée pour garantir l'accès à l'eau potable (forage ou puits aménagé), à un éclairage solaire 24h pour les révisions, et à des sanitaires décents.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Prix réels en Francs Guinéens (FG)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tarifs directs fixés par les propriétaires, sans surcoût de faux démarcheurs. Le montant de la caution et du premier mois de loyer est clair dès le départ.
              </p>
            </div>
          </div>

          {/* Quick Call to action */}
          <div className="mt-12 bg-gradient-to-r from-emerald-800 to-stone-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">
                Besoin d'un logement pour la rentrée universitaire ?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                Consultez toutes les résidences ou connectez-vous pour finaliser votre demande.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/residence"
                className="px-5 py-2.5 text-xs font-bold text-stone-900 bg-white hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              >
                Toutes les résidences
              </Link>
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connexion</span>
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
