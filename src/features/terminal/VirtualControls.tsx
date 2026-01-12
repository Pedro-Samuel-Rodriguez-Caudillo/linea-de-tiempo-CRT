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
        flex h-11 w-11 items-center justify-center rounded border border-amber-800/40 
        bg-amber-950/20 text-[10px] font-bold uppercase tracking-widest text-amber-crt-dim
        active:border-amber-500 active:bg-amber-900/40 active:text-amber-crt sm:h-14 sm:w-14 sm:text-xs
        ${className}
      `}
    >
      {label}
    </button>
  )

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:hidden">
      {/* Directional Pad */}
      <div className="grid grid-cols-3 gap-1.5">
        <div />
        <Button k="arrowup" label="W" />
        <div />
        <Button k="arrowleft" label="A" />
        <Button k="arrowdown" label="S" />
        <Button k="arrowright" label="D" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button k="space" label="ACT" className="w-20 sm:w-28" />
      </div>
    </div>
  )
}

export default VirtualControls
