import EncryptedEvent from './EncryptedEvent'
import { BANNER_LINES } from './constants'
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
  return (
    <div className="space-y-6">
      <TerminalLine className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
        <span>Secuencia</span>
        <span>
          {currentIndex + 1} / {total}
        </span>
      </TerminalLine>
      {showBanner && (
        <TerminalLines
          lines={BANNER_LINES}
          className="space-y-1 text-emerald-200"
          lineClassName="whitespace-pre"
        />
      )}
      <EncryptedEvent event={event} />
      <div className="space-y-2 text-sm text-slate-200">
        <TerminalLine>Pregunta: continuar con la linea?</TerminalLine>
        <div className="space-y-2">
          {!isLast && (
            <TerminalLine>
              <button
                type="button"
                onClick={onContinue}
                className="rounded border border-emerald-400/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-100 transition hover:border-emerald-200 hover:text-emerald-50"
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
                className="rounded border border-sky-400/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-sky-200 transition hover:border-sky-200 hover:text-sky-100"
              >
                Desencriptar
              </button>
            </TerminalLine>
          )}
          <TerminalLine>
            <button
              type="button"
              onClick={onExit}
              className="rounded border border-amber-400/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-amber-200 transition hover:border-amber-200 hover:text-amber-100"
            >
              Salir
            </button>
          </TerminalLine>
        </div>
        {!canDecrypt && (
          <TerminalLine className="text-xs text-slate-500">
            Desencriptar no disponible para este evento.
          </TerminalLine>
        )}
      </div>
    </div>
  )
}

export default EventPrompt
