'use client'
import { useEffect, useState } from 'react'
import { api, setAccessToken, logout } from '~/lib/api-client'
import { useAuthStore } from '~/store/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login } = useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.post('/auth/refresh-token')
        if (res.data.success) {
          setAccessToken(res.data.result.accessToken)
          // If backend returns user info optimize here
          // login(res.data.result.user)
        }
      } catch (err) {
        // Refresh token failed -> clear everything
        logout()
      }
    }
    initAuth()
  }, [])

  // Render children immediately for SEO
  return <>{children}</>
}
