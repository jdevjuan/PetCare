import { Link } from 'react-router-dom';
import ServiceList from '../../components/ServiceList';
import { Button, PageHeader } from '../../components/ui';
import { listServices } from '../../lib/api';

export default function ClientServices() {
  const services = listServices();

  return (
    <>
      <PageHeader title="Serviços disponíveis" subtitle="Veja os preços e agende o atendimento." />
      <ServiceList
        services={services}
        renderAction={() => (
          <Link to="/app/agendar">
            <Button className="w-full">Agendar</Button>
          </Link>
        )}
      />
    </>
  );
}
