import { useCallback, useEffect } from 'react'
import { soundSynth } from '../utils/soundSynth'

const useSound = () => {
  // Inicializamos el sonido en la primera interacción si es posible
  useEffect(() => {
    const initAudio = () => {
      soundSynth.startHum().catch(() => {
        // Navegadores bloquean audio hasta interaccion explicita
      })
    }

    window.addEventListener('click', initAudio, { once: true })
    window.addEventListener('keydown', initAudio, { once: true })

    return () => {
      soundSynth.stopHum()
      window.removeEventListener('click', initAudio)
      window.removeEventListener('keydown', initAudio)
    }
  }, [])

  const playKeystroke = useCallback(() => soundSynth.playKeystroke(), [])
  const playBeep = useCallback(() => soundSynth.playBeep(), [])
  const playSuccess = useCallback(() => soundSynth.playSuccess(), [])
  const playError = useCallback(() => soundSynth.playError(), [])
  const playBoot = useCallback(() => soundSynth.playBootSequence(), [])
  const toggleMute = useCallback(() => soundSynth.toggleMute(), [])

  return {
    playKeystroke,
    playBeep,
    playSuccess,
    playError,
    playBoot,
    toggleMute,
  }
}

export default useSound
