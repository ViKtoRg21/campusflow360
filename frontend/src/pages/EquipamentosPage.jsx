import { useState, useEffect } from 'react'
import { equipamentosApi, locaisApi } from '../api'
import { Loading, Empty, ErrorMsg, Spinner, Modal } from '../components/ui'
import { Monitor, AlertTriangle, CheckCircle, PlusCircle, Trash2 } from 'lucide-react'
import { clsx } from 'clsx'

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState([])
  const [locais, setLocais]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [filtro, setFiltro]             = useState('todos')
  const [showModal, setShowModal]       = useState(false)
  const [saving, setSaving]             = useState(false)
  const [form, setForm] = useState({
    nome: '', numeroPatrimonio: '', modelo: '', fabricante: '', localId: ''
  })

  const fetchEquipamentos = () => {
    setLoading(true)
    setError('')
    equipamentosApi.listar()
      .then(r => setEquipamentos(r.data || []))
      .catch(() => setError('Erro ao carregar equipamentos. Verifique se o backend está rodando.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEquipamentos()
    locaisApi.listar().then(r => setLocais(r.data || [])).catch(() => {})
  }, [])

  const toggleOperacional = async (id, atual) => {
    try {
      await equipamentosApi.atualizarOperacional(id, !atual)
      fetchEquipamentos()
    } catch {
      alert('Erro ao atualizar equipamento.')
    }
  }

  const handleCriar = async () => {
    if (!form.nome.trim()) return alert('Nome é obrigatório.')
    setSaving(true)
    try {
      await equipamentosApi.criar({
        nome: form.nome,
        numeroPatrimonio: form.numeroPatrimonio || undefined,
        modelo: form.modelo || undefined,
        fabricante: form.fabricante || undefined,
        localId: form.localId ? Number(form.localId) : undefined,
      })
      setShowModal(false)
      setForm({ nome: '', numeroPatrimonio: '', modelo: '', fabricante: '', localId: '' })
      fetchEquipamentos()
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao cadastrar equipamento.')
    } finally {
      setSaving(false)
    }
  }

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const lista = filtro === 'defeito'
    ? equipamentos.filter(e => !e.operacional)
    : filtro === 'ok'
    ? equipamentos.filter(e => e.operacional)
    : equipamentos

  const totalDefeito = equipamentos.filter(e => !e.operacional).length
  const totalOk      = equipamentos.filter(e => e.operacional).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipamentos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalDefeito > 0
              ? <span className="text-red-600 font-medium">{totalDefeito} com defeito</span>
              : <span>{totalDefeito} com defeito</span>}
            {' · '}
            {totalOk} operacionais
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusCircle className="w-4 h-4" /> Cadastrar Equipamento
        </button>
      </div>

      {error && <ErrorMsg message={error} />}

      {/* Filtros */}
      <div className="card p-4 mb-4 flex gap-2">
        {[['todos','Todos'],['ok','Operacionais'],['defeito','Com Defeito']].map(([v, l]) => (
          <button key={v} onClick={() => setFiltro(v)}
            className={clsx('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              filtro === v ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            {l}
            {v === 'defeito' && totalDefeito > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {totalDefeito}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : lista.length === 0 ? (
        <div className="card p-12">
          <Empty
            title="Nenhum equipamento encontrado"
            description={filtro === 'defeito' ? 'Nenhum equipamento com defeito.' : 'Cadastre o primeiro equipamento.'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lista.map(e => (
            <div key={e.id} className={clsx(
              'card p-5 border-l-4 hover:shadow-md transition-shadow',
              e.operacional ? 'border-l-green-400' : 'border-l-red-400'
            )}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-start gap-3">
                  <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                    e.operacional ? 'bg-green-100' : 'bg-red-100')}>
                    <Monitor className={clsx('w-4 h-4', e.operacional ? 'text-green-700' : 'text-red-600')} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{e.nome}</h3>
                    {e.modelo && <p className="text-xs text-gray-400">{e.fabricante ? `${e.fabricante} · ` : ''}{e.modelo}</p>}
                  </div>
                </div>

                {/* Toggle operacional */}
                <button
                  onClick={() => toggleOperacional(e.id, e.operacional)}
                  title={e.operacional ? 'Marcar com defeito' : 'Marcar como operacional'}
                  className={clsx('shrink-0 p-1.5 rounded-lg transition-colors',
                    e.operacional ? 'text-green-600 hover:bg-red-50 hover:text-red-500' : 'text-red-500 hover:bg-green-50 hover:text-green-600')}>
                  {e.operacional ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </button>
              </div>

              {/* Patrimônio */}
              {e.numeroPatrimonio && (
                <p className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded mb-2">
                  PAT: {e.numeroPatrimonio}
                </p>
              )}

              {/* Local */}
              {e.local ? (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  📍 {e.local.nome}{e.local.bloco ? ` — Bloco ${e.local.bloco}` : ''}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">Sem local definido</p>
              )}

              {/* Status label */}
              <div className="mt-3 pt-3 border-t border-gray-50">
                <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full',
                  e.operacional ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                  {e.operacional ? '✓ Operacional' : '✕ Com Defeito'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Cadastrar */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Cadastrar Equipamento">
        <div className="space-y-4">
          <div>
            <label className="label">Nome *</label>
            <input className="input" value={form.nome} onChange={set('nome')}
              placeholder="Ex: Projetor Epson PowerLite" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nº Patrimônio</label>
              <input className="input" value={form.numeroPatrimonio} onChange={set('numeroPatrimonio')}
                placeholder="Ex: PAT-042" />
            </div>
            <div>
              <label className="label">Modelo</label>
              <input className="input" value={form.modelo} onChange={set('modelo')}
                placeholder="Ex: W52+" />
            </div>
          </div>

          <div>
            <label className="label">Fabricante</label>
            <input className="input" value={form.fabricante} onChange={set('fabricante')}
              placeholder="Ex: Epson, Dell, LG..." />
          </div>

          <div>
            <label className="label">Local</label>
            <select className="input" value={form.localId} onChange={set('localId')}>
              <option value="">Sem local definido</option>
              {locais.map(l => (
                <option key={l.id} value={l.id}>
                  {l.nome}{l.bloco ? ` — Bloco ${l.bloco}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button onClick={handleCriar} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <Spinner size="sm" /> : <PlusCircle className="w-4 h-4" />}
              {saving ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
