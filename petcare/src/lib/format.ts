import type { AppointmentStatus, PaymentMethod, PaymentStatus, Role } from '../types';

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export const formatDate = (value: string): string => {
  if (!value) return '-';
  // Datas "AAAA-MM-DD" são lidas como locais para não "voltar um dia" por causa do fuso.
  const date = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value);
  return date.toLocaleDateString('pt-BR');
};

// Valor aceito pelo <input type="datetime-local">.
export function toLocalInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function ageText(birthDate: string): string {
  if (!birthDate) return 'Idade não informada';
  const birth = new Date(`${birthDate}T00:00:00`);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  if (months < 0) return 'Idade não informada';
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'ano' : 'anos'}`;
}

export const statusLabel: Record<AppointmentStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em atendimento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: 'Pagamento pendente',
  PAID: 'Pago',
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  PIX: 'Pix',
  CARD: 'Cartão',
};

export const homeFor = (role: Role): string => (role === 'ADMIN' ? '/admin' : '/app');

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Algo deu errado. Tente novamente.';
}
