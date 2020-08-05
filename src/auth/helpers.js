export const API_URL = '/api'
export const API_ADMIN_URL = '/api/admin'

export const isAllowed = (user, rights) => rights.some((right) => user.rights.includes(right))

export const hasRoles = (user, roles) => {
  const list = Array.isArray(roles) ? roles : [roles]
  return list.some((role) => user.roles.includes(role))
}

export const authHeader = (user) => {
  return { 'Authorization': `Bearer ${user.token}` }
}
