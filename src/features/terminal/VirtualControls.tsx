import type { KeyControls } from './hooks/useKeyControls'

type VirtualControlsProps = {
  controls: KeyControls
}

const VirtualControls = ({ controls }: VirtualControlsProps) => {
  const Button = ({ k, label, className = '' }: { k: string, label: string, className?: string }) => (
    <button
      onMouseDown={() => controls.triggerDown(k)}
      onMouseUp={() => controls.triggerUp(k)}
      onMouseLeave={() => controls.triggerUp(k)}
      onTouchStart={(e) => { e.preventDefault(); controls.triggerDown(k) }}
      onTouchEnd={(e) => { e.preventDefault(); controls.triggerUp(k) }}
      className={`
        flex h-12 w-12 items-center justify-center rounded border border-amber-800/40 
        bg-amber-950/20 text-xs font-bold uppercase tracking-widest text-amber-crt-dim
        active:border-amber-500 active:bg-amber-900/40 active:text-amber-crt sm:h-14 sm:w-14
        ${className}
      `}
    >
      {label}
    </button>
  )

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-8 md:hidden">
      {/* Directional Pad */}
      <div className="grid grid-cols-3 gap-2">
        <div />
        <Button k="arrowup" label="W" />
        <div />
        <Button k="arrowleft" label="A" />
        <Button k="arrowdown" label="S" />
        <Button k="arrowright" label="D" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button k="space" label="ACT" className="w-24 sm:w-28" />
      </div>
    </div>
  )
}

export default VirtualControls
