import React from 'react'

export interface Props {
  onClick?: (event: React.MouseEvent) => void
}

const Mask: React.FC<Props> = (props: Props) => {
  return <div className="w-full h-full fixed bg-black bg-opacity-0 inset-0 z-10" onClick={props.onClick}/>
}

export default Mask
