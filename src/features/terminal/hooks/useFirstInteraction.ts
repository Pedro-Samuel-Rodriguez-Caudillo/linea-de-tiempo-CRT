import { useEffect, useRef } from 'react'

type UseFirstInteractionOptions = {
  enabled: boolean
  onInteract: () => void
}

const useFirstInteraction = ({ enabled, onInteract }: UseFirstInteractionOptions) => {
  const triggered = useRef(false)

  useEffect(() => {
    if (!enabled) {
      triggered.current = false
      return
    }

    const handleInteract = () => {
      if (triggered.current) return
      triggered.current = true
      onInteract()
    }

    window.addEventListener('pointerdown', handleInteract)
    window.addEventListener('keydown', handleInteract)

    return () => {
      window.removeEventListener('pointerdown', handleInteract)
      window.removeEventListener('keydown', handleInteract)
    }
  }, [enabled, onInteract])
}

export default useFirstInteraction
