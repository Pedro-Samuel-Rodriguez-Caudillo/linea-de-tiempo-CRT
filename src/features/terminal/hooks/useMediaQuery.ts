import { useEffect, useState } from 'react'

const useMediaQuery = (query: string) => {
  const getMatch = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  const [matches, setMatches] = useState(getMatch)

  useEffect(() => {
    const media = window.matchMedia(query)
    const handler = () => setMatches(media.matches)

    handler()

    media.addEventListener('change', handler)

    return () => {
      media.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}

export default useMediaQuery
