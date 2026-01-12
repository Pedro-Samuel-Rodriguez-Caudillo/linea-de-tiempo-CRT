import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls, { type KeyControls } from '../hooks/useKeyControls'
import TerminalLines from '../TerminalLines'
import { createGrid, renderGrid, withBorder, wrap } from '../utils/grid'
import type { GameResult } from './types'

type Point = { x: number; y: number }

type SnakeState = {
  width: number
  height: number
  snake: Point[]
  food: Point
  dir: Point
}

type SnakeGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
  externalControls?: KeyControls
}

const WIDTH = 50
const HEIGHT = 24

export const SNAKE_CONTROLS = 'WASD o Flechas para mover'

const spawnFood = (snake: Point[], width: number, height: number): Point => {
  let food: Point
  while (true) {
    food = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    }
    if (!snake.some((s) => s.x === food.x && s.y === food.y)) break
  }
  return food
}

const buildInitialState = (): SnakeState => {
  const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]
  return {
    width: WIDTH,
    height: HEIGHT,
    snake,
    food: spawnFood(snake, WIDTH, HEIGHT),
    dir: { x: 1, y: 0 },
  }
}

const updateState = (
  state: SnakeState,
  controls: KeyControls,
) => {
  const events: Array<'point' | 'lifeLost'> = []
  let { dir, snake, food } = state

  if ((controls.pressed.has('w') || controls.pressed.has('arrowup')) && state.dir.y === 0) dir = { x: 0, y: -1 }
  if ((controls.pressed.has('s') || controls.pressed.has('arrowdown')) && state.dir.y === 0) dir = { x: 0, y: 1 }
  if ((controls.pressed.has('a') || controls.pressed.has('arrowleft')) && state.dir.x === 0) dir = { x: -1, y: 0 }
  if ((controls.pressed.has('d') || controls.pressed.has('arrowright')) && state.dir.x === 0) dir = { x: 1, y: 0 }

  const head = snake[0]
  const newHead = {
    x: wrap(head.x + dir.x, 0, state.width - 1),
    y: wrap(head.y + dir.y, 0, state.height - 1),
  }

  if (snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
    events.push('lifeLost')
    return { state: buildInitialState(), events }
  }

  const newSnake = [newHead, ...snake]

  if (newHead.x === food.x && newHead.y === food.y) {
    events.push('point')
    food = spawnFood(newSnake, state.width, state.height)
  } else {
    newSnake.pop()
  }

  return {
    state: { ...state, snake: newSnake, dir, food },
    events,
  } satisfies GameResult<SnakeState>
}

const renderState = (state: SnakeState) => {
  const grid = createGrid(state.width, state.height, ' ')
  grid[state.food.y][state.food.x] = '*'
  state.snake.forEach((p, i) => {
    grid[p.y][p.x] = i === 0 ? '@' : 'o'
  })
  return withBorder(renderGrid(grid))
}

const SnakeGame = ({ onEvent, externalControls }: SnakeGameProps) => {
  const localControls = useKeyControls()
  const controls = externalControls || localControls
  const initialState = useMemo(() => buildInitialState(), [])
  const { frame } = useGameLoop({
    initialState,
    update: updateState,
    render: renderState,
    controls,
    onEvent,
    tickMs: 140,
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

export default SnakeGame
