import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls from '../hooks/useKeyControls'
import TerminalLines from '../TerminalLines'
import { clamp, createGrid, renderGrid, withBorder } from '../utils/grid'
import type { GameResult } from './types'

type BreakoutState = {
  width: number
  height: number
  paddleWidth: number
  paddleX: number
  ballX: number
  ballY: number
  ballVx: number
  ballVy: number
  serveDelay: number
  blocks: boolean[][]
}

type BreakoutGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
}

const WIDTH = 24
const HEIGHT = 12
const BLOCK_ROWS = 3
const BLOCK_START_Y = 1

export const BREAKOUT_CONTROLS = 'Flechas o A/D para mover'

const createBlocks = () =>
  Array.from({ length: BLOCK_ROWS }, () =>
    Array.from({ length: WIDTH }, () => true),
  )

const resetBall = (state: BreakoutState) => ({
  ...state,
  ballX: Math.floor(state.width / 2),
  ballY: state.height - 3,
  ballVx: Math.random() > 0.5 ? 1 : -1,
  ballVy: -1,
  serveDelay: 8,
})

const buildInitialState = (): BreakoutState => ({
  width: WIDTH,
  height: HEIGHT,
  paddleWidth: 5,
  paddleX: Math.floor((WIDTH - 5) / 2),
  ballX: Math.floor(WIDTH / 2),
  ballY: HEIGHT - 3,
  ballVx: 1,
  ballVy: -1,
  serveDelay: 8,
  blocks: createBlocks(),
})

const updateState = (
  state: BreakoutState,
  controls: ReturnType<typeof useKeyControls>,
) => {
  const events: Array<'point' | 'lifeLost'> = []
  let paddleX = state.paddleX

  if (controls.pressed.has('arrowleft') || controls.pressed.has('a')) {
    paddleX -= 1
  }
  if (controls.pressed.has('arrowright') || controls.pressed.has('d')) {
    paddleX += 1
  }

  paddleX = clamp(paddleX, 0, state.width - state.paddleWidth)

  let { ballX, ballY, ballVx, ballVy, serveDelay, blocks } = state

  if (serveDelay > 0) {
    serveDelay -= 1
  } else {
    ballX += ballVx
    ballY += ballVy
  }

  if (ballX <= 0) {
    ballX = 0
    ballVx = 1
  }
  if (ballX >= state.width - 1) {
    ballX = state.width - 1
    ballVx = -1
  }
  if (ballY <= 0) {
    ballY = 0
    ballVy = 1
  }

  const paddleY = state.height - 2
  if (ballY === paddleY && ballX >= paddleX && ballX < paddleX + state.paddleWidth) {
    ballVy = -1
    const hit = ballX - (paddleX + Math.floor(state.paddleWidth / 2))
    ballVx = hit === 0 ? 0 : hit > 0 ? 1 : -1
  }

  if (ballY > state.height - 1) {
    events.push('lifeLost')
    return {
      state: resetBall({ ...state, paddleX }),
      events,
    } satisfies GameResult<BreakoutState>
  }

  const blockRow = ballY - BLOCK_START_Y
  if (blockRow >= 0 && blockRow < BLOCK_ROWS) {
    if (blocks[blockRow][ballX]) {
      blocks = blocks.map((row, rowIndex) =>
        rowIndex === blockRow
          ? row.map((cell, colIndex) => (colIndex === ballX ? false : cell))
          : row,
      )
      events.push('point')
      ballVy = ballVy * -1
    }
  }

  const hasBlocks = blocks.some((row) => row.some(Boolean))
  if (!hasBlocks) {
    blocks = createBlocks()
  }

  return {
    state: {
      ...state,
      paddleX,
      ballX,
      ballY,
      ballVx,
      ballVy,
      serveDelay,
      blocks,
    },
    events,
  } satisfies GameResult<BreakoutState>
}

const renderState = (state: BreakoutState) => {
  const grid = createGrid(state.width, state.height, ' ')

  state.blocks.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        grid[BLOCK_START_Y + rowIndex][colIndex] = '#'
      }
    })
  })

  const paddleY = state.height - 2
  for (let i = 0; i < state.paddleWidth; i += 1) {
    grid[paddleY][state.paddleX + i] = '='
  }

  if (state.serveDelay === 0) {
    grid[state.ballY][state.ballX] = 'o'
  }

  return withBorder(renderGrid(grid))
}

const BreakoutGame = ({ onEvent }: BreakoutGameProps) => {
  const controls = useKeyControls()
  const initialState = useMemo(() => buildInitialState(), [])
  const { frame } = useGameLoop({
    initialState,
    update: updateState,
    render: renderState,
    controls,
    onEvent,
    tickMs: 90,
  })

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-emerald-100">
      <TerminalLines
        lines={frame}
        className="space-y-0 font-mono"
        lineClassName="whitespace-pre leading-none"
      />
    </div>
  )
}

export default BreakoutGame
