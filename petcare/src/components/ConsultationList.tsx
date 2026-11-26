import { FileText, Trash2 } from 'lucide-react';
import type { ConsultationView } from '../lib/api';
import { formatDateTime } from '../lib/format';
import { Card, EmptyState } from './ui';

export default function ConsultationList({
  consultations,
  showOwner = false,
  onDelete,
}: {
  consultations: ConsultationView[];
  showOwner?: boolean;
  onDelete?: (consultation: ConsultationView) => void;
}) {
  if (consultations.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Nenhuma consulta registrada"
        text="O histórico veterinário aparece aqui depois dos atendimentos."
      />
    );
  }

  return (
    <div className="space-y-4">
      {consultations.map((c) => (
        <Card key={c.id}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-bold text-slate-900">
                {c.petName}
                {showOwner && <span className="font-medium text-slate-500"> - tutor: {c.ownerName}</span>}
              </p>
              <p className="text-xs text-slate-500">
                {formatDateTime(c.date)} - Dr(a). {c.veterinarian}
              </p>
            </div>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(c)}
                aria-label="Excluir consulta"
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-3 text-sm">
            <span className="font-semibold text-slate-700">Diagnóstico: </span>
            {c.diagnosis}
          </p>
          {c.notes && (
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-semibold text-slate-700">Observações: </span>
              {c.notes}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
