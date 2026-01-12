import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls from '../hooks/useKeyControls'
import { clamp, createGrid, randomInt, renderGrid, withBorder } from '../utils/grid'
import type { GameResult } from './types'

type Invader = {
  x: number
  y: number
}

type Bullet = {
  x: number
  y: number
  vy: number
}

type InvadersState = {
  width: number
  height: number
  playerX: number
  enemies: Invader[]
  dir: 1 | -1
  step: number
  playerBullet: Bullet | null
  enemyBullets: Bullet[]
  cooldown: number
}

type InvadersGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
}

const WIDTH = 26
const HEIGHT = 14
const ENEMY_STEP = 3

export const INVADERS_CONTROLS = 'Flechas o A/D para mover, espacio dispara'

const createEnemies = (width: number) => {
  const cols = 8
  const rows = 3
  const spacing = 2
  const offsetX = Math.floor((width - cols * spacing) / 2)
  const enemies: Invader[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      enemies.push({
        x: offsetX + col * spacing,
        y: 1 + row,
      })
    }
  }

  return enemies
}

const buildInitialState = (): InvadersState => ({
  width: WIDTH,
  height: HEIGHT,
  playerX: Math.floor(WIDTH / 2),
  enemies: createEnemies(WIDTH),
  dir: 1,
  step: 0,
  playerBullet: null,
  enemyBullets: [],
  cooldown: 0,
})

const updateState = (
  state: InvadersState,
  controls: ReturnType<typeof useKeyControls>,
) => {
  const events: Array<'point' | 'lifeLost'> = []
  let { playerX, dir, step, enemies, playerBullet, enemyBullets, cooldown } = state

  if (controls.pressed.has('arrowleft') || controls.pressed.has('a')) {
    playerX -= 1
  }
  if (controls.pressed.has('arrowright') || controls.pressed.has('d')) {
    playerX += 1
  }
  playerX = clamp(playerX, 0, state.width - 1)

  if (cooldown > 0) {
    cooldown -= 1
  }

  if (controls.consume('space') && cooldown === 0 && !playerBullet) {
    playerBullet = { x: playerX, y: state.height - 2, vy: -1 }
    cooldown = 4
  }

  if (step % ENEMY_STEP === 0) {
    const edgeHit = enemies.some((enemy) =>
      dir === 1 ? enemy.x >= state.width - 1 : enemy.x <= 0,
    )
    if (edgeHit) {
      dir = dir === 1 ? -1 : 1
      enemies = enemies.map((enemy) => ({ ...enemy, y: enemy.y + 1 }))
    } else {
      enemies = enemies.map((enemy) => ({ ...enemy, x: enemy.x + dir }))
    }
  }
  step += 1

  if (playerBullet) {
    playerBullet = { ...playerBullet, y: playerBullet.y + playerBullet.vy }
    if (playerBullet.y < 0) {
      playerBullet = null
    }
  }

  enemyBullets = enemyBullets
    .map((bullet) => ({ ...bullet, y: bullet.y + bullet.vy }))
    .filter((bullet) => bullet.y < state.height)

  if (enemies.length > 0 && enemyBullets.length < 2 && Math.random() < 0.2) {
    const shooter = enemies[randomInt(0, enemies.length - 1)]
    enemyBullets.push({ x: shooter.x, y: shooter.y + 1, vy: 1 })
  }

  if (playerBullet) {
    const hitIndex = enemies.findIndex(
      (enemy) => enemy.x === playerBullet?.x && enemy.y === playerBullet?.y,
    )
    if (hitIndex >= 0) {
      enemies = enemies.filter((_, index) => index !== hitIndex)
      playerBullet = null
      events.push('point')
    }
  }

  const playerY = state.height - 1
  const hitPlayer = enemyBullets.find(
    (bullet) => bullet.x === playerX && bullet.y >= playerY,
  )
  if (hitPlayer) {
    events.push('lifeLost')
    return {
      state: {
        ...state,
        playerX,
        enemies: createEnemies(state.width),
        dir,
        step,
        playerBullet: null,
        enemyBullets: [],
        cooldown,
      },
      events,
    } satisfies GameResult<InvadersState>
  }

  const invaded = enemies.some((enemy) => enemy.y >= playerY - 1)
  if (invaded) {
    events.push('lifeLost')
    return {
      state: {
        ...state,
        playerX,
        enemies: createEnemies(state.width),
        dir,
        step,
        playerBullet: null,
        enemyBullets: [],
        cooldown,
      },
      events,
    } satisfies GameResult<InvadersState>
  }

  if (enemies.length === 0) {
    enemies = createEnemies(state.width)
  }

  return {
    state: {
      ...state,
      playerX,
      dir,
      step,
      enemies,
      playerBullet,
      enemyBullets,
      cooldown,
    },
    events,
  } satisfies GameResult<InvadersState>
}

const renderState = (state: InvadersState) => {
  const grid = createGrid(state.width, state.height, ' ')

  state.enemies.forEach((enemy) => {
    if (enemy.y >= 0 && enemy.y < state.height) {
      grid[enemy.y][enemy.x] = 'W'
    }
  })

  if (state.playerBullet) {
    grid[state.playerBullet.y][state.playerBullet.x] = '|'
  }

  state.enemyBullets.forEach((bullet) => {
    if (bullet.y >= 0 && bullet.y < state.height) {
      grid[bullet.y][bullet.x] = '!'
    }
  })

  grid[state.height - 1][state.playerX] = 'A'

  return withBorder(renderGrid(grid))
}

const InvadersGame = ({ onEvent }: InvadersGameProps) => {
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
    <pre className="whitespace-pre rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-emerald-100">
      {frame.join('\n')}
    </pre>
  )
}

export default InvadersGame
