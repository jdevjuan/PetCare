import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { Button, Card, EmptyState, Field, PageHeader } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { createAppointment, listPets, listServices } from '../../lib/api';
import { errorMessage, formatCurrency, toLocalInput } from '../../lib/format';

export default function NewAppointment() {
  const { notify } = useToast();
  const navigate = useNavigate();
  const [pets] = useState(() => listPets());
  const [services] = useState(() => listServices());
  const [form, setForm] = useState({ petId: '', serviceId: '', date: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const selectedService = services.find((s) => s.id === form.serviceId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAppointment(form);
      notify('success', 'Agendamento solicitado! Aguarde a confirmação da clínica.');
      navigate('/app/agendamentos');
    } catch (error) {
      notify('error', errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (pets.length === 0) {
    return (
      <>
        <PageHeader title="Novo agendamento" />
        <EmptyState
          icon={PawPrint}
          title="Cadastre um animal primeiro"
          text="Para agendar um serviço, você precisa ter ao menos um animal cadastrado."
          action={
            <Link to="/app/animais/novo">
              <Button>Cadastrar animal</Button>
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Novo agendamento" subtitle="Escolha o animal, o serviço e o melhor horário." />
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Animal">
            <select className="input" value={form.petId} onChange={(e) => setForm({ ...form, petId: e.target.value })}>
              <option value="">Selecione</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species})
                </option>
              ))}
            </select>
          </Field>

          <Field label="Serviço">
            <select
              className="input"
              value={form.serviceId}
              onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
            >
              <option value="">Selecione</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - {formatCurrency(s.price)}
                </option>
              ))}
            </select>
          </Field>

          {selectedService && (
            <div className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-900">
              Valor: <strong>{formatCurrency(selectedService.price)}</strong> - duração de{' '}
              <strong>{selectedService.duration} min</strong>
            </div>
          )}

          <Field label="Data e horário">
            <input
              className="input"
              type="datetime-local"
              min={toLocalInput(new Date())}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>

          <Field label="Observações (opcional)">
            <textarea
              className="input min-h-24"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>

          <Button type="submit" loading={loading} className="w-full">
            Solicitar agendamento
          </Button>
        </form>
      </Card>
    </>
  );
}
