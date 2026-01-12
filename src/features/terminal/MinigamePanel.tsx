import TerminalLine from './TerminalLine'
import type { EncryptedEvent as EncryptedEventType, MinigameState } from './types'
import { MINIGAME_COMPONENTS, MINIGAME_CONTROLS } from './minigames'

type MinigamePanelProps = {
  minigame: MinigameState
  event: EncryptedEventType
  onGainPoint: () => void
  onLoseLife: () => void
}

const MinigamePanel = ({
  minigame,
  event,
  onGainPoint,
  onLoseLife,
}: MinigamePanelProps) => {
  const GameComponent = MINIGAME_COMPONENTS[minigame.id]
  const controls = MINIGAME_CONTROLS[minigame.id]

  const handleEvent = (eventType: 'point' | 'lifeLost') => {
    if (eventType === 'point') {
      onGainPoint()
      return
    }
    onLoseLife()
  }

  return (
    <div className="relative space-y-5 pt-6 text-sm text-slate-200">
      <div className="absolute right-0 top-0 text-xs uppercase tracking-[0.3em] text-sky-200">
        {event.revealedWords} / {event.totalWords} palabras descifradas
      </div>
      <div className="space-y-1">
        <TerminalLine className="text-emerald-200">
          Minijuego activo: {minigame.nombre}
        </TerminalLine>
        <TerminalLine className="text-slate-300">
          {minigame.descripcion}
        </TerminalLine>
      </div>
      <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <TerminalLine className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-slate-400">
          <span>Puntos: {minigame.points}</span>
          <span>Meta: {minigame.target}</span>
          <span>Vidas: {minigame.lives}</span>
        </TerminalLine>
        <GameComponent key={minigame.id} onEvent={handleEvent} />
        <TerminalLine className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Controles: {controls}
        </TerminalLine>
      </div>
    </div>
  )
}

export default MinigamePanel
