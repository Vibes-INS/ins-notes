import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'

export interface Props {
  content?: string
  closeable?: boolean
  editable?: boolean
  onSave?: (tag: string) => void
  onClose?: (content?: string) => void
}

const Tag: React.FC<Props> = (props: Props) => {
  const [input, setInput] = useState('')

  function onEnter (event: React.KeyboardEvent) {
    if (!['Enter'].includes(event.code)) return
    onSave()
  }

  function onSave () {
    if (!props.onSave || !input) return
    props.onSave(input)
    setInput('')
  }

  function onClose () {
    if (!props.onClose) return
    props.onClose(props.content)
  }

  const Input = <>
    <input
      placeholder="Hashtag"
      className="bg-opacity-0 bg-none bg-white appearance-none outline-none font-semibold mr-2 w-16"
      value={input}
      onChange={event => setInput(event.target.value)}
      onKeyUp={onEnter}
    />
    <span className="select-none cursor-pointer" onClick={onSave}>
      <FontAwesomeIcon icon={faPlus}/>
    </span>
  </>

  return <label
    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-1 inline-flex">
    {
      props.editable
        ? Input
        : <>#{props.content}</>
    }

    {
      props.closeable &&
      <span
          className="transform rotate-45 scale-150 ml-2 inline-block cursor-pointer select-none"
          onClick={onClose}
      >+</span>
    }
  </label>
}

export default Tag
