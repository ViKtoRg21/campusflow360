import { useState, useEffect } from 'react'
import { dashboardApi, chamadosApi } from '../api'
import { Loading, ErrorMsg, StatusBadge } from '../components/ui'
import { formatMinutes, formatDate, CATEGORIA_CONFIG } from '../utils'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  Ticket, Clock, CheckCircle, XCircle,
  TrendingUp, Users, Trophy, ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const COLORS = ['#15803d','#22c55e','#4ade80','#86efac','#bbf7d0','#d97706','#3b82f6']
const STATUS_COLORS = { ABERTO:'#3b82f6', EM_ATENDIMENTO:'#d97706', AGUARDANDO_PARTES:'#8b5cf6', RESOLVIDO:'#22c55e', CANCELADO:'#9ca3af' }

export default function DashboardPage() {
  const navigate = useNavigate()
  const [dash, setDash] = useState(null)
  const [recenteChamados, setRecenteChamados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      dashboardApi.get(),
      chamadosApi.listar({ size: 5, sort: 'createdAt,desc' })
    ]).then(([d, c]) => {
      setDash(d.data)
      setRecenteChamados(c.data.content || [])
    }).catch(() => setError('Erro ao carregar dashboard. Verifique se o backend está ativo.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading text="Carregando indicadores..." />
  if (error)   return <ErrorMsg message={error} />
  if (!dash)   return null

  const categoriaData = Object.entries(dash.chamadosPorCategoria || {}).map(([k, v]) => ({
    name: CATEGORIA_CONFIG[k]?.label || k, value: v
  }))

  const statusData = Object.entries(dash.chamadosPorStatus || {}).map(([k, v]) => ({
    name: k.replace('_', ' '), value: v, color: STATUS_COLORS[k] || '#9ca3af'
  }))

  const total = dash.totalAbertos + dash.totalEmAtendimento + dash.totalResolvidos + dash.totalCancelados

  const kpis = [
    { label: 'Total Abertos',     value: dash.totalAbertos,         icon: Ticket,       color: 'blue',  sub: `${total} total` },
    { label: 'Em Atendimento',    value: dash.totalEmAtendimento,   icon: TrendingUp,   color: 'amber', sub: 'em andamento' },
    { label: 'Resolvidos',        value: dash.totalResolvidos,      icon: CheckCircle,  color: 'green', sub: 'concluídos' },
    { label: 'Tempo Médio',       value: formatMinutes(dash.tempoMedioResolucaoMinutos), icon: Clock, color: 'brand', sub: 'para resolver' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Gerencial</h1>
        <p className="text-sm text-gray-500 mt-0.5">Visão consolidada de todos os chamados</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value ?? '—'}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Bar chart - por categoria */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Chamados por Categoria</h2>
          {categoriaData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sem dados</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoriaData} margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Chamados" radius={[4,4,0,0]}>
                  {categoriaData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart - por status */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Distribuição por Status</h2>
          {statusData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sem dados</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name" paddingAngle={2}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n.replace('_', ' ')]} />
                <Legend formatter={v => v.replace('_', ' ')} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ranking técnicos */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Ranking de Técnicos
          </h2>
          {(!dash.rankingTecnicos || dash.rankingTecnicos.length === 0) ? (
            <p className="text-sm text-gray-400 text-center py-6">Sem dados de técnicos</p>
          ) : (
            <div className="space-y-3">
              {dash.rankingTecnicos.slice(0, 5).map((t, i) => (
                <div key={t.nomeTecnico} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-amber-100 text-amber-700' :
                    i === 1 ? 'bg-gray-100 text-gray-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800">{t.nomeTecnico}</span>
                      <span className="text-sm font-semibold text-brand-700">{t.totalChamados}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full transition-all"
                        style={{ width: `${(t.totalChamados / (dash.rankingTecnicos[0]?.totalChamados || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chamados recentes */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-brand-600" /> Recentes
            </h2>
            <button onClick={() => navigate('/chamados')}
              className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {recenteChamados.map(c => (
              <div key={c.id} onClick={() => navigate(`/chamados/${c.id}`)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{c.titulo}</p>
                  <p className="text-xs text-gray-400">{formatDate(c.createdAt)}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
