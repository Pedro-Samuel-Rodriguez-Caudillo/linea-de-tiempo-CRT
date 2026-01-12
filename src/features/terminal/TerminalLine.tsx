import type { PropsWithChildren } from 'react'
import { parseFormattedText } from './utils/textFormatting'

type TerminalLineProps = PropsWithChildren<{
  className?: string
}>

const TerminalLine = ({ className = '', children }: TerminalLineProps) => {
  const classes = ['console-line', className].filter(Boolean).join(' ')

  const content = typeof children === 'string' ? parseFormattedText(children) : children

  return <div className={classes}>{content}</div>
}

export default TerminalLine
