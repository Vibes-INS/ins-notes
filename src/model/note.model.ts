import { ObjectStoreMeta } from 'react-indexed-db'

export default {
  store: 'note',
  storeConfig: { keyPath: 'id', autoIncrement: true },
  storeSchema: [
    { name: 'content', keypath: 'content', options: { unique: false } },
    { name: 'folderId', keypath: 'folderId', options: { unique: false } },
    { name: 'createdTime', keypath: 'createdTime', options: { unique: false } },
    { name: 'updatedTime', keypath: 'updatedTime', options: { unique: false } }
  ]
} as ObjectStoreMeta

export interface Note {
  id: number
  content: string
  folderId: number
  createdTime: string
  updatedTime: string
}
