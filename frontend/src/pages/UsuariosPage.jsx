import { useState, useEffect } from 'react'
import { usuariosApi } from '../api'
import { Loading, Empty, ErrorMsg, RoleBadge, Spinner, Modal } from '../components/ui'
import { formatDate } from '../utils'
import { UserPlus, Trash2, Search } from 'lucide-react'

const ROLES = ['ALUNO','PROFESSOR','TECNICO','GESTOR','ADMIN']

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [modalError, setModalError] = useState('')
  const [form, setForm]         = useState({ nome:'', email:'', senha:'', role:'ALUNO', telefone:'' })

  const fetch = () => {
    setLoading(true)
    usuariosApi.listar().then(r => setUsuarios(r.data)).catch(() => setError('Erro ao carregar.')).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCriar = async () => {
    setModalError('')
    if (!form.nome.trim())  return setModalError('Nome é obrigatório.')
    if (!form.email.trim()) return setModalError('E-mail é obrigatório.')
    if (form.senha.length < 6) return setModalError('Senha deve ter no mínimo 6 caracteres.')

    setSaving(true)
    try {
      await usuariosApi.criar({
        ...form,
        email: form.email.toLowerCase().trim(), // normaliza para minúsculo
      })
      setShowModal(false)
      setModalError('')
      setForm({ nome:'', email:'', senha:'', role:'ALUNO', telefone:'' })
      fetch()
    } catch (err) {
      const data = err.response?.data
      // Erro de validação com campos detalhados (422)
      if (data?.fields) {
        const msgs = Object.entries(data.fields).map(([k, v]) => `${k}: ${v}`).join(' | ')
        setModalError(msgs)
      } else if (data?.detail) {
        setModalError(data.detail)
      } else if (err.response?.status === 400) {
        setModalError('E-mail já cadastrado ou dados inválidos.')
      } else {
        setModalError('Erro ao criar usuário. Verifique se o backend está ativo.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDesativar = async (id, nome) => {
    if (!confirm(`Desativar "${nome}"?`)) return
    await usuariosApi.desativar(id)
    fetch()
  }

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-sm text-gray-500 mt-0.5">{usuarios.length} usuário(s) ativo(s)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <UserPlus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      {error && <ErrorMsg message={error} />}

      <div className="card mb-4 p-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="input pl-9 text-sm" />
        </div>
      </div>

      {loading ? <Loading /> : filtrados.length === 0 ? <Empty title="Nenhum usuário encontrado" /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Nome','E-mail','Papel','Cadastro','Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrados.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-semibold text-xs">
                        {u.nome.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{u.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDesativar(u.id, u.nome)}
                      className="p-1.5 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setModalError('') }} title="Novo Usuário">
        <div className="space-y-4">
          {modalError && <ErrorMsg message={modalError} />}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Nome *</label>
              <input className="input" value={form.nome} onChange={set('nome')} placeholder="Nome completo" />
            </div>
            <div className="col-span-2">
              <label className="label">E-mail *</label>
              <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="email@exemplo.com" />
            </div>
            <div>
              <label className="label">Senha *</label>
              <input className="input" type="password" value={form.senha} onChange={set('senha')} placeholder="Min. 6 caracteres" />
            </div>
            <div>
              <label className="label">Telefone</label>
              <input className="input" value={form.telefone} onChange={set('telefone')} placeholder="(00) 00000-0000" />
            </div>
            <div className="col-span-2">
              <label className="label">Papel *</label>
              <select className="input" value={form.role} onChange={set('role')}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setShowModal(false); setModalError('') }} className="btn-secondary flex-1 justify-center">Cancelar</button>
            <button onClick={handleCriar} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <Spinner size="sm" /> : <UserPlus className="w-4 h-4" />}
              {saving ? 'Criando...' : 'Criar Usuário'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
