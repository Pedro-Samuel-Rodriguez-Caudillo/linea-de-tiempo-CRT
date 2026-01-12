import TerminalLine from './TerminalLine'
import type { EncryptedEvent as EncryptedEventType, MinigameState } from './types'
import { MINIGAME_COMPONENTS, MINIGAME_CONTROLS } from './minigames'
import useKeyControls from './hooks/useKeyControls'
import VirtualControls from './VirtualControls'

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
  const controls = useKeyControls()
  const GameComponent = MINIGAME_COMPONENTS[minigame.id]
  const controlsDesc = MINIGAME_CONTROLS[minigame.id]

  const handleEvent = (eventType: 'point' | 'lifeLost') => {
    if (eventType === 'point') {
      onGainPoint()
      return
    }
    onLoseLife()
  }

  return (
    <div className="relative space-y-5 pt-6 text-sm text-amber-100">
      <TerminalLine className="absolute right-0 top-0 text-xs uppercase tracking-[0.3em] text-amber-crt">
        {event.revealedWords} / {event.totalWords} palabras descifradas
      </TerminalLine>
      <div className="space-y-1">
        <TerminalLine className="text-amber-crt">
          Minijuego activo: {minigame.nombre}
        </TerminalLine>
        <TerminalLine className="text-amber-crt-dim">
          {minigame.descripcion}
        </TerminalLine>
      </div>
      <div className="grid gap-4 rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
        <TerminalLine className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-amber-600">
          <span>Puntos: {minigame.points}</span>
          <span>Meta: {minigame.target}</span>
          <span>Vidas: {minigame.lives}</span>
        </TerminalLine>
        <GameComponent key={minigame.id} onEvent={handleEvent} externalControls={controls} />
        <TerminalLine className="hidden text-xs uppercase tracking-[0.3em] text-amber-600 md:block">
          Controles: {controlsDesc}
        </TerminalLine>
      </div>
      <VirtualControls controls={controls} />
    </div>
  )
}

export default MinigamePanel
