'use client'
import { Button } from '~/components/ui/core/button'
import { api, logout } from '~/lib/api-client'
import { useAuthStore } from '~/store/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LogoUi from '~/components/shared/logo-ui'
import Link from 'next/link'
const Header = () => {
  const [isLogin, setIsLogin] = useState(false)

  const { isAuthenticated, logout: logoutStore } = useAuthStore()
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.log(error)
    } finally {
      logoutStore()
      logout() // Clear cookies and redirect
    }
  }
  useEffect(() => {
    setIsLogin(isAuthenticated)
  }, [isAuthenticated])

  return (
    <header className='w-full py-6 px-8 md:px-16 flex justify-between items-center z-10 text-white border-b'>
      <LogoUi />
      <nav className='hidden md:flex space-x-12 items-center'>
        <div className='flex items-center gap-2'>
          {isLogin && (
            <div className='flex items-center gap-2'>
              <Button variant='default' onClick={handleLogout}>
                Log out
              </Button>
              <Link href='/admin/dashboard'>Dashboard</Link>
            </div>
          )}
          {!isLogin && (
            <Button
              variant='default'
              onClick={() => router.push('/auth/sign-in')}
            >
              Log in
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
