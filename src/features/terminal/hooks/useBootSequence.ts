import { useEffect, useMemo, useState } from 'react'

type BootOptions = {
  stepDelayMs?: number
  minDurationMs?: number
  sequenceKey?: number
}

type BootState = {
  lines: string[]
  done: boolean
}

const useBootSequence = (lines: string[], options: BootOptions = {}): BootState => {
  const { stepDelayMs = 220, minDurationMs = 3000, sequenceKey = 0 } = options
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const sequence = useMemo(() => lines, [lines])

  useEffect(() => {
    let active = true
    const timers: number[] = []

    setVisibleLines([])
    setDone(false)

    sequence.forEach((line, index) => {
      const timer = window.setTimeout(() => {
        if (!active) return
        setVisibleLines((prev) => [...prev, line])
      }, index * stepDelayMs)
      timers.push(timer)
    })

    const totalDuration = Math.max(sequence.length * stepDelayMs, minDurationMs)
    const doneTimer = window.setTimeout(() => {
      if (!active) return
      setDone(true)
    }, totalDuration)
    timers.push(doneTimer)

    return () => {
      active = false
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [sequence, stepDelayMs, minDurationMs, sequenceKey])

  return { lines: visibleLines, done }
}

export default useBootSequence
