import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Ticket, PlusCircle, Wrench,
  Users, Building2, Monitor, LogOut, ChevronRight
} from 'lucide-react'
import { clsx } from 'clsx'
import { RoleBadge } from '../ui'

const NAV = {
  ALUNO: [
    { to: '/chamados/novo',  icon: PlusCircle,      label: 'Abrir Chamado' },
    { to: '/chamados/meus',  icon: Ticket,          label: 'Meus Chamados' },
  ],
  PROFESSOR: [
    { to: '/chamados/novo',  icon: PlusCircle,      label: 'Abrir Chamado' },
    { to: '/chamados/meus',  icon: Ticket,          label: 'Meus Chamados' },
  ],
  TECNICO: [
    { to: '/tecnico/fila',   icon: Wrench,          label: 'Minha Fila' },
    { to: '/chamados',       icon: Ticket,          label: 'Todos os Chamados' },
  ],
  GESTOR: [
    { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chamados',       icon: Ticket,          label: 'Chamados' },
    { to: '/usuarios',       icon: Users,           label: 'Usuários' },
    { to: '/locais',         icon: Building2,       label: 'Locais' },
    { to: '/equipamentos',   icon: Monitor,         label: 'Equipamentos' },
  ],
  ADMIN: [
    { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chamados',       icon: Ticket,          label: 'Chamados' },
    { to: '/chamados/novo',  icon: PlusCircle,      label: 'Abrir Chamado' },
    { to: '/tecnico/fila',   icon: Wrench,          label: 'Fila Técnico' },
    { to: '/usuarios',       icon: Users,           label: 'Usuários' },
    { to: '/locais',         icon: Building2,       label: 'Locais' },
    { to: '/equipamentos',   icon: Monitor,         label: 'Equipamentos' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = NAV[user?.role] || []

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="w-64 shrink-0 bg-brand-950 text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-brand-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">CF</div>
          <div>
            <p className="font-semibold text-sm leading-tight">CampusFlow</p>
            <p className="text-brand-400 text-xs">360</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-brand-800">
        <div className="bg-brand-900 rounded-xl p-3">
          <p className="font-medium text-sm truncate">{user?.nome}</p>
          <p className="text-brand-400 text-xs truncate mb-2">{user?.email}</p>
          <RoleBadge role={user?.role} />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
              isActive
                ? 'bg-brand-700 text-white font-medium'
                : 'text-brand-300 hover:bg-brand-800 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-brand-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-brand-400 hover:bg-brand-800 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
