import React, { useState } from 'react';
import { MapPin, Droplets, Sun, Bath, Users, Clock, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { Room } from '../types';
import { formatFG } from '../utils/formatters';

interface RoomCardProps {
  room: Room;
  onSelectRoom: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelectRoom, onBookRoom }) => {
  const [imageError, setImageError] = useState(false);
  const isAvailable = room.status === 'disponible';

  return (
    <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
      {/* Visual Asset Container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onSelectRoom(room)}>
        {!imageError && room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-100/60 to-stone-100 p-4 text-center">
            <span className="text-emerald-700 font-bold text-base">{room.title}</span>
            <span className="text-xs text-stone-500 mt-1">{room.cite} · Labé Hafia</span>
          </div>
        )}

        {/* Clean Status Overlay */}
        <div className="absolute top-3 left-3">
          <div
            className={`text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm ${
              isAvailable
                ? 'bg-emerald-600/90 text-white'
                : 'bg-stone-900/90 text-amber-300'
            }`}
          >
            {isAvailable ? 'Disponible immédiatement' : 'Réservé / Non disponible'}
          </div>
        </div>

        {/* Distance Indicator */}
        <div className="absolute bottom-3 left-3 bg-stone-900/85 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{room.distanceToCampusMins} min à pied du campus</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Anti-AI Slop Rule) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 flex-wrap">
            <span className="font-medium text-stone-700">{room.cite}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-emerald-800">
              {room.type === 'studio'
                ? 'Studio autonome (sanitaires & cuisine privés)'
                : room.type === 'individuelle'
                ? 'Chambre simple'
                : 'Chambre partagée'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{room.capacity} pers.</span>
          </div>

          <h3
            onClick={() => onSelectRoom(room)}
            className="text-base font-bold text-stone-900 line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors leading-snug"
          >
            {room.title}
          </h3>

          <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Key Amenities - Clean unboxed presentation */}
          <div className="mt-3.5 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <Droplets className={`w-3.5 h-3.5 ${room.amenities.runningWater ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span className={room.amenities.runningWater ? 'text-stone-800' : 'text-stone-400'}>
                {room.amenities.runningWater ? 'Eau forage / courante' : 'Puits traditionnel'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Sun className={`w-3.5 h-3.5 ${room.amenities.solarPower ? 'text-amber-600' : 'text-stone-300'}`} />
              <span className={room.amenities.solarPower ? 'text-stone-800' : 'text-stone-400'}>
                {room.amenities.solarPower ? 'Courant solaire / EDG' : 'Réseau EDG seul'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Bath className={`w-3.5 h-3.5 ${room.amenities.privateBathroom ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span className="text-stone-800">
                {room.amenities.privateBathroom ? 'Douche interne' : 'Douche commune'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck className={`w-3.5 h-3.5 ${room.amenities.securityGuard ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span className="text-stone-800">
                {room.amenities.securityGuard ? 'Concession gardée' : 'Clôture fermée'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA Controls */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-400">Loyer mensuel</div>
            <div className="text-base font-extrabold text-stone-900 font-mono tabular-nums leading-tight">
              {formatFG(room.pricePerMonthFG)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectRoom(room)}
              className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Détails
            </button>

            <button
              onClick={() => onBookRoom(room)}
              disabled={!isAvailable}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
                isAvailable
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isAvailable ? 'Réserver' : 'Complet'}</span>
              {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
