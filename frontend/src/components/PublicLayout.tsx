import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { homeFor } from '../lib/format';
import Logo from './Logo';
import { Button } from './ui';

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/servicos', label: 'Serviços', end: false },
  { to: '/sobre', label: 'Sobre', end: false },
  { to: '/contato', label: 'Contato', end: false },
];

export default function PublicLayout() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Ao trocar de página, volta para o topo.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:text-teal-800'
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" aria-label="PetCare - página inicial">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Link to={homeFor(user.role)}>
                <Button>Minha área</Button>
              </Link>
            ) : (
              <>
                <Link to="/entrar">
                  <Button variant="ghost">Entrar</Button>
                </Link>
                <Link to="/cadastro">
                  <Button>Criar conta</Button>
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-700 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="space-y-1 border-t border-slate-100 bg-white px-4 py-3 md:hidden" onClick={() => setOpen(false)}>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={(s) => `block ${linkClass(s)}`}>
                {l.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-2">
              {user ? (
                <Link to={homeFor(user.role)} className="flex-1">
                  <Button className="w-full">Minha área</Button>
                </Link>
              ) : (
                <>
                  <Link to="/entrar" className="flex-1">
                    <Button variant="secondary" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/cadastro" className="flex-1">
                    <Button className="w-full">Criar conta</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-4 font-semibold">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-teal-700">
                {l.label}
              </Link>
            ))}
          </nav>
          <p>Projeto acadêmico de Desenvolvimento Web</p>
        </div>
      </footer>
    </div>
  );
}
