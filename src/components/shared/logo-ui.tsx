import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cn } from '~/lib/utils'

const LogoUi = ({ className }: { className?: string }) => {
  return (
    <Link
      href='/'
      className={cn(
        'font-extrabold text-xl sm:text-3xl text-primary-color whitespace-nowrap  flex items-center gap-2',
        className,
      )}
    >
      <Image
        src={'/logo-app.png'}
        alt='Logo'
        width={200}
        height={200}
        className='w-14 h-14 object-cover'
      />
      AKR-SHOP
    </Link>
  )
}

export default LogoUi
