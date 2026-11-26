import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeFor } from '../lib/format';
import type { Role } from '../types';

// Protege um grupo de rotas: exige login e (opcionalmente) um tipo de usuário.
export default function ProtectedRoute({ role }: { role: Role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />;
  return <Outlet />;
}
