import React, { useState } from 'react';
import { Reservation, Room } from '../types';
import { formatFG, formatDate } from '../utils/formatters';
import { CheckCircle2, Clock, XCircle, AlertCircle, Phone, Printer, MapPin, Building2, User, FileText, MessageCircle } from 'lucide-react';

interface StudentBookingsViewProps {
  reservations: Reservation[];
  rooms: Room[];
  currentStudentId: string;
  onCancelReservation: (resId: string) => void;
  onViewRoomDetails: (roomId: string) => void;
}

export const StudentBookingsView: React.FC<StudentBookingsViewProps> = ({
  reservations,
  rooms,
  currentStudentId,
  onCancelReservation,
  onViewRoomDetails,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<Reservation | null>(null);

  // Filter reservations for this student
  const studentReservations = reservations.filter((r) => r.studentId === currentStudentId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            Espace Étudiant Hafia
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            Suivi de mes réservations
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Consultez le statut en temps réel de vos demandes auprès des bailleurs de chambres à Hafia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 shadow-sm">
            <span className="font-bold text-emerald-700">{studentReservations.length}</span> demande{studentReservations.length > 1 ? 's' : ''} enregistrée{studentReservations.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {studentReservations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Aucune réservation pour le moment</h3>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
            Vous n'avez pas encore envoyé de demande de logement. Parcourez la liste des chambres disponibles à la Cité Université ou à Hafia Centre.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {studentReservations.map((res) => {
            const room = rooms.find((r) => r.id === res.roomId);

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm hover:border-stone-300 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* Status Badge */}
                    {res.status === 'validee' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Réservation validée & confirmée
                      </span>
                    )}
                    {res.status === 'en_attente' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        En attente de validation du bailleur
                      </span>
                    )}
                    {res.status === 'rejetee' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-red-100 text-red-800">
                        <XCircle className="w-3.5 h-3.5" />
                        Demande non retenue
                      </span>
                    )}
                    {res.status === 'annulee' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Demande annulée
                      </span>
                    )}

                    <span className="text-xs text-stone-400">·</span>
                    <span className="text-xs text-stone-500">Demande soumise le {formatDate(res.requestDate)}</span>
                  </div>

                  <h3
                    onClick={() => onViewRoomDetails(res.roomId)}
                    className="text-lg font-bold text-stone-900 hover:text-emerald-700 cursor-pointer transition leading-tight"
                  >
                    {res.roomTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {res.cite}
                    </span>
                    <span className="flex items-center gap-1">
                      <strong className="text-stone-900 font-mono">{formatFG(res.priceFG)}</strong> / mois
                    </span>
                    <span>Emménagement prévu : <strong>{formatDate(res.moveInDate)}</strong></span>
                    <span>Durée : <strong>{res.durationMonths} mois</strong></span>
                  </div>

                  {res.adminNote && (
                    <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                      <span className="font-semibold text-stone-900">Note du bailleur / coordination :</span> {res.adminNote}
                    </div>
                  )}

                  {room && (
                    <div className="mt-3 text-xs text-stone-500 flex flex-wrap items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>Propriétaire : <strong className="text-stone-800">{room.landlord.name}</strong></span>
                      <span>·</span>
                      <a
                        href={`https://wa.me/${room.landlord.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${room.landlord.name}, je suis étudiant(e) à Hafia et j'ai fait une demande de réservation pour votre logement "${room.title}" (Réf : ${res.id}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition"
                        title="Contacter sur WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${room.landlord.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium transition"
                        title="Appeler le bailleur"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{room.landlord.phone}</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0">
                  {res.status === 'validee' && (
                    <button
                      onClick={() => setSelectedTicket(res)}
                      className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Attestation & Reçu</span>
                    </button>
                  )}

                  <button
                    onClick={() => onViewRoomDetails(res.roomId)}
                    className="px-4 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition"
                  >
                    Fiche logement
                  </button>

                  {res.status === 'en_attente' && (
                    <button
                      onClick={() => onCancelReservation(res.id)}
                      className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      Annuler la demande
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket / Printable Voucher Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
            <div className="text-center pb-6 border-b border-stone-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Attestation Officielle de Logement Étudiant</h3>
              <p className="text-xs text-stone-500">LogeStudent Guinée · Région de Labé (Hafia)</p>
            </div>

            <div className="py-5 space-y-3 text-xs">
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">N° Référence :</span>
                <span className="font-mono font-bold text-stone-900">{selectedTicket.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Étudiant bénéficiaire :</span>
                <span className="font-semibold text-stone-900">{selectedTicket.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Matricule INE :</span>
                <span className="font-mono font-semibold text-stone-900">{selectedTicket.studentIne}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Département universitaire :</span>
                <span className="font-medium text-stone-900">{selectedTicket.studentFaculty}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Logement réservé :</span>
                <span className="font-semibold text-stone-900 text-right max-w-[200px]">{selectedTicket.roomTitle}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Secteur / Cité :</span>
                <span className="font-medium text-stone-900">{selectedTicket.cite}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Loyer mensuel homologué :</span>
                <span className="font-mono font-bold text-emerald-700">{formatFG(selectedTicket.priceFG)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">Date d'effet du bail :</span>
                <span className="font-medium text-stone-900">{formatDate(selectedTicket.moveInDate)} ({selectedTicket.durationMonths} mois)</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 text-center">
              Ce document fait foi auprès de l'administration du Centre Universitaire de Hafia pour votre justificatif d'hébergement.
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer l'attestation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
