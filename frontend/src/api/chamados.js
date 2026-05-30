import api from './client'

export const chamadosApi = {
  listar: (params) => api.get('/chamados', { params }),
  buscarPorId: (id) => api.get(`/chamados/${id}`),
  meusChamados: (params) => api.get('/chamados/meus', { params }),
  minhaFila: (params) => api.get('/chamados/minha-fila', { params }),
  criar: (data) => api.post('/chamados', data),
  atualizarStatus: (id, data) => api.patch(`/chamados/${id}/status`, data),
  deletar: (id) => api.delete(`/chamados/${id}`),
}
