import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import ConsultationList from '../../components/ConsultationList';
import { Button, Field, Modal, PageHeader } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { createConsultation, deleteConsultation, listConsultations, listPets } from '../../lib/api';
import type { ConsultationView } from '../../lib/api';
import { errorMessage, toLocalInput } from '../../lib/format';

const newForm = () => ({ petId: '', veterinarian: '', diagnosis: '', notes: '', date: toLocalInput(new Date()) });

export default function AdminConsultations() {
  const { notify } = useToast();
  const [consultations, setConsultations] = useState<ConsultationView[]>(() => listConsultations());
  const [pets] = useState(() => listPets());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(newForm);

  const openModal = () => {
    setForm(newForm());
    setOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createConsultation(form);
      notify('success', 'Consulta registrada!');
      setOpen(false);
      setConsultations(listConsultations());
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  const handleDelete = async (c: ConsultationView) => {
    if (!window.confirm(`Excluir a consulta de ${c.petName}?`)) return;
    try {
      await deleteConsultation(c.id);
      setConsultations(listConsultations());
      notify('success', 'Consulta excluída.');
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  return (
    <>
      <PageHeader
        title="Consultas"
        subtitle="Histórico veterinário de todos os animais."
        action={
          <Button onClick={openModal}>
            <Plus className="h-4 w-4" /> Registrar consulta
          </Button>
        }
      />

      <ConsultationList consultations={consultations} showOwner onDelete={handleDelete} />

      <Modal open={open} title="Registrar consulta" onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Animal">
            <select className="input" value={form.petId} onChange={(e) => setForm({ ...form, petId: e.target.value })}>
              <option value="">Selecione</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - tutor: {p.ownerName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Veterinário(a)">
            <input
              className="input"
              value={form.veterinarian}
              onChange={(e) => setForm({ ...form, veterinarian: e.target.value })}
            />
          </Field>
          <Field label="Data e horário">
            <input
              className="input"
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>
          <Field label="Diagnóstico">
            <input
              className="input"
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            />
          </Field>
          <Field label="Observações">
            <textarea
              className="input min-h-20"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>
          <div className="flex gap-2">
            <Button type="submit">Salvar</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
