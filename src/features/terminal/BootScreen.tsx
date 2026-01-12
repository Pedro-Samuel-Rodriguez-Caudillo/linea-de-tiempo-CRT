import TerminalLine from './TerminalLine'
import TerminalLines from './TerminalLines'

type BootScreenProps = {
  lines: string[]
  ready: boolean
  dataStatus: 'loading' | 'ready' | 'error'
  onRetry?: () => void
}

const BootScreen = ({ lines, ready, dataStatus, onRetry }: BootScreenProps) => {
  return (
    <div className="space-y-2 text-sm text-emerald-100">
      <TerminalLine className="text-xs uppercase tracking-[0.4em] text-emerald-300">
        PapuSO
      </TerminalLine>
      <TerminalLines lines={lines} className="space-y-1" />
      {dataStatus === 'loading' && (
        <TerminalLine className="text-sky-200">Cargando data.json ...</TerminalLine>
      )}
      {dataStatus === 'error' && (
        <TerminalLine className="text-amber-200">
          Error al cargar data.json.{' '}
          <button
            type="button"
            onClick={onRetry}
            className="underline decoration-dotted underline-offset-4"
          >
            Reintentar
          </button>
        </TerminalLine>
      )}
      {ready && dataStatus === 'ready' && (
        <TerminalLine className="text-emerald-200">
          Presiona cualquier tecla para continuar
          <span className="blink">_</span>
        </TerminalLine>
      )}
    </div>
  )
}

export default BootScreen
