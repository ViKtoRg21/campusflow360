import { useNavigate } from 'react-router-dom'
import { MapPin, User, Calendar } from 'lucide-react'
import { StatusBadge, PrioridadeBadge, CategoriaBadge } from '../ui'
import { formatDate } from '../../utils'

export default function ChamadoCard({ chamado }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/chamados/${chamado.id}`)}
      className="card p-5 hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-400"># {chamado.id}</span>
            <CategoriaBadge categoria={chamado.categoria} />
          </div>
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-brand-700 transition-colors">
            {chamado.titulo}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={chamado.status} />
          <PrioridadeBadge prioridade={chamado.prioridade} />
        </div>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{chamado.descricao}</p>

      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-3">
        {chamado.solicitante && (
          <span className="flex items-center gap-1.5">
            <User className="w-3 h-3" />
            {chamado.solicitante.nome}
          </span>
        )}
        {chamado.local && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {chamado.local.nome}
          </span>
        )}
        <span className="flex items-center gap-1.5 ml-auto">
          <Calendar className="w-3 h-3" />
          {formatDate(chamado.createdAt)}
        </span>
      </div>
    </div>
  )
}
