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
          <span>
            {line.labelTokens.map((token, index) => (
              <span
                key={`${line.label}-label-${index}`}
                className={token.revealed ? 'text-amber-200' : 'text-amber-900'}
              >
                {token.revealed ? token.original : token.encrypted}
                {index < line.labelTokens.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
          <span className="text-amber-700">: </span>
          <span>
            {line.tokens.map((token, index) => (
              <span
                key={`${line.label}-value-${index}`}
                className={token.revealed ? 'text-amber-200' : 'text-amber-900'}
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
