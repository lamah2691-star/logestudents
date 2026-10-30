import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Room, Reservation, UserProfile, RoomType } from '../types';
import { formatFG, formatDate } from '../utils/formatters';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Users,
  Layers,
  Phone,
  Check,
  X,
  Lock,
} from 'lucide-react';

interface AdminPortalProps {
  rooms: Room[];
  reservations: Reservation[];
  students: UserProfile[];
  onValidateReservation: (resId: string) => { success: boolean; message: string };
  onRejectReservation: (resId: string, reason?: string) => void;
  onAddRoom: (newRoom: Omit<Room, 'id' | 'createdAt'>) => void;
  onDeleteRoom: (roomId: string) => void;
  onUpdateRoomStatus: (roomId: string, status: 'disponible' | 'reserve' | 'occupe') => void;
  mode?: 'admin' | 'landlord';
  currentLandlord?: UserProfile;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  rooms,
  reservations,
  students,
  onValidateReservation,
  onRejectReservation,
  onAddRoom,
  onDeleteRoom,
  onUpdateRoomStatus,
  mode = 'admin',
  currentLandlord,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as 'reservations' | 'rooms' | 'add-room' | 'users' | null;
  const activeTab = urlTab && ['reservations', 'rooms', 'add-room', 'users'].includes(urlTab)
    ? urlTab
    : 'reservations';

  const setActiveTab = (tab: 'reservations' | 'rooms' | 'add-room' | 'users') => {
    setSearchParams({ tab });
  };

  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Room Form State (Cahier des charges: "Ajout de nouvelles chambres", "Les formulaires doivent être validés - champ obligatoire")
  const [newTitle, setNewTitle] = useState('');
  const [newCite, setNewCite] = useState('Cité Université Hafia');
  const [newAddress, setNewAddress] = useState('');
  const [newPrice, setNewPrice] = useState(180000);
  const [newDeposit, setNewDeposit] = useState(360000);
  const [newType, setNewType] = useState<RoomType>('individuelle');
  const [newCapacity, setNewCapacity] = useState(1);
  const [newDistanceMins, setNewDistanceMins] = useState(5);
  const [newDescription, setNewDescription] = useState('');
  const [newWater, setNewWater] = useState(true);
  const [newSolar, setNewSolar] = useState(true);
  const [newPrivateBath, setNewPrivateBath] = useState(false);
  const [newFurnished, setNewFurnished] = useState(true);
  const [newSecurity, setNewSecurity] = useState(true);
  const [newLandlordName, setNewLandlordName] = useState(mode === 'landlord' ? (currentLandlord?.name || 'Elhadj Mamadou Barry') : 'Elhadj Mamadou Barry');
  const [newLandlordPhone, setNewLandlordPhone] = useState(mode === 'landlord' ? (currentLandlord?.phone || '+224 622 45 12 89') : '+224 622 45 12 89');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Handlers for reservation validation
  const handleValidate = (resId: string) => {
    const res = onValidateReservation(resId);
    if (res.success) {
      setFeedbackMessage({ text: res.message, type: 'success' });
    } else {
      setFeedbackMessage({ text: res.message, type: 'error' });
    }
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleReject = (resId: string) => {
    onRejectReservation(resId, 'Logement non disponible ou profil incomplet');
    setFeedbackMessage({ text: 'Réservation rejetée avec succès. La chambre reste disponible.', type: 'success' });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!newTitle.trim()) errors.title = 'Le titre du logement est obligatoire';
    if (!newAddress.trim()) errors.address = 'L’adresse ou repère précis est obligatoire';
    if (newPrice <= 0) errors.price = 'Le prix mensuel doit être supérieur à 0';
    if (!newDescription.trim()) errors.description = 'La description est obligatoire';
    if (!newLandlordName.trim()) errors.landlordName = 'Le nom du bailleur est obligatoire';
    if (!newLandlordPhone.trim()) errors.landlordPhone = 'Le numéro de téléphone est obligatoire';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onAddRoom({
      title: newTitle,
      cite: newCite,
      addressDescription: newAddress,
      pricePerMonthFG: Number(newPrice),
      depositFG: Number(newDeposit),
      type: newType,
      capacity: Number(newCapacity),
      distanceToCampusMins: Number(newDistanceMins),
      status: 'disponible',
      images: [
        // default high quality interior photo
        rooms[0]?.images[0] || '',
      ],
      description: newDescription,
      amenities: {
        runningWater: newWater,
        solarPower: newSolar,
        privateBathroom: newPrivateBath,
        furnished: newFurnished,
        securityGuard: newSecurity,
        wifi: false,
      },
      landlord: {
        id: 'landlord-admin',
        name: newLandlordName,
        phone: newLandlordPhone,
        paymentMethods: ['Orange Money', 'Espèces'],
        verified: true,
      },
    });

    setFeedbackMessage({ text: 'Nouvelle chambre ajoutée avec succès au catalogue LogeStudent !', type: 'success' });
    setTimeout(() => setFeedbackMessage(null), 5000);
    setActiveTab('rooms');
    // reset
    setNewTitle('');
    setNewAddress('');
    setNewDescription('');
    setFormErrors({});
  };

  // Landlord vs Admin data scoping
  const landlordName = currentLandlord?.name || 'Elhadj Mamadou Barry';
  const isLandlordMode = mode === 'landlord';

  const portalRooms = isLandlordMode
    ? rooms.filter((r) => r.landlord.name === landlordName || r.landlord.id === 'landlord-1' || r.landlord.id === 'landlord-admin')
    : rooms;

  const portalReservations = isLandlordMode
    ? reservations.filter((res) => {
        const room = rooms.find((r) => r.id === res.roomId);
        return !room || room.landlord.name === landlordName || room.landlord.id === 'landlord-1' || room.landlord.id === 'landlord-admin';
      })
    : reservations;

  // Metrics
  const totalRooms = portalRooms.length;
  const availableRooms = portalRooms.filter((r) => r.status === 'disponible').length;
  const pendingReservations = portalReservations.filter((r) => r.status === 'en_attente').length;
  const approvedReservations = portalReservations.filter((r) => r.status === 'validee').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dynamic Title based on URL role */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          {isLandlordMode ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Espace Bailleur & Propriétaire (Hafia)</span>
                <span className="font-mono bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                  URL : /bailleur
                </span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                Gestion de vos logements et demandes de réservation
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Bailleur connecté : <strong className="text-stone-700">{landlordName}</strong> · Gestion directe des baux étudiants à Hafia.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Portail Administrateur & Modération LogeStudent</span>
                <span className="font-mono bg-stone-900 text-amber-300 text-[10px] px-2 py-0.5 rounded-md font-bold">
                  URL : /admin
                </span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                Supervision du parc et modération des réservations
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Conformité Cahier des charges : validation anti-double réservation, agrément des bailleurs et annuaire.
              </p>
            </div>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => setActiveTab('add-room')}
          className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isLandlordMode ? 'Publier une nouvelle chambre' : 'Ajouter une chambre au catalogue'}</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs font-medium border ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">
            {isLandlordMode ? 'Mes chambres' : 'Chambres répertoriées'}
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono mt-1 tabular-nums">{totalRooms}</div>
          <div className="text-[11px] text-stone-400 mt-1">
            {isLandlordMode ? 'Gérées sous votre profil' : 'Cités de Hafia & Labé'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">Disponibles immédiatement</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1 tabular-nums">{availableRooms}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Prêtes à être louées</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">Demandes en attente</div>
          <div className="text-2xl font-bold text-amber-600 font-mono mt-1 tabular-nums">{pendingReservations}</div>
          <div className="text-[11px] text-amber-600 mt-1">À traiter</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs text-stone-500 font-medium">Réservations confirmées</div>
          <div className="text-2xl font-bold text-stone-900 font-mono mt-1 tabular-nums">{approvedReservations}</div>
          <div className="text-[11px] text-stone-400 mt-1">Baux étudiants validés</div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 mb-6">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'reservations'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>{isLandlordMode ? 'Demandes des étudiants' : 'Gestion des réservations'}</span>
          {pendingReservations > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingReservations}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'rooms'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>{isLandlordMode ? `Mes chambres (${totalRooms})` : `Parc de logements (${rooms.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('add-room')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'add-room'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isLandlordMode ? 'Publier une chambre' : 'Ajouter une chambre'}</span>
        </button>

        {!isLandlordMode && (
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <span>Utilisateurs ({students.length})</span>
          </button>
        )}
      </div>


      {/* TAB 1: RESERVATIONS MANAGEMENT (Cahier des charges: "Validation ou rejet des réservations", "Empêcher la double réservation") */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-stone-900">Toutes les demandes de réservation reçues</span>
            <span className="text-stone-500">
              Règle : la validation verrouille instantanément le logement pour éviter toute double réservation.
            </span>
          </div>

          <div className="divide-y divide-stone-200">
            {portalReservations.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                Aucune demande de réservation à afficher pour le moment.
              </div>
            ) : (
              portalReservations.map((res) => {
              const targetRoom = rooms.find((r) => r.id === res.roomId);
              const isRoomOccupied = targetRoom?.status !== 'disponible';

              return (
                <div key={res.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {res.status === 'en_attente' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          En attente de validation
                        </span>
                      )}
                      {res.status === 'validee' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Validée & Confirmée
                        </span>
                      )}
                      {res.status === 'rejetee' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-800">
                          Rejetée
                        </span>
                      )}
                      {res.status === 'annulee' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          Annulée par l'étudiant
                        </span>
                      )}

                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-500 font-mono">Dossier #{res.id}</span>
                      <span className="text-xs text-stone-400">·</span>
                      <span className="text-xs text-stone-500">{formatDate(res.requestDate)}</span>
                    </div>

                    <div className="text-base font-bold text-stone-900">
                      {res.roomTitle}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs text-stone-600">
                      <div>
                        <span className="text-stone-400">Étudiant :</span>{' '}
                        <strong className="text-stone-900">{res.studentName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400">INE :</span>{' '}
                        <span className="font-mono font-medium text-stone-800">{res.studentIne}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">Filière :</span>{' '}
                        <span className="text-stone-800">{res.studentFaculty}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">Téléphone :</span>{' '}
                        <span className="font-mono text-stone-800 font-semibold">{res.studentPhone}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">Loyer mensuel :</span>{' '}
                        <span className="font-mono text-emerald-700 font-bold">{formatFG(res.priceFG)}</span>
                      </div>
                      <div>
                        <span className="text-stone-400">Arrivée :</span>{' '}
                        <span className="text-stone-800">{formatDate(res.moveInDate)} ({res.durationMonths} mois)</span>
                      </div>
                    </div>

                    {res.emergencyContact && (
                      <div className="text-[11px] text-stone-500 mt-1.5">
                        Contact urgence / tuteur : {res.emergencyContact}
                      </div>
                    )}

                    {/* Room current availability warning */}
                    {res.status === 'en_attente' && isRoomOccupied && (
                      <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 shrink-0" />
                        <span>Attention : cette chambre a déjà été validée pour un autre dossier ! La valider sera bloquée par l'anti-double réservation.</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {res.status === 'en_attente' && (
                      <>
                        <button
                          onClick={() => handleValidate(res.id)}
                          className="px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Valider la réservation</span>
                        </button>

                        <button
                          onClick={() => handleReject(res.id)}
                          className="px-3 py-2 text-xs font-semibold bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-700 rounded-xl transition flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Rejeter</span>
                        </button>
                      </>
                    )}

                    {res.status === 'validee' && (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Chambre réservée & attribuée</span>
                      </span>
                    )}

                    {res.status === 'rejetee' && (
                      <span className="text-xs text-stone-400">Dossier clôturé</span>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      )}

      {/* TAB 2: ROOMS LIST & MANAGEMENT (Cahier des charges: "Modifier ou supprimer des chambres") */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-stone-900">Catalogue des logements de Hafia ({rooms.length})</span>
            <span className="text-stone-500">Modifier le statut ou supprimer une chambre</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="p-3 font-semibold">Logement</th>
                  <th className="p-3 font-semibold">Cité</th>
                  <th className="p-3 font-semibold">Loyer / Caution</th>
                  <th className="p-3 font-semibold">Bailleur</th>
                  <th className="p-3 font-semibold">Statut actuel</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {portalRooms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-xs text-stone-500">
                      Aucun logement répertorié pour le moment.
                    </td>
                  </tr>
                ) : (
                  portalRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-stone-50">
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{room.title}</div>
                      <div className="text-[11px] text-stone-500 capitalize">{room.type} · {room.capacity} pers.</div>
                    </td>
                    <td className="p-3 text-stone-700">
                      <div>{room.cite}</div>
                      <div className="text-[11px] text-stone-400">{room.distanceToCampusMins} min campus</div>
                    </td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-stone-900">{formatFG(room.pricePerMonthFG)}</div>
                      <div className="text-[11px] text-stone-400 font-mono">Caution: {formatFG(room.depositFG)}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-stone-900 font-medium">{room.landlord.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{room.landlord.phone}</div>
                    </td>
                    <td className="p-3">
                      <select
                        value={room.status}
                        onChange={(e) =>
                          onUpdateRoomStatus(room.id, e.target.value as 'disponible' | 'reserve' | 'occupe')
                        }
                        className={`text-xs px-2 py-1 rounded-md font-semibold border ${
                          room.status === 'disponible'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="reserve">Réservé</option>
                        <option value="occupe">Occupé</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Confirmez-vous la suppression de ${room.title} ?`)) {
                            onDeleteRoom(room.id);
                            setFeedbackMessage({ text: 'Logement supprimé avec succès.', type: 'success' });
                            setTimeout(() => setFeedbackMessage(null), 4000);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer la chambre"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW ROOM (Cahier des charges: "Ajout de nouvelles chambres") */}
      {activeTab === 'add-room' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
          <div className="mb-6 pb-4 border-b border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">
              Ajout d'une nouvelle chambre pour les étudiants de Hafia
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Tous les champs marqués d’un astérisque (*) sont obligatoires selon le cahier des charges.
            </p>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Titre du logement <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Chambre meublée avec bureau - Cité Centrale"
                className={`w-full px-3 py-2 rounded-xl border ${
                  formErrors.title ? 'border-red-500 bg-red-50/50' : 'border-stone-200 bg-stone-50'
                } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
              />
              {formErrors.title && <p className="text-[11px] text-red-600 mt-1">{formErrors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Cité / Quartier <span className="text-red-500">*</span>
                </label>
                <select
                  value={newCite}
                  onChange={(e) => setNewCite(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                >
                  <option value="Cité Université Hafia">Cité Université Hafia</option>
                  <option value="Hafia Centre">Hafia Centre</option>
                  <option value="Axe Popodara - Hafia">Axe Popodara - Hafia</option>
                  <option value="Cité Safatou">Cité Safatou</option>
                  <option value="Quartier Ley-Saré">Quartier Ley-Saré</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Type de logement <span className="text-red-500">*</span>
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as RoomType)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                >
                  <option value="individuelle">Chambre individuelle</option>
                  <option value="partagee">Chambre partagée (colocation)</option>
                  <option value="studio">Studio autonome</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Adresse précise ou repère <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Ex: À 200m de l'amphi 2, face à la boutique Barry"
                className={`w-full px-3 py-2 rounded-xl border ${
                  formErrors.address ? 'border-red-500 bg-red-50/50' : 'border-stone-200 bg-stone-50'
                } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
              />
              {formErrors.address && <p className="text-[11px] text-red-600 mt-1">{formErrors.address}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Loyer / mois (FG) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="10000"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Caution (FG) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="10000"
                  value={newDeposit}
                  onChange={(e) => setNewDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Temps marche campus (min)
                </label>
                <input
                  type="number"
                  value={newDistanceMins}
                  onChange={(e) => setNewDistanceMins(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Description détaillée <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Décrivez l'éclairage, la sécurité, l'aération, le voisinage..."
                className={`w-full px-3 py-2 rounded-xl border ${
                  formErrors.description ? 'border-red-500 bg-red-50/50' : 'border-stone-200 bg-stone-50'
                } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
              />
              {formErrors.description && <p className="text-[11px] text-red-600 mt-1">{formErrors.description}</p>}
            </div>

            {/* Amenities toggles */}
            <div>
              <label className="block font-semibold text-stone-700 mb-2">
                Commodités disponibles
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <input
                    type="checkbox"
                    checked={newWater}
                    onChange={(e) => setNewWater(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Eau forage courante</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <input
                    type="checkbox"
                    checked={newSolar}
                    onChange={(e) => setNewSolar(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Courant solaire permanent</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <input
                    type="checkbox"
                    checked={newPrivateBath}
                    onChange={(e) => setNewPrivateBath(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Douche interne</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <input
                    type="checkbox"
                    checked={newFurnished}
                    onChange={(e) => setNewFurnished(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Meublé (lit, bureau)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <input
                    type="checkbox"
                    checked={newSecurity}
                    onChange={(e) => setNewSecurity(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Clôture gardée</span>
                </label>
              </div>
            </div>

            {/* Landlord contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-stone-200">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nom du bailleur / propriétaire <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newLandlordName}
                  onChange={(e) => setNewLandlordName(e.target.value)}
                  placeholder="Ex: Elhadj Mamadou Barry"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Téléphone (Orange Money / MTN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newLandlordPhone}
                  onChange={(e) => setNewLandlordPhone(e.target.value)}
                  placeholder="+224 6XX XX XX XX"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
              >
                Enregistrer et publier le logement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: USERS DIRECTORY (Cahier des charges: "Gestion des utilisateurs") */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
            <span className="font-bold text-stone-900">Étudiants et Utilisateurs enregistrés à Hafia</span>
            <span className="text-stone-500">Protection des données personnelles (JWT / MySQL architecture)</span>
          </div>

          <div className="divide-y divide-stone-200 text-xs">
            {students.map((st) => (
              <div key={st.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">{st.name}</div>
                    <div className="text-stone-500">{st.university} · {st.faculty}</div>
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                      INE : {st.matriculeIne} · Tél : {st.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                    Étudiant vérifié
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
