import { useMemo } from 'react'
import useGameLoop from '../hooks/useGameLoop'
import useKeyControls from '../hooks/useKeyControls'
import TerminalLines from '../TerminalLines'
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
  playerBullets: Bullet[]
  enemyBullets: Bullet[]
  cooldown: number
}

type InvadersGameProps = {
  onEvent: (event: 'point' | 'lifeLost') => void
}

const WIDTH = 50
const HEIGHT = 24
const ENEMY_STEP = 3
const PLAYER_COOLDOWN = 3
const MAX_PLAYER_BULLETS = 3

export const INVADERS_CONTROLS = 'Flechas o A/D para mover, espacio dispara'

const createEnemies = (width: number) => {
  const cols = 12
  const rows = 4
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
  playerBullets: [],
  enemyBullets: [],
  cooldown: 0,
})

const updateState = (
  state: InvadersState,
  controls: ReturnType<typeof useKeyControls>,
) => {
  const events: Array<'point' | 'lifeLost'> = []
  let { playerX, dir, step, enemies, playerBullets, enemyBullets, cooldown } = state

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

  if (controls.consume('space') && cooldown === 0 && playerBullets.length < MAX_PLAYER_BULLETS) {
    playerBullets = [...playerBullets, { x: playerX, y: state.height - 2, vy: -1 }]
    cooldown = PLAYER_COOLDOWN
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

  playerBullets = playerBullets
    .map((bullet) => ({ ...bullet, y: bullet.y + bullet.vy }))
    .filter((bullet) => bullet.y >= 0)

  enemyBullets = enemyBullets
    .map((bullet) => ({ ...bullet, y: bullet.y + bullet.vy }))
    .filter((bullet) => bullet.y < state.height)

  if (enemies.length > 0 && enemyBullets.length < 2 && Math.random() < 0.2) {
    const shooter = enemies[randomInt(0, enemies.length - 1)]
    enemyBullets.push({ x: shooter.x, y: shooter.y + 1, vy: 1 })
  }

  const isNear = (ax: number, ay: number, bx: number, by: number, radius = 1) =>
    Math.abs(ax - bx) <= radius && Math.abs(ay - by) <= radius

  const hitEnemies = new Set<number>()
  const remainingBullets: Bullet[] = []

  playerBullets.forEach((bullet) => {
    const hitIndex = enemies.findIndex((enemy) =>
      isNear(enemy.x, enemy.y, bullet.x, bullet.y),
    )
    if (hitIndex >= 0) {
      hitEnemies.add(hitIndex)
    } else {
      remainingBullets.push(bullet)
    }
  })

  if (hitEnemies.size > 0) {
    enemies = enemies.filter((_, index) => !hitEnemies.has(index))
    for (let i = 0; i < hitEnemies.size; i += 1) {
      events.push('point')
    }
  }

  playerBullets = remainingBullets

  const playerY = state.height - 1
  const hitPlayer = enemyBullets.find((bullet) =>
    isNear(bullet.x, bullet.y, playerX, playerY),
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
        playerBullets: [],
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
        playerBullets: [],
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
      playerBullets,
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
      grid[enemy.y][enemy.x] = '[E]W'
    }
  })

  state.playerBullets.forEach((bullet) => {
    if (bullet.y >= 0 && bullet.y < state.height) {
      grid[bullet.y][bullet.x] = '|'
    }
  })

  state.enemyBullets.forEach((bullet) => {
    if (bullet.y >= 0 && bullet.y < state.height) {
      grid[bullet.y][bullet.x] = '[E]!'
    }
  })

  grid[state.height - 1][state.playerX] = '[P]A'

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
    <div className="terminal-grid rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-amber-crt">
      <TerminalLines
        lines={frame}
        className="space-y-0 font-mono"
        lineClassName="whitespace-pre leading-none"
      />
    </div>
  )
}

export default InvadersGame
