import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chamadosApi, locaisApi, equipamentosApi } from '../api'
import { PlusCircle, ChevronLeft } from 'lucide-react'
import { Spinner, ErrorMsg } from '../components/ui'

const CATEGORIAS = [
  ['INFRAESTRUTURA','Infraestrutura'],
  ['EQUIPAMENTO','Equipamento'],
  ['INTERNET','Internet'],
  ['LABORATORIO','Laboratório'],
  ['ACADEMICO','Acadêmico'],
  ['ADMINISTRATIVO','Administrativo'],
  ['SEGURANCA','Segurança'],
  ['OUTRO','Outro'],
]
const PRIORIDADES = [
  ['BAIXA','Baixa'],['MEDIA','Média'],['ALTA','Alta'],['CRITICA','Crítica']
]

export default function NovoChamadoPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    titulo: '', descricao: '', categoria: '', prioridade: 'MEDIA', localId: '', equipamentoId: ''
  })
  const [locais, setLocais]           = useState([])
  const [todosEquip, setTodosEquip]   = useState([])   // todos do backend
  const [equipamentos, setEquipamentos] = useState([]) // filtrados pelo local
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')

  // Carrega locais e TODOS os equipamentos no mount
  useEffect(() => {
    locaisApi.listar().then(r => setLocais(r.data || [])).catch(() => {})
    equipamentosApi.listar().then(r => setTodosEquip(r.data || [])).catch(() => {})
  }, [])

  // Filtra equipamentos pelo local selecionado
  useEffect(() => {
    if (form.localId) {
      const filtrados = todosEquip.filter(e =>
        e.local && String(e.local.id) === String(form.localId) && e.operacional
      )
      setEquipamentos(filtrados)
    } else {
      setEquipamentos(todosEquip.filter(e => e.operacional))
    }
    setForm(f => ({ ...f, equipamentoId: '' }))
  }, [form.localId, todosEquip])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        titulo: form.titulo,
        descricao: form.descricao,
        categoria: form.categoria,
        prioridade: form.prioridade,
        ...(form.localId      && { localId: Number(form.localId) }),
        ...(form.equipamentoId && { equipamentoId: Number(form.equipamentoId) }),
      }
      const { data } = await chamadosApi.criar(payload)
      navigate(`/chamados/${data.id}`)
    } catch (err) {
      const detail = err.response?.data?.detail
      const fields = err.response?.data?.fields
      if (fields) {
        setError('Campos inválidos: ' + Object.entries(fields).map(([k,v]) => `${k}: ${v}`).join(', '))
      } else {
        setError(detail || 'Erro ao abrir chamado.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Abrir Chamado</h1>
        <p className="text-gray-500 text-sm mt-1">Descreva o problema com o máximo de detalhes possível.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {error && <ErrorMsg message={error} />}

        {/* Título */}
        <div>
          <label className="label">Título *</label>
          <input className="input" required value={form.titulo} onChange={set('titulo')}
            placeholder="Ex: Projetor da sala 205 não liga" minLength={5} maxLength={150} />
          <p className="text-xs text-gray-400 mt-1">{form.titulo.length}/150 caracteres</p>
        </div>

        {/* Descrição */}
        <div>
          <label className="label">Descrição *</label>
          <textarea className="input resize-none" rows={4} required value={form.descricao}
            onChange={set('descricao')}
            placeholder="Descreva o problema em detalhes: quando começou, o que foi tentado, impacto nas atividades..."
            minLength={10} />
        </div>

        {/* Categoria + Prioridade */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Categoria *</label>
            <select className="input" required value={form.categoria} onChange={set('categoria')}>
              <option value="">Selecione...</option>
              {CATEGORIAS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Prioridade</label>
            <select className="input" value={form.prioridade} onChange={set('prioridade')}>
              {PRIORIDADES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Local + Equipamento */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Local <span className="text-gray-400 font-normal">(opcional)</span></label>
            <select className="input" value={form.localId} onChange={set('localId')}>
              <option value="">Selecione um local...</option>
              {locais.map(l => (
                <option key={l.id} value={l.id}>
                  {l.nome}{l.bloco ? ` — Bloco ${l.bloco}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">
              Equipamento <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <select className="input" value={form.equipamentoId} onChange={set('equipamentoId')}
              disabled={equipamentos.length === 0}>
              <option value="">
                {equipamentos.length === 0 ? 'Nenhum equipamento disponível' : 'Selecione...'}
              </option>
              {equipamentos.map(e => (
                <option key={e.id} value={e.id}>
                  {e.nome}{e.numeroPatrimonio ? ` (${e.numeroPatrimonio})` : ''}
                </option>
              ))}
            </select>
            {equipamentos.length === 0 && todosEquip.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                Nenhum equipamento cadastrado. <a href="/equipamentos" className="underline">Cadastrar agora.</a>
              </p>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1 justify-center">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? <Spinner size="sm" /> : <PlusCircle className="w-4 h-4" />}
            {loading ? 'Abrindo...' : 'Abrir Chamado'}
          </button>
        </div>
      </form>
    </div>
  )
}
