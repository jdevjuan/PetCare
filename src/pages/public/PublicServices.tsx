import { Link } from 'react-router-dom';
import ServiceList from '../../components/ServiceList';
import { Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { listServices } from '../../lib/api';

export default function PublicServices() {
  const { user } = useAuth();
  const services = listServices();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">Serviços</h1>
      <p className="mb-8 mt-1 text-slate-500">Confira o que oferecemos, com preço e duração de cada atendimento.</p>
      <ServiceList
        services={services}
        renderAction={() =>
          user?.role === 'CLIENT' ? (
            <Link to="/app/agendar">
              <Button className="w-full">Agendar</Button>
            </Link>
          ) : user ? null : (
            <Link to="/entrar">
              <Button variant="secondary" className="w-full">
                Entre para agendar
              </Button>
            </Link>
          )
        }
      />
    </div>
  );
}
