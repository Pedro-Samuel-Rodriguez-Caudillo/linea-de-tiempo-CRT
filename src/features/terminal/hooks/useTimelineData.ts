import { useCallback, useEffect, useState } from 'react'
import type { TimelineEntry } from '../types'

type TimelineStatus = 'loading' | 'ready' | 'error'

const useTimelineData = () => {
  const [data, setData] = useState<TimelineEntry[]>([])
  const [status, setStatus] = useState<TimelineStatus>('loading')

  const load = useCallback(() => {
    setStatus('loading')
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('data.json no disponible')
        }
        return response.json()
      })
      .then((payload) => {
        if (!Array.isArray(payload)) {
          throw new Error('data.json invalido')
        }
        setData(payload)
        setStatus('ready')
      })
      .catch(() => {
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, status, reload: load }
}

export default useTimelineData
