import axios from 'axios'

// Instancia compartida de axios. En desarrollo la API se sirve vía proxy de Vite.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
})

// Interceptor de errores: extrae el mensaje cuando es posible.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail || error.response?.statusText || 'Error de red'
    return Promise.reject(new Error(message))
  }
)

export default api
