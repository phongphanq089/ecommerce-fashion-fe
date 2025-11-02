import { notFound } from 'next/navigation'
import CategoriesDetail from '~/features/admin/category/components/CategoriesDetail'
import CategoryTable from '~/features/admin/category/components/CategoriesList/CategoryTable'

const PageAction = async ({
  params,
}: {
  params: Promise<{ action: string }>
}) => {
  const { action } = await params

  switch (action) {
    case 'create':
      return <CategoriesDetail />
    case 'list':
      return <CategoryTable />
    default:
      return notFound()
  }
}

export default PageAction
