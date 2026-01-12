import { useEffect, useState } from 'react'

const useMediaQuery = (query: string) => {
  const getMatch = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  const [matches, setMatches] = useState(getMatch)

  useEffect(() => {
    const media = window.matchMedia(query)
    const handler = () => setMatches(media.matches)

    handler()

    if (media.addEventListener) {
      media.addEventListener('change', handler)
    } else {
      media.addListener(handler)
    }

    return () => {
      if (media.addEventListener) {
        media.removeEventListener('change', handler)
      } else {
        media.removeListener(handler)
      }
    }
  }, [query])

  return matches
}

export default useMediaQuery
