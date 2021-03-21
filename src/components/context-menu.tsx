import React, { useState } from 'react'
import Mask from './mask'

interface ContextMenuProps {
  items: Array<{ name: string, onClick: () => void }>
  pos: {
    y: number
    x: number
  }
  onClickMask?: (event: React.MouseEvent) => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({ pos, items, onClickMask }: ContextMenuProps) => {
  const style = {
    top: pos.y + 'px',
    left: pos.x + 'px',
    height: 'fit-content'
  }

  return <>
    <ul
      className="fixed -bottom-full -right-20 bg-white shadow-xl z-20 p-2 w-40 max-h-56 overflow-x-hidden overflow-y-auto block rounded-md border"
      style={style}
    >
      {
        items.map((item, i) =>
          <li key={i} onClick={item.onClick} className="text-gray-700 h-6 leading-6 hover:bg-purple-100 px-2 active:bg-purple-600 active:text-white rounded">{ item.name }</li>
        )
      }
    </ul>
    <Mask onClick={onClickMask}/>
  </>
}

type useMenuReturn = [
  { active: boolean, pos: { x: number, y: number } },
  { deactivate: () => void, activate: (event: React.MouseEvent) => void }
]

export function useMenu (): useMenuReturn {
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  function deactivate () {
    setActive(false)
  }

  function activate (event: React.MouseEvent) {
    setActive(true)
    setPos({ y: event.clientY, x: event.clientX })
  }

  return [{ active, pos }, { deactivate, activate }]
}

export default ContextMenu
