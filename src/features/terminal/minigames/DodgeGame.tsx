import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls from '../hooks/useKeyControls'
import TerminalLines from '../TerminalLines'
import { clamp, createGrid, randomInt, renderGrid, withBorder } from '../utils/grid'
import type { GameResult } from './types'

type DodgeItem = {
  x: number
  y: number
  kind: 'good' | 'bad'
}

type DodgeState = {
  width: number
  height: number
  playerX: number
  items: DodgeItem[]
  tick: number
}

type DodgeGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
}

const WIDTH = 40
const HEIGHT = 24

export const DODGE_CONTROLS = 'Flechas o A/D para mover'

const buildInitialState = (): DodgeState => ({
  width: WIDTH,
  height: HEIGHT,
  playerX: Math.floor(WIDTH / 2),
  items: [],
  tick: 0,
})

const updateState = (state: DodgeState, controls: ReturnType<typeof useKeyControls>) => {
  const events: Array<'point' | 'lifeLost'> = []
  let playerX = state.playerX

  if (controls.pressed.has('arrowleft') || controls.pressed.has('a')) {
    playerX -= 1
  }
  if (controls.pressed.has('arrowright') || controls.pressed.has('d')) {
    playerX += 1
  }

  playerX = clamp(playerX, 0, state.width - 1)

  const movedItems = state.items.map((item) => ({ ...item, y: item.y + 1 }))
  const remainingItems = movedItems.filter((item) => {
    if (item.y === state.height - 1 && item.x === playerX) {
      events.push(item.kind === 'good' ? 'point' : 'lifeLost')
      return false
    }
    return item.y < state.height
  })

  const spawnChance = 0.35
  if (Math.random() < spawnChance) {
    const isGood = Math.random() < 0.3
    remainingItems.push({
      x: randomInt(0, state.width - 1),
      y: 0,
      kind: isGood ? 'good' : 'bad',
    })
  }

  const nextState: DodgeState = {
    ...state,
    playerX,
    items: remainingItems,
    tick: state.tick + 1,
  }

  return { state: nextState, events } satisfies GameResult<DodgeState>
}

const renderState = (state: DodgeState) => {
  const grid = createGrid(state.width, state.height, ' ')

  state.items.forEach((item) => {
    if (item.y >= 0 && item.y < state.height) {
      grid[item.y][item.x] = item.kind === 'good' ? '.' : 'X'
    }
  })

  grid[state.height - 1][state.playerX] = '@'

  return withBorder(renderGrid(grid))
}

const DodgeGame = ({ onEvent }: DodgeGameProps) => {
  const controls = useKeyControls()
  const initialState = useMemo(() => buildInitialState(), [])
  const { frame } = useGameLoop({
    initialState,
    update: updateState,
    render: renderState,
    controls,
    onEvent,
    tickMs: 120,
  })

  return (
    <div className="terminal-grid rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-amber-crt">
      <TerminalLines
        lines={frame}
        className="space-y-0 font-mono"
        lineClassName="whitespace-pre leading-none"
      />
    </div>
  )
}

export default DodgeGame
