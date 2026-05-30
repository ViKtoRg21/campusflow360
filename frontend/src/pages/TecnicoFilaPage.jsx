import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chamadosApi } from '../api'
import { Loading, Empty, ErrorMsg, StatusBadge, PrioridadeBadge } from '../components/ui'
import { formatDate } from '../utils'
import { Wrench, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function TecnicoFilaPage() {
  const navigate = useNavigate()
  const [fila, setFila]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    chamadosApi.minhaFila({ size: 50, sort: 'prioridade,desc' })
      .then(r => setFila(r.data.content || []))
      .catch(() => setError('Erro ao carregar fila.'))
      .finally(() => setLoading(false))
  }, [])

  const criticos = fila.filter(c => c.prioridade === 'CRITICA' || c.prioridade === 'ALTA')
  const normais  = fila.filter(c => c.prioridade !== 'CRITICA' && c.prioridade !== 'ALTA')

  const ChamadoRow = ({ c }) => (
    <div onClick={() => navigate(`/chamados/${c.id}`)}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer rounded-xl transition-colors group border border-transparent hover:border-brand-100">
      <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
        <Wrench className="w-4 h-4 text-brand-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-mono text-gray-400">#{c.id}</span>
          <PrioridadeBadge prioridade={c.prioridade} />
        </div>
        <p className="font-medium text-gray-900 truncate group-hover:text-brand-700 transition-colors">
          {c.titulo}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" />
          {formatDate(c.createdAt)}
          {c.local && <> · <span>{c.local.nome}</span></>}
        </p>
      </div>
      <StatusBadge status={c.status} />
    </div>
  )

  if (loading) return <Loading />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Minha Fila</h1>
        <p className="text-sm text-gray-500 mt-0.5">{fila.length} chamado(s) atribuído(s) a você</p>
      </div>

      {error && <ErrorMsg message={error} />}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total na Fila',     value: fila.length,                                color: 'brand', icon: Wrench },
          { label: 'Alta/Crítica',      value: criticos.length,                            color: 'red',   icon: AlertTriangle },
          { label: 'Em Atendimento',    value: fila.filter(c => c.status === 'EM_ATENDIMENTO').length, color: 'amber', icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {fila.length === 0 ? (
        <div className="card p-12">
          <Empty title="Fila vazia" description="Nenhum chamado atribuído a você no momento." />
        </div>
      ) : (
        <div className="space-y-4">
          {criticos.length > 0 && (
            <div className="card p-4">
              <h2 className="text-sm font-semibold text-red-600 flex items-center gap-2 mb-3 px-2">
                <AlertTriangle className="w-4 h-4" /> Urgentes
              </h2>
              <div className="divide-y divide-gray-50">
                {criticos.map(c => <ChamadoRow key={c.id} c={c} />)}
              </div>
            </div>
          )}
          {normais.length > 0 && (
            <div className="card p-4">
              <h2 className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-3 px-2">
                <CheckCircle2 className="w-4 h-4" /> Normal
              </h2>
              <div className="divide-y divide-gray-50">
                {normais.map(c => <ChamadoRow key={c.id} c={c} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
