import TerminalLine from './TerminalLine'

type TerminalLinesProps = {
  lines: string[]
  className?: string
  lineClassName?: string
}

const TerminalLines = ({
  lines,
  className = '',
  lineClassName = 'whitespace-pre',
}: TerminalLinesProps) => {
  return (
    <div className={className}>
      {lines.map((line, index) => (
        <TerminalLine key={`${index}-${line}`} className={lineClassName}>
          {line.length > 0 ? line : ' '}
        </TerminalLine>
      ))}
    </div>
  )
}

export default TerminalLines
