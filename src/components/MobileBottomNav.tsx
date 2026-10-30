import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, BookmarkCheck, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface MobileBottomNavProps {
  reservationCount: number;
  onSwitchRole: (role: UserRole) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  reservationCount,
  onSwitchRole,
}) => {
  const location = useLocation();

  const isStudent = (location.pathname.startsWith('/etudiant') || location.pathname === '/' || location.pathname === '/accueil') && location.pathname !== '/etudiant/reservations';
  const isBookings = location.pathname === '/etudiant/reservations';
  const isLandlord = location.pathname.startsWith('/bailleur');
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-1">
        {/* Tab 1: Accueil -> / */}
        <Link
          to="/"
          onClick={() => onSwitchRole('student')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            isStudent ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Accueil"
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[9px] tracking-tight mt-1 font-medium">Accueil</span>
        </Link>

        {/* Tab 2: Mes Réservations -> /etudiant/reservations */}
        <Link
          to="/etudiant/reservations"
          onClick={() => onSwitchRole('student')}
          className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            isBookings ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Mes Réservations (/etudiant/reservations)"
        >
          <BookmarkCheck className="w-4 h-4" />
          <span className="text-[9px] tracking-tight mt-1 font-medium">Réservations</span>
          {reservationCount > 0 && (
            <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
              {reservationCount}
            </span>
          )}
        </Link>

        {/* Tab 3: Bailleur -> /bailleur */}
        <Link
          to="/bailleur"
          onClick={() => onSwitchRole('landlord')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            isLandlord ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Espace Bailleur (/bailleur)"
        >
          <Building2 className="w-4 h-4 text-amber-600" />
          <span className="text-[9px] tracking-tight mt-1 font-medium">Bailleur</span>
        </Link>

        {/* Tab 4: Admin -> /admin */}
        <Link
          to="/admin"
          onClick={() => onSwitchRole('admin')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            isAdmin ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Espace Administrateur (/admin)"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[9px] tracking-tight mt-1 font-medium">Admin</span>
        </Link>
      </div>
    </nav>
  );
};

