import { type FormEvent, useState } from 'react'
import useMediaQuery from './hooks/useMediaQuery'
import TerminalLine from './TerminalLine'

type ExitSequenceProps = {
  onRestart: () => void
}

const ExitSequence = ({ onRestart }: ExitSequenceProps) => {
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

    if (['reiniciar', 'r', 'restart'].includes(normalized)) {
      setFeedback(null)
      setCommand('')
      onRestart()
      return
    }

    setFeedback('Comando no reconocido. Usa: reiniciar')
  }

  return (
    <div className="space-y-2 text-sm text-amber-200">
      <TerminalLine>Operacion de salida de SO iniciada</TerminalLine>
      <TerminalLine className="text-amber-100">
        Cerrando procesos en memoria ...
      </TerminalLine>
      <TerminalLine className="text-amber-100">Apagando modulos ...</TerminalLine>
      <TerminalLine className="text-amber-100">Estado: seguro</TerminalLine>
      {isDesktop ? (
        <div className="space-y-2">
          <TerminalLine className="text-xs uppercase tracking-[0.3em] text-amber-700">
            Comando: reiniciar
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
                placeholder="Escribe reiniciar y presiona Enter"
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
            onClick={onRestart}
            className="rounded border border-amber-400/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-amber-200 transition hover:border-amber-200 hover:text-amber-100"
          >
            Reiniciar
          </button>
        </TerminalLine>
      )}
    </div>
  )
}

export default ExitSequence
