// Tipos de dados do PetCare (equivalem aos modelos do banco no prompt original).

export type Role = 'CLIENT' | 'ADMIN';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID';

export type PaymentMethod = 'CASH' | 'PIX' | 'CARD';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

// Usuário sem a senha: é o que a interface enxerga.
export type PublicUser = Omit<User, 'passwordHash'>;

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string; // AAAA-MM-DD ou vazio
  weight: number; // kg
  observations: string;
  ownerId: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // minutos
  active: boolean;
  createdAt: string;
}

export interface Appointment {
  id: string;
  petId: string;
  serviceId: string;
  date: string; // ISO
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  petId: string;
  appointmentId?: string;
  veterinarian: string;
  diagnosis: string;
  notes: string;
  date: string; // ISO
  createdAt: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  createdAt: string;
}
