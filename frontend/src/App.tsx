import { Link, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import { Button } from './components/ui';

import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import PublicServices from './pages/public/PublicServices';
import Register from './pages/public/Register';

import ClientDashboard from './pages/client/ClientDashboard';
import ClientServices from './pages/client/ClientServices';
import History from './pages/client/History';
import MyAppointments from './pages/client/MyAppointments';
import NewAppointment from './pages/client/NewAppointment';
import PetForm from './pages/client/PetForm';
import Pets from './pages/client/Pets';
import Profile from './pages/client/Profile';

import AdminAppointments from './pages/admin/AdminAppointments';
import AdminClients from './pages/admin/AdminClients';
import AdminConsultations from './pages/admin/AdminConsultations';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-5xl font-extrabold text-teal-700">404</p>
      <p className="text-slate-600">Não encontramos essa página.</p>
      <Link to="/">
        <Button>Voltar ao início</Button>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Área pública */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="servicos" element={<PublicServices />} />
        <Route path="sobre" element={<About />} />
        <Route path="contato" element={<Contact />} />
        <Route path="entrar" element={<Login />} />
        <Route path="cadastro" element={<Register />} />
      </Route>

      {/* Área do cliente */}
      <Route element={<ProtectedRoute role="CLIENT" />}>
        <Route path="app" element={<AppLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="animais" element={<Pets />} />
          <Route path="animais/novo" element={<PetForm />} />
          <Route path="animais/:id" element={<PetForm />} />
          <Route path="servicos" element={<ClientServices />} />
          <Route path="agendar" element={<NewAppointment />} />
          <Route path="agendamentos" element={<MyAppointments />} />
          <Route path="historico" element={<History />} />
        </Route>
      </Route>

      {/* Área administrativa */}
      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="admin" element={<AppLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clientes" element={<AdminClients />} />
          <Route path="animais" element={<Pets />} />
          <Route path="animais/novo" element={<PetForm />} />
          <Route path="animais/:id" element={<PetForm />} />
          <Route path="servicos" element={<AdminServices />} />
          <Route path="agendamentos" element={<AdminAppointments />} />
          <Route path="consultas" element={<AdminConsultations />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
