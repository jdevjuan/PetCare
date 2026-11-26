import ConsultationList from '../../components/ConsultationList';
import { PageHeader } from '../../components/ui';
import { listConsultations } from '../../lib/api';

export default function History() {
  const consultations = listConsultations();

  return (
    <>
      <PageHeader title="Histórico de consultas" subtitle="Atendimentos veterinários dos seus animais." />
      <ConsultationList consultations={consultations} />
    </>
  );
}
