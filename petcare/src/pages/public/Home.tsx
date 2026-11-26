import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, FileText, PawPrint, ShieldCheck } from 'lucide-react';
import ServiceList from '../../components/ServiceList';
import { Button, Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { listServices } from '../../lib/api';
import { homeFor } from '../../lib/format';

const features = [
  {
    icon: PawPrint,
    title: 'Cadastro dos seus pets',
    text: 'Guarde nome, raça, peso e observações de cada animal em um só lugar.',
  },
  {
    icon: CalendarDays,
    title: 'Agendamento online',
    text: 'Escolha o serviço, o dia e o horário e acompanhe a confirmação.',
  },
  {
    icon: FileText,
    title: 'Histórico veterinário',
    text: 'Consulte diagnósticos e atendimentos anteriores quando precisar.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const services = listServices().slice(0, 3);

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
              <ShieldCheck className="h-4 w-4" /> Clínica veterinária e pet shop
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Cuidado de verdade para quem faz parte da <span className="text-teal-700">família</span>.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Cadastre seus animais, conheça os serviços e agende banho, tosa, vacinas e consultas sem sair de casa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={user ? homeFor(user.role) : '/cadastro'}>
                <Button className="px-6 py-3 text-base">
                  {user ? 'Ir para minha área' : 'Criar minha conta'} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/servicos">
                <Button variant="secondary" className="px-6 py-3 text-base">
                  Ver serviços
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96">
            <div className="absolute inset-0 rounded-[3rem] bg-teal-700 shadow-2xl shadow-teal-900/20" />
            <PawPrint className="relative h-32 w-32 text-white/90 sm:h-44 sm:w-44" />
            <div className="absolute -left-4 top-8 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-lg">
              Agendamento confirmado
            </div>
            <div className="absolute -right-4 bottom-10 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-lg">
              Vacinas em dia
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Nossos serviços</h2>
            <p className="text-sm text-slate-500">Alguns dos atendimentos disponíveis na clínica.</p>
          </div>
          <Link to="/servicos" className="text-sm font-bold text-teal-700 hover:underline">
            Ver todos
          </Link>
        </div>
        <ServiceList services={services} />
      </section>
    </>
  );
}
