import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, BookmarkCheck } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onSwitchRole: (role: UserRole) => void;
  isMobileSimulator: boolean;
  setIsMobileSimulator: (val: boolean) => void;
  reservationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenProfile,
  onOpenAuth,
  onSwitchRole,
  isMobileSimulator,
  setIsMobileSimulator,
  reservationCount,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/' || location.pathname === '/accueil';
  const isStudent = location.pathname.startsWith('/etudiant') || isHome;
  const isBookings = location.pathname === '/etudiant/reservations';
  const isResidence = location.pathname.startsWith('/residence');
  const isLandlord = location.pathname.startsWith('/bailleur');
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">

      {/* Main Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-stone-900 leading-tight">
                Loge<span className="text-emerald-600">Student</span>
              </div>
              <div className="text-[11px] font-medium text-stone-500 tracking-wide">
                Hafia · Région de Labé (Guinée)
              </div>
            </div>
          </Link>

          {/* Zone 2: Navigation Links separated by URLs */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            <Link
              to="/"
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                isHome ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
              }`}
            >
              <span>Accueil</span>
            </Link>

            <Link
              to="/residence"
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                isResidence ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Résidence</span>
            </Link>

            <Link
              to="/etudiant/reservations"
              onClick={() => onSwitchRole('student')}
              className={`hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                isBookings ? 'text-emerald-700 border-emerald-600 font-semibold' : 'border-transparent'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span>Mes réservations</span>
              {reservationCount > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs px-1.5 py-0.2 rounded-full font-bold">
                  {reservationCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Zone 3: Primary Action / User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors whitespace-nowrap shrink-0"
              title="Gérer les informations personnelles"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-semibold text-stone-900 leading-none">{currentUser.name.split(' ')[0]}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">{currentUser.role}</div>
              </div>
            </button>

            <button
              onClick={onOpenAuth}
              className="px-3 py-2 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Connexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
