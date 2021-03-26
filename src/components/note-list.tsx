import React, { useContext } from 'react'
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteContext, { NoteContextValue } from '../contexts/note-context'
import { Note } from '../interfaces/note.interface'
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
    setActiveNote,
    onDeleteNote,
    onCreateNote
  } = useContext(NoteContext) as NoteContextValue

  return <ul className="relative select-none overflow-y-auto h-full pb-4">
    <NoteHeader
      onAdd={() => onCreateNote('')}
      onDelete={notes.length ? () => onDeleteNote(activeNote.id) : undefined}/>
    {
      notes.map((note, i) => <NoteItem
        key={note.id + '' + i}
        note={note}
        onClick={() => setActiveNote({ id: note.id, editing: false })}
        activated={activeNote.id === note.id}
      />)
    }
    {
      notes.length === 0 &&
        <div className="text-xl text-center absolute left-0 right-0 top-52 opacity-25">
          No Notes
        </div>
    }
  </ul>
}

const NoteItem: React.FC<NoteItemProps> = ({ note, activated, onClick }: NoteItemProps) => {
  const activatedClassName = activated
    ? 'rounded-md bg-purple-500 text-white shadow-md'
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
  return <li className="flex py-3 px-6 sticky top-0 left-0 w-full mb-2 border-b border-gray-200 bg-white">
    { onAdd && <FontAwesomeIcon icon={faPlus} className="mr-6 cursor-pointer" onClick={() => onAdd()}/> }
    { onDelete && <FontAwesomeIcon icon={faTrashAlt} className="mr-4 cursor-pointer" onClick={() => onDelete()}/> }
  </li>
}

export default NoteList
