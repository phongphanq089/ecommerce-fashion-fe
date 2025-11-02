import React from 'react'
import HeadingSectionAdmin from '~/components/shared/HeadingSectionAdmin'
import { Card, CardContent, CardHeader } from '~/components/ui/core/card'
import NewCategoryForm from './NewCategoryForm'

const CategoriesDetail = () => {
  return (
    <Card>
      <CardHeader>
        <HeadingSectionAdmin title='New Category' />
      </CardHeader>
      <CardContent className='max-sm:p-2'>
        <NewCategoryForm />
      </CardContent>
    </Card>
  )
}

export default CategoriesDetail
