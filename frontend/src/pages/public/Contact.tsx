import { useState } from 'react';
import type { FormEvent } from 'react';
import { ChevronDown, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Button, Card, Field } from '../../components/ui';
import { useToast } from '../../context/ToastContext';

const info = [
  { icon: MapPin, title: 'Endereço', text: 'Rua dos Animais, 123 - Centro' },
  { icon: Phone, title: 'Telefone', text: '(00) 0000-0000' },
  { icon: Mail, title: 'E-mail', text: 'contato@petcare.exemplo' },
  { icon: Clock, title: 'Horário', text: 'Seg a Sáb, das 8h às 18h' },
];

const faq = [
  {
    q: 'Como faço para agendar um serviço?',
    a: 'Crie sua conta, cadastre seu animal e escolha o serviço, a data e o horário em "Novo agendamento". A clínica confirma em seguida.',
  },
  {
    q: 'Posso cancelar um agendamento?',
    a: 'Sim. Enquanto o agendamento estiver como Pendente ou Confirmado, você pode cancelar em "Meus agendamentos".',
  },
  {
    q: 'Onde vejo o histórico de consultas do meu pet?',
    a: 'Na área do cliente, em "Histórico". Lá aparecem os atendimentos veterinários registrados pela clínica.',
  },
  {
    q: 'Como sei se o horário está livre?',
    a: 'O sistema avisa na hora se já existir um atendimento naquele horário e você escolhe outro.',
  },
];

export default function Contact() {
  const { notify } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">Contato</h1>
      <p className="mb-8 mt-1 text-slate-500">Fale com a gente. Os dados abaixo são fictícios, de exemplo.</p>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {info.map((i) => (
          <Card key={i.title}>
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <i.icon className="h-5 w-5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{i.title}</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">{i.text}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-extrabold text-slate-900">Perguntas frequentes</h2>
          <div className="space-y-2">
            {faq.map((item, index) => {
              const open = openFaq === index;
              return (
                <div key={item.q} className="rounded-2xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold text-slate-800"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                  >
                    {item.q}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-teal-700 transition ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && <p className="px-4 pb-4 text-sm text-slate-500">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <Card>
          <h2 className="mb-4 text-xl font-extrabold text-slate-900">Envie uma mensagem</h2>
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
    </div>
  );
}
