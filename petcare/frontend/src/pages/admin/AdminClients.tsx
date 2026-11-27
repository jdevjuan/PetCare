import { Users } from 'lucide-react';
import { Card, EmptyState, PageHeader } from '../../components/ui';
import { listClients } from '../../lib/api';
import { formatDate } from '../../lib/format';

export default function AdminClients() {
  const clients = listClients();

  return (
    <>
      <PageHeader title="Clientes" subtitle="Tutores cadastrados na plataforma." />
      {clients.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum cliente cadastrado ainda" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Animais</th>
                <th className="px-4 py-3">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600">{c.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{c.petCount}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
