import React, { Suspense } from 'react'
import ListFolderUi from '~/components/admin/media/ListFolderUi'
import MediaList from '~/components/admin/media/MediaList'
import { LoadingUiFolder } from '~/components/admin/shared/LoadingUIFolder'

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
