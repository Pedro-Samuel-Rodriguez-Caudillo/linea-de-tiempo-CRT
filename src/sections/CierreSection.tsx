import { useRef } from 'react'
import useSectionAnimations from '../animations/useSectionAnimations'

const CierreSection = () => {
  const scope = useRef<HTMLElement | null>(null)
  useSectionAnimations('cierre', { scope })

  return (
    <section ref={scope} id="cierre" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold text-neutral-100">
          Cierre
        </h2>
        <p className="mt-3 max-w-2xl text-base text-neutral-300">
          Zona final para resumen o llamada a la accion.
        </p>
      </div>
    </section>
  )
}

export default CierreSection
