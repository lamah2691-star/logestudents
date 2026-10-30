import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Sparkles, MapPin } from 'lucide-react';

interface HomeHeroProps {
  totalRoomsCount: number;
  availableCount: number;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ totalRoomsCount, availableCount }) => {
  return (
    <div className="relative bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 border-b border-slate-200 overflow-hidden">
      {/* Subtle topographic decorative pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16 relative">
        <div className="max-w-3xl">
          {/* Unboxed natural editorial subtitle without pill badge */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide mb-3 flex-wrap">
            <span>Projet LogeStudent</span>
            <span aria-hidden="true">·</span>
            <span>Centre Universitaire de Hafia (Labé)</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">République de Guinée</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
            Trouvez votre chambre étudiante <span className="text-emerald-700">fiable &amp; sécurisée</span> à Hafia.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl text-pretty">
            Fini les arnaques de faux démarcheurs et le stress du bouche-à-oreille lors de votre arrivée à Labé. 
            Consultez des concessions vérifiées à proximité du campus, comparez les prix en Francs Guinéens (FG) 
            et réservez en toute tranquillité.
          </p>
        </div>

        {/* Action Buttons to explore residences */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/residence"
            className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Explorer toutes les résidences</span>
            <span className="bg-emerald-700/60 text-emerald-100 text-xs px-2 py-0.5 rounded-full font-mono font-semibold">
              {totalRoomsCount} chambres
            </span>
          </Link>

          <Link
            to="/residence"
            className="px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Voir les chambres disponibles</span>
            <span className="text-emerald-700 font-bold">({availableCount})</span>
          </Link>
        </div>

        {/* Adjacency Proof Strip (Quantified & Trust markers) */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 text-xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Concessions vérifiées</p>
              <p className="text-slate-500">Bailleurs identifiés sur place à Hafia</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Anti-double réservation</p>
              <p className="text-slate-500">Chambre verrouillée dès validation</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">3 à 12 min du campus</p>
              <p className="text-slate-500">Accès direct aux amphis à pied</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">0 FG commission cachée</p>
              <p className="text-slate-500">Tarifs réels fixés par les bailleurs</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
