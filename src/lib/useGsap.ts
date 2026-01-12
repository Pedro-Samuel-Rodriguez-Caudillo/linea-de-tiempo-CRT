import { type DependencyList, useLayoutEffect } from 'react'
import { gsap } from './gsap'

type GsapCallback = Parameters<typeof gsap.context>[0]
type GsapScope = Parameters<typeof gsap.context>[1]

type UseGsapOptions = {
  scope?: GsapScope
  dependencies?: DependencyList
}

const useGsap = (callback: GsapCallback, options: UseGsapOptions = {}) => {
  const { scope, dependencies = [] } = options

  useLayoutEffect(() => {
    const context = gsap.context(callback, scope)
    return () => context.revert()
  }, dependencies)
}

export default useGsap
