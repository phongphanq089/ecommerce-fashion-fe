import React, { Suspense } from 'react'
import MediaList from '~/features/media/components/MediaList'
import { LoadingUiFolder } from '~/features/media/components/LoadingUIFolder'
import ListFolderUi from '~/features/media/components/ListFolderUi'

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
