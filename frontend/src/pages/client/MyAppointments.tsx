import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { Button, Card, EmptyState, PageHeader, StatusBadge } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { cancelAppointment, listAppointments } from '../../lib/api';
import type { AppointmentView } from '../../lib/api';
import { errorMessage, formatCurrency, formatDateTime } from '../../lib/format';

export default function MyAppointments() {
  const { notify } = useToast();
  const [appointments, setAppointments] = useState<AppointmentView[]>(() => listAppointments());

  const handleCancel = async (a: AppointmentView) => {
    if (!window.confirm('Cancelar este agendamento?')) return;
    try {
      await cancelAppointment(a.id);
      setAppointments(listAppointments());
      notify('success', 'Agendamento cancelado.');
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  return (
    <>
      <PageHeader
        title="Meus agendamentos"
        subtitle="Acompanhe o status de cada solicitação."
        action={
          <Link to="/app/agendar">
            <Button>Novo agendamento</Button>
          </Link>
        }
      />

      {appointments.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Você ainda não tem agendamentos" />
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">
                  {a.service?.name ?? 'Serviço'} - {a.pet?.name ?? 'Animal'}
                </p>
                <p className="text-sm text-slate-500">
                  {formatDateTime(a.date)}
                  {a.service ? ` - ${formatCurrency(a.service.price)}` : ''}
                </p>
                {a.notes && <p className="mt-1 text-sm text-slate-500">Obs.: {a.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={a.status} />
                {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                  <Button variant="secondary" onClick={() => handleCancel(a)}>
                    Cancelar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
