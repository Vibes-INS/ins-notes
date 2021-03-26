import React, { useEffect, useState } from 'react'
import FolderSideBar from './components/folder-sidebar'
import { Folder } from './interfaces/folder.interface'
import NoteContext, { ActiveFolder, ActiveNote, NoteContextValue } from './contexts/note-context'
import NoteList from './components/note-list'
import { Note } from './interfaces/note.interface'
import NoteEditor from './components/note-editor'
import localforage from 'localforage'
import ObjectID from 'bson-objectid'

const folderStore = localforage.createInstance({
  name: 'folder'
})

const noteStore = localforage.createInstance({
  name: 'note'
})

function App () {
  const [folders, setFolders] = useState<Folder[]>([])
  const [folderLoading, setFolderLoading] = useState(true)
  const [notes, setNotes] = useState<Note[]>([])

  const [activeFolder, setActiveFolder] = useState<ActiveFolder>({
    id: '',
    editing: false
  })
  const [activeNote, setActiveNote] = useState<ActiveNote>({
    id: '',
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
      const insertFolder: Folder = {
        id: new ObjectID().toHexString(),
        name,
        noteCount: 0,
        createdTime: new Date().toISOString(),
        updatedTime: new Date().toISOString()
      }

      await folderStore.setItem(insertFolder.id, insertFolder)
      setFolders([...folders, insertFolder])
      setActiveFolder({
        id: insertFolder.id,
        editing: Boolean(options?.editing)
      })
      setActiveNote({
        id: '',
        editing: false
      })
    },
    async onDeleteFolder (key) {
      await folderStore.removeItem(key)
      const removedFolders = folders.filter(folder => folder.id !== key)
      setFolders(removedFolders)
      const activeFolder = removedFolders[0]
      setActiveFolder({ id: activeFolder?.id, editing: false })
    },
    async onUpdateFolderName (folder, name) {
      folder.name = name
      await folderStore.setItem(folder.id, folder)
      setFolders([...folders])
    },
    async onCreateNote (content, options) {
      const folderId = options?.folderId || activeFolder.id
      if (!folders.find(folder => folder.id === folderId)) return
      const insertNote: Note = {
        id: new ObjectID().toHexString(),
        folderId,
        content,
        createdTime: new Date().toISOString(),
        updatedTime: new Date().toISOString()
      }

      await noteStore.setItem(insertNote.id, insertNote)
      setNotes([...notes, insertNote])
      setActiveNote({ id: insertNote.id, editing: true })
    },
    async onDeleteNote (key) {
      await noteStore.removeItem(key)
      const removedNotes = notes.filter(note => note.id === key)
      setNotes(removedNotes)
      const activeNote = removedNotes[0]
      setActiveNote({ id: activeNote.id, editing: false })
    },
    async onUpdateNoteContent (note, content) {
      await noteStore.setItem(note.id, note)
      notes.forEach(n => {
        if (n.id === note.id && content) {
          n.content = content
        }
      })
      setNotes([...notes])
    }
  }

  useEffect(() => {
    (async () => {
      const readFolders: Folder[] = []
      await folderStore.iterate<Folder, void>(value => readFolders.push(value))
      setFolders(readFolders)
      setFolderLoading(false)
    })()
    ;(async () => {
      const readNotes: Note[] = []
      await noteStore.iterate<Note, void>(value => readNotes.push(value))
      setNotes(readNotes)
    })()
  }, [])

  useEffect(() => {
    if (!folderLoading && !activeFolder.id) {
      if (folders.length) {
        setActiveFolder({ ...activeFolder, id: folders[0].id })
      } else {
        editContextValue.onCreateFolder('New Folder')
      }
    }
  }, [folderLoading])

  return (
    <main className="w-full h-screen m-auto flex min-w-app overflow-x-auto">
      <NoteContext.Provider value={editContextValue}>
        <section className="w-1/5 min-w-side-bar">
          <FolderSideBar/>
        </section>

        <section className="w-1/5 border-r border-gray-200 min-w-side-bar">
          { activeFolder.id && <NoteList/> }
        </section>

        <section className="w-3/5 h-full">
          { activeFolder.id && activeNote.id && <NoteEditor/> }
        </section>
      </NoteContext.Provider>
    </main>
  )
}

export default App
