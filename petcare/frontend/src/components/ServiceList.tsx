import type { ReactNode } from 'react';
import { Clock, Droplets, PawPrint, Scissors, Stethoscope, Syringe } from 'lucide-react';
import type { Service } from '../types';
import { formatCurrency } from '../lib/format';
import { Card, EmptyState } from './ui';

function iconFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes('banho')) return Droplets;
  if (n.includes('tosa')) return Scissors;
  if (n.includes('vacin')) return Syringe;
  if (n.includes('consulta') || n.includes('exame')) return Stethoscope;
  return PawPrint;
}

export default function ServiceList({
  services,
  renderAction,
}: {
  services: Service[];
  renderAction?: (service: Service) => ReactNode;
}) {
  if (services.length === 0) {
    return <EmptyState icon={PawPrint} title="Nenhum serviço disponível" text="Volte em breve para conferir as novidades." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const Icon = iconFor(service.name);
        return (
          <Card key={service.id} className="flex flex-col transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
            <p className="mt-1 flex-1 text-sm text-slate-500">{service.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-extrabold text-teal-800">{formatCurrency(service.price)}</span>
              <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {service.duration} min
              </span>
            </div>
            {renderAction && <div className="mt-4">{renderAction(service)}</div>}
          </Card>
        );
      })}
    </div>
  );
}
