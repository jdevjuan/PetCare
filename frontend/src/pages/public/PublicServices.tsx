import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import ServiceList from '../../components/ServiceList';
import { Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { listServices } from '../../lib/api';

export default function PublicServices() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const services = listServices();

  const term = search.trim().toLowerCase();
  const filtered = services.filter(
    (s) => !term || s.name.toLowerCase().includes(term) || s.description.toLowerCase().includes(term),
  );

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-extrabold text-slate-900">Serviços</h1>
          <p className="mt-1 max-w-xl text-slate-500">
            Confira o que oferecemos, com preço e duração de cada atendimento.
          </p>
          <div className="relative mt-6 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              placeholder="Buscar serviço (ex.: banho, vacina)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar serviço"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {filtered.length === 0 && services.length > 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Nenhum serviço encontrado para "{search}".
          </p>
        ) : (
          <ServiceList
            services={filtered}
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
        )}
      </div>
    </>
  );
}
