import React, { useState } from 'react';
import { X, MapPin, Clock, Droplets, Sun, Bath, Users, ShieldCheck, Phone, CheckCircle, AlertTriangle, ArrowRight, Share2, Check, MessageCircle, Copy } from 'lucide-react';
import { Room } from '../types';
import { formatFG } from '../utils/formatters';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onBook: (room: Room) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose, onBook }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!room) return null;

  const isAvailable = room.status === 'disponible';

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(room.landlord.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-stone-950 flex items-center justify-center shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Section */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-stone-900">
          <img
            src={room.images[selectedImageIndex] || room.images[0]}
            alt={room.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Cité & Status Badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="bg-stone-900/85 backdrop-blur-md text-white text-xs px-3 py-1 rounded-md font-medium">
              {room.cite} · Labé Hafia
            </span>
            <span
              className={`text-xs px-3 py-1 rounded-md font-semibold backdrop-blur-md ${
                isAvailable ? 'bg-emerald-600/90 text-white' : 'bg-amber-600/90 text-white'
              }`}
            >
              {isAvailable ? 'Disponible' : 'Réservée / Occupée'}
            </span>
          </div>

          {/* Photo Switcher if multiple */}
          {room.images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-stone-900/60 backdrop-blur-md p-1 rounded-lg">
              {room.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    selectedImageIndex === idx ? 'bg-white w-5' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                Logement Étudiant Certifié Hafia
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                {room.title}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{room.addressDescription}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-stone-800">{room.distanceToCampusMins} min à pied du campus</span>
              </div>
            </div>

            <div className="sm:text-right shrink-0 bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <div className="text-xs text-stone-500">Loyer mensuel</div>
              <div className="text-2xl font-extrabold text-stone-900 font-mono tabular-nums">
                {formatFG(room.pricePerMonthFG)}
              </div>
              <div className="text-[11px] text-stone-500">
                Caution remboursable : <span className="font-mono font-medium">{formatFG(room.depositFG)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 mb-2">Description du logement</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Commodités / Équipements */}
          <div className="py-6 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 mb-3">Commodités et services inclus</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-800">
                <Droplets className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{room.amenities.runningWater ? 'Eau forage permanente' : 'Puits traditionnel'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-800">
                <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{room.amenities.solarPower ? 'Solaire + Réseau EDG' : 'Réseau EDG'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-800">
                <Bath className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{room.amenities.privateBathroom ? 'Douche et WC internes' : 'Sanitaires partagés'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-800">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Capacité : {room.capacity} place{room.capacity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{room.amenities.securityGuard ? 'Concession surveillée' : 'Clôture sécurisée'}</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{room.amenities.furnished ? 'Lit & table fournis' : 'Non meublé'}</span>
              </div>
            </div>
          </div>

          {/* Propriétaire / Bailleur */}
          <div className="py-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-base">
                {room.landlord.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-900 text-sm">{room.landlord.name}</span>
                  {room.landlord.verified && (
                    <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                      Vérifié
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Bailleur référencé · Cité {room.cite}
                </div>
                <div className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
                  <span className="font-semibold">Moyens acceptés:</span>
                  <span>{room.landlord.paymentMethods.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://wa.me/${room.landlord.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${room.landlord.name}, je vous contacte depuis LogeStudent Hafia concernant votre logement "${room.title}". Est-il toujours disponible ?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
                title="Discuter directement sur WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${room.landlord.phone.replace(/\s+/g, '')}`}
                className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition flex items-center gap-1.5 active:scale-95"
                title={`Appeler ${room.landlord.name}`}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Appeler</span>
              </a>

              <button
                onClick={handleCopyPhone}
                className="px-2.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition flex items-center gap-1"
                title="Copier le numéro"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPhone ? 'Copié !' : room.landlord.phone}</span>
              </button>
            </div>
          </div>

          {/* Protection Anti-Arnaque Guarantee */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Garantie Sécurité LogeStudent Labé/Hafia</div>
              <p className="mt-0.5 leading-relaxed text-amber-800">
                Ne versez jamais d’argent à un démarcheur non agréé dans la rue. Passez votre réservation officielle ici : la chambre vous est réservée et le contrat est validé par le propriétaire et la coordination étudiante.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-xl transition"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              onClose();
              onBook(room);
            }}
            disabled={!isAvailable}
            className={`px-6 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-sm ${
              isAvailable
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Demander la réservation' : 'Chambre déjà réservée'}</span>
            {isAvailable && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
