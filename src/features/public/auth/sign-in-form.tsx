'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authApi } from '~/lib/api-client'
import { useAuthStore } from '~/store/auth-store'
import BannerImage from './banner-image'
import Link from 'next/link'
import IconGoogle from '~/components/ui/icon/icon-google'
import { Button } from '~/components/ui/core/button'
import { Input } from '~/components/ui/core/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, SignInSchemaType } from './auth.validate'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

const SignInForm = () => {
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const onSubmit = async (data: SignInSchemaType) => {
    console.log(data)
    setIsLoading(true)

    try {
      const res = await authApi.post('/login', data)

      if (res.data.success) {
        login(res.data.result)
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        toast.error(res.data.message || 'Login failed')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='grid md:grid-cols-2 gap-4'>
      <BannerImage />
      <div className='w-full flex items-center justify-center p-8 sm:p-12 md:p-24 bg-background-light dark:bg-background-dark'>
        <div className='w-full max-w-md'>
          <div className='space-y-2 mb-10'>
            <h1 className='text-3xl font-semibold tracking-tight'>
              Welcome back
            </h1>
            <p className='text-slate-500 dark:text-gray-400 font-light'>
              Please sign in to your account
            </p>
          </div>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <Input
                label='Email address'
                id='email'
                placeholder='Email address'
                type='email'
                {...register('email')}
                errorMessage={errors.email?.message}
              />
              <Input
                label='Password'
                id='password'
                placeholder='Password'
                type='password'
                {...register('password')}
                errorMessage={errors.password?.message}
              />
            </div>
            <div className='flex items-center justify-end'>
              <Link
                className='text-xs font-medium hover:underline text-slate-600 dark:text-gray-400'
                href='#'
              >
                Forgot your password?
              </Link>
            </div>
            <Button className='w-full' type='submit' disabled={isLoading}>
              {isLoading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                'Sign in'
              )}
            </Button>
            <div className='relative py-4'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-slate-200 dark:border-white/10'></div>
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background-light dark:bg-background-dark px-4 text-slate-500 dark:text-gray-500 font-medium tracking-widest'>
                  or continue with
                </span>
              </div>
            </div>
            <div className='w-full'>
              <button
                className='flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors w-full'
                type='button'
              >
                <IconGoogle />
                <span className='text-sm font-medium'>Google</span>
              </button>
            </div>
            <p className='text-center text-sm text-slate-500 dark:text-gray-400 mt-8'>
              Don't have an account?
              <Link
                className='font-semibold text-slate-900 dark:text-white hover:underline ml-1'
                href='/auth/sign-up'
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignInForm
