import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { chamadosApi, usuariosApi } from '../api'
import {
  StatusBadge, PrioridadeBadge, CategoriaBadge,
  Loading, ErrorMsg, Spinner, Modal
} from '../components/ui'
import { formatDate, formatMinutes } from '../utils'
import { useAuth } from '../context/AuthContext'
import {
  ChevronLeft, MapPin, Monitor, Clock, User,
  MessageSquare, RefreshCw, CheckCircle
} from 'lucide-react'

const STATUS_TRANSITIONS = {
  ABERTO:            ['EM_ATENDIMENTO', 'CANCELADO'],
  EM_ATENDIMENTO:    ['AGUARDANDO_PARTES', 'RESOLVIDO', 'CANCELADO'],
  AGUARDANDO_PARTES: ['EM_ATENDIMENTO', 'RESOLVIDO', 'CANCELADO'],
  RESOLVIDO:         [],
  CANCELADO:         [],
}

export default function ChamadoDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [chamado, setChamado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [tecnicos, setTecnicos] = useState([])
  const [form, setForm] = useState({ novoStatus: '', comentario: '', tecnicoId: '' })
  const [saving, setSaving] = useState(false)

  const canUpdate = ['TECNICO', 'GESTOR', 'ADMIN'].includes(user?.role)

  const fetch = async () => {
    setLoading(true)
    try {
      const { data } = await chamadosApi.buscarPorId(id)
      setChamado(data)
    } catch {
      setError('Chamado não encontrado.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  useEffect(() => {
    if (showModal) {
      usuariosApi.listar({ role: 'TECNICO' }).then(r => setTecnicos(r.data)).catch(() => {})
    }
  }, [showModal])

  const handleUpdate = async () => {
    if (!form.novoStatus) return
    setSaving(true)
    try {
      await chamadosApi.atualizarStatus(id, {
        novoStatus: form.novoStatus,
        comentario: form.comentario || undefined,
        tecnicoId: form.tecnicoId ? Number(form.tecnicoId) : undefined,
      })
      setShowModal(false)
      setForm({ novoStatus: '', comentario: '', tecnicoId: '' })
      fetch()
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao atualizar.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error)   return <ErrorMsg message={error} />
  if (!chamado) return null

  const transitions = STATUS_TRANSITIONS[chamado.status] || []

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Header */}
      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gray-400">#{chamado.id}</span>
              <CategoriaBadge categoria={chamado.categoria} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{chamado.titulo}</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={chamado.status} />
            <PrioridadeBadge prioridade={chamado.prioridade} />
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">{chamado.descricao}</p>

        {/* Meta info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><User className="w-3 h-3"/> Solicitante</p>
            <p className="font-medium text-gray-800">{chamado.solicitante?.nome || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Técnico</p>
            <p className="font-medium text-gray-800">{chamado.tecnicoResponsavel?.nome || 'Não atribuído'}</p>
          </div>
          {chamado.local && (
            <div>
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Local</p>
              <p className="font-medium text-gray-800">{chamado.local.nome}</p>
            </div>
          )}
          {chamado.equipamento && (
            <div>
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Monitor className="w-3 h-3"/> Equipamento</p>
              <p className="font-medium text-gray-800">{chamado.equipamento.nome}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Aberto em</p>
            <p className="font-medium text-gray-800">{formatDate(chamado.createdAt)}</p>
          </div>
          {chamado.tempoResolucaoMinutos && (
            <div>
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Tempo resolução</p>
              <p className="font-medium text-green-700">{formatMinutes(chamado.tempoResolucaoMinutos)}</p>
            </div>
          )}
        </div>

        {/* Action button */}
        {canUpdate && transitions.length > 0 && (
          <div className="mt-4">
            <button onClick={() => setShowModal(true)} className="btn-primary">
              <RefreshCw className="w-4 h-4" /> Atualizar Status
            </button>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-600" /> Histórico
        </h2>

        {chamado.atualizacoes?.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Nenhuma atualização registrada.</p>
        ) : (
          <div className="space-y-4">
            {(chamado.atualizacoes || []).map((a, i) => (
              <div key={a.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-semibold shrink-0">
                    {a.autorNome?.charAt(0)}
                  </div>
                  {i < chamado.atualizacoes.length - 1 && (
                    <div className="w-0.5 bg-gray-100 flex-1 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{a.autorNome}</span>
                    <span className="text-xs text-gray-400">{formatDate(a.criadoEm)}</span>
                  </div>
                  {a.statusAnterior && a.novoStatus && (
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={a.statusAnterior} />
                      <span className="text-gray-400 text-xs">→</span>
                      <StatusBadge status={a.novoStatus} />
                    </div>
                  )}
                  {a.comentario && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      {a.comentario}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Atualizar Status">
        <div className="space-y-4">
          <div>
            <label className="label">Novo Status *</label>
            <div className="grid grid-cols-2 gap-2">
              {transitions.map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, novoStatus: s }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    form.novoStatus === s
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {!chamado.tecnicoResponsavel && (
            <div>
              <label className="label">Atribuir Técnico</label>
              <select className="input" value={form.tecnicoId}
                onChange={e => setForm(f => ({ ...f, tecnicoId: e.target.value }))}>
                <option value="">Selecione um técnico...</option>
                {tecnicos.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label">Comentário</label>
            <textarea className="input resize-none" rows={3}
              value={form.comentario}
              onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
              placeholder="Descreva o que foi feito ou observado..." />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button onClick={handleUpdate} disabled={!form.novoStatus || saving}
              className="btn-primary flex-1 justify-center">
              {saving ? <Spinner size="sm" /> : <CheckCircle className="w-4 h-4" />}
              {saving ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
