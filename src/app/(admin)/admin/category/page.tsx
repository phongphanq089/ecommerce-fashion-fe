import CategoryTable from '~/features/admin/category/components/category-list/category-table'

const PageAction = async ({
  params,
}: {
  params: Promise<{ action: string }>
}) => {
  return (
    <>
      <CategoryTable />
    </>
  )
}

export default PageAction
