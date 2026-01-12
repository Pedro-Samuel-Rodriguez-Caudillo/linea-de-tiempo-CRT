export type TimelineEntry = {
  titulo: string
  anio: string
  descripcion: string
}

export type WordToken = {
  original: string
  encrypted: string
  revealed: boolean
}

export type EncryptedLine = {
  label: string
  labelTokens: WordToken[]
  tokens: WordToken[]
}

export type EncryptedEvent = {
  id: string
  lines: EncryptedLine[]
  totalWords: number
  revealedWords: number
  decryptable: boolean
}

export type Stage = 'boot' | 'prompt' | 'minigame' | 'exit' | 'victory'

export type MinigameId =
  | 'asteroids'
  | 'breakout'
  | 'pong'
  | 'dodge'
  | 'invaders'
  | 'snake'
  | 'tetris'
  | 'missile'
  | '2048'

export type MinigameDefinition = {
  id: MinigameId
  nombre: string
  descripcion: string
  baseTarget: number
}

export type MinigameState = MinigameDefinition & {
  points: number
  target: number
  lives: number
}
