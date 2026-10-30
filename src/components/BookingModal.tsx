import React, { useState } from 'react';
import { X, Calendar, User, Phone, BookOpen, AlertCircle, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';
import { Room, Reservation, UserProfile } from '../types';
import { formatFG } from '../utils/formatters';

interface BookingModalProps {
  room: Room | null;
  currentUser: UserProfile;
  existingReservations: Reservation[];
  onClose: () => void;
  onSubmitBooking: (reservation: Omit<Reservation, 'id' | 'requestDate' | 'status'>) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  currentUser,
  existingReservations,
  onClose,
  onSubmitBooking,
}) => {
  if (!room) return null;

  // Form State initialized with logged-in user details
  const [studentName, setStudentName] = useState(currentUser.name || '');
  const [studentPhone, setStudentPhone] = useState(currentUser.phone || '');
  const [studentEmail, setStudentEmail] = useState(currentUser.email || '');
  const [studentIne, setStudentIne] = useState(currentUser.matriculeIne || 'INE-2026-HAF-9842');
  const [studentFaculty, setStudentFaculty] = useState(currentUser.faculty || 'Génie Informatique & Télécoms');
  const [moveInDate, setMoveInDate] = useState('2026-11-01');
  const [durationMonths, setDurationMonths] = useState(10);
  const [emergencyContact, setEmergencyContact] = useState('+224 622 99 00 11 (Tuteur)');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check double booking safeguard (Exigence fonctionnelle: "Le système doit empêcher la double réservation d'une même chambre")
  const isAlreadyBooked = room.status !== 'disponible';
  const hasPendingForThisRoom = existingReservations.some(
    (res) => res.roomId === room.id && res.studentId === currentUser.id && (res.status === 'en_attente' || res.status === 'validee')
  );

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!studentName.trim()) errors.studentName = 'Le nom complet est obligatoire';
    if (!studentPhone.trim()) errors.studentPhone = 'Le numéro de téléphone est obligatoire';
    if (!studentIne.trim()) errors.studentIne = 'Le matricule INE est obligatoire (orienté Hafia)';
    if (!studentFaculty.trim()) errors.studentFaculty = 'La filière / faculté est obligatoire';
    if (!moveInDate) errors.moveInDate = 'La date d’emménagement est obligatoire';
    if (!termsAccepted) errors.terms = 'Veuillez accepter les conditions de réservation';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitBooking({
        roomId: room.id,
        roomTitle: room.title,
        cite: room.cite,
        priceFG: room.pricePerMonthFG,
        studentId: currentUser.id,
        studentName,
        studentPhone,
        studentEmail,
        studentIne,
        studentFaculty,
        moveInDate,
        durationMonths,
        emergencyContact,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto border border-stone-200">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Demande de réservation sécurisée
            </span>
            <h2 className="text-lg font-bold text-stone-900 mt-0.5">
              {room.title}
            </h2>
            <div className="text-xs text-stone-500 mt-0.5">
              {room.cite} · Loyer : <strong className="text-stone-900 font-mono">{formatFG(room.pricePerMonthFG)}</strong> / mois
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-stone-500 hover:text-stone-900 flex items-center justify-center shadow-sm border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Double-booking alert check */}
        {isAlreadyBooked ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Chambre non disponible</h3>
            <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
              Conformément à la règle de sécurité anti-double réservation du cahier des charges, cette chambre est déjà réservée ou occupée. Vous ne pouvez pas soumettre de demande concurrente.
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-xl"
            >
              Choisir un autre logement disponible
            </button>
          </div>
        ) : hasPendingForThisRoom ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Demande déjà en cours</h3>
            <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
              Vous avez déjà une demande active pour ce logement dans votre espace « Suivi des réservations ». Le bailleur examine votre dossier.
            </p>
            <button
              onClick={onClose}
              className="mt-5 px-5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-xl"
            >
              Fermer et consulter le suivi
            </button>
          </div>
        ) : (
          /* Form with mandatory validation (Cahier des charges: "Les formulaires doivent être validés - champ obligatoire") */
          <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Réservation directe sans commission d'intermédiaire</span>
                <p className="text-emerald-800 text-[11px] mt-0.5">
                  Votre demande est transmise immédiatement à <strong>{room.landlord.name}</strong>. Une fois validée, la chambre est automatiquement bloquée pour vous.
                </p>
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nom et prénom de l'étudiant <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Sény Solange Lamah"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    formErrors.studentName ? 'border-red-500 bg-red-50/50' : 'border-stone-200 bg-stone-50'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                />
                {formErrors.studentName && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.studentName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Téléphone (Orange Money / MTN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+224 6XX XX XX XX"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    formErrors.studentPhone ? 'border-red-500 bg-red-50/50' : 'border-stone-200 bg-stone-50'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                />
                {formErrors.studentPhone && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.studentPhone}</p>
                )}
              </div>
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Matricule INE (Attestation orientation) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentIne}
                  onChange={(e) => setStudentIne(e.target.value)}
                  placeholder="Ex: INE-2026-HAF-9842"
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    formErrors.studentIne ? 'border-red-500 bg-red-50/50' : 'border-stone-200 bg-stone-50'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                />
                {formErrors.studentIne && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.studentIne}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Département / Filière à Hafia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentFaculty}
                  onChange={(e) => setStudentFaculty(e.target.value)}
                  placeholder="Ex: Génie Informatique, Gestion..."
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    formErrors.studentFaculty ? 'border-red-500 bg-red-50/50' : 'border-stone-200 bg-stone-50'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-600`}
                />
                {formErrors.studentFaculty && (
                  <p className="text-[11px] text-red-600 mt-1">{formErrors.studentFaculty}</p>
                )}
              </div>
            </div>

            {/* Dates & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Date d'emménagement souhaitée <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Durée de l'année universitaire
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value={9}>9 mois (Année académique standard)</option>
                  <option value={10}>10 mois (Session complète)</option>
                  <option value={12}>12 mois (Année civile continue)</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact d'urgence / Tuteur à Labé ou Conakry
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+224 6XX XX XX XX (Nom du parent ou tuteur)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Summary Pricing Box */}
            <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Loyer premier mois :</span>
                <span className="font-mono font-semibold">{formatFG(room.pricePerMonthFG)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Caution de garantie (restituée en fin de bail) :</span>
                <span className="font-mono font-semibold">{formatFG(room.depositFG)}</span>
              </div>
              <div className="pt-1.5 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                <span>Total à prévoir à l'installation :</span>
                <span className="font-mono text-emerald-700">{formatFG(room.pricePerMonthFG + room.depositFG)}</span>
              </div>
            </div>

            {/* Checkbox agreement */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer text-xs text-stone-600">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>
                  Je certifie être étudiant orienté à Hafia et m’engage à respecter le règlement intérieur de la cité.
                </span>
              </label>
              {formErrors.terms && (
                <p className="text-[11px] text-red-600 mt-1">{formErrors.terms}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande de réservation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
