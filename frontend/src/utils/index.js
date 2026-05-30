export const STATUS_CONFIG = {
  ABERTO:            { label: 'Aberto',           color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  EM_ATENDIMENTO:    { label: 'Em Atendimento',   color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  AGUARDANDO_PARTES: { label: 'Aguard. Peças',    color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  RESOLVIDO:         { label: 'Resolvido',         color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  CANCELADO:         { label: 'Cancelado',         color: 'bg-gray-100 text-gray-500',     dot: 'bg-gray-400' },
}

export const PRIORIDADE_CONFIG = {
  BAIXA:   { label: 'Baixa',   color: 'bg-gray-100 text-gray-600' },
  MEDIA:   { label: 'Média',   color: 'bg-blue-100 text-blue-700' },
  ALTA:    { label: 'Alta',    color: 'bg-orange-100 text-orange-700' },
  CRITICA: { label: 'Crítica', color: 'bg-red-100 text-red-700' },
}

export const CATEGORIA_CONFIG = {
  INFRAESTRUTURA: { label: 'Infraestrutura', icon: '🏗️' },
  EQUIPAMENTO:    { label: 'Equipamento',    icon: '🖥️' },
  INTERNET:       { label: 'Internet',       icon: '📡' },
  LABORATORIO:    { label: 'Laboratório',    icon: '🔬' },
  ACADEMICO:      { label: 'Acadêmico',      icon: '📚' },
  ADMINISTRATIVO: { label: 'Administrativo', icon: '📋' },
  SEGURANCA:      { label: 'Segurança',      icon: '🔒' },
  OUTRO:          { label: 'Outro',          icon: '❓' },
}

export const ROLE_CONFIG = {
  ADMIN:     { label: 'Admin',     color: 'bg-red-100 text-red-700' },
  GESTOR:    { label: 'Gestor',    color: 'bg-purple-100 text-purple-700' },
  TECNICO:   { label: 'Técnico',   color: 'bg-green-100 text-green-700' },
  PROFESSOR: { label: 'Professor', color: 'bg-blue-100 text-blue-700' },
  ALUNO:     { label: 'Aluno',     color: 'bg-gray-100 text-gray-700' },
}

export const formatDate = (date) => {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(date))
}

export const formatMinutes = (min) => {
  if (!min && min !== 0) return '—'
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}
