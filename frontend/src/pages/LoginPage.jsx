import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Spinner } from '../components/ui'

const DEMO_USERS = [
  { email: 'joao@campusflow.com',    senha: 'senha123', label: 'Aluno',    role: 'ALUNO' },
  { email: 'maria@campusflow.com',   senha: 'senha123', label: 'Professor',role: 'PROFESSOR' },
  { email: 'carlos@campusflow.com',  senha: 'senha123', label: 'Técnico',  role: 'TECNICO' },
  { email: 'ana@campusflow.com',     senha: 'senha123', label: 'Gestor',   role: 'GESTOR' },
  { email: 'admin@campusflow.com',   senha: 'admin123', label: 'Admin',    role: 'ADMIN' },
]

const ROLE_HOME = {
  ADMIN: '/dashboard', GESTOR: '/dashboard',
  TECNICO: '/tecnico/fila', PROFESSOR: '/chamados/meus', ALUNO: '/chamados/meus'
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to={ROLE_HOME[user.role] || '/chamados'} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = login(email, senha)
      navigate(ROLE_HOME[u.role] || '/chamados')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (u) => { setEmail(u.email); setSenha(u.senha); setError('') }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">CF</span>
          </div>
          <h1 className="text-3xl font-bold text-white">CampusFlow 360</h1>
          <p className="text-brand-300 mt-1">Sistema de Gestão de Chamados</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Entrar na plataforma</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">E-mail</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input"
              />
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} required value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-10"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-2.5">
              {loading ? <Spinner size="sm" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Demo users */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3 text-center">Acesso rápido (ambiente dev)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map(u => (
                <button key={u.email} onClick={() => fillDemo(u)}
                  className="text-left px-3 py-2 bg-gray-50 hover:bg-brand-50 hover:border-brand-200 border border-gray-100 rounded-lg transition-all">
                  <p className="text-xs font-medium text-gray-700">{u.label}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
