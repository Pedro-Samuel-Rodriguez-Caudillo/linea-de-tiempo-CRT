import { useEffect, useRef, useState } from 'react'
import type { GameEvent, GameResult } from '../minigames/types'
import type { KeyControls } from './useKeyControls'

type UseGameLoopOptions<State> = {
  initialState: State
  update: (state: State, controls: KeyControls) => GameResult<State>
  render: (state: State) => string[]
  controls: KeyControls
  onEvent?: (event: GameEvent) => void
  tickMs?: number
  resetKey?: number | string
}

const useGameLoop = <State,>({
  initialState,
  update,
  render,
  controls,
  onEvent,
  tickMs = 90,
  resetKey,
}: UseGameLoopOptions<State>) => {
  const stateRef = useRef(initialState)
  const updateRef = useRef(update)
  const renderRef = useRef(render)
  const onEventRef = useRef(onEvent)
  const [frame, setFrame] = useState(() => render(initialState))

  useEffect(() => {
    updateRef.current = update
    renderRef.current = render
    onEventRef.current = onEvent
  })

  useEffect(() => {
    stateRef.current = initialState
    setFrame(renderRef.current(initialState))
  }, [initialState, resetKey])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const result = updateRef.current(stateRef.current, controls)
      stateRef.current = result.state
      setFrame(renderRef.current(result.state))
      result.events?.forEach((event) => onEventRef.current?.(event))
    }, tickMs)

    return () => window.clearInterval(timer)
  }, [controls, tickMs])

  return { frame, state: stateRef.current }
}

export default useGameLoop
