import React from 'react'
import ProductTable from '~/components/admin/product/product-list/ProductTable'

const CreateComponent = () => <div>Đây là trang TẠO MỚI</div>
const NotFoundComponent = () => <div>Hành động không hợp lệ</div>

const PageAction = async ({
  params,
}: {
  params: Promise<{ action: string }>
}) => {
  const { action } = await params

  switch (action) {
    case 'create':
      return <CreateComponent />
    case 'list':
      return <ProductTable />
    default:
      return <NotFoundComponent />
  }
}

export default PageAction
