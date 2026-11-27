import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, CalendarDays, Clock, FileText, PawPrint, Stethoscope, Users } from 'lucide-react';
import { Card, PageHeader } from '../../components/ui';
import { getAdminStats } from '../../lib/api';

export default function AdminDashboard() {
  const stats = getAdminStats();

  const cards = [
    { icon: Users, label: 'Clientes', value: stats.clients },
    { icon: PawPrint, label: 'Animais', value: stats.pets },
    { icon: Clock, label: 'Agendamentos pendentes', value: stats.pending },
    { icon: CalendarCheck, label: 'Agendamentos confirmados', value: stats.confirmed },
    { icon: FileText, label: 'Consultas realizadas', value: stats.consultations },
  ];

  const maxCount = Math.max(1, ...stats.topServices.map((s) => s.count));

  const shortcuts = [
    { to: '/admin/agendamentos', icon: CalendarDays, label: 'Gerenciar agendamentos' },
    { to: '/admin/servicos', icon: Stethoscope, label: 'Editar serviços e preços' },
    { to: '/admin/consultas', icon: FileText, label: 'Registrar consulta' },
  ];


  return (
    <>
      <PageHeader title="Painel administrativo" subtitle="Indicadores calculados a partir dos dados cadastrados." />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {shortcuts.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="group flex items-center justify-between gap-3 rounded-2xl bg-teal-800 px-5 py-4 text-sm font-bold text-white transition hover:bg-teal-900"
          >
            <span className="flex items-center gap-3">
              <s.icon className="h-5 w-5 text-teal-200" />
              {s.label}
            </span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">Serviços mais solicitados</h2>
        {stats.topServices.length === 0 ? (
          <p className="text-sm text-slate-500">Ainda não há agendamentos.</p>
        ) : (
          <ul className="space-y-3">
            {stats.topServices.map((s) => (
              <li key={s.name}>
                <div className="mb-1 flex justify-between text-sm font-semibold text-slate-700">
                  <span>{s.name}</span>
                  <span>{s.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-teal-600" style={{ width: `${(s.count / maxCount) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>


    </>
  );
}
