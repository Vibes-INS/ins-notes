import { ObjectStoreMeta } from 'react-indexed-db/src/indexed-hooks'
import FolderModel from './folder.model'
import NoteModel from './note.model'

export const StoreSet = ['folder', 'note'] as const
export type Store = typeof StoreSet[number]

export const config = {
  name: 'ins-notes-react',
  version: 1,
  objectStoresMeta: [
    FolderModel,
    NoteModel
  ] as ObjectStoreMeta[]
}
