import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('auth_token') || '',
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        console.log('Attempting login with:', credentials)
        const response = await api.post('/login', credentials)
        console.log('Login response:', response.data)

        this.user = response.data.user
        this.token = response.data.access_token
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('auth_token', response.data.access_token)
        
        return response
      } catch (error) {
        console.error('Login error:', error)
        console.error('Response data:', error.response?.data)
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      this.loading = true
      
      try {
        // Call the API to invalidate the token
        await api.post('/logout')
      } catch (error) {
        console.error('Logout API error:', error)
      } finally {
        // Clear state and localStorage regardless of API success
        this.user = null
        this.token = ''
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')
        this.loading = false
      }
    },
    
    async checkAuth() {
      if (!this.token) return null
      
      try {
        const response = await api.get('/user')
        this.user = response.data.user
        return response
      } catch (error) {
        this.user = null
        this.token = ''
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')
        throw error
      }
    }
  }
})