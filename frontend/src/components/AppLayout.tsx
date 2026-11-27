import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PawPrint,
  Stethoscope,
  User,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const clientNav: NavItem[] = [
  { to: '/app', label: 'Início', icon: LayoutDashboard, end: true },
  { to: '/app/animais', label: 'Meus animais', icon: PawPrint },
  { to: '/app/servicos', label: 'Serviços', icon: Stethoscope },
  { to: '/app/agendar', label: 'Novo agendamento', icon: CalendarDays },
  { to: '/app/agendamentos', label: 'Meus agendamentos', icon: ClipboardList },
  { to: '/app/historico', label: 'Histórico', icon: FileText },
  { to: '/app/perfil', label: 'Meu perfil', icon: User },
];

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/animais', label: 'Animais', icon: PawPrint },
  { to: '/admin/servicos', label: 'Serviços', icon: Stethoscope },
  { to: '/admin/agendamentos', label: 'Agendamentos', icon: CalendarDays },
  { to: '/admin/consultas', label: 'Consultas', icon: FileText },
  { to: '/admin/perfil', label: 'Meu perfil', icon: User },
];

// Layout das áreas privadas: menu lateral + conteúdo da página.
export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;
  const items = user.role === 'ADMIN' ? adminNav : clientNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen lg:flex">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Logo />
        <button type="button" onClick={() => setOpen(true)} aria-label="Abrir menu" className="rounded-lg p-2">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-teal-900 p-4 text-teal-50 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link to="/" className="mb-6 px-2 pt-2">
          <Logo light />
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? 'bg-white/15 text-white' : 'text-teal-100 hover:bg-white/10'
                }`
              }
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="truncate px-2 text-sm font-bold">{user.name}</p>
          <p className="mb-3 px-2 text-xs text-teal-200">{user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-teal-100 hover:bg-white/10"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sair
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl animate-fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
