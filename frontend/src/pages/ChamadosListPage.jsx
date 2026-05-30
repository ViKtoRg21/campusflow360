import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { chamadosApi } from '../api'
import { Loading, Empty, Pagination, ErrorMsg } from '../components/ui'
import ChamadoCard from '../components/chamados/ChamadoCard'
import { Search, SlidersHorizontal, PlusCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STATUSES = ['', 'ABERTO', 'EM_ATENDIMENTO', 'AGUARDANDO_PARTES', 'RESOLVIDO', 'CANCELADO']
const STATUS_LABELS = {
  '': 'Todos', ABERTO: 'Aberto', EM_ATENDIMENTO: 'Em Atendimento',
  AGUARDANDO_PARTES: 'Aguard. Peças', RESOLVIDO: 'Resolvido', CANCELADO: 'Cancelado'
}

export default function ChamadosListPage({ meusChamados = false }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchChamados = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, size: 12, sort: 'createdAt,desc' }
      if (status) params.status = status
      if (search) params.q = search

      const fn = meusChamados ? chamadosApi.meusChamados : chamadosApi.listar
      const { data } = await fn(params)
      setChamados(data.content || [])
      setTotalPages(data.totalPages || 0)
      setTotalElements(data.totalElements || 0)
    } catch {
      setError('Erro ao carregar chamados. Verifique se o backend está ativo.')
    } finally {
      setLoading(false)
    }
  }, [page, status, search, meusChamados])

  useEffect(() => { fetchChamados() }, [fetchChamados])
  useEffect(() => { setPage(0) }, [status, search])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const canOpen = ['ALUNO', 'PROFESSOR', 'ADMIN'].includes(user?.role)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {meusChamados ? 'Meus Chamados' : 'Todos os Chamados'}
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">{totalElements} chamado(s) encontrado(s)</p>
          )}
        </div>
        {canOpen && (
          <button onClick={() => navigate('/chamados/novo')} className="btn-primary">
            <PlusCircle className="w-4 h-4" /> Abrir Chamado
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                status === s
                  ? 'bg-brand-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Buscar chamados..."
              className="input pl-9 w-52 text-sm py-1.5"
            />
          </div>
          <button type="submit" className="btn-secondary text-sm py-1.5">Buscar</button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchInput('') }}
              className="text-xs text-gray-400 hover:text-gray-600">✕ limpar</button>
          )}
        </form>
      </div>

      {error && <ErrorMsg message={error} />}

      {loading ? (
        <Loading />
      ) : chamados.length === 0 ? (
        <Empty
          title="Nenhum chamado encontrado"
          description={status ? `Nenhum chamado com status "${STATUS_LABELS[status]}"` : 'Tente ajustar os filtros.'}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {chamados.map(c => <ChamadoCard key={c.id} chamado={c} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
