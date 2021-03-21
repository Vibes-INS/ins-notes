import { useIndexedDB } from 'react-indexed-db'
import { useEffect, useState } from 'react'
import { Store } from '../model/config'

interface BaseDbItem {
  id: number
  createdTime: string
  updatedTime: string
}

export interface UseDbOperation<T = BaseDbItem> {
  update: (item: T) => Promise<T[]>,
  add: (item: Omit<T, 'id' | 'createdTime' | 'updatedTime'>) => Promise<number>,
  del: (key: number) => Promise<T[]>,
}

export type UseDbReturn<T = BaseDbItem> = [
  T[],
  UseDbOperation<T>
]

export function useDb<T = BaseDbItem> (store: Store): UseDbReturn<T> {
  const db = useIndexedDB(store)
  const [data, setData] = useState<T[]>([])

  useEffect(() => {
    getAll()
  }, [])

  function getAll () {
    return db.getAll<T>().then(d => {
      setData(d)
      return d
    })
  }

  function update (item: T) {
    return db.update(item).then(() => getAll())
  }

  function add (item: Omit<T, 'id' | 'createdTime' | 'updatedTime'>) {
    return db.add({
      ...item,
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString()
    }).then(id => {
      getAll()
      return id
    })
  }

  function del (key: number) {
    return db.deleteRecord(key).then(() => getAll())
  }

  return [data, { update, add, del }]
}
