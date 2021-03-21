import React, { useState } from 'react'
import { copy } from '../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCopy, faEdit, faSave, faUndoAlt } from '@fortawesome/free-solid-svg-icons'

export interface Props {
  content: string
  copyable?: boolean
  editable?: boolean
  onUpdateContent?: (content: string) => void
}

const Typography: React.FC<Props> = (props: Props) => {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(props.content)

  function onChangeContent () {
    if (!props.onUpdateContent) return
    setEditing(false)
    props.onUpdateContent(content)
  }

  function onUndo () {
    setContent(props.content)
    setEditing(false)
  }

  return <>
    {
      editing
        ? <textarea
          rows={2}
          className="w-full border-none appearance-none outline-none"
          value={content}
          onChange={event => setContent(event.target.value)}
        />
        : <span className="whitespace-pre-wrap mr-2">{props.content}</span>
    }

    { props.copyable && !editing && <CopyIcon content={props.content}/> }
    {
      props.editable && <FontAwesomeIcon
          icon={editing ? faSave : faEdit}
          className="mt-3 mx-2 cursor-pointer ml-auto inline-block cursor-pointer"
          onClick={editing ? onChangeContent : () => setEditing(!editing)}
      />
    }
    {
      editing && <FontAwesomeIcon
          icon={faUndoAlt}
          className="mt-3 mx-2 cursor-pointer ml-auto inline-block cursor-pointer"
          onClick={onUndo}
      />
    }
  </>
}

const CopyIcon: React.FC<{ content: string }> = (props: { content: string }) => {
  const [copySuccess, setCopySuccess] = useState(false)

  function copyContent () {
    if (copySuccess) return
    copy(props.content)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return <FontAwesomeIcon
    icon={copySuccess ? faCheck : faCopy}
    className={`mr-2 fa-w-2 ${copySuccess ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    onClick={copyContent}
  />
}

export default Typography
