import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls, { type KeyControls } from '../hooks/useKeyControls'
import TerminalLines from '../TerminalLines'
import { createGrid, randomInt, renderGrid, withBorder, wrap } from '../utils/grid'

type Asteroid = { x: number; y: number; vx: number; vy: number }
type Bullet = { x: number; y: number; vx: number; vy: number; life: number }

type AsteroidsState = {
  width: number
  height: number
  shipX: number
  shipY: number
  asteroids: Asteroid[]
  bullets: Bullet[]
  cooldown: number
}

type AsteroidsGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
  externalControls?: KeyControls
}

const WIDTH = 26
const HEIGHT = 10 // Un poco más bajo para mejor visibilidad

export const ASTEROIDS_CONTROLS = 'WASD/Flechas para mover, Espacio dispara'

const createAsteroid = (width: number, height: number, shipX: number, shipY: number) => {
  let x = randomInt(0, width - 1)
  let y = randomInt(0, height - 1)
  // Asegurar distancia inicial del jugador
  if (Math.abs(x - shipX) < 4 && Math.abs(y - shipY) < 4) {
    x = (x + 8) % width
    y = (y + 4) % height
  }
  return { x, y, vx: Math.random() > 0.5 ? 1 : -1, vy: 0 } // Movimiento solo horizontal para facilitar
}

const buildInitialState = (): AsteroidsState => {
  const shipX = Math.floor(WIDTH / 2)
  const shipY = Math.floor(HEIGHT / 2)
  return {
    width: WIDTH,
    height: HEIGHT,
    shipX,
    shipY,
    asteroids: Array.from({ length: 3 }, () => createAsteroid(WIDTH, HEIGHT, shipX, shipY)), // Menos asteroides
    bullets: [],
    cooldown: 0,
  }
}

const updateState = (state: AsteroidsState, controls: KeyControls) => {
  const events: Array<'point' | 'lifeLost'> = []
  let { shipX, shipY, cooldown } = state

  if (controls.pressed.has('arrowleft') || controls.pressed.has('a')) shipX = wrap(shipX - 1, 0, state.width - 1)
  if (controls.pressed.has('arrowright') || controls.pressed.has('d')) shipX = wrap(shipX + 1, 0, state.width - 1)
  if (controls.pressed.has('arrowup') || controls.pressed.has('w')) shipY = wrap(shipY - 1, 0, state.height - 1)
  if (controls.pressed.has('arrowdown') || controls.pressed.has('s')) shipY = wrap(shipY + 1, 0, state.height - 1)

  if (cooldown > 0) cooldown--

  let bullets = state.bullets.map(b => ({ ...b, x: wrap(b.x + b.vx, 0, state.width - 1), life: b.life - 1 })).filter(b => b.life > 0)

  if (controls.consume('space') && cooldown === 0) {
    bullets.push({ x: shipX, y: shipY, vx: 1, vy: 0, life: 10 })
    cooldown = 3
  }

  let asteroids = state.asteroids.map(a => ({ ...a, x: wrap(a.x + a.vx, 0, state.width - 1) }))

  const destroyed = new Set<number>()
  bullets = bullets.filter(b => {
    const hit = asteroids.findIndex(a => Math.abs(a.x - b.x) < 1.1 && Math.abs(a.y - b.y) < 1.1)
    if (hit >= 0) {
      destroyed.add(hit)
      events.push('point')
      return false
    }
    return true
  })

  asteroids = asteroids.filter((_, i) => !destroyed.has(i))
  while (asteroids.length < 3) asteroids.push(createAsteroid(state.width, state.height, shipX, shipY))

  if (asteroids.some(a => Math.floor(a.x) === shipX && Math.floor(a.y) === shipY)) {
    events.push('lifeLost')
    shipX = Math.floor(state.width / 2)
    shipY = Math.floor(state.height / 2)
  }

  return { state: { ...state, shipX, shipY, asteroids, bullets, cooldown }, events }
}

const renderState = (state: AsteroidsState) => {
  const grid = createGrid(state.width, state.height, ' ')
  state.asteroids.forEach(a => grid[Math.floor(a.y)][Math.floor(a.x)] = 'X') // Carácter más visible
  state.bullets.forEach(b => grid[Math.floor(b.y)][Math.floor(b.x)] = '·')
  grid[state.shipY][state.shipX] = 'A' // Jugador más claro
  return withBorder(renderGrid(grid))
}

const AsteroidsGame = ({ onEvent, externalControls }: AsteroidsGameProps) => {
  const localControls = useKeyControls()
  const controls = externalControls || localControls
  const initialState = useMemo(() => buildInitialState(), [])
  const { frame } = useGameLoop({
    initialState,
    update: updateState,
    render: renderState,
    controls,
    onEvent,
    tickMs: 120, // Más lento para que sea legible
  })

  return (
    <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-amber-crt">
      <TerminalLines lines={frame} className="space-y-0 font-mono" lineClassName="whitespace-pre leading-none" />
    </div>
  )
}

export default AsteroidsGame
