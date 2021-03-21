import React from 'react'
import TagGroup, { Props as TagGroupProps } from './tag-group'
import Typography, { Props as TypographyProps } from './typography'

export interface CardProps extends TypographyProps {
  tags?: TagGroupProps
}

const Card: React.FC<CardProps> = (props: CardProps) => {
  return <div className="w-full rounded overflow-hidden bg-white dark:bg-gray-800 my-2 shadow-md">
    <div className="px-6 py-4">
      <Typography
        content={props.content}
        onUpdateContent={props.onUpdateContent}
        editable={true}
        copyable={props.copyable}
      />
    </div>

    {
      props.tags && <div className="px-6 pb-4">
        <TagGroup
            tags={props.tags.tags}
            onUpdateTags={props.tags.onUpdateTags}
            editable={props.tags.editable}
            closeable={props.tags.closeable}
        />
      </div>
    }
  </div>
}

export default Card
