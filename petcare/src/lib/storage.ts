// "Banco de dados" do PetCare: tudo fica salvo no localStorage do navegador.
// Assim o site funciona na Vercel sem precisar de servidor nem de banco externo.

import type { Appointment, Consultation, Payment, Pet, Service, User } from '../types';

export interface Database {
  users: User[];
  pets: Pet[];
  services: Service[];
  appointments: Appointment[];
  consultations: Consultation[];
  payments: Payment[];
}

const DB_KEY = 'petcare_db_v1';
const SESSION_KEY = 'petcare_session_v1';

export const newId = (): string => crypto.randomUUID();

// Serviços iniciais (o administrador pode editar preços e duração depois).
function seedServices(): Service[] {
  const now = new Date().toISOString();
  const base: Array<Omit<Service, 'id' | 'active' | 'createdAt'>> = [
    { name: 'Banho', description: 'Banho completo com shampoo adequado ao tipo de pelo e secagem.', price: 50, duration: 60 },
    { name: 'Tosa higiênica', description: 'Corte de pelos em áreas sensíveis para mais conforto e higiene.', price: 40, duration: 45 },
    { name: 'Tosa completa', description: 'Tosa do corpo inteiro, de acordo com a raça ou o estilo escolhido.', price: 80, duration: 90 },
    { name: 'Consulta veterinária', description: 'Avaliação clínica geral feita por um médico veterinário.', price: 120, duration: 40 },
    { name: 'Vacinação', description: 'Aplicação de vacinas conforme o calendário de cada animal.', price: 90, duration: 30 },
    { name: 'Exame clínico', description: 'Exames para acompanhar a saúde e investigar sintomas.', price: 150, duration: 45 },
  ];
  return base.map((s) => ({ ...s, id: newId(), active: true, createdAt: now }));
}

function emptyDb(): Database {
  return { users: [], pets: [], services: seedServices(), appointments: [], consultations: [], payments: [] };
}

export function saveDb(db: Database): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function loadDb(): Database {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as Database;
  } catch {
    // dados corrompidos: começa do zero
  }
  const db = emptyDb();
  saveDb(db);
  return db;
}

export function resetDb(): void {
  saveDb(emptyDb());
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionUserId(id: string | null): void {
  if (id) localStorage.setItem(SESSION_KEY, id);
  else localStorage.removeItem(SESSION_KEY);
}
