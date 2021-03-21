import React, { useContext, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare, faFolder, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import { Folder } from '../model/folder.model'
import ContextMenu, { useMenu } from './context-menu'
import NoteContext, { NoteContextValue } from '../contexts/note-context'

const FolderSideBar: React.FC = () => {
  const {
    folders,
    folderOperation,
    activeFolder,
    setActiveFolder,
    onCreateFolder
  } = useContext(NoteContext) as NoteContextValue
  function onDeleteFolder (id: number) {
    folderOperation.del(id)
  }
  function onUpdateFolderName (folder: Folder, name: string) {
    folder.name = name
    folderOperation.update(folder)
  }

  return <ul className="col-span-2 col-span bg-purple-50 h-screen w-full flex flex-col pt-4">
    {
      folders.map((folder, i) => <FolderItem
        name={folder.name}
        key={i + folder.name}
        active={folder.id === activeFolder.id}
        edit={{
          editing: folder.id === activeFolder.id && activeFolder.editing,
          onChangeName: name => onUpdateFolderName(folder, name)
        }}
        onDelete={() => onDeleteFolder(folder.id)}
        onClick={() => setActiveFolder({ id: folder.id, editing: false })}
      />)
    }

    <li className="px-3 mx-2 py-1.5 mb-3 text-sm select-none cursor-pointer text-gray-600 mt-auto"
        onClick={() => onCreateFolder(`New Folder (${folders.length})`, { editing: true })}>
      <FontAwesomeIcon icon={faPlusSquare}/>
      <span className="ml-2">New Folder</span>
    </li>
  </ul>
}

interface FolderItemProps {
  name: string
  edit?: {
    editing: boolean
    onChangeName: (name: string) => void
  }
  onDelete?: () => void
  active?: boolean
  onClick?: () => void
}

const FolderItem: React.FC<FolderItemProps> = (props: FolderItemProps) => {
  const [editing, setEditing] = useState(props.edit?.editing)
  const [name, setName] = useState(props.name)
  const [menuInfo, menuOperation] = useMenu()
  const inputRef = useRef<HTMLInputElement>(null)
  const menuList = [
    {
      name: 'Rename Folder',
      onClick: () => activateInput()
    },
    {
      name: 'Delete Folder',
      onClick: () => onDelete()
    }
  ]
  const activeClassName = props.active ? ' bg-purple-500 text-white' : 'hover:bg-purple-100 text-gray-700'

  function onEnter (event: React.KeyboardEvent) {
    if (event.code !== 'Enter') return
    onSave()
  }

  async function activateInput () {
    await setEditing(true)
    focusInput()
    menuOperation.deactivate()
  }

  function focusInput () {
    inputRef?.current?.focus()
    inputRef?.current?.select()
  }

  function onDelete () {
    if (!props.onDelete) return
    props.onDelete()
    menuOperation.deactivate()
  }

  function onSave () {
    setEditing(false)
    props.edit?.onChangeName(name)
  }

  useEffect(() => {
    focusInput()
  }, [])

  return <li
    className={`px-3 mx-2 py-1.5 text-sm select-none cursor-pointer rounded flex hover-show-child relative ${activeClassName}`}
    onClick={props.onClick}>
    <FontAwesomeIcon icon={faFolder} className="my-auto"/>
    {
      editing
        ? <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={event => setName(event.target.value)}
          onBlur={onSave}
          onKeyUp={onEnter}
          className="appearance-none bg-white text-sm w-full box-border text-sm ml-2 h-4 leading-4 text-gray-700 rounded-sm"
        />
        : <>
          <span className="ml-2 block w-full overflow-hidden overflow-ellipsis h-4 leading-4">{name}</span>
          <FontAwesomeIcon icon={faSlidersH} className="hover-child my-auto h-3" onClick={menuOperation.activate}/>
        </>
    }
    {
      menuInfo.active &&
        <ContextMenu
          items={menuList}
          pos={{ y: menuInfo.pos.y, x: menuInfo.pos.x }}
          onClickMask={menuOperation.deactivate}
        />
    }
  </li>
}

export default FolderSideBar
