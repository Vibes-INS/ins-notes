import React, { useContext, useEffect, useState } from 'react'
import NoteContext, { NoteContextValue } from '../contexts/note-context'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const NoteEditor: React.FC = () => {
  const {
    notes,
    activeNote,
    noteOperation
  } = useContext(NoteContext) as NoteContextValue
  const [activeNoteContent, setActiveNoteContent] = useState(notes.find(note => note.id === activeNote.id))
  const [inputFocus, setInputFocus] = useState(false)
  const [contents, setContents] = useState<string[]>([])

  useEffect(() => {
    const newActiveNoteContent = notes.find(note => note.id === activeNote.id)
    setActiveNoteContent(newActiveNoteContent)
    setContents(newActiveNoteContent?.content.split('\n\n') || [])
  }, [activeNote])

  useEffect(() => {
    setContents(activeNoteContent?.content.split('\n\n') || [])
  }, [inputFocus])

  function updateNoteContent (event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!activeNoteContent) return
    const content = event.target.value
    const activeNoteContentValue = { ...activeNoteContent, content }
    setActiveNoteContent(activeNoteContentValue)
    noteOperation.update(activeNoteContentValue)
  }

  const textareaClassname = inputFocus ? '' : 'opacity-0'
  return <div className="w-full h-full p-3 relative">
    {
      activeNote && <textarea
          className={`w-full h-full resize-none p-2 appearance-none outline-none text-sm ${textareaClassname}`}
          value={activeNoteContent?.content || ''}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          onChange={updateNoteContent}/>
    }
    {
      !inputFocus && <div className="absolute top-0 left-0 p-5 pointer-events-none">{
        contents.map((content, i) => <p key={i} className="mb-2 text-gray-600 text-sm">
          {content}
          <FontAwesomeIcon icon={faCopy} className="ml-2 cursor-pointer"/>
        </p>)
      }</div>
    }
  </div>
}

export default NoteEditor
