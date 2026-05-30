import axios from 'axios'

// Em produção (Vercel): usa VITE_API_URL do ambiente
// Em desenvolvimento: usa proxy do Vite (vite.config.js aponta para localhost:8081)
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const user = localStorage.getItem('cf_user')
  if (user) {
    const { id } = JSON.parse(user)
    config.headers['X-User-Id'] = id
  }
  return config
})

export const chamadosApi = {
  listar: (params) => api.get('/chamados', { params }),
  buscarPorId: (id) => api.get(`/chamados/${id}`),
  meusChamados: (params) => api.get('/chamados/meus', { params }),
  minhaFila: (params) => api.get('/chamados/minha-fila', { params }),
  criar: (data) => api.post('/chamados', data),
  atualizarStatus: (id, data) => api.patch(`/chamados/${id}/status`, data),
  deletar: (id) => api.delete(`/chamados/${id}`),
}

export const usuariosApi = {
  listar: (params) => api.get('/usuarios', { params }),
  buscarPorId: (id) => api.get(`/usuarios/${id}`),
  criar: (data) => api.post('/usuarios', data),
  desativar: (id) => api.delete(`/usuarios/${id}`),
}

export const locaisApi = {
  listar: () => api.get('/locais'),
  criar: (data) => api.post('/locais', data),
}

export const equipamentosApi = {
  listar: (localId) => api.get('/equipamentos', localId ? { params: { localId } } : {}),
  comDefeito: () => api.get('/equipamentos/defeito'),
  criar: (data) => api.post('/equipamentos', data),
  atualizarOperacional: (id, operacional) =>
    api.patch(`/equipamentos/${id}/operacional`, null, { params: { operacional } }),
  deletar: (id) => api.delete(`/equipamentos/${id}`),
}

export const dashboardApi = {
  get: () => api.get('/dashboard'),
}

export default api
