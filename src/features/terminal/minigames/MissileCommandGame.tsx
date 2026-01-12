import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls from '../hooks/useKeyControls'
import TerminalLines from '../TerminalLines'
import { createGrid, renderGrid, withBorder, wrap } from '../utils/grid'
import type { GameResult } from './types'

type Missile = { x: number; y: number; tx: number; ty: number; speed: number }
type Explosion = { x: number; y: number; life: number }

type MissileState = {
  width: number
  height: number
  cursor: { x: number; y: number }
  missiles: Missile[]
  explosions: Explosion[]
  nextSpawn: number
}

type MissileGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
}

const WIDTH = 50
const HEIGHT = 24

export const MISSILE_CONTROLS = 'Flechas: mover cursor, Espacio: disparar'

const buildInitialState = (): MissileState => ({
  width: WIDTH,
  height: HEIGHT,
  cursor: { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) },
  missiles: [],
  explosions: [],
  nextSpawn: 0,
})

const updateState = (
  state: MissileState,
  controls: ReturnType<typeof useKeyControls>,
) => {
  const events: Array<'point' | 'lifeLost'> = []
  let { cursor, missiles, explosions, nextSpawn } = state

  // Cursor move
  if (controls.pressed.has('arrowleft') || controls.pressed.has('a')) cursor.x = wrap(cursor.x - 1, 0, state.width - 1)
  if (controls.pressed.has('arrowright') || controls.pressed.has('d')) cursor.x = wrap(cursor.x + 1, 0, state.width - 1)
  if (controls.pressed.has('arrowup') || controls.pressed.has('w')) cursor.y = wrap(cursor.y - 1, 0, state.height - 1)
  if (controls.pressed.has('arrowdown') || controls.pressed.has('s')) cursor.y = wrap(cursor.y + 1, 0, state.height - 1)

  // Fire
  if (controls.consume('space')) {
    explosions.push({ x: cursor.x, y: cursor.y, life: 3 })
  }

  // Update missiles
  missiles = missiles.map((m) => {
    const dx = m.tx - m.x
    const dy = m.ty - m.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 1) return { ...m, y: state.height } // Landed
    return {
      ...m,
      x: m.x + (dx / dist) * 0.5,
      y: m.y + (dy / dist) * 0.5,
    }
  })

  // Collisions
  const remainingMissiles: Missile[] = []
  missiles.forEach((m) => {
    const hit = explosions.some((e) => Math.abs(e.x - m.x) < 2 && Math.abs(e.y - m.y) < 2)
    if (hit) {
      events.push('point')
    } else if (m.y >= state.height - 1) {
      events.push('lifeLost')
    } else {
      remainingMissiles.push(m)
    }
  })

  // Update explosions
  explosions = explosions.map((e) => ({ ...e, life: e.life - 1 })).filter((e) => e.life > 0)

  // Spawning
  if (nextSpawn <= 0) {
    remainingMissiles.push({
      x: Math.random() * state.width,
      y: 0,
      tx: Math.random() * state.width,
      ty: state.height - 1,
      speed: 0.2 + Math.random() * 0.3,
    })
    nextSpawn = 15
  } else {
    nextSpawn--
  }

  return {
    state: { ...state, cursor, missiles: remainingMissiles, explosions, nextSpawn },
    events,
  } satisfies GameResult<MissileState>
}

const renderState = (state: MissileState) => {
  const grid = createGrid(state.width, state.height, ' ')

  state.missiles.forEach((m) => {
    const ix = Math.floor(m.x)
    const iy = Math.floor(m.y)
    if (iy >= 0 && iy < state.height && ix >= 0 && ix < state.width) grid[iy][ix] = 'v'
  })

  state.explosions.forEach((e) => {
    const ix = Math.floor(e.x)
    const iy = Math.floor(e.y)
    if (iy >= 0 && iy < state.height && ix >= 0 && ix < state.width) grid[iy][ix] = '#'
  })

  grid[state.cursor.y][state.cursor.x] = '+'

  return withBorder(renderGrid(grid))
}

const MissileGame = ({ onEvent }: MissileGameProps) => {
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
    <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-amber-crt">
      <TerminalLines
        lines={frame}
        className="space-y-0 font-mono"
        lineClassName="whitespace-pre leading-none"
      />
    </div>
  )
}

export default MissileGame
