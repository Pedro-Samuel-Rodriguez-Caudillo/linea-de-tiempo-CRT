import { useEffect } from 'react'
import useArraySequence from './hooks/useArraySequence'
import TerminalLines from './TerminalLines'

type BriefingScreenProps = {
  lines: string[]
  onComplete: () => void
}

const BriefingScreen = ({ lines, onComplete }: BriefingScreenProps) => {
  const { visibleItems, done } = useArraySequence(lines, {
    stepDelayMs: 60,
    initialDelayMs: 500,
  })

  useEffect(() => {
    if (done) {
      const timer = setTimeout(() => {
        onComplete()
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [done, onComplete])

  return (
    <div className="space-y-4">
      <TerminalLines
        lines={visibleItems}
        className="space-y-2 text-sm text-amber-crt"
        lineClassName="whitespace-pre"
      />
    </div>
  )
}

export default BriefingScreen
