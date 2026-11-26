import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, EmptyState, Field, PageHeader } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { createPet, getPet, listClients, updatePet } from '../../lib/api';
import { errorMessage, homeFor } from '../../lib/format';
import { PawPrint } from 'lucide-react';

const emptyForm = { name: '', species: '', breed: '', birthDate: '', weight: '', observations: '' };

// Formulário de cadastro e edição de animal (cliente e administrador).
export default function PetForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';
  const base = user ? homeFor(user.role) : '/app';
  const editing = Boolean(id);

  // Se o animal não existe (ou não é do usuário), mostramos uma mensagem.
  const [notFound] = useState(() => {
    if (!id) return false;
    try {
      getPet(id);
      return false;
    } catch {
      return true;
    }
  });
  const [ownerId, setOwnerId] = useState('');
  const [clients] = useState(() => (isAdmin ? listClients() : []));
  const [form, setForm] = useState(() => {
    if (!id) return emptyForm;
    try {
      const pet = getPet(id);
      return {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birthDate: pet.birthDate,
        weight: pet.weight ? String(pet.weight) : '',
        observations: pet.observations,
      };
    } catch {
      return emptyForm;
    }
  });

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        updatePet(id, form);
        notify('success', 'Animal atualizado!');
      } else {
        if (isAdmin && !ownerId) throw new Error('Selecione o tutor do animal.');
        createPet(form, ownerId || undefined);
        notify('success', 'Animal cadastrado!');
      }
      navigate(`${base}/animais`);
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  if (notFound) {
    return (
      <EmptyState
        icon={PawPrint}
        title="Animal não encontrado"
        action={
          <Link to={`${base}/animais`}>
            <Button>Voltar para a lista</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeader title={editing ? 'Editar animal' : 'Novo animal'} />
      <Card className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isAdmin && !editing && (
            <Field label="Tutor">
              <select className="input" value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
                <option value="">Selecione um cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Nome">
            <input className="input" value={form.name} onChange={set('name')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Espécie">
              <input className="input" list="species-list" value={form.species} onChange={set('species')} />
              <datalist id="species-list">
                <option value="Cachorro" />
                <option value="Gato" />
                <option value="Ave" />
                <option value="Coelho" />
                <option value="Roedor" />
              </datalist>
            </Field>
            <Field label="Raça">
              <input className="input" value={form.breed} onChange={set('breed')} />
            </Field>
            <Field label="Data de nascimento">
              <input className="input" type="date" value={form.birthDate} onChange={set('birthDate')} />
            </Field>
            <Field label="Peso (kg)">
              <input
                className="input"
                type="number"
                step="0.1"
                min="0"
                value={form.weight}
                onChange={set('weight')}
              />
            </Field>
          </div>
          <Field label="Observações">
            <textarea className="input min-h-24" value={form.observations} onChange={set('observations')} />
          </Field>
          <div className="flex gap-2">
            <Button type="submit">{editing ? 'Salvar alterações' : 'Cadastrar animal'}</Button>
            <Link to={`${base}/animais`}>
              <Button variant="secondary">Cancelar</Button>
            </Link>
          </div>
        </form>
      </Card>
    </>
  );
}
