import { ObjectStoreMeta } from 'react-indexed-db'

export default {
  store: 'folder',
  storeConfig: { keyPath: 'id', autoIncrement: true },
  storeSchema: [
    { name: 'name', keypath: 'name', options: { unique: true } },
    { name: 'noteCount', keypath: 'noteCount', options: { unique: false } },
    { name: 'createdTime', keypath: 'createdTime', options: { unique: false } },
    { name: 'updatedTime', keypath: 'updatedTime', options: { unique: false } }
  ]
} as ObjectStoreMeta

export interface Folder {
  id: number
  noteCount: number
  name: string
  createdTime: string
  updatedTime: string
}
