import { computed } from 'vue'

export function useAuth() {
  const token      = computed(() => localStorage.getItem('eco_token'))
  const user       = computed(() => JSON.parse(localStorage.getItem('eco_user') || 'null'))
  const isLoggedIn = computed(() => !!token.value)
  const isPenyewa  = computed(() => user.value ? user.value.role === 'penyewa' : false)
  const isPemilik  = computed(() => user.value ? user.value.role === 'pemilik' : false)

  const setAuth = (tokenVal, userVal) => {
    localStorage.setItem('eco_token', tokenVal)
    localStorage.setItem('eco_user', JSON.stringify(userVal))
  }

  const clearAuth = () => {
    localStorage.removeItem('eco_token')
    localStorage.removeItem('eco_user')
  }

  return { token, user, isLoggedIn, isPenyewa, isPemilik, setAuth, clearAuth }
}