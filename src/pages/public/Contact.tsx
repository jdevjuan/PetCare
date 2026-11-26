import { useState } from 'react';
import type { FormEvent } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Button, Card, Field } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

const info = [
  { icon: MapPin, text: 'Rua dos Animais, 123 - Centro' },
  { icon: Phone, text: '(00) 0000-0000' },
  { icon: Mail, text: 'contato@petcare.exemplo' },
  { icon: Clock, text: 'Seg a Sáb, das 8h às 18h' },
];

export default function Contact() {
  const { notify } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  // Formulário de demonstração: não envia nada para nenhum servidor.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      notify('error', 'Preencha todos os campos.');
      return;
    }
    notify('success', 'Mensagem enviada! (demonstração)');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Contato</h1>
        <p className="mb-6 mt-1 text-slate-500">Fale com a gente. Os dados abaixo são fictícios, de exemplo.</p>
        <ul className="space-y-4">
          {info.map((i) => (
            <li key={i.text} className="flex items-center gap-3 text-slate-700">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <i.icon className="h-5 w-5" />
              </span>
              {i.text}
            </li>
          ))}
        </ul>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nome">
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="E-mail">
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Mensagem">
            <textarea
              className="input min-h-28"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </Field>
          <Button type="submit" className="w-full">
            Enviar mensagem
          </Button>
        </form>
      </Card>
    </div>
  );
}
