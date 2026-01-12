import type { ComponentType } from 'react'
import AsteroidsGame, { ASTEROIDS_CONTROLS } from './AsteroidsGame'
import BreakoutGame, { BREAKOUT_CONTROLS } from './BreakoutGame'
import DodgeGame, { DODGE_CONTROLS } from './DodgeGame'
import InvadersGame, { INVADERS_CONTROLS } from './InvadersGame'
import PongGame, { PONG_CONTROLS } from './PongGame'
import SnakeGame, { SNAKE_CONTROLS } from './SnakeGame'
import TetrisGame, { TETRIS_CONTROLS } from './TetrisGame'
import MissileCommandGame, { MISSILE_CONTROLS } from './MissileCommandGame'
import TwentyFortyEightGame, { TWENTY_FORTY_EIGHT_CONTROLS } from './TwentyFortyEightGame'
import type { MinigameId } from '../types'

type MinigameComponent = ComponentType<{
  onEvent: (event: 'point' | 'lifeLost') => void
}>

export const MINIGAME_COMPONENTS: Record<MinigameId, MinigameComponent> = {
  asteroids: AsteroidsGame,
  breakout: BreakoutGame,
  pong: PongGame,
  dodge: DodgeGame,
  invaders: InvadersGame,
  snake: SnakeGame,
  tetris: TetrisGame,
  missile: MissileCommandGame,
  '2048': TwentyFortyEightGame,
}

export const MINIGAME_CONTROLS: Record<MinigameId, string> = {
  asteroids: ASTEROIDS_CONTROLS,
  breakout: BREAKOUT_CONTROLS,
  pong: PONG_CONTROLS,
  dodge: DODGE_CONTROLS,
  invaders: INVADERS_CONTROLS,
  snake: SNAKE_CONTROLS,
  tetris: TETRIS_CONTROLS,
  missile: MISSILE_CONTROLS,
  '2048': TWENTY_FORTY_EIGHT_CONTROLS,
}
