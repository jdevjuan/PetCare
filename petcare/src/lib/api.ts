// Camada de "backend" do PetCare.
// Aqui ficam as regras de negócio, a autenticação e a checagem de permissões.
// Toda função confere quem é o usuário logado antes de ler ou alterar dados,
// do mesmo jeito que os middlewares de uma API Express fariam.

import { z } from 'zod';
import { getSessionUserId, loadDb, newId, resetDb, saveDb, setSessionUserId } from './storage';
import {
  appointmentSchema,
  consultationSchema,
  loginSchema,
  petSchema,
  profileSchema,
  registerSchema,
  serviceSchema,
} from './validators';
import type {
  AppointmentInput,
  ConsultationInput,
  PetInput,
  ProfileInput,
  RegisterInput,
  ServiceInput,
} from './validators';
import type {
  Appointment,
  AppointmentStatus,
  Consultation,
  Payment,
  PaymentMethod,
  Pet,
  PublicUser,
  Service,
  User,
} from '../types';

export class AppError extends Error {}

// ---------- utilitários internos ----------

function parse<S extends z.ZodTypeAny>(schema: S, data: unknown): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) throw new AppError(result.error.issues[0]?.message ?? 'Dados inválidos.');
  return result.data;
}

const toPublic = (user: User): PublicUser => {
  const { passwordHash, ...rest } = user;
  void passwordHash;
  return rest;
};

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`petcare:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getCurrentUser(): PublicUser | null {
  const id = getSessionUserId();
  if (!id) return null;
  const user = loadDb().users.find((u) => u.id === id);
  return user ? toPublic(user) : null;
}

// Equivalente ao middleware de autenticação.
function requireUser(): PublicUser {
  const user = getCurrentUser();
  if (!user) throw new AppError('Você precisa entrar na sua conta.');
  return user;
}

// Equivalente ao middleware de autorização (só ADMIN).
function requireAdmin(): PublicUser {
  const user = requireUser();
  if (user.role !== 'ADMIN') throw new AppError('Acesso restrito ao administrador.');
  return user;
}

const canAccessPet = (user: PublicUser, pet: Pet): boolean => user.role === 'ADMIN' || pet.ownerId === user.id;

// ---------- autenticação ----------

export const hasUsers = (): boolean => loadDb().users.length > 0;

export async function register(input: RegisterInput): Promise<PublicUser> {
  const data = parse(registerSchema, input);
  const passwordHash = await hashPassword(data.password);
  const db = loadDb();
  if (db.users.some((u) => u.email === data.email)) throw new AppError('Já existe uma conta com esse e-mail.');

  const user: User = {
    id: newId(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    passwordHash,
    // O primeiro cadastro vira administrador (não existe senha padrão no código).
    role: db.users.length === 0 ? 'ADMIN' : 'CLIENT',
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDb(db);
  setSessionUserId(user.id);
  return toPublic(user);
}

export async function login(input: { email: string; password: string }): Promise<PublicUser> {
  const data = parse(loginSchema, input);
  const passwordHash = await hashPassword(data.password);
  const user = loadDb().users.find((u) => u.email === data.email && u.passwordHash === passwordHash);
  if (!user) throw new AppError('E-mail ou senha incorretos.');
  setSessionUserId(user.id);
  return toPublic(user);
}

export const logout = (): void => setSessionUserId(null);

export function updateProfile(input: ProfileInput): PublicUser {
  const user = requireUser();
  const data = parse(profileSchema, input);
  const db = loadDb();
  const record = db.users.find((u) => u.id === user.id);
  if (!record) throw new AppError('Usuário não encontrado.');
  record.name = data.name;
  record.phone = data.phone;
  saveDb(db);
  return toPublic(record);
}

export function resetAllData(): void {
  requireAdmin();
  resetDb();
  setSessionUserId(null);
}

// ---------- clientes (admin) ----------

export interface ClientView extends PublicUser {
  petCount: number;
}

export function listClients(): ClientView[] {
  requireAdmin();
  const db = loadDb();
  return db.users
    .filter((u) => u.role === 'CLIENT')
    .map((u) => ({ ...toPublic(u), petCount: db.pets.filter((p) => p.ownerId === u.id).length }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ---------- animais ----------

export interface PetView extends Pet {
  ownerName: string;
}

export function listPets(): PetView[] {
  const user = requireUser();
  const db = loadDb();
  return db.pets
    .filter((p) => canAccessPet(user, p))
    .map((p) => ({ ...p, ownerName: db.users.find((u) => u.id === p.ownerId)?.name ?? '-' }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getPet(id: string): Pet {
  const user = requireUser();
  const pet = loadDb().pets.find((p) => p.id === id);
  // Mesma mensagem nos dois casos para não revelar que o animal existe.
  if (!pet || !canAccessPet(user, pet)) throw new AppError('Animal não encontrado.');
  return pet;
}

export function createPet(input: PetInput, ownerId?: string): Pet {
  const user = requireUser();
  const data = parse(petSchema, input);
  const db = loadDb();
  // Só o admin pode cadastrar em nome de outro cliente.
  const owner = user.role === 'ADMIN' && ownerId ? ownerId : user.id;
  if (!db.users.some((u) => u.id === owner)) throw new AppError('Tutor não encontrado.');
  const pet: Pet = { ...data, id: newId(), ownerId: owner, createdAt: new Date().toISOString() };
  db.pets.push(pet);
  saveDb(db);
  return pet;
}

export function updatePet(id: string, input: PetInput): Pet {
  getPet(id); // confere se o usuário pode mexer neste animal
  const data = parse(petSchema, input);
  const db = loadDb();
  const index = db.pets.findIndex((p) => p.id === id);
  db.pets[index] = { ...db.pets[index], ...data };
  saveDb(db);
  return db.pets[index];
}

export function deletePet(id: string): void {
  getPet(id);
  const db = loadDb();
  const hasHistory =
    db.appointments.some((a) => a.petId === id) || db.consultations.some((c) => c.petId === id);
  if (hasHistory) {
    throw new AppError('Este animal tem histórico de agendamentos ou consultas e não pode ser excluído.');
  }
  db.pets = db.pets.filter((p) => p.id !== id);
  saveDb(db);
}

// ---------- serviços ----------

// Visitantes e clientes só veem serviços ativos. O admin pode pedir todos.
export function listServices(includeInactive = false): Service[] {
  if (includeInactive) requireAdmin();
  return loadDb()
    .services.filter((s) => includeInactive || s.active)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function createService(input: ServiceInput): Service {
  requireAdmin();
  const data = parse(serviceSchema, input);
  const db = loadDb();
  const service: Service = { ...data, id: newId(), createdAt: new Date().toISOString() };
  db.services.push(service);
  saveDb(db);
  return service;
}

export function updateService(id: string, input: ServiceInput): Service {
  requireAdmin();
  const data = parse(serviceSchema, input);
  const db = loadDb();
  const index = db.services.findIndex((s) => s.id === id);
  if (index === -1) throw new AppError('Serviço não encontrado.');
  db.services[index] = { ...db.services[index], ...data };
  saveDb(db);
  return db.services[index];
}

// Exclusão lógica: serviço já usado em agendamentos só é desativado.
export function deleteService(id: string): 'deleted' | 'deactivated' {
  requireAdmin();
  const db = loadDb();
  const service = db.services.find((s) => s.id === id);
  if (!service) throw new AppError('Serviço não encontrado.');
  if (db.appointments.some((a) => a.serviceId === id)) {
    service.active = false;
    saveDb(db);
    return 'deactivated';
  }
  db.services = db.services.filter((s) => s.id !== id);
  saveDb(db);
  return 'deleted';
}

// ---------- agendamentos ----------

export interface AppointmentView extends Appointment {
  pet?: Pet;
  service?: Service;
  owner?: PublicUser;
  payment?: Payment;
}

export function listAppointments(): AppointmentView[] {
  const user = requireUser();
  const db = loadDb();
  return db.appointments
    .map((a): AppointmentView => {
      const pet = db.pets.find((p) => p.id === a.petId);
      const owner = pet ? db.users.find((u) => u.id === pet.ownerId) : undefined;
      return {
        ...a,
        pet,
        owner: owner ? toPublic(owner) : undefined,
        service: db.services.find((s) => s.id === a.serviceId),
        payment: db.payments.find((p) => p.appointmentId === a.id),
      };
    })
    .filter((a) => user.role === 'ADMIN' || a.pet?.ownerId === user.id)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function createAppointment(input: AppointmentInput): Appointment {
  const user = requireUser();
  const data = parse(appointmentSchema, input);
  const db = loadDb();

  const pet = db.pets.find((p) => p.id === data.petId);
  if (!pet || !canAccessPet(user, pet)) throw new AppError('Animal inválido para este usuário.');

  const service = db.services.find((s) => s.id === data.serviceId);
  if (!service || !service.active) throw new AppError('Este serviço não está disponível.');

  const start = new Date(data.date).getTime();
  if (Number.isNaN(start)) throw new AppError('Data inválida.');
  if (start <= Date.now()) throw new AppError('Escolha uma data e horário no futuro.');

  // Conflito: a clínica atende um serviço por vez, então os intervalos não podem se sobrepor.
  const end = start + service.duration * 60_000;
  const conflict = db.appointments.some((a) => {
    if (a.status === 'CANCELLED') return false;
    const otherStart = new Date(a.date).getTime();
    const otherDuration = db.services.find((s) => s.id === a.serviceId)?.duration ?? 30;
    return start < otherStart + otherDuration * 60_000 && otherStart < end;
  });
  if (conflict) throw new AppError('Já existe um atendimento nesse horário. Escolha outro horário.');

  const appointment: Appointment = {
    id: newId(),
    petId: pet.id,
    serviceId: service.id,
    date: new Date(start).toISOString(),
    status: 'PENDING', // o cliente nunca escolhe o status
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };
  db.appointments.push(appointment);
  saveDb(db);
  return appointment;
}

// O cliente só cancela os próprios agendamentos, enquanto ainda não começaram.
export function cancelAppointment(id: string): void {
  const user = requireUser();
  const db = loadDb();
  const appointment = db.appointments.find((a) => a.id === id);
  const pet = appointment ? db.pets.find((p) => p.id === appointment.petId) : undefined;
  if (!appointment || !pet || !canAccessPet(user, pet)) throw new AppError('Agendamento não encontrado.');
  if (appointment.status !== 'PENDING' && appointment.status !== 'CONFIRMED') {
    throw new AppError('Este agendamento não pode mais ser cancelado.');
  }
  appointment.status = 'CANCELLED';
  saveDb(db);
}

const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export function setAppointmentStatus(id: string, status: AppointmentStatus): void {
  requireAdmin();
  const db = loadDb();
  const appointment = db.appointments.find((a) => a.id === id);
  if (!appointment) throw new AppError('Agendamento não encontrado.');
  if (!allowedTransitions[appointment.status].includes(status)) {
    throw new AppError('Mudança de status não permitida.');
  }
  appointment.status = status;

  // Ao concluir, gera o registro de pagamento (apenas controle administrativo).
  if (status === 'COMPLETED' && !db.payments.some((p) => p.appointmentId === id)) {
    const service = db.services.find((s) => s.id === appointment.serviceId);
    db.payments.push({
      id: newId(),
      appointmentId: id,
      amount: service?.price ?? 0,
      status: 'PENDING',
      paymentMethod: null,
      createdAt: new Date().toISOString(),
    });
  }
  saveDb(db);
}

// ---------- pagamentos (admin) ----------

export function markPaymentPaid(paymentId: string, method: PaymentMethod): void {
  requireAdmin();
  const db = loadDb();
  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) throw new AppError('Pagamento não encontrado.');
  payment.status = 'PAID';
  payment.paymentMethod = method;
  saveDb(db);
}

// ---------- consultas ----------

export interface ConsultationView extends Consultation {
  petName: string;
  ownerName: string;
}

export function listConsultations(): ConsultationView[] {
  const user = requireUser();
  const db = loadDb();
  return db.consultations
    .map((c): ConsultationView => {
      const pet = db.pets.find((p) => p.id === c.petId);
      return {
        ...c,
        petName: pet?.name ?? '-',
        ownerName: db.users.find((u) => u.id === pet?.ownerId)?.name ?? '-',
      };
    })
    .filter((c) => {
      if (user.role === 'ADMIN') return true;
      const pet = db.pets.find((p) => p.id === c.petId);
      return pet?.ownerId === user.id;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function createConsultation(input: ConsultationInput): Consultation {
  requireAdmin();
  const data = parse(consultationSchema, input);
  const db = loadDb();
  if (!db.pets.some((p) => p.id === data.petId)) throw new AppError('Animal não encontrado.');
  if (data.appointmentId) {
    const appointment = db.appointments.find((a) => a.id === data.appointmentId);
    if (!appointment || appointment.petId !== data.petId) {
      throw new AppError('O agendamento informado não pertence a este animal.');
    }
  }
  const consultation: Consultation = {
    ...data,
    appointmentId: data.appointmentId || undefined,
    date: new Date(data.date).toISOString(),
    id: newId(),
    createdAt: new Date().toISOString(),
  };
  db.consultations.push(consultation);
  saveDb(db);
  return consultation;
}

export function deleteConsultation(id: string): void {
  requireAdmin();
  const db = loadDb();
  db.consultations = db.consultations.filter((c) => c.id !== id);
  saveDb(db);
}

// ---------- dashboards (dados calculados do que está salvo) ----------

export function getClientStats() {
  const user = requireUser();
  const now = Date.now();
  const appointments = listAppointments();
  return {
    petCount: listPets().length,
    upcoming: appointments
      .filter((a) => a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && new Date(a.date).getTime() >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5),
    recentConsultations: listConsultations().slice(0, 3),
    userName: user.name,
  };
}

export function getAdminStats() {
  requireAdmin();
  const db = loadDb();
  const counts = new Map<string, number>();
  for (const a of db.appointments) {
    if (a.status === 'CANCELLED') continue;
    counts.set(a.serviceId, (counts.get(a.serviceId) ?? 0) + 1);
  }
  const topServices = Array.from(counts.entries())
    .map(([serviceId, count]) => ({
      name: db.services.find((s) => s.id === serviceId)?.name ?? 'Serviço removido',
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    clients: db.users.filter((u) => u.role === 'CLIENT').length,
    pets: db.pets.length,
    pending: db.appointments.filter((a) => a.status === 'PENDING').length,
    confirmed: db.appointments.filter((a) => a.status === 'CONFIRMED').length,
    consultations: db.consultations.length,
    topServices,
  };
}
