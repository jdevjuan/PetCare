import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Field } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { errorMessage, homeFor } from '../../lib/format';

export default function Login() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from.startsWith(homeFor(user.role)) ? from : homeFor(user.role), { replace: true });
    } catch (error) {
      notify('error', errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-center text-3xl font-extrabold text-slate-900">Entrar</h1>
      <p className="mb-6 mt-1 text-center text-slate-500">Acesse sua conta para continuar.</p>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="E-mail">
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Senha">
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>
      </Card>
      <p className="mt-4 text-center text-sm text-slate-500">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-bold text-teal-700 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
