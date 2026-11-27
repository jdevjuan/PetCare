import type { ReactNode } from 'react';
import { CalendarCheck, FileText, PawPrint } from 'lucide-react';

const perks = [
  { icon: PawPrint, text: 'Cadastre todos os seus pets em um só lugar' },
  { icon: CalendarCheck, text: 'Agende banho, tosa, vacinas e consultas' },
  { icon: FileText, text: 'Acompanhe o histórico veterinário' },
];

// Moldura das telas de login e cadastro: painel colorido ao lado + formulário.
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-5xl items-stretch gap-0 px-4 py-10 md:grid-cols-2 md:py-16">
      <aside className="hidden flex-col justify-between rounded-l-3xl bg-gradient-to-br from-teal-700 to-teal-900 p-10 text-white md:flex">
        <div>
          <PawPrint className="h-10 w-10 text-teal-200" />
          <h2 className="mt-6 text-3xl font-extrabold leading-tight">Cuidar do seu pet ficou mais fácil.</h2>
          <p className="mt-3 text-teal-100">Tudo o que a sua rotina com a clínica precisa, em poucos cliques.</p>
        </div>
        <ul className="mt-10 space-y-4">
          {perks.map((p) => (
            <li key={p.text} className="flex items-center gap-3 text-sm font-semibold">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <p.icon className="h-4 w-4" />
              </span>
              {p.text}
            </li>
          ))}
        </ul>
      </aside>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 md:rounded-l-none md:rounded-r-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
        <p className="mb-6 mt-1 text-slate-500">{subtitle}</p>
        {children}
      </section>
    </div>
  );
}
