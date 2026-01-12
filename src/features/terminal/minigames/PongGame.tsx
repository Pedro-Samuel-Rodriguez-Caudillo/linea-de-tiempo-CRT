import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls from '../hooks/useKeyControls'
import TerminalLines from '../TerminalLines'
import { clamp, createGrid, renderGrid, withBorder } from '../utils/grid'
import type { GameResult } from './types'

type PongState = {
  width: number
  height: number
  paddleSize: number
  playerY: number
  aiY: number
  ballX: number
  ballY: number
  ballVx: number
  ballVy: number
  serveDelay: number
}

type PongGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
}

const WIDTH = 28
const HEIGHT = 12

export const PONG_CONTROLS = 'W/S o Flechas arriba/abajo'

const resetBall = (state: PongState, direction: 1 | -1) => ({
  ...state,
  ballX: Math.floor(state.width / 2),
  ballY: Math.floor(state.height / 2),
  ballVx: direction,
  ballVy: Math.random() > 0.5 ? 1 : -1,
  serveDelay: 8,
})

const buildInitialState = (): PongState => ({
  width: WIDTH,
  height: HEIGHT,
  paddleSize: 3,
  playerY: Math.floor(HEIGHT / 2) - 1,
  aiY: Math.floor(HEIGHT / 2) - 1,
  ballX: Math.floor(WIDTH / 2),
  ballY: Math.floor(HEIGHT / 2),
  ballVx: 1,
  ballVy: 1,
  serveDelay: 10,
})

const updateState = (state: PongState, controls: ReturnType<typeof useKeyControls>) => {
  const events: Array<'point' | 'lifeLost'> = []
  let playerY = state.playerY

  if (controls.pressed.has('arrowup') || controls.pressed.has('w')) {
    playerY -= 1
  }
  if (controls.pressed.has('arrowdown') || controls.pressed.has('s')) {
    playerY += 1
  }

  playerY = clamp(playerY, 0, state.height - state.paddleSize)

  let aiY = state.aiY
  if (Math.random() > 0.2) {
    if (state.ballY < aiY) {
      aiY -= 1
    } else if (state.ballY > aiY + state.paddleSize - 1) {
      aiY += 1
    }
  }
  aiY = clamp(aiY, 0, state.height - state.paddleSize)

  let { ballX, ballY, ballVx, ballVy, serveDelay } = state

  if (serveDelay > 0) {
    serveDelay -= 1
  } else {
    ballX += ballVx
    ballY += ballVy
  }

  if (ballY <= 0) {
    ballY = 0
    ballVy = 1
  }
  if (ballY >= state.height - 1) {
    ballY = state.height - 1
    ballVy = -1
  }

  if (ballX <= 1) {
    if (ballY >= playerY && ballY < playerY + state.paddleSize) {
      ballX = 1
      ballVx = 1
      const offset = ballY - (playerY + 1)
      ballVy = offset === 0 ? 0 : offset > 0 ? 1 : -1
    } else if (ballX < 0) {
      events.push('lifeLost')
      return { state: resetBall({ ...state, playerY, aiY }, 1), events } satisfies GameResult<PongState>
    }
  }

  if (ballX >= state.width - 2) {
    if (ballY >= aiY && ballY < aiY + state.paddleSize) {
      ballX = state.width - 2
      ballVx = -1
      const offset = ballY - (aiY + 1)
      ballVy = offset === 0 ? 0 : offset > 0 ? 1 : -1
    } else if (ballX > state.width - 1) {
      events.push('point')
      return { state: resetBall({ ...state, playerY, aiY }, -1), events } satisfies GameResult<PongState>
    }
  }

  return {
    state: {
      ...state,
      playerY,
      aiY,
      ballX,
      ballY,
      ballVx,
      ballVy,
      serveDelay,
    },
    events,
  } satisfies GameResult<PongState>
}

const renderState = (state: PongState) => {
  const grid = createGrid(state.width, state.height, ' ')

  for (let i = 0; i < state.paddleSize; i += 1) {
    grid[state.playerY + i][0] = '|'
    grid[state.aiY + i][state.width - 1] = '|'
  }

  if (state.serveDelay === 0) {
    grid[state.ballY][state.ballX] = 'o'
  }

  return withBorder(renderGrid(grid))
}

const PongGame = ({ onEvent }: PongGameProps) => {
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

export default PongGame
