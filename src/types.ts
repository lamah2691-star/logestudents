export type UserRole = 'student' | 'landlord' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  university: string;
  faculty?: string;
  matriculeIne?: string;
  avatarUrl?: string;
  verified: boolean;
}

export type RoomType = 'individuelle' | 'partagee' | 'studio' | 'maison';

export type AvailabilityStatus = 'disponible' | 'reserve' | 'occupe';

export interface Room {
  id: string;
  title: string;
  cite: string; // Quartier / Cité à Hafia (ex: Cité Université Hafia, Popodara, Safatou, Ley-Saré)
  addressDescription: string;
  pricePerMonthFG: number; // Prix en Franc Guinéen (ex: 200 000 FG)
  depositFG: number; // Caution en FG (ex: 400 000 FG)
  type: RoomType;
  capacity: number; // 1 ou 2 personnes
  distanceToCampusMins: number; // Temps de marche vers le Centre Universitaire de Hafia
  status: AvailabilityStatus;
  images: string[];
  description: string;
  amenities: {
    runningWater: boolean; // Forage / Eau de robinet
    solarPower: boolean; // Courant Solaire / EDG
    privateBathroom: boolean; // Douche interne ou externe
    furnished: boolean; // Meublé (lit, table, matelas)
    securityGuard: boolean; // Gardien / Clôture fermée
    wifi: boolean;
  };
  landlord: {
    id: string;
    name: string;
    phone: string; // Ex: +224 624 XX XX XX
    paymentMethods: string[]; // Orange Money, MTN Mobile Money, Espèces
    verified: boolean;
  };
  createdAt: string;
}

export type ReservationStatus = 'en_attente' | 'validee' | 'rejetee' | 'annulee';

export interface Reservation {
  id: string;
  roomId: string;
  roomTitle: string;
  cite: string;
  priceFG: number;
  studentId: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  studentIne: string;
  studentFaculty: string;
  moveInDate: string;
  durationMonths: number;
  status: ReservationStatus;
  requestDate: string;
  adminNote?: string;
  emergencyContact?: string;
}

export interface CitéFilterOption {
  id: string;
  name: string;
  distanceKm: string;
}
