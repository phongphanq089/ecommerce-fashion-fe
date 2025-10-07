import React, { Suspense } from 'react'
import ListFolderUi from '~/components/admin/media/ListFolderUi'
import MediaList from '~/components/admin/media/MediaList'
import { Skeleton } from '~/components/ui/core/skeleton'

const PageMedia = () => {
  return (
    <div className='w-full'>
      <Suspense fallback={<LoadingUiFolder />}>
        <ListFolderUi />
      </Suspense>
      <MediaList />
    </div>
  )
}

export default PageMedia

const LoadingUiFolder = () => {
  return (
    <div className='flex items-center gap-3.5'>
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
      <Skeleton className='h-[70px] min-w-[120px] rounded-xl' />
    </div>
  )
}
