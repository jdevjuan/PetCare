import { Heart, ShieldCheck, Stethoscope } from 'lucide-react';
import { Card } from '../../components/ui';

const values = [
  { icon: Heart, title: 'Carinho', text: 'Tratamos cada animal com paciência e respeito, como se fosse nosso.' },
  { icon: Stethoscope, title: 'Cuidado clínico', text: 'Atendimento veterinário com acompanhamento do histórico de cada pet.' },
  { icon: ShieldCheck, title: 'Transparência', text: 'Preços e duração dos serviços visíveis antes de agendar.' },
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
        Este site é um projeto acadêmico de Desenvolvimento Web e demonstra um fluxo completo: cadastro de tutores e
        animais, agendamento de serviços e gestão administrativa da clínica.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {values.map((v) => (
          <Card key={v.title}>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <v.icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900">{v.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{v.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
