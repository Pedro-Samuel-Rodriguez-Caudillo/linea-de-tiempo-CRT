import { useRef } from 'react'
import useSectionAnimations from '../animations/useSectionAnimations'

const IntroSection = () => {
  const scope = useRef<HTMLElement | null>(null)
  useSectionAnimations('intro', { scope })

  return (
    <section ref={scope} id="intro" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
          Introduccion
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-neutral-100">
          Linea de tiempo
        </h1>
        <p className="mt-3 max-w-2xl text-base text-neutral-300">
          Estructura base lista para animaciones con GSAP ScrollTrigger.
        </p>
      </div>
    </section>
  )
}

export default IntroSection
