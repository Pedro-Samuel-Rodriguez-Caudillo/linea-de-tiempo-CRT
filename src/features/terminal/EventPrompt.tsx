import { type FormEvent, useState } from 'react'
import EncryptedEvent from './EncryptedEvent'
import { BANNER_LINES } from './constants'
import useArraySequence from './hooks/useArraySequence'
import useMediaQuery from './hooks/useMediaQuery'
import useSound from './hooks/useSound'
import TerminalLine from './TerminalLine'
import TerminalLines from './TerminalLines'
import type { EncryptedEvent as EncryptedEventType } from './types'

type EventPromptProps = {
  event: EncryptedEventType
  showBanner: boolean
  isLast: boolean
  canDecrypt: boolean
  currentIndex: number
  total: number
  onContinue: () => void
  onDecrypt: () => void
  onExit: () => void
}

const EventPrompt = ({
  event,
  showBanner,
  isLast,
  canDecrypt,
  currentIndex,
  total,
  onContinue,
  onDecrypt,
  onExit,
}: EventPromptProps) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [command, setCommand] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const { playKeystroke } = useSound()

  const { visibleItems: visibleLines, done: isAnimationDone } = useArraySequence(
    event.lines,
    {
      stepDelayMs: 150,
      initialDelayMs: 300,
    },
  )

  const normalizeCommand = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const availableCommands = [
    !isLast ? 'si' : null,
    canDecrypt ? 'desencriptar' : null,
    'salir',
  ].filter((command): command is string => Boolean(command))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = normalizeCommand(command)
    if (!normalized) return

    if (['si', 's', 'continuar', 'siguiente'].includes(normalized)) {
      if (isLast) {
        setFeedback('No hay mas eventos para continuar.')
        return
      }
      setFeedback(null)
      setCommand('')
      onContinue()
      return
    }

    if (['desencriptar', 'descifrar', 'd'].includes(normalized)) {
      if (!canDecrypt) {
        setFeedback('Desencriptar no disponible para este evento.')
        return
      }
      setFeedback(null)
      setCommand('')
      onDecrypt()
      return
    }

    if (['salir', 'exit', 'quit'].includes(normalized)) {
      setFeedback(null)
      setCommand('')
      onExit()
      return
    }

    setFeedback(`Comando no reconocido. Usa: ${availableCommands.join(' / ')}`)
  }

  // Create a partial event for display animation
  const displayEvent = { ...event, lines: visibleLines }

  return (
    <div className="space-y-6">
      <TerminalLine className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-amber-700">
        <span>Secuencia</span>
        <span>
          {currentIndex + 1} / {total}
        </span>
      </TerminalLine>
      {showBanner && (
        <TerminalLines
          lines={BANNER_LINES}
          className="space-y-1 text-amber-crt"
          lineClassName="whitespace-pre"
        />
      )}
      <EncryptedEvent event={displayEvent} />
      
      {/* Spacer to push content up, but we want the prompt to appear below the event lines. 
          The previous request asked for space at the bottom. 
          The prompt UI should only appear when animation is done. */}
      {isAnimationDone && (
        <div className="space-y-2 text-sm text-amber-100 animate-in fade-in duration-500">
          <TerminalLine>Continuar con la linea de tiempo?</TerminalLine>
          {isDesktop ? (
            <div className="space-y-2">
              <TerminalLine className="text-xs uppercase tracking-[0.3em] text-amber-700">
                Comandos: {availableCommands.join(' / ')}
              </TerminalLine>
              <TerminalLine className="flex items-center gap-2">
                <span className="text-amber-500">&gt;</span>
                <form onSubmit={handleSubmit} className="flex-1">
                  <input
                    value={command}
                    onChange={(event) => {
                      setCommand(event.target.value)
                      setFeedback(null)
                    }}
                    onKeyDown={() => playKeystroke()}
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-transparent text-amber-100 placeholder:text-amber-700 focus:outline-none"
                    placeholder="Escribe un comando y presiona Enter"
                  />
                </form>
              </TerminalLine>
              {feedback && (
                <TerminalLine className="text-xs text-amber-700">{feedback}</TerminalLine>
              )}
              {!canDecrypt && (
                <TerminalLine className="text-xs text-amber-900">
                  Desencriptar no disponible para este evento.
                </TerminalLine>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {!isLast && (
                <TerminalLine>
                  <button
                    type="button"
                    onClick={onContinue}
                    className="w-full whitespace-normal rounded border border-amber-500/60 px-4 py-3 text-center text-xs uppercase tracking-[0.25em] text-amber-crt transition hover:border-amber-400 hover:text-amber-100 active:bg-amber-900/40"
                  >
                    Si (continuar)
                  </button>
                </TerminalLine>
              )}
              {canDecrypt && (
                <TerminalLine>
                  <button
                    type="button"
                    onClick={onDecrypt}
                    className="w-full whitespace-normal rounded border border-amber-500/60 px-4 py-3 text-center text-xs uppercase tracking-[0.25em] text-amber-crt transition hover:border-amber-400 hover:text-amber-100 active:bg-amber-900/40"
                  >
                    Desencriptar
                  </button>
                </TerminalLine>
              )}
              <TerminalLine>
                <button
                  type="button"
                  onClick={onExit}
                  className="w-full whitespace-normal rounded border border-amber-800/60 px-4 py-3 text-center text-xs uppercase tracking-[0.25em] text-amber-700 transition hover:border-amber-600 hover:text-amber-500 active:bg-amber-900/20"
                >
                  Salir
                </button>
              </TerminalLine>
              {!canDecrypt && (
                <TerminalLine className="text-center text-xs text-amber-900">
                  Desencriptar no disponible para este evento.
                </TerminalLine>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="h-32" aria-hidden="true" />
    </div>
  )
}

export default EventPrompt
