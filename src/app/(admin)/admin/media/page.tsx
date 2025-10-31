import React, { Suspense } from 'react'
import ListFolderUi from '~/features/admin/media/components/ListFolderUi'
import { LoadingUiFolder } from '~/features/admin/media/components/LoadingUIFolder'
import MediaList from '~/features/admin/media/components/MediaList'

const PageMedia = () => {
  return (
    <div className='w-full'>
      <Suspense fallback={<LoadingUiFolder />}>
        <ListFolderUi />
        <MediaList />
      </Suspense>
    </div>
  )
}

export default PageMedia
