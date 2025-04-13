import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Create a custom axios instance
const api = axios.create({ 
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true
})

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
})

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  // Make api available as this.$api
  app.config.globalProperties.$api = api
})

// Export the api instance for use in components
export { api }