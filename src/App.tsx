import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Room, Reservation, UserProfile, UserRole } from './types';
import {
  INITIAL_ROOMS,
  CITES_HAFIA,
  INITIAL_STUDENTS,
  INITIAL_RESERVATIONS,
  ADMIN_USER,
  LANDLORD_USER,
} from './data/initialData';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ResidenceView } from './components/ResidenceView';
import { HeroSearch } from './components/HeroSearch';
import { RoomCard } from './components/RoomCard';
import { RoomDetailModal } from './components/RoomDetailModal';
import { BookingModal } from './components/BookingModal';
import { StudentBookingsView } from './components/StudentBookingsView';
import { AdminPortal } from './components/AdminPortal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Smartphone, Monitor, CheckCircle } from 'lucide-react';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Persistence state with robust try/catch
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('logestudent_rooms_v2');
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('logestudent_reservations');
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [students, setStudents] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('logestudent_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Current logged in user (defaults to student Sény Solange Lamah)
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_STUDENTS[0]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCite, setSelectedCite] = useState('all');
  const [maxPrice, setMaxPrice] = useState(400000);
  const [selectedType, setSelectedType] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Modals & Drawers
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);

  // Notification Banner
  const [notification, setNotification] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('logestudent_rooms_v2', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('logestudent_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('logestudent_students', JSON.stringify(students));
  }, [students]);

  // Filtered rooms logic
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Text match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = room.title.toLowerCase().includes(query);
        const matchesCite = room.cite.toLowerCase().includes(query);
        const matchesDesc = room.description.toLowerCase().includes(query);
        const matchesAddress = room.addressDescription.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCite && !matchesDesc && !matchesAddress) return false;
      }

      // Cité match
      if (selectedCite !== 'all' && room.cite !== selectedCite) {
        return false;
      }

      // Type match
      if (selectedType !== 'all' && room.type !== selectedType) {
        return false;
      }

      // Max price match
      if (room.pricePerMonthFG > maxPrice) {
        return false;
      }

      // Availability match
      if (onlyAvailable && room.status !== 'disponible') {
        return false;
      }

      return true;
    });
  }, [rooms, searchQuery, selectedCite, selectedType, maxPrice, onlyAvailable]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCite('all');
    setSelectedType('all');
    setMaxPrice(400000);
    setOnlyAvailable(false);
  };

  // Synchronize currentUser role with URL path automatically (e.g. direct access or refresh on /bailleur, /admin, /etudiant)
  useEffect(() => {
    if (location.pathname.startsWith('/bailleur') && currentUser.role !== 'landlord') {
      setCurrentUser(LANDLORD_USER);
    } else if (location.pathname.startsWith('/admin') && currentUser.role !== 'admin') {
      setCurrentUser(ADMIN_USER);
    } else if ((location.pathname.startsWith('/etudiant') || location.pathname.startsWith('/residence') || location.pathname === '/' || location.pathname === '/accueil') && currentUser.role !== 'student') {
      setCurrentUser(students[0] || INITIAL_STUDENTS[0]);
    }
  }, [location.pathname, currentUser.role, students]);

  // Role Switcher
  const handleSwitchRole = (role: UserRole) => {
    if (role === 'student') {
      setCurrentUser(students[0] || INITIAL_STUDENTS[0]);
    } else if (role === 'landlord') {
      setCurrentUser(LANDLORD_USER);
    } else if (role === 'admin') {
      setCurrentUser(ADMIN_USER);
    }
    showNotification(`Connecté avec succès en tant que ${role === 'student' ? 'Étudiante' : role === 'admin' ? 'Administrateur' : 'Bailleur'}`);
  };

  // Show temporary toast notification
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Student: Create reservation
  const handleSubmitBooking = (newResData: Omit<Reservation, 'id' | 'requestDate' | 'status'>) => {
    // Check double booking safeguard
    const targetRoom = rooms.find((r) => r.id === newResData.roomId);
    if (!targetRoom || targetRoom.status !== 'disponible') {
      alert('Erreur: Ce logement est déjà réservé ou occupé (Règle Anti-Double Réservation).');
      return;
    }

    const newReservation: Reservation = {
      ...newResData,
      id: `res-${Date.now().toString().slice(-4)}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'en_attente',
    };

    setReservations((prev) => [newReservation, ...prev]);
    showNotification(`Demande de réservation enregistrée pour ${newReservation.roomTitle} ! Suivez l’état d’avancement dans « Mes réservations » (/etudiant/reservations).`);
    navigate('/etudiant/reservations');
  };

  // Student: Cancel reservation
  const handleCancelReservation = (resId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: 'annulee' as const } : r))
    );
    showNotification('Demande de réservation annulée avec succès.');
  };

  // Admin/Landlord: Validate Reservation (With strict Double-Booking Prevention)
  const handleValidateReservation = (resId: string): { success: boolean; message: string } => {
    const targetReservation = reservations.find((r) => r.id === resId);
    if (!targetReservation) {
      return { success: false, message: 'Réservation introuvable.' };
    }

    const targetRoom = rooms.find((r) => r.id === targetReservation.roomId);
    if (!targetRoom) {
      return { success: false, message: 'Logement introuvable.' };
    }

    // CHECK DOUBLE-BOOKING SAFEGUARD:
    if (targetRoom.status !== 'disponible') {
      return {
        success: false,
        message: `ALERTE DOUBLE RÉSERVATION : Cette chambre (${targetRoom.title}) est déjà marquée comme ${targetRoom.status}. Le système bloque la validation pour respecter le cahier des charges !`,
      };
    }

    // Mark room as reserved
    setRooms((prev) =>
      prev.map((r) => (r.id === targetRoom.id ? { ...r, status: 'reserve' as const } : r))
    );

    // Mark this reservation as validated
    setReservations((prev) =>
      prev.map((r) =>
        r.id === resId
          ? {
              ...r,
              status: 'validee' as const,
              adminNote: `Validée officiellement par la modération le ${new Date().toLocaleDateString('fr-FR')}.`,
            }
          : r
      )
    );

    return {
      success: true,
      message: `Réservation validée avec succès ! La chambre est maintenant verrouillée au nom de ${targetReservation.studentName}.`,
    };
  };

  // Admin/Landlord: Reject Reservation
  const handleRejectReservation = (resId: string, reason?: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === resId
          ? {
              ...r,
              status: 'rejetee' as const,
              adminNote: reason || 'Non retenue pour cette session.',
            }
          : r
      )
    );
  };

  // Admin: Add Room
  const handleAddRoom = (newRoomData: Omit<Room, 'id' | 'createdAt'>) => {
    const newRoom: Room = {
      ...newRoomData,
      id: `room-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRooms((prev) => [newRoom, ...prev]);
  };

  // Admin: Delete Room
  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  // Admin: Update Room Status
  const handleUpdateRoomStatus = (roomId: string, status: 'disponible' | 'reserve' | 'occupe') => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status } : r)));
  };

  // Profile update
  const handleSaveProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showNotification('Informations personnelles mises à jour.');
  };

  // Calculate student reservation badge count
  const myReservationsCount = reservations.filter(
    (r) => r.studentId === currentUser.id && r.status === 'en_attente'
  ).length;

  // View room detail from bookings
  const handleViewRoomDetails = (roomId: string) => {
    const found = rooms.find((r) => r.id === roomId);
    if (found) setSelectedRoomForDetail(found);
  };

  // Content Renderer with separated URLs for Étudiant, Bailleur, Admin, and Vision
  const renderMainContent = () => (
    <Routes>
      {/* URL Page d'Accueil : / ou /accueil */}
      <Route
        path="/"
        element={
          <HomeView
            rooms={rooms}
            onSelectRoom={(r) => setSelectedRoomForDetail(r)}
            onBookRoom={(r) => setSelectedRoomForBooking(r)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        }
      />
      <Route
        path="/accueil"
        element={
          <HomeView
            rooms={rooms}
            onSelectRoom={(r) => setSelectedRoomForDetail(r)}
            onBookRoom={(r) => setSelectedRoomForBooking(r)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        }
      />

      {/* URL Espace Étudiant : /etudiant */}
      <Route
        path="/etudiant"
        element={<Navigate to="/" replace />}
      />

      {/* URL Résidences : /residence */}
      <Route
        path="/residence"
        element={
          <ResidenceView
            rooms={rooms}
            cites={CITES_HAFIA}
            onSelectRoom={(r) => setSelectedRoomForDetail(r)}
            onBookRoom={(r) => setSelectedRoomForBooking(r)}
          />
        }
      />

      {/* URL Espace Étudiant - Mes Réservations : /etudiant/reservations */}
      <Route
        path="/etudiant/reservations"
        element={
          <StudentBookingsView
            reservations={reservations}
            rooms={rooms}
            currentStudentId={currentUser.id}
            onCancelReservation={handleCancelReservation}
            onViewRoomDetails={handleViewRoomDetails}
          />
        }
      />

      {/* URL Espace Bailleur : /bailleur */}
      <Route
        path="/bailleur/*"
        element={
          <AdminPortal
            rooms={rooms}
            reservations={reservations}
            students={students}
            onValidateReservation={handleValidateReservation}
            onRejectReservation={handleRejectReservation}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
            onUpdateRoomStatus={handleUpdateRoomStatus}
            mode="landlord"
            currentLandlord={currentUser}
          />
        }
      />

      {/* URL Espace Administrateur : /admin */}
      <Route
        path="/admin/*"
        element={
          <AdminPortal
            rooms={rooms}
            reservations={reservations}
            students={students}
            onValidateReservation={handleValidateReservation}
            onRejectReservation={handleRejectReservation}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
            onUpdateRoomStatus={handleUpdateRoomStatus}
            mode="admin"
          />
        }
      />



      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/etudiant" replace />} />
    </Routes>
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md bg-stone-900 text-white p-4 rounded-2xl shadow-xl border border-stone-800 flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1 font-medium">{notification}</div>
          <button
            onClick={() => setNotification(null)}
            className="text-stone-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Application Container or Mobile Simulator Frame */}
      {isMobileSimulator ? (
        <div className="flex-1 bg-stone-800 py-6 px-3 flex flex-col items-center justify-center">
          <div className="mb-4 flex items-center justify-between gap-4 text-xs text-white max-w-sm w-full">
            <span className="font-semibold flex items-center gap-1.5 text-amber-300">
              <Smartphone className="w-4 h-4" />
              <span>Simulateur Smartphone (Mobile-First)</span>
            </span>
            <button
              onClick={() => setIsMobileSimulator(false)}
              className="text-stone-300 hover:text-white flex items-center gap-1 font-medium underline"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Mode Bureau 1440px</span>
            </button>
          </div>

          {/* Smartphone Frame */}
          <div className="w-full max-w-[400px] h-[840px] bg-white rounded-[44px] shadow-2xl overflow-hidden border-[10px] border-stone-900 flex flex-col relative">
            {/* Phone Speaker & Camera Notch */}
            <div className="h-6 bg-stone-900 w-36 mx-auto rounded-b-xl flex items-center justify-center z-50">
              <div className="w-10 h-1 bg-stone-700 rounded-full"></div>
            </div>

            {/* Scrollable Mobile Screen Content */}
            <div className="flex-1 overflow-y-auto pb-20 relative">
              <Header
                currentUser={currentUser}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
                onSwitchRole={handleSwitchRole}
                isMobileSimulator={isMobileSimulator}
                setIsMobileSimulator={setIsMobileSimulator}
                reservationCount={myReservationsCount}
              />
              {renderMainContent()}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <MobileBottomNav
              reservationCount={myReservationsCount}
              onSwitchRole={handleSwitchRole}
            />
          </div>
        </div>
      ) : (
        /* Full Desktop & Responsive Layout */
        <div className="flex-1 flex flex-col pb-16 lg:pb-0">
          <Header
            currentUser={currentUser}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onSwitchRole={handleSwitchRole}
            isMobileSimulator={isMobileSimulator}
            setIsMobileSimulator={setIsMobileSimulator}
            reservationCount={myReservationsCount}
          />

          <div className="flex-1">
            {renderMainContent()}
          </div>

          {/* Mobile Bottom Navigation on small screen */}
          <MobileBottomNav
            reservationCount={myReservationsCount}
            onSwitchRole={handleSwitchRole}
          />


          {/* Clean Editorial Footer */}
          <footer className="mt-auto bg-emerald-600 text-emerald-100 text-xs border-t border-emerald-700 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="text-white font-bold text-base mb-2">LogeStudent Hafia</div>
                  <p className="text-emerald-100 text-xs leading-relaxed">
                    Plateforme officielle de recherche et de réservation de logements étudiants pour la région de Labé (Guinée).
                  </p>
                </div>

                <div>
                  <div className="text-white font-bold mb-2">Cités Universitaires</div>
                  <ul className="space-y-1.5 text-emerald-100 text-xs">
                    <li>Cité Université Hafia</li>
                    <li>Hafia Centre</li>
                    <li>Axe Popodara - Hafia</li>
                    <li>Cité Safatou</li>
                  </ul>
                </div>

                <div>
                  <div className="text-white font-bold mb-2">Engagements Sécurité</div>
                  <ul className="space-y-1.5 text-emerald-100 text-xs">
                    <li>Zéro démarcheur pirate</li>
                    <li>Garantie anti-double réservation</li>
                    <li>Paiements directs Orange / MTN</li>
                    <li>Contrats certifiés conformes</li>
                  </ul>
                </div>

                <div>
                  <div className="text-white font-bold mb-2">Spécifications Projet</div>
                  <p className="text-emerald-100 text-xs leading-relaxed">
                    Projet : LogeStudent · Conçu selon le cahier des charges officiel de Sény Solange Lamah.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-emerald-500 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-100">
                <div>
                  © {new Date().getFullYear()} LogeStudent Guinée · Centre Universitaire de Hafia (Labé). Tous droits réservés.
                </div>
                <div className="flex items-center gap-4">
                  <span>Mentions légales</span>
                  <span>·</span>
                  <span>Protection des données personnelles</span>
                  <span>·</span>
                  <span>Tarifs réglementés</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Modals */}
      <RoomDetailModal
        room={selectedRoomForDetail}
        onClose={() => setSelectedRoomForDetail(null)}
        onBook={(room) => {
          setSelectedRoomForDetail(null);
          setSelectedRoomForBooking(room);
        }}
      />

      <BookingModal
        room={selectedRoomForBooking}
        currentUser={currentUser}
        existingReservations={reservations}
        onClose={() => setSelectedRoomForBooking(null)}
        onSubmitBooking={handleSubmitBooking}
      />

      <UserProfileModal
        user={currentUser}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={handleSaveProfile}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginAs={handleSwitchRole}
        currentUser={currentUser}
      />


    </div>
  );
}
