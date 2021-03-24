import { Folder } from '../model/folder.model'
import React from 'react'
import { Note } from '../model/note.model'

export interface ActiveFolder {
  id: number
  editing: boolean
}

export interface ActiveNote {
  id: number
  editing: boolean
}

export interface NoteContextValue {
  folders: Folder[]
  notes: Note[]
  activeFolder: ActiveFolder
  setActiveFolder: React.Dispatch<React.SetStateAction<ActiveFolder>>
  activeNote: ActiveNote
  setActiveNote: React.Dispatch<React.SetStateAction<ActiveNote>>
  onCreateFolder: (name: string, options?: { editing?: boolean }) => Promise<void>
  onDeleteFolder: (key: number) => Promise<void>
  onUpdateFolderName: (folder: Folder, name: string) => Promise<void>
  onUpdateNoteContent: (note: Note, content?: string) => Promise<void>
  onCreateNote: (content: string, options?: { folderId?: number }) => Promise<void>
  onDeleteNote: (key: number) => Promise<void>
}

const NoteContext = React.createContext<NoteContextValue | null>(null)

export default NoteContext
