import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  _mediaApi,
  FolderDeleteType,
  FolderInputType,
  FolderUpdateType,
} from '../api/media'
import { mediaKeys } from './keys'

export const _mediaService = {
  useMediaFolder: () => {
    return useQuery({
      queryKey: mediaKeys.folder,
      queryFn: () => _mediaApi.fetchFolderMedia(),
    })
  },
  useMediaFolderCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: FolderInputType) =>
        _mediaApi.fetchFolderCreate(payload),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: mediaKeys.folder }),
    })
  },
  useMediaFolderUpdate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: FolderUpdateType) =>
        _mediaApi.fetchFolderUpdate(payload),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: mediaKeys.folder }),
    })
  },
  useMediaFolderDelete: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => _mediaApi.fetchFolderDelete(id),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: mediaKeys.folder }),
    })
  },
}
