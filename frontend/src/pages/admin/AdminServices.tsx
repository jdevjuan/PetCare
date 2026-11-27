import { useState } from 'react';
import type { FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Card, Field, Modal, PageHeader } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { createService, deleteService, listServices, updateService } from '../../lib/api';
import { errorMessage, formatCurrency } from '../../lib/format';
import type { Service } from '../../types';

const emptyForm = { name: '', description: '', price: '', duration: '', active: true };

export default function AdminServices() {
  const { notify } = useToast();
  const [services, setServices] = useState<Service[]>(() => listServices(true));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const reload = () => setServices(listServices(true));

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      description: s.description,
      price: String(s.price),
      duration: String(s.duration),
      active: s.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await updateService(editingId, form);
      else await createService(form);
      notify('success', editingId ? 'Serviço atualizado!' : 'Serviço criado!');
      setModalOpen(false);
      reload();
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  const handleDelete = async (s: Service) => {
    if (!window.confirm(`Excluir o serviço "${s.name}"?`)) return;
    try {
      const result = await deleteService(s.id);
      notify(
        'success',
        result === 'deactivated'
          ? 'O serviço já foi usado em agendamentos, então foi apenas desativado.'
          : 'Serviço excluído.',
      );
      reload();
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  return (
    <>
      <PageHeader
        title="Serviços"
        subtitle="Defina nomes, preços e duração dos atendimentos."
        action={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Novo serviço
          </Button>
        }
      />

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Serviço</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Duração</th>
              <th className="px-4 py-3">Situação</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{s.name}</p>
                  <p className="max-w-xs truncate text-xs text-slate-500">{s.description}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{formatCurrency(s.price)}</td>
                <td className="px-4 py-3 text-slate-700">{s.duration} min</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      s.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(s)}
                      aria-label={`Editar ${s.name}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      aria-label={`Excluir ${s.name}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={modalOpen} title={editingId ? 'Editar serviço' : 'Novo serviço'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nome">
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Descrição">
            <textarea
              className="input min-h-20"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Preço (R$)">
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>
            <Field label="Duração (min)">
              <input
                className="input"
                type="number"
                min="5"
                step="5"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Serviço ativo (aparece para os clientes)
          </label>
          <div className="flex gap-2">
            <Button type="submit">Salvar</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
