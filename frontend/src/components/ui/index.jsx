import { X, Loader2, AlertCircle, InboxIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { STATUS_CONFIG, PRIORIDADE_CONFIG, CATEGORIA_CONFIG, ROLE_CONFIG } from '../../utils'

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {}
  return (
    <span className={clsx('badge', cfg.color)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label || status}
    </span>
  )
}

export function PrioridadeBadge({ prioridade }) {
  const cfg = PRIORIDADE_CONFIG[prioridade] || {}
  return <span className={clsx('badge', cfg.color)}>{cfg.label || prioridade}</span>
}

export function CategoriaBadge({ categoria }) {
  const cfg = CATEGORIA_CONFIG[categoria] || { label: categoria, icon: '❓' }
  return (
    <span className="badge bg-gray-100 text-gray-700">
      {cfg.icon} {cfg.label}
    </span>
  )
}

export function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] || {}
  return <span className={clsx('badge', cfg.color)}>{cfg.label || role}</span>
}

export function Spinner({ size = 'md', className }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return <Loader2 className={clsx('animate-spin text-brand-600', s[size], className)} />
}

export function Loading({ text = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
      <Spinner size="lg" />
      <span className="text-sm">{text}</span>
    </div>
  )
}

export function ErrorMsg({ message }) {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </div>
  )
}

export function Empty({ title = 'Nenhum item encontrado', description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
      <InboxIcon className="w-10 h-10 mb-2" />
      <p className="font-medium text-gray-600">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  )
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const w = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative bg-white rounded-2xl shadow-2xl w-full animate-slide-up', w[size])}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
      >
        ← Anterior
      </button>
      <span className="text-sm text-gray-500">
        Página {page + 1} de {totalPages}
      </span>
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
        className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
      >
        Próxima →
      </button>
    </div>
  )
}
