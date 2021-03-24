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
  UseDbOperation<T>,
  { loading: boolean }
]

export function useDb<T = BaseDbItem> (store: Store): UseDbReturn<T> {
  const db = useIndexedDB(store)
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAll()
  }, [])

  function getAll () {
    setLoading(true)
    return db.getAll<T>().then(d => {
      setData(d)
      setLoading(false)
      return d
    })
  }

  function update (item: T) {
    return db.update(item).then(() => getAll())
  }

  async function add (item: Omit<T, 'id' | 'createdTime' | 'updatedTime'>) {
    const key = db.add({
      ...item,
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString()
    })
    await getAll()
    return key
  }

  function del (key: number) {
    return db.deleteRecord(key).then(() => getAll())
  }

  return [data, { update, add, del }, { loading }]
}
