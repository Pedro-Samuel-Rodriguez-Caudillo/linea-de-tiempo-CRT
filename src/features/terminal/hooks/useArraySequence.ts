import { useEffect, useState } from 'react'

type SequenceOptions = {
  stepDelayMs?: number
  initialDelayMs?: number
}

type SequenceState<T> = {
  visibleItems: T[]
  done: boolean
}

export const useArraySequence = <T>(
  items: T[],
  options: SequenceOptions = {},
): SequenceState<T> => {
  const { stepDelayMs = 100, initialDelayMs = 0 } = options
  const [visibleCount, setVisibleCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setVisibleCount(0)
    setDone(false)

    if (items.length === 0) {
      setDone(true)
      return
    }

    let active = true
    let timeouts: number[] = []

    // Initial delay before starting
    const startTimeout = window.setTimeout(() => {
      if (!active) return

      items.forEach((_, index) => {
        const timer = window.setTimeout(() => {
          if (!active) return
          setVisibleCount((prev) => prev + 1)
        }, index * stepDelayMs)
        timeouts.push(timer)
      })

      // Completion timer
      const doneTimer = window.setTimeout(() => {
        if (!active) return
        setDone(true)
      }, items.length * stepDelayMs)
      timeouts.push(doneTimer)

    }, initialDelayMs)
    
    timeouts.push(startTimeout)

    return () => {
      active = false
      timeouts.forEach((t) => window.clearTimeout(t))
    }
  }, [items, stepDelayMs, initialDelayMs])

  return {
    visibleItems: items.slice(0, visibleCount),
    done: items.length > 0 ? visibleCount === items.length : true,
  }
}

export default useArraySequence
