import { Folder } from '../interfaces/folder.interface'
import React from 'react'
import { Note } from '../interfaces/note.interface'

export interface ActiveFolder {
  id: string
  editing: boolean
}

export interface ActiveNote {
  id: string
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
  onDeleteFolder: (key: string) => Promise<void>
  onUpdateFolderName: (folder: Folder, name: string) => Promise<void>
  onUpdateNoteContent: (note: Note, content?: string) => Promise<void>
  onCreateNote: (content: string, options?: { folderId?: string }) => Promise<void>
  onDeleteNote: (key: string) => Promise<void>
}

const NoteContext = React.createContext<NoteContextValue | null>(null)

export default NoteContext
