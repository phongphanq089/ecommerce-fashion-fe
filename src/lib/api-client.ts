// lib/api-client.ts
import axios from 'axios'

export const API_BASE_URL =
  'https://ecommerce-fashion-be-phongphanq0894143-npyksiu6.leapcell.dev/api'

// Dùng cho API Public (Gọi trực tiếp)
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Dùng cho API nhạy cảm (Gọi qua Proxy Next.js)
export const authApi = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
})
