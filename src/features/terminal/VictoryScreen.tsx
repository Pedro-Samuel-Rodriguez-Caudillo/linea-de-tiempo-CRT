import { type FormEvent, useState } from 'react'
import useMediaQuery from './hooks/useMediaQuery'
import TerminalLine from './TerminalLine'

type VictoryScreenProps = {
  onContinue: () => void
}

const VictoryScreen = ({ onContinue }: VictoryScreenProps) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [command, setCommand] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const normalizeCommand = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = normalizeCommand(command)
    if (!normalized) return

    if (['continuar', 'c', 'enter'].includes(normalized)) {
      setFeedback(null)
      setCommand('')
      onContinue()
      return
    }

    setFeedback('Comando no reconocido. Usa: continuar')
  }

  return (
    <div className="space-y-4 text-sm text-amber-crt">
      <TerminalLine>Estado: victoria</TerminalLine>
      <TerminalLine className="text-amber-crt-dim">
        Texto descifrado. Limpiando pantalla ...
      </TerminalLine>
      {isDesktop ? (
        <div className="space-y-2">
          <TerminalLine className="text-xs uppercase tracking-[0.3em] text-amber-700">
            Comando: continuar
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
                autoFocus
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent text-amber-100 placeholder:text-amber-700 focus:outline-none"
                placeholder="Escribe continuar y presiona Enter"
              />
            </form>
          </TerminalLine>
          {feedback && (
            <TerminalLine className="text-xs text-amber-700">{feedback}</TerminalLine>
          )}
        </div>
      ) : (
        <TerminalLine>
          <button
            type="button"
            onClick={onContinue}
            className="rounded border border-amber-500/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-amber-100 transition hover:border-amber-200 hover:text-amber-50"
          >
            Continuar
          </button>
        </TerminalLine>
      )}
    </div>
  )
}

export default VictoryScreen
