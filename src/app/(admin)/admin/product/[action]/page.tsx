import { notFound } from 'next/navigation'

import ProductTable from '~/features/admin/product/product-table'
import ProductFormAction from '~/features/admin/product/product-form-action'

const PageAction = async ({
  params,
}: {
  params: Promise<{ action: string }>
}) => {
  const { action } = await params

  switch (action) {
    case 'create':
      return <ProductFormAction />
    case 'list':
      return <ProductTable />
    default:
      return notFound()
  }
}

export default PageAction
