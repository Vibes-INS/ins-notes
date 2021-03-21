import { Folder } from '../model/folder.model'
import React from 'react'
import { Note } from '../model/note.model'
import { UseDbOperation } from '../utils/db'

export interface ActiveFolder {
  id: number
  editing: boolean
}

export interface ActiveNote {
  id: number
}

export interface NoteContextValue {
  folders: Folder[]
  notes: Note[]
  folderOperation: UseDbOperation<Folder>
  noteOperation: UseDbOperation<Note>
  activeFolder: ActiveFolder
  setActiveFolder: React.Dispatch<React.SetStateAction<ActiveFolder>>
  activeNote: ActiveNote
  setActiveNote: React.Dispatch<React.SetStateAction<ActiveNote>>
  onCreateFolder: (name: string, options?: { editing?: boolean }) => Promise<void>
}

const NoteContext = React.createContext<NoteContextValue | null>(null)

export default NoteContext
