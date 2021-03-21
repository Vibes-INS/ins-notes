import moment from 'moment'
import React from 'react'

export interface Props {
  content: string
  updatedTime: string
}

const MenuItem: React.FC<Props> = (props: Props) => {
  return <section className="w-full border-b border-solid border-gray-200 px-3 py-2">
    <div className="h-6 leading-6 text-sm">{ props.content }</div>
    <div className="h-4 leading-4 text-xs">
      { moment(props.updatedTime).format('lll') }
    </div>
  </section>
}

export default MenuItem
