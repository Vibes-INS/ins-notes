import React, { useEffect, useState } from 'react'
import { initDB } from 'react-indexed-db'

import { config as DbConfig } from './model/config'
import FolderSideBar from './components/folder-sidebar'
import { Folder } from './model/folder.model'
import { useDb } from './utils/db'
import NoteContext, { ActiveFolder, ActiveNote, NoteContextValue } from './contexts/note-context'
import NoteList from './components/note-list'
import { Note } from './model/note.model'
import NoteEditor from './components/note-editor'

try {
  initDB(DbConfig)
} catch {
}

function App () {
  const [folders, folderOperation, folderDbStatus] = useDb<Folder>('folder')
  const [notes, noteOperation] = useDb<Note>('note')
  const [activeFolder, setActiveFolder] = useState<ActiveFolder>({
    id: -1,
    editing: false
  })
  const [activeNote, setActiveNote] = useState<ActiveNote>({
    id: -1
  })
  const editContextValue: NoteContextValue = {
    folders,
    get notes (): Note[] {
      return notes.filter(note => note.folderId === activeFolder.id)
    },
    folderOperation,
    noteOperation,
    activeFolder,
    setActiveFolder,
    activeNote,
    setActiveNote,
    async onCreateFolder (name, options): Promise<void> {
      const folderId = await folderOperation.add({ name, noteCount: 0 })
      setActiveFolder({
        id: folderId,
        editing: Boolean(options?.editing)
      })
    }
  }

  useEffect(() => {
    if (!folderDbStatus.loading && activeFolder.id === -1) {
      if (folders.length) {
        setActiveFolder({ ...activeFolder, id: folders[0].id })
      } else {
        editContextValue.onCreateFolder('New Folder')
      }
    }
  }, [folderDbStatus.loading])

  return (
    <main className="w-full h-screen m-auto flex">
      <NoteContext.Provider value={editContextValue}>
        <section className="w-1/5 min-w-side-bar">
          <FolderSideBar/>
        </section>

        <section className="w-1/5 border-r border-gray-200 min-w-side-bar">
          { activeFolder.id !== -1 && <NoteList/> }
        </section>

        <section className="w-3/5 h-full">
          <NoteEditor/>
        </section>
      </NoteContext.Provider>
    </main>
  )
}

export default App
