import type { ComponentType } from 'react'
import AsteroidsGame, { ASTEROIDS_CONTROLS } from './AsteroidsGame'
import BreakoutGame, { BREAKOUT_CONTROLS } from './BreakoutGame'
import DodgeGame, { DODGE_CONTROLS } from './DodgeGame'
import InvadersGame, { INVADERS_CONTROLS } from './InvadersGame'
import PongGame, { PONG_CONTROLS } from './PongGame'
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
}

export const MINIGAME_CONTROLS: Record<MinigameId, string> = {
  asteroids: ASTEROIDS_CONTROLS,
  breakout: BREAKOUT_CONTROLS,
  pong: PONG_CONTROLS,
  dodge: DODGE_CONTROLS,
  invaders: INVADERS_CONTROLS,
}
