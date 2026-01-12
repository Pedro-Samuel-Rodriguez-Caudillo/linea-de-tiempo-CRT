import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls from '../hooks/useKeyControls'
import TerminalLines from '../TerminalLines'
import {
  createGrid,
  randomInt,
  renderGrid,
  withBorder,
  wrap,
  wrappedDistance,
} from '../utils/grid'
import type { GameResult } from './types'

type Asteroid = {
  x: number
  y: number
  vx: number
  vy: number
}

type Bullet = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

type AsteroidsState = {
  width: number
  height: number
  shipX: number
  shipY: number
  dirX: number
  dirY: number
  asteroids: Asteroid[]
  bullets: Bullet[]
  cooldown: number
}

type AsteroidsGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
}

const WIDTH = 26
const HEIGHT = 12

export const ASTEROIDS_CONTROLS = 'Flechas o WASD para mover, espacio dispara'

const createAsteroid = (width: number, height: number, shipX: number, shipY: number) => {
  let x = randomInt(0, width - 1)
  let y = randomInt(0, height - 1)
  if (x === shipX && y === shipY) {
    x = (x + 3) % width
    y = (y + 2) % height
  }
  const vx = randomInt(-1, 1) || 1
  const vy = randomInt(-1, 1)
  return { x, y, vx, vy }
}

const buildInitialState = (): AsteroidsState => {
  const shipX = Math.floor(WIDTH / 2)
  const shipY = Math.floor(HEIGHT / 2)
  return {
    width: WIDTH,
    height: HEIGHT,
    shipX,
    shipY,
    dirX: 1,
    dirY: 0,
    asteroids: Array.from({ length: 4 }, () => createAsteroid(WIDTH, HEIGHT, shipX, shipY)),
    bullets: [],
    cooldown: 0,
  }
}

const updateState = (
  state: AsteroidsState,
  controls: ReturnType<typeof useKeyControls>,
) => {
  const events: Array<'point' | 'lifeLost'> = []
  let { shipX, shipY, dirX, dirY, cooldown } = state

  let moveX = 0
  let moveY = 0
  if (controls.pressed.has('arrowleft') || controls.pressed.has('a')) moveX -= 1
  if (controls.pressed.has('arrowright') || controls.pressed.has('d')) moveX += 1
  if (controls.pressed.has('arrowup') || controls.pressed.has('w')) moveY -= 1
  if (controls.pressed.has('arrowdown') || controls.pressed.has('s')) moveY += 1

  if (moveX !== 0 || moveY !== 0) {
    dirX = moveX
    dirY = moveY
  }

  shipX = wrap(shipX + moveX, 0, state.width - 1)
  shipY = wrap(shipY + moveY, 0, state.height - 1)

  if (cooldown > 0) {
    cooldown -= 1
  }

  const bullets = state.bullets
    .map((bullet) => ({
      ...bullet,
      x: wrap(bullet.x + bullet.vx, 0, state.width - 1),
      y: wrap(bullet.y + bullet.vy, 0, state.height - 1),
      life: bullet.life - 1,
    }))
    .filter((bullet) => bullet.life > 0)

  if (controls.consume('space') && cooldown === 0) {
    const fireX = dirX === 0 && dirY === 0 ? 1 : dirX
    const fireY = dirX === 0 && dirY === 0 ? 0 : dirY
    bullets.push({
      x: shipX,
      y: shipY,
      vx: fireX,
      vy: fireY,
      life: 14,
    })
    cooldown = 4
  }

  let asteroids = state.asteroids.map((asteroid) => ({
    ...asteroid,
    x: wrap(asteroid.x + asteroid.vx, 0, state.width - 1),
    y: wrap(asteroid.y + asteroid.vy, 0, state.height - 1),
  }))

  const remainingBullets: Bullet[] = []
  const destroyed = new Set<number>()

  const isBulletHit = (bullet: Bullet, asteroid: Asteroid) => {
    const dx = wrappedDistance(bullet.x, asteroid.x, state.width)
    const dy = wrappedDistance(bullet.y, asteroid.y, state.height)
    return dx <= 1 && dy <= 1
  }

  bullets.forEach((bullet) => {
    const hitIndex = asteroids.findIndex(
      (asteroid) => isBulletHit(bullet, asteroid),
    )
    if (hitIndex >= 0) {
      destroyed.add(hitIndex)
      events.push('point')
    } else {
      remainingBullets.push(bullet)
    }
  })

  asteroids = asteroids.filter((_, index) => !destroyed.has(index))

  while (asteroids.length < 4) {
    asteroids.push(createAsteroid(state.width, state.height, shipX, shipY))
  }

  const collision = asteroids.some(
    (asteroid) => asteroid.x === shipX && asteroid.y === shipY,
  )
  if (collision) {
    events.push('lifeLost')
    shipX = Math.floor(state.width / 2)
    shipY = Math.floor(state.height / 2)
  }

  return {
    state: {
      ...state,
      shipX,
      shipY,
      dirX,
      dirY,
      asteroids,
      bullets: remainingBullets,
      cooldown,
    },
    events,
  } satisfies GameResult<AsteroidsState>
}

const renderState = (state: AsteroidsState) => {
  const grid = createGrid(state.width, state.height, ' ')

  state.asteroids.forEach((asteroid) => {
    grid[asteroid.y][asteroid.x] = 'O'
  })

  state.bullets.forEach((bullet) => {
    grid[bullet.y][bullet.x] = '*'
  })

  grid[state.shipY][state.shipX] = '^'

  return withBorder(renderGrid(grid))
}

const AsteroidsGame = ({ onEvent }: AsteroidsGameProps) => {
  const controls = useKeyControls()
  const initialState = useMemo(() => buildInitialState(), [])
  const { frame } = useGameLoop({
    initialState,
    update: updateState,
    render: renderState,
    controls,
    onEvent,
    tickMs: 110,
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

export default AsteroidsGame
