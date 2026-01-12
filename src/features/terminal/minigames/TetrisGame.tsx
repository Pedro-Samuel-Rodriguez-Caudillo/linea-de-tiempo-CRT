import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls from '../hooks/useKeyControls'
import TerminalLines from '../TerminalLines'
import { createGrid, renderGrid, withBorder } from '../utils/grid'
import type { GameResult } from './types'

type Point = { x: number; y: number }

type Tetromino = {
  shape: Point[]
  pos: Point
}

type TetrisState = {
  width: number
  height: number
  grid: string[][]
  active: Tetromino
  nextTick: number
}

type TetrisGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
}

const WIDTH = 12
const HEIGHT = 14
const TICK_MAX = 5

const SHAPES: Point[][] = [
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], // O
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], // I
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }], // T
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -1 }], // L
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -1 }], // J
]

export const TETRIS_CONTROLS = 'WASD/Flechas: mover/rotar'

const createTetromino = (): Tetromino => ({
  shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  pos: { x: Math.floor(WIDTH / 2), y: 0 },
})

const buildInitialState = (): TetrisState => ({
  width: WIDTH,
  height: HEIGHT,
  grid: createGrid(WIDTH, HEIGHT, ' '),
  active: createTetromino(),
  nextTick: TICK_MAX,
})

const isValid = (shape: Point[], pos: Point, grid: string[][], w: number, h: number) => {
  return shape.every((p) => {
    const nx = p.x + pos.x
    const ny = p.y + pos.y
    return nx >= 0 && nx < w && ny >= 0 && ny < h && grid[ny][nx] === ' '
  })
}

const rotate = (shape: Point[]): Point[] => shape.map((p) => ({ x: -p.y, y: p.x }))

const updateState = (
  state: TetrisState,
  controls: ReturnType<typeof useKeyControls>,
) => {
  const events: Array<'point' | 'lifeLost'> = []
  let { active, grid, nextTick } = state

  // Horizontal move
  let dx = 0
  if (controls.consume('a') || controls.consume('arrowleft')) dx = -1
  if (controls.consume('d') || controls.consume('arrowright')) dx = 1
  if (dx !== 0 && isValid(active.shape, { x: active.pos.x + dx, y: active.pos.y }, grid, state.width, state.height)) {
    active = { ...active, pos: { ...active.pos, x: active.pos.x + dx } }
  }

  // Rotation
  if (controls.consume('w') || controls.consume('arrowup')) {
    const rs = rotate(active.shape)
    if (isValid(rs, active.pos, grid, state.width, state.height)) {
      active = { ...active, shape: rs }
    }
  }

  // Drop
  let shouldDrop = nextTick <= 0 || controls.consume('s') || controls.consume('arrowdown')
  
  if (shouldDrop) {
    if (isValid(active.shape, { x: active.pos.x, y: active.pos.y + 1 }, grid, state.width, state.height)) {
      active = { ...active, pos: { ...active.pos, y: active.pos.y + 1 } }
    } else {
      // Lock
      active.shape.forEach((p) => {
        const nx = p.x + active.pos.x
        const ny = p.y + active.pos.y
        if (ny >= 0 && ny < state.height) grid[ny][nx] = '#'
      })
      // Clear lines
      let linesCleared = 0
      for (let y = state.height - 1; y >= 0; y--) {
        if (grid[y].every((cell) => cell !== ' ')) {
          grid.splice(y, 1)
          grid.unshift(new Array(state.width).fill(' '))
          linesCleared++
          y++
        }
      }
      if (linesCleared > 0) events.push('point')
      
      active = createTetromino()
      if (!isValid(active.shape, active.pos, grid, state.width, state.height)) {
        events.push('lifeLost')
        return { state: buildInitialState(), events }
      }
    }
    nextTick = TICK_MAX
  } else {
    nextTick--
  }

  return {
    state: { ...state, active, grid, nextTick },
    events,
  } satisfies GameResult<TetrisState>
}

const renderState = (state: TetrisState) => {
  const display = state.grid.map((row) => [...row])
  state.active.shape.forEach((p) => {
    const nx = p.x + state.active.pos.x
    const ny = p.y + state.active.pos.y
    if (ny >= 0 && ny < state.height && nx >= 0 && nx < state.width) {
      display[ny][nx] = 'O'
    }
  })
  return withBorder(renderGrid(display))
}

const TetrisGame = ({ onEvent }: TetrisGameProps) => {
  const controls = useKeyControls()
  const initialState = useMemo(() => buildInitialState(), [])
  const { frame } = useGameLoop({
    initialState,
    update: updateState,
    render: renderState,
    controls,
    onEvent,
    tickMs: 150,
  })

  return (
    <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-amber-crt">
      <TerminalLines
        lines={frame}
        className="space-y-0 font-mono"
        lineClassName="whitespace-pre leading-none"
      />
    </div>
  )
}

export default TetrisGame
