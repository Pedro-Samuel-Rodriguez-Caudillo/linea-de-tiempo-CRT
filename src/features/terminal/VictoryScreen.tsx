import TerminalLine from './TerminalLine'

type VictoryScreenProps = {
  onContinue: () => void
}

const VictoryScreen = ({ onContinue }: VictoryScreenProps) => {
  return (
    <div className="space-y-4 text-sm text-emerald-200">
      <TerminalLine>Estado: victoria</TerminalLine>
      <TerminalLine className="text-slate-300">
        Texto descifrado. Limpiando pantalla ...
      </TerminalLine>
      <TerminalLine>
        <button
          type="button"
          onClick={onContinue}
          className="rounded border border-emerald-400/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-100 transition hover:border-emerald-200 hover:text-emerald-50"
        >
          Continuar
        </button>
      </TerminalLine>
    </div>
  )
}

export default VictoryScreen
