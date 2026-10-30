import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAs: (role: UserRole) => void;
  currentUser: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginAs,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(
      mode === 'login'
        ? 'Connexion sécurisée réussie (Simulation JWT)'
        : 'Compte créé avec succès ! Bienvenue sur LogeStudent Hafia.'
    );
    setTimeout(() => {
      onLoginAs(selectedRole);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {mode === 'login' ? 'Connexion sécurisée' : 'Inscription nouvel utilisateur'}
            </h3>

          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-stone-500 hover:text-stone-900 flex items-center justify-center shadow-sm border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">


          {/* Toggle Login / Register */}
          <div className="flex border-b border-stone-200 mb-4 text-xs font-semibold">
            <button
              onClick={() => setMode('login')}
              className={`pb-2 flex-1 border-b-2 text-center transition ${
                mode === 'login' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-400'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setMode('register')}
              className={`pb-2 flex-1 border-b-2 text-center transition ${
                mode === 'register' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-stone-400'
              }`}
            >
              Créer un compte
            </button>
          </div>

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Sény Solange Lamah"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Votre profil</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                  >
                    <option value="student">Étudiant orienté à Hafia</option>
                    <option value="landlord">Propriétaire de chambres / concession</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Adresse Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="etudiant@hafia.edu.gn"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{mode === 'login' ? 'Connexion sécurisée' : 'Valider l’inscription'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
