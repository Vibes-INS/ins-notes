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
    id: -1,
    editing: false
  })
  const editContextValue: NoteContextValue = {
    folders,
    get notes (): Note[] {
      return notes.filter(note => note.folderId === activeFolder.id)
    },
    activeFolder,
    setActiveFolder,
    activeNote,
    setActiveNote,
    async onCreateFolder (name, options) {
      const folderId = await folderOperation.add({ name, noteCount: 0 })
      setActiveFolder({
        id: folderId,
        editing: Boolean(options?.editing)
      })
      setActiveNote({
        id: -1,
        editing: false
      })
    },
    async onDeleteFolder (key) {
      await folderOperation.del(key).then(newFolders => {
        if (key === activeFolder.id) {
          const folder = newFolders[0]
          const id = folder?.id === undefined ? -1 : folder.id
          setActiveFolder({ id, editing: false })
        }
      })
    },
    async onUpdateFolderName (folder, name) {
      folder.name = name
      await folderOperation.update(folder)
    },
    async onCreateNote (content, options) {
      const folderId = options?.folderId || activeFolder.id
      if (!folders.find(folder => folder.id === folderId)) return
      await noteOperation.add({ content, folderId }).then(id => {
        setActiveNote({ id, editing: true })
      })
    },
    async onDeleteNote (key) {
      await noteOperation.del(key).then(newNotes => {
        const note = newNotes[0]
        const id = note?.id === undefined ? -1 : note.id
        setActiveNote({ id, editing: false })
      })
    },
    async onUpdateNoteContent (note, content) {
      if (content) note.content = content
      await noteOperation.update(note)
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
    <main className="w-full h-screen m-auto flex min-w-app overflow-x-auto">
      <NoteContext.Provider value={editContextValue}>
        <section className="w-1/5 min-w-side-bar">
          <FolderSideBar/>
        </section>

        <section className="w-1/5 border-r border-gray-200 min-w-side-bar">
          { activeFolder.id !== -1 && <NoteList/> }
        </section>

        <section className="w-3/5 h-full">
          { activeFolder.id !== -1 && activeNote.id !== -1 && <NoteEditor/> }
        </section>
      </NoteContext.Provider>
    </main>
  )
}

export default App
