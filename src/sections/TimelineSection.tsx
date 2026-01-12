import { useRef } from 'react'
import useSectionAnimations from '../animations/useSectionAnimations'

const TimelineSection = () => {
  const scope = useRef<HTMLElement | null>(null)
  useSectionAnimations('timeline', { scope })

  return (
    <section ref={scope} id="timeline" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold text-neutral-100">
          Timeline principal
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 p-6">
            <p className="text-sm text-neutral-400">Hito 01</p>
            <p className="mt-2 text-base text-neutral-200">
              Contenedor para contenido.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 p-6">
            <p className="text-sm text-neutral-400">Hito 02</p>
            <p className="mt-2 text-base text-neutral-200">
              Contenedor para contenido.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 p-6">
            <p className="text-sm text-neutral-400">Hito 03</p>
            <p className="mt-2 text-base text-neutral-200">
              Contenedor para contenido.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimelineSection
