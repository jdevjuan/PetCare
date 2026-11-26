import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button, Card, Field } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { hasUsers } from '../../lib/api';
import { errorMessage, homeFor } from '../../lib/format';

export default function Register() {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const firstAccount = !hasUsers();

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      notify('success', 'Conta criada com sucesso!');
      navigate(homeFor(user.role), { replace: true });
    } catch (error) {
      notify('error', errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-center text-3xl font-extrabold text-slate-900">Criar conta</h1>
      <p className="mb-6 mt-1 text-center text-slate-500">Leva menos de um minuto.</p>

      {firstAccount && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Este é o primeiro cadastro: sua conta será a de <strong>administrador</strong>. As próximas serão de
            clientes.
          </span>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nome completo">
            <input className="input" autoComplete="name" value={form.name} onChange={set('name')} />
          </Field>
          <Field label="E-mail">
            <input className="input" type="email" autoComplete="email" value={form.email} onChange={set('email')} />
          </Field>
          <Field label="Telefone">
            <input className="input" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} />
          </Field>
          <Field label="Senha" hint="Mínimo de 6 caracteres.">
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={set('password')}
            />
          </Field>
          <Button type="submit" loading={loading} className="w-full">
            Criar conta
          </Button>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-slate-500">
        Já tem conta?{' '}
        <Link to="/entrar" className="font-bold text-teal-700 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
