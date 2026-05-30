import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Usuários de seed do backend (perfil dev)
const SEED_USERS = [
  { id: 1, nome: 'Admin Sistema',    email: 'admin@campusflow.com',   role: 'ADMIN',     senha: 'admin123' },
  { id: 2, nome: 'Ana Gestora',      email: 'ana@campusflow.com',     role: 'GESTOR',    senha: 'senha123' },
  { id: 3, nome: 'Carlos Técnico',   email: 'carlos@campusflow.com',  role: 'TECNICO',   senha: 'senha123' },
  { id: 4, nome: 'Prof. Maria Silva',email: 'maria@campusflow.com',   role: 'PROFESSOR', senha: 'senha123' },
  { id: 5, nome: 'João Aluno',       email: 'joao@campusflow.com',    role: 'ALUNO',     senha: 'senha123' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cf_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (email, senha) => {
    const found = SEED_USERS.find(u => u.email === email && u.senha === senha)
    if (!found) throw new Error('E-mail ou senha inválidos.')
    const { senha: _, ...safe } = found
    setUser(safe)
    localStorage.setItem('cf_user', JSON.stringify(safe))
    return safe
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cf_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
