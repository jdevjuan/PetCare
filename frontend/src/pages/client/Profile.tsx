import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card, Field, PageHeader } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateProfile } from '../../lib/api';
import { errorMessage } from '../../lib/format';

// Usada pelo cliente e pelo administrador.
export default function Profile() {
  const { user, refresh } = useAuth();
  const { notify } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone });
      refresh();
      notify('success', 'Perfil atualizado!');
    } catch (error) {
      notify('error', errorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Meu perfil" subtitle="Mantenha seus dados de contato atualizados." />
      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nome">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="E-mail" hint="O e-mail não pode ser alterado.">
            <input className="input" value={user?.email ?? ''} disabled />
          </Field>
          <Field label="Telefone">
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Button type="submit">Salvar alterações</Button>
        </form>
      </Card>
    </>
  );
}
