import React from 'react'
import Tag from './tag'

export interface Props {
  tags: string[]
  onUpdateTags?: (tags: string[]) => void
  closeable?: boolean
  editable?: boolean
  allowRepeat?: boolean
}

const TagGroup: React.FC<Props> = (props: Props) => {
  function addTag (tag: string): void {
    if (!props.onUpdateTags) return
    if (!props.allowRepeat && props.tags.includes(tag)) return
    const afterTags = [...props.tags, tag]
    props.onUpdateTags(afterTags)
  }

  function delTag (indexOrTag: number | string) {
    if (!props.closeable) return
    if (!props.onUpdateTags) return
    const index = typeof indexOrTag === 'number'
      ? indexOrTag
      : props.tags.findIndex(tag => tag === indexOrTag)
    if (index === -1) return
    props.tags.splice(index, 1)
    props.onUpdateTags(props.tags)
  }

  return <>
    {
      props.tags.map((tag, tagIndex) =>
        <Tag
          key={tagIndex}
          content={tag}
          closeable={props.closeable}
          onClose={() => delTag(tagIndex)}
        />
      )
    }
    {
      props.editable && <Tag editable={props.editable} onSave={tag => addTag(tag)}/>
    }
  </>
}

export default TagGroup
