import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ChamadosListPage from './pages/ChamadosListPage'
import ChamadoDetailPage from './pages/ChamadoDetailPage'
import NovoChamadoPage from './pages/NovoChamadoPage'
import TecnicoFilaPage from './pages/TecnicoFilaPage'
import UsuariosPage from './pages/UsuariosPage'
import LocaisPage from './pages/LocaisPage'
import EquipamentosPage from './pages/EquipamentosPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard"       element={<DashboardPage />} />
          <Route path="/chamados"        element={<ChamadosListPage />} />
          <Route path="/chamados/meus"   element={<ChamadosListPage meusChamados />} />
          <Route path="/chamados/novo"   element={<NovoChamadoPage />} />
          <Route path="/chamados/:id"    element={<ChamadoDetailPage />} />
          <Route path="/tecnico/fila"    element={<TecnicoFilaPage />} />
          <Route path="/usuarios"        element={<UsuariosPage />} />
          <Route path="/locais"          element={<LocaisPage />} />
          <Route path="/equipamentos"    element={<EquipamentosPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
