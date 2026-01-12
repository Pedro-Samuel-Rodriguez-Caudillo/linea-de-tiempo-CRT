import { useEffect, useRef, useState } from 'react'
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
  const [showIntro, setShowIntro] = useState(true)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useKeyControls()
  const GameComponent = MINIGAME_COMPONENTS[minigame.id]
  const controlsDesc = MINIGAME_CONTROLS[minigame.id]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const availableWidth = window.innerWidth - 32 // Approximate padding
      const targetWidth = 500 // Assumed base width for "comfortable" gaming
      
      if (availableWidth < targetWidth) {
        setScale(availableWidth / targetWidth)
      } else {
        setScale(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleEvent = (eventType: 'point' | 'lifeLost') => {
    if (eventType === 'point') {
      onGainPoint()
      return
    }
    onLoseLife()
  }

  if (showIntro) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="space-y-2">
          <h2 className="text-sm uppercase tracking-[0.5em] text-amber-700">Desencriptando via</h2>
          <h1 className="text-4xl font-bold uppercase tracking-widest text-amber-500 md:text-6xl">
            {minigame.nombre}
          </h1>
        </div>
        <div className="h-px w-32 bg-amber-900/50" />
        <p className="max-w-md text-lg text-amber-200/80">{minigame.descripcion}</p>
        <div className="mt-12 animate-pulse text-xs uppercase tracking-[0.2em] text-amber-800">
          Iniciando subrutina...
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-5 pt-6 text-sm text-amber-100 animate-in fade-in duration-700">
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
      <div 
        ref={containerRef}
        className="grid gap-4 rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 transition-all duration-300"
      >
        <TerminalLine className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-amber-600">
          <span>Puntos: {minigame.points}</span>
          <span>Meta: {minigame.target}</span>
          <span>Vidas: {minigame.lives}</span>
        </TerminalLine>
        
        <div 
          className="flex justify-center origin-top-left sm:origin-center"
          style={{ 
            transform: `scale(${scale})`,
            marginBottom: scale < 1 ? `-${(1 - scale) * 200}px` : '0' // Negative margin to reduce gap from scaling
          }}
        >
          <GameComponent key={minigame.id} onEvent={handleEvent} externalControls={controls} />
        </div>

        <TerminalLine className="hidden text-xs uppercase tracking-[0.3em] text-amber-600 md:block">
          Controles: {controlsDesc}
        </TerminalLine>
      </div>
      <VirtualControls controls={controls} />
    </div>
  )
}

export default MinigamePanel
