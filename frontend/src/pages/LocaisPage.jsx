import { useState, useEffect } from 'react'
import { locaisApi } from '../api'
import { Loading, Empty, ErrorMsg, Spinner, Modal } from '../components/ui'
import { Building2, PlusCircle } from 'lucide-react'

export default function LocaisPage() {
  const [locais, setLocais]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState({ nome:'', bloco:'', andar:'', descricao:'' })

  const fetch = () => {
    setLoading(true)
    locaisApi.listar().then(r => setLocais(r.data)).catch(() => setError('Erro ao carregar locais.')).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleCriar = async () => {
    setSaving(true)
    try {
      await locaisApi.criar(form)
      setShowModal(false)
      setForm({ nome:'', bloco:'', andar:'', descricao:'' })
      fetch()
    } catch { alert('Erro ao criar local.') }
    finally { setSaving(false) }
  }

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locais</h1>
          <p className="text-sm text-gray-500 mt-0.5">Salas, laboratórios e ambientes da instituição</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <PlusCircle className="w-4 h-4" /> Novo Local
        </button>
      </div>

      {error && <ErrorMsg message={error} />}

      {loading ? <Loading /> : locais.length === 0 ? <Empty title="Nenhum local cadastrado" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locais.map(l => (
            <div key={l.id} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-brand-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{l.nome}</h3>
                  {(l.bloco || l.andar) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {l.bloco && `Bloco ${l.bloco}`}{l.bloco && l.andar && ' · '}{l.andar && `${l.andar}º andar`}
                    </p>
                  )}
                </div>
              </div>
              {l.descricao && <p className="text-sm text-gray-500 line-clamp-2">{l.descricao}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Novo Local">
        <div className="space-y-4">
          <div>
            <label className="label">Nome *</label>
            <input className="input" value={form.nome} onChange={set('nome')} placeholder="Ex: Laboratório de Informática 01" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Bloco</label>
              <input className="input" value={form.bloco} onChange={set('bloco')} placeholder="Ex: A" />
            </div>
            <div>
              <label className="label">Andar</label>
              <input className="input" value={form.andar} onChange={set('andar')} placeholder="Ex: 1" />
            </div>
          </div>
          <div>
            <label className="label">Descrição</label>
            <textarea className="input resize-none" rows={2} value={form.descricao} onChange={set('descricao')} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
            <button onClick={handleCriar} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <Spinner size="sm" /> : <PlusCircle className="w-4 h-4" />}
              {saving ? 'Criando...' : 'Criar Local'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
