import VerifyEmailForm from '~/features/public/auth/verify-email-form'
import { Suspense } from 'react'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  )
}
