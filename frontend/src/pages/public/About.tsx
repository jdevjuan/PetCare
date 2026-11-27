import { Heart, ShieldCheck, Stethoscope } from 'lucide-react';
import { Card } from '../../components/ui';

const values = [
  { icon: Heart, title: 'Carinho', text: 'Tratamos cada animal com paciência e respeito, como se fosse nosso.' },
  { icon: Stethoscope, title: 'Cuidado clínico', text: 'Atendimento veterinário com acompanhamento do histórico de cada pet.' },
  { icon: ShieldCheck, title: 'Transparência', text: 'Preços e duração dos serviços visíveis antes de agendar.' },
];

const highlights = [
  { value: '6', label: 'serviços para o dia a dia do seu pet' },
  { value: '100%', label: 'do agendamento feito online' },
  { value: '24h', label: 'para consultar seu histórico no site' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">Sobre a clínica</h1>
      <p className="mt-4 text-lg text-slate-600">
        O PetCare nasceu para facilitar a rotina de quem tem animais de estimação. Reunimos clínica veterinária e pet
        shop em um só lugar, com agendamento online e histórico de saúde sempre à mão.
      </p>
      <p className="mt-3 text-slate-600">
        Aqui o tutor cadastra seus animais, consulta preços, escolhe o melhor horário e acompanha cada atendimento. Do
        lado da clínica, a equipe confirma os agendamentos, registra as consultas e mantém o histórico de cada pet
        organizado.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.value} className="rounded-2xl bg-teal-800 p-5 text-center text-white">
            <p className="text-3xl font-extrabold">{h.value}</p>
            <p className="mt-1 text-sm text-teal-100">{h.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-extrabold text-slate-900">Nossos valores</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {values.map((v) => (
          <Card key={v.title} className="transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <v.icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900">{v.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{v.text}</p>
          </Card>
        ))}
      </div>

      <p className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Este site é um projeto acadêmico de Desenvolvimento Web. Os dados de contato e da clínica são fictícios.
      </p>
    </div>
  );
}
