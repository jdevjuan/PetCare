import { Link } from 'react-router-dom';
import { CalendarDays, FileText, PawPrint, Plus } from 'lucide-react';
import ConsultationList from '../../components/ConsultationList';
import { Button, Card, EmptyState, PageHeader, StatusBadge } from '../../components/ui';
import { getClientStats } from '../../lib/api';
import { formatDateTime } from '../../lib/format';

export default function ClientDashboard() {
  const stats = getClientStats();

  const cards = [
    { icon: PawPrint, label: 'Animais cadastrados', value: stats.petCount },
    { icon: CalendarDays, label: 'Próximos agendamentos', value: stats.upcoming.length },
    { icon: FileText, label: 'Consultas recentes', value: stats.recentConsultations.length },
  ];

  return (
    <>
      <PageHeader
        title={`Olá, ${stats.userName.split(' ')[0]}!`}
        subtitle="Veja um resumo da sua conta e acesse os atalhos."
        action={
          <div className="flex gap-2">
            <Link to="/app/animais/novo">
              <Button variant="secondary">
                <Plus className="h-4 w-4" /> Cadastrar animal
              </Button>
            </Link>
            <Link to="/app/agendar">
              <Button>
                <CalendarDays className="h-4 w-4" /> Agendar serviço
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <c.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{c.value}</p>
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 text-lg font-extrabold text-slate-900">Próximos agendamentos</h2>
      {stats.upcoming.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhum agendamento por vir"
          text="Que tal marcar um banho ou uma consulta?"
          action={
            <Link to="/app/agendar">
              <Button>Agendar agora</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {stats.upcoming.map((a) => (
            <Card key={a.id} className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-slate-900">
                  {a.service?.name ?? 'Serviço'} - {a.pet?.name ?? 'Animal'}
                </p>
                <p className="text-sm text-slate-500">{formatDateTime(a.date)}</p>
              </div>
              <StatusBadge status={a.status} />
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-8 text-lg font-extrabold text-slate-900">Histórico recente</h2>
      <ConsultationList consultations={stats.recentConsultations} />
    </>
  );
}
