import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext, { NoteContextValue } from '../contexts/note-context'
import { faCheck, faCopy, faEdit, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { copy } from '../utils'

const NoteEditor: React.FC = () => {
  const {
    notes,
    activeNote,
    onUpdateNoteContent,
    setActiveNote
  } = useContext(NoteContext) as NoteContextValue
  const [activeNoteContent, setActiveNoteContent] = useState(notes.find(note => note.id === activeNote.id))
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    updateActiveNote().then(() => {
      if (activeNote.editing) inputRef?.current?.focus()
    })
  }, [activeNote])
  async function updateActiveNote () {
    await setActiveNoteContent(notes.find(note => note.id === activeNote.id))
  }
  async function onChangeTextarea (content: string) {
    if (!activeNoteContent) return
    setActiveNoteContent({ ...activeNoteContent, content })
  }
  async function onSave () {
    if (activeNoteContent) {
      await onUpdateNoteContent(activeNoteContent, activeNoteContent.content)
    }
  }
  async function onFocus () {
    await setActiveNote({ ...activeNote, editing: true })
    inputRef?.current?.focus()
  }

  const textareaClassname = activeNote.editing ? '' : 'opacity-0'
  return <div className="w-full h-full relative max-h-full flex flex-col">
    <ToolsBar
      onEdit={() => onFocus()}
      editing={activeNote.editing}
      setEditing={() => setActiveNote({ ...activeNote, editing: false })}/>
    {
      activeNote && <textarea
          className={`w-full h-full resize-none p-3 appearance-none outline-none text-sm ${textareaClassname}`}
          ref={inputRef}
          value={activeNoteContent?.content || ''}
          onChange={event => onChangeTextarea(event.target.value)}
          placeholder="Please input the content"
          onBlur={onSave}/>
    }
    {
      !activeNote.editing && <Renderer content={activeNoteContent?.content || ''}/>
    }
  </div>
}

interface ToolsBarProps {
  onEdit?: () => void
  editing?: boolean
  setEditing?: (editing: boolean) => void
}

const ToolsBar: React.FC<ToolsBarProps> = ({
  onEdit,
  editing,
  setEditing
}: ToolsBarProps) => {
  function onClick () {
    if (editing && setEditing) {
      setEditing(false)
    } else if (onEdit) {
      onEdit()
    }
  }

  return <header className="flex py-3 px-3 sticky top-0 left-0 w-full mb-2 border-b border-gray-200 z-30">
    { onEdit && <FontAwesomeIcon
        icon={editing ? faSave : faEdit}
        className="mr-6 cursor-pointer"
        onClick={onClick}
    /> }
  </header>
}

interface RendererProps {
  content: string
}

const Renderer: React.FC<RendererProps> = ({ content }: RendererProps) => {
  const lines = content
    .trim()
    .split('\n\n')
    .filter(x => x)

  return <div className="absolute top-0 left-0 px-3 pt-14 pb-3 w-full h-full">
    {
      lines.length > 0
        ? lines.map((line, i) => <Paragraph key={i} content={line}/>)
        : <div className="opacity-25 pointer-events-none absolute left-0 right-0 text-center py-4">
            No Content
          </div>
    }
  </div>
}

interface ParagraphProps {
  content: string
}

const Paragraph: React.FC<ParagraphProps> = ({ content }: ParagraphProps) => {
  const [copySucceeded, setCopySucceeded] = useState(false)
  async function onCopy (line: string) {
    copy(line)
    setCopySucceeded(true)
    setTimeout(() => setCopySucceeded(false), 3000)
  }

  return <p className="mb-2 text-gray-600 text-sm whitespace-pre-wrap break-all">
    { content }
    <FontAwesomeIcon
      icon={copySucceeded ? faCheck : faCopy}
      className="ml-2 cursor-pointer inline-block"
      onClick={() => onCopy(content)}
    />
  </p>
}

export default NoteEditor
