import type { PropsWithChildren } from 'react'

const TerminalFrame = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen px-4 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-5xl">
        <div className="crt-frame">
          <div className="crt-screen">
            <div className="crt-content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TerminalFrame
