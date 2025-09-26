import axios from 'axios'
import { URL_API } from '~/settings/apiconfig'
// import { useAuthStore } from '~/stores/useAuthStore'

const https = axios.create({
  baseURL: URL_API,
  withCredentials: true,
})

https.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await https.post('/refreshToken')

        return https(originalRequest)
      } catch {
        // useAuthStore.getState().logout()
        console.log('Token refresh failed')
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unknown error from server'

    return Promise.reject(new Error(message))
  }
)

export default https
