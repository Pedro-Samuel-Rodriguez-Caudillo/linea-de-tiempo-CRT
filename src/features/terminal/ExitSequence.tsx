import TerminalLine from './TerminalLine'

type ExitSequenceProps = {
  onRestart: () => void
}

const ExitSequence = ({ onRestart }: ExitSequenceProps) => {
  return (
    <div className="space-y-2 text-sm text-amber-200">
      <TerminalLine>Operacion de salida de SO iniciada</TerminalLine>
      <TerminalLine className="text-amber-100">
        Cerrando procesos en memoria ...
      </TerminalLine>
      <TerminalLine className="text-amber-100">Apagando modulos ...</TerminalLine>
      <TerminalLine className="text-amber-100">Estado: seguro</TerminalLine>
      <TerminalLine>
        <button
          type="button"
          onClick={onRestart}
          className="rounded border border-amber-400/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-amber-200 transition hover:border-amber-200 hover:text-amber-100"
        >
          Reiniciar
        </button>
      </TerminalLine>
    </div>
  )
}

export default ExitSequence
