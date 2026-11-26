import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, FileText, PawPrint, Users } from 'lucide-react';
import { Button, Card, PageHeader } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getAdminStats, resetAllData } from '../../lib/api';

export default function AdminDashboard() {
  const stats = getAdminStats();
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const cards = [
    { icon: Users, label: 'Clientes', value: stats.clients },
    { icon: PawPrint, label: 'Animais', value: stats.pets },
    { icon: Clock, label: 'Agendamentos pendentes', value: stats.pending },
    { icon: CalendarCheck, label: 'Agendamentos confirmados', value: stats.confirmed },
    { icon: FileText, label: 'Consultas realizadas', value: stats.consultations },
  ];

  const maxCount = Math.max(1, ...stats.topServices.map((s) => s.count));

  const handleReset = () => {
    if (!window.confirm('Apagar TODOS os dados deste navegador e voltar ao estado inicial?')) return;
    resetAllData();
    refresh();
    navigate('/');
  };

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

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-4">
        <p className="text-sm text-slate-500">
          Os dados ficam salvos apenas neste navegador. Para limpar tudo (por exemplo, antes de uma apresentação):
        </p>
        <Button variant="danger" className="mt-3" onClick={handleReset}>
          Restaurar dados iniciais
        </Button>
      </div>
    </>
  );
}
