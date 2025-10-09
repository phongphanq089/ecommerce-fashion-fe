/* eslint-disable @typescript-eslint/no-explicit-any */
import https from '~/config/https'
import { ApiResponse } from '~/types/apiConfig'

interface FolderType {
  id: string
  name: string
  parentId: string | null
}

export interface FolderInputType {
  name: string
  parentId: string | null
}

export interface FolderUpdateType {
  id: string
  name: string
}

export interface FolderDeleteType {
  id: string
}
export const _mediaApi = {
  fetchFolderMedia: async () => {
    const response: ApiResponse<FolderType[]> = await https.get(
      '/media-folder/folder-getAll'
    )

    return response.data
  },
  fetchFolderCreate: async (payload: FolderInputType) => {
    const response: ApiResponse<FolderType> = await https.post(
      '/media-folder/create',
      payload
    )
    return response
  },
  fetchFolderUpdate: async (payload: FolderUpdateType) => {
    const response: ApiResponse<FolderType> = await https.put(
      '/media-folder/folder-update',
      payload
    )
    return response
  },
  fetchFolderDelete: async (id: string) => {
    const response: ApiResponse<any> = await https.delete(
      `/media-folder/delete/${id}`
    )
    return response
  },
}
