import TerminalLine from './TerminalLine'
import type { EncryptedEvent as EncryptedEventType } from './types'

type EncryptedEventProps = {
  event: EncryptedEventType
}

const EncryptedEvent = ({ event }: EncryptedEventProps) => {
  return (
    <div className="space-y-3 text-sm">
      {event.lines.map((line) => (
        <TerminalLine key={line.label}>
          <span className="text-sky-200">{line.label}: </span>
          <span>
            {line.tokens.map((token, index) => (
              <span
                key={`${line.label}-${index}`}
                className={token.revealed ? 'text-emerald-200' : 'text-slate-500'}
              >
                {token.revealed ? token.original : token.encrypted}
                {index < line.tokens.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </TerminalLine>
      ))}
    </div>
  )
}

export default EncryptedEvent
