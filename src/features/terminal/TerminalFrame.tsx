import type { PropsWithChildren } from 'react'

const TerminalFrame = ({ children }: PropsWithChildren) => {
  return (
    <div className="crt-frame">
      <div className="crt-bezel">
        <div className="crt-screen">
          <div className="vignette"></div>
          <div className="crt-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TerminalFrame
