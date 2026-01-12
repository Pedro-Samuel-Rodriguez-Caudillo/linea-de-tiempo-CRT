import { useCallback, useEffect, useMemo, useRef } from 'react'

export type KeyControls = {
  pressed: Set<string>
  consume: (key: string) => boolean
  triggerDown: (key: string) => void
  triggerUp: (key: string) => void
}

const normalizeKey = (key: string) => {
  if (key === ' ') return 'space'
  if (key === 'spacebar') return 'space'
  return key.toLowerCase()
}

const DEFAULT_PREVENT = new Set([
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'space',
])

type UseKeyControlsOptions = {
  enabled?: boolean
  preventKeys?: string[]
}

const useKeyControls = (options: UseKeyControlsOptions = {}): KeyControls => {
  const { enabled = true, preventKeys } = options
  const pressed = useRef<Set<string>>(new Set())
  const pressedOnce = useRef<Set<string>>(new Set())
  const preventSet = useRef<Set<string>>(
    new Set(preventKeys?.map(normalizeKey) ?? Array.from(DEFAULT_PREVENT)),
  )

  useEffect(() => {
    preventSet.current = new Set(
      preventKeys?.map(normalizeKey) ?? Array.from(DEFAULT_PREVENT),
    )
  }, [preventKeys])

  useEffect(() => {
    if (!enabled) {
      pressed.current.clear()
      pressedOnce.current.clear()
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = normalizeKey(event.key)
      if (preventSet.current.has(key)) {
        event.preventDefault()
      }
      if (!pressed.current.has(key)) {
        pressedOnce.current.add(key)
      }
      pressed.current.add(key)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = normalizeKey(event.key)
      pressed.current.delete(key)
      pressedOnce.current.delete(key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      pressed.current.clear()
      pressedOnce.current.clear()
    }
  }, [enabled])

  const triggerDown = useCallback((key: string) => {
    const normalized = normalizeKey(key)
    if (!pressed.current.has(normalized)) {
      pressedOnce.current.add(normalized)
    }
    pressed.current.add(normalized)
  }, [])

  const triggerUp = useCallback((key: string) => {
    const normalized = normalizeKey(key)
    pressed.current.delete(normalized)
    pressedOnce.current.delete(normalized)
  }, [])

  const consume = useCallback((key: string) => {
    const normalized = normalizeKey(key)
    if (!pressedOnce.current.has(normalized)) {
      return false
    }
    pressedOnce.current.delete(normalized)
    return true
  }, [])

  return useMemo(
    () => ({
      pressed: pressed.current,
      consume,
      triggerDown,
      triggerUp,
    }),
    [consume, triggerDown, triggerUp],
  )
}

export default useKeyControls
