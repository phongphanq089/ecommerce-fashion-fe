import React from 'react'
import ListFolderUi from '~/components/admin/media/ListFolderUi'
import MediaList from '~/components/admin/media/MediaList'

const PageMedia = () => {
  return (
    <div className='w-full'>
      <ListFolderUi />
      <MediaList />
    </div>
  )
}

export default PageMedia
