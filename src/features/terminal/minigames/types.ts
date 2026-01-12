export type GameEvent = 'point' | 'lifeLost'

export type GameResult<State> = {
  state: State
  events?: GameEvent[]
}
