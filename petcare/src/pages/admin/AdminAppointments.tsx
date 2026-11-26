import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Button, Card, EmptyState, PageHeader, PaymentBadge, StatusBadge } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { listAppointments, markPaymentPaid, setAppointmentStatus } from '../../lib/api';
import type { AppointmentView } from '../../lib/api';
import { errorMessage, formatCurrency, formatDateTime, paymentMethodLabel, statusLabel } from '../../lib/format';
import type { AppointmentStatus, PaymentMethod } from '../../types';

// Próximos status que o administrador pode aplicar em cada situação.
const nextActions: Record<AppointmentStatus, Array<{ status: AppointmentStatus; label: string; danger?: boolean }>> = {
  PENDING: [
    { status: 'CONFIRMED', label: 'Confirmar' },
    { status: 'CANCELLED', label: 'Cancelar', danger: true },
  ],
  CONFIRMED: [
    { status: 'IN_PROGRESS', label: 'Iniciar atendimento' },
    { status: 'CANCELLED', label: 'Cancelar', danger: true },
  ],
  IN_PROGRESS: [
    { status: 'COMPLETED', label: 'Concluir' },
    { status: 'CANCELLED', label: 'Cancelar', danger: true },
  ],
  COMPLETED: [],
  CANCELLED: [],
};

export default function AdminAppointments() {
  const { notify } = useToast();
  const [appointments, setAppointments] = useState<AppointmentView[]>(() => listAppointments());
  const [filter, setFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [method, setMethod] = useState<PaymentMethod>('PIX');

  const reload = () => setAppointments(listAppointments());

  const changeStatus = (id: string, status: AppointmentStatus) => {
    try {
      setAppointmentStatus(id, status);
      notify('success', `Status atualizado para "${statusLabel[status]}".`);
      reload();
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  const pay = (paymentId: string) => {
    try {
      markPaymentPaid(paymentId, method);
      notify('success', 'Pagamento registrado.');
      reload();
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  const visible = appointments.filter((a) => filter === 'ALL' || a.status === filter);

  return (
    <>
      <PageHeader
        title="Agendamentos"
        subtitle="Confirme, acompanhe e conclua os atendimentos."
        action={
          <select
            className="input w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value as AppointmentStatus | 'ALL')}
            aria-label="Filtrar por status"
          >
            <option value="ALL">Todos os status</option>
            {(Object.keys(statusLabel) as AppointmentStatus[]).map((s) => (
              <option key={s} value={s}>
                {statusLabel[s]}
              </option>
            ))}
          </select>
        }
      />

      {visible.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Nenhum agendamento encontrado" />
      ) : (
        <div className="space-y-3">
          {visible.map((a) => (
            <Card key={a.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">
                    {a.service?.name ?? 'Serviço'} - {a.pet?.name ?? 'Animal'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDateTime(a.date)} - Tutor: {a.owner?.name ?? '-'}
                    {a.owner?.phone ? ` (${a.owner.phone})` : ''}
                  </p>
                  {a.notes && <p className="mt-1 text-sm text-slate-500">Obs.: {a.notes}</p>}
                </div>
                <StatusBadge status={a.status} />
              </div>

              {nextActions[a.status].length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {nextActions[a.status].map((action) => (
                    <Button
                      key={action.status}
                      variant={action.danger ? 'secondary' : 'primary'}
                      onClick={() => changeStatus(a.id, action.status)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}

              {a.payment && (
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-sm">
                  <span className="font-semibold text-slate-700">{formatCurrency(a.payment.amount)}</span>
                  <PaymentBadge status={a.payment.status} />
                  {a.payment.status === 'PAID' && a.payment.paymentMethod && (
                    <span className="text-slate-500">via {paymentMethodLabel[a.payment.paymentMethod]}</span>
                  )}
                  {a.payment.status === 'PENDING' && (
                    <>
                      <select
                        className="input w-auto"
                        value={method}
                        onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                        aria-label="Forma de pagamento"
                      >
                        {(Object.keys(paymentMethodLabel) as PaymentMethod[]).map((m) => (
                          <option key={m} value={m}>
                            {paymentMethodLabel[m]}
                          </option>
                        ))}
                      </select>
                      <Button variant="secondary" onClick={() => pay(a.payment!.id)}>
                        Marcar como pago
                      </Button>
                    </>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
