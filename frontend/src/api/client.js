import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Injeta X-User-Id automaticamente (substitua por JWT depois)
api.interceptors.request.use(config => {
  const userId = localStorage.getItem('userId') ?? '1'
  config.headers['X-User-Id'] = userId
  return config
})

// Trata erros globalmente
api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.detail ?? err.message ?? 'Erro inesperado'
    return Promise.reject(new Error(msg))
  }
)

export default api
