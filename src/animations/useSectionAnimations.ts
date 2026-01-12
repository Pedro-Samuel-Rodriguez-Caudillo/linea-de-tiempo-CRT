import useGsap from '../lib/useGsap'
import { animateCierre } from './sections/cierre'
import { animateIntro } from './sections/intro'
import { animateTimeline } from './sections/timeline'
import type { AnimationSection } from './types'

type UseSectionAnimationsOptions = {
  scope?: Parameters<typeof useGsap>[1]['scope']
  dependencies?: Parameters<typeof useGsap>[1]['dependencies']
}

const useSectionAnimations = (
  section: AnimationSection,
  options: UseSectionAnimationsOptions = {},
) => {
  useGsap(() => {
    if (section === 'intro') {
      animateIntro()
    }

    if (section === 'timeline') {
      animateTimeline()
    }

    if (section === 'cierre') {
      animateCierre()
    }
  }, options)
}

export default useSectionAnimations
