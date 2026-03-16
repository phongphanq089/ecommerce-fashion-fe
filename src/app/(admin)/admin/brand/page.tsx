import React from 'react'
import BrandTable from '~/features/admin/brand/components/brand-list/brand-table'

export const metadata = {
  title: 'Brand Management | Admin Dashboard',
  description: 'Manage product brands',
}

const BrandPage = () => {
  return (
    <div className=''>
      <BrandTable />
    </div>
  )
}

export default BrandPage
