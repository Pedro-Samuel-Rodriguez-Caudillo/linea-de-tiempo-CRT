import type { PropsWithChildren } from 'react'

type TerminalLineProps = PropsWithChildren<{
  className?: string
}>

const TerminalLine = ({ className = '', children }: TerminalLineProps) => {
  const classes = ['console-line', className].filter(Boolean).join(' ')

  return <div className={classes}>{children}</div>
}

export default TerminalLine
