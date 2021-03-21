import React, { useContext } from 'react'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteContext, { NoteContextValue } from '../contexts/note-context'
import { Note } from '../model/note.model'
import moment from 'moment'

export interface Props {
}

export interface NoteHeaderProps {
  onAdd?: () => void
  onDelete?: () => void
}

export interface NoteItemProps {
  note: Note
  activated?: boolean
  onClick?: () => void
}

const NoteList: React.FC<Props> = () => {
  const {
    notes,
    activeNote,
    activeFolder,
    setActiveNote,
    noteOperation
  } = useContext(NoteContext) as NoteContextValue
  function onAddNote (content = '') {
    noteOperation.add({ content, folderId: activeFolder.id }).then(id => {
      setActiveNote({ id })
    })
  }
  function onDeleteNote (id: number) {
    noteOperation.del(id)
  }

  return <ul className="relative select-none">
    <NoteHeader onAdd={onAddNote} onDelete={() => onDeleteNote(activeNote.id)}/>
    {
      notes.map((note, i) => <NoteItem
        key={note.id + '' + i}
        note={note}
        onClick={() => setActiveNote({ id: note.id })}
        activated={activeNote.id === note.id}
      />)
    }
  </ul>
}

const NoteItem: React.FC<NoteItemProps> = ({ note, activated, onClick }: NoteItemProps) => {
  const activatedClassName = activated
    ? ' rounded-md bg-purple-500 text-white shadow-md'
    : 'border-gray-100'

  return <li
    className={`px-4 py-3 text-sm block mx-3 cursor-pointer border-b ${activatedClassName}`}
    onClick={() => onClick && onClick()}>
    <div className="overflow-ellipsis overflow-hidden whitespace-nowrap h-5 leading-5 font-semibold">{
      note.content.split('\n')[0] || 'New Note'
    }</div>
    <div className="text-xs h-4 leading-4 mt-1">{ moment(note.updatedTime).format('yyyy/MM/DD') }</div>
  </li>
}

const NoteHeader: React.FC<NoteHeaderProps> = ({ onAdd, onDelete }: NoteHeaderProps) => {
  return <li className="flex py-3 px-6 sticky top-0 left-0 w-full hover:shadow-md mb-2">
    { onAdd && <FontAwesomeIcon icon={faEdit} className="mr-4 cursor-pointer" onClick={() => onAdd()}/> }
    { onDelete && <FontAwesomeIcon icon={faTrashAlt} className="mr-4 cursor-pointer" onClick={() => onDelete()}/> }
  </li>
}

export default NoteList
