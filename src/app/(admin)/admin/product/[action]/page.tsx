import React from 'react'
import ProductDetail from '~/features/admin/product/components/ProductDetail'
import ProductTable from '~/features/admin/product/components/ProductList/ProductTable'

const NotFoundComponent = () => <div>Hành động không hợp lệ</div>

const PageAction = async ({
  params,
}: {
  params: Promise<{ action: string }>
}) => {
  const { action } = await params

  switch (action) {
    case 'create':
      return <ProductDetail />
    case 'list':
      return <ProductTable />
    default:
      return <NotFoundComponent />
  }
}

export default PageAction
