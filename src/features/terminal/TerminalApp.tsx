import { useEffect, useState } from 'react'
import BootScreen from './BootScreen'
import BriefingScreen from './BriefingScreen'
import EventPrompt from './EventPrompt'
import ExitSequence from './ExitSequence'
import MinigamePanel from './MinigamePanel'
import TerminalFrame from './TerminalFrame'
import TerminalLine from './TerminalLine'
import VictoryScreen from './VictoryScreen'
import { BOOT_LINES, INSTRUCTION_LINES, MINIGAMES } from './constants'
import useBootSequence from './hooks/useBootSequence'
import useFirstInteraction from './hooks/useFirstInteraction'
import useTimelineData from './hooks/useTimelineData'
import { buildEncryptedEvents, isEventComplete, revealNextWord } from './utils/encryption'
import type { EncryptedEvent, MinigameDefinition, MinigameState, Stage } from './types'

const pickMinigame = (list: MinigameDefinition[]) =>
  list[Math.floor(Math.random() * list.length)]

const TerminalApp = () => {
  const [bootKey, setBootKey] = useState(0)
  const boot = useBootSequence(BOOT_LINES, {
    stepDelayMs: 180,
    minDurationMs: 3000,
    sequenceKey: bootKey,
  })
  const { data, status, reload } = useTimelineData()
  const [events, setEvents] = useState<EncryptedEvent[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stage, setStage] = useState<Stage>('boot')
  const [showBanner, setShowBanner] = useState(false)
  const [minigame, setMinigame] = useState<MinigameState | null>(null)
  const [screenKey, setScreenKey] = useState(0)

  useEffect(() => {
    if (status === 'ready') {
      setEvents(buildEncryptedEvents(data))
      setCurrentIndex(0)
    }
  }, [data, status])

  const isReadyForInput = boot.done && status === 'ready'

  useFirstInteraction({
    enabled: stage === 'boot' && isReadyForInput,
    onInteract: () => {
      setStage('briefing')
    },
  })

  const handleBriefingComplete = () => {
    setStage('prompt')
    setShowBanner(true)
  }

  const currentEvent = events[currentIndex]
  const isLastEvent = currentIndex >= events.length - 1
  const canDecrypt =
    Boolean(currentEvent) &&
    currentEvent.decryptable &&
    currentEvent.revealedWords < currentEvent.totalWords

  const startMinigame = () => {
    if (!currentEvent) return
    const remainingWords = currentEvent.totalWords - currentEvent.revealedWords
    if (remainingWords <= 0) return
    const definition = pickMinigame(MINIGAMES)

    setMinigame({
      ...definition,
      points: 0,
      target: Math.min(definition.baseTarget, remainingWords),
      lives: 5,
    })
    setStage('minigame')
  }

  const handleContinue = () => {
    setShowBanner(false)
    if (isLastEvent) return
    setCurrentIndex((index) => Math.min(index + 1, events.length - 1))
  }

  const handleDecrypt = () => {
    if (!canDecrypt) return
    setShowBanner(false)
    startMinigame()
  }

  const handleExit = () => {
    setShowBanner(false)
    setStage('exit')
  }

  const handleGainPoint = () => {
    if (!currentEvent || !minigame) return
    const updatedEvent = revealNextWord(currentEvent)

    setEvents((prev) =>
      prev.map((event, index) => (index === currentIndex ? updatedEvent : event)),
    )

    const nextPoints = minigame.points + 1
    setMinigame({ ...minigame, points: nextPoints })

    if (isEventComplete(updatedEvent) || nextPoints >= minigame.target) {
      setStage('victory')
    }
  }

  const handleLoseLife = () => {
    if (!currentEvent || !minigame) return
    const nextLives = minigame.lives - 1

    if (nextLives <= 0) {
      setEvents((prev) =>
        prev.map((event, index) =>
          index === currentIndex ? { ...event, decryptable: false } : event,
        ),
      )
      setMinigame(null)
      setStage('prompt')
      return
    }

    setMinigame({ ...minigame, lives: nextLives })
  }

  const handleVictoryContinue = () => {
    setMinigame(null)
    setShowBanner(false)
    setStage('prompt')
    setScreenKey((key) => key + 1)
  }

  const handleRestart = () => {
    setMinigame(null)
    setShowBanner(false)
    setStage('boot')
    setScreenKey((key) => key + 1)
    setBootKey((key) => key + 1)
    if (status === 'ready') {
      setEvents(buildEncryptedEvents(data))
      setCurrentIndex(0)
    } else {
      reload()
    }
  }

  return (
    <TerminalFrame>
      {stage === 'boot' && (
        <BootScreen lines={boot.lines} ready={boot.done} dataStatus={status} onRetry={reload} />
      )}
      {stage === 'briefing' && (
        <BriefingScreen lines={INSTRUCTION_LINES} onComplete={handleBriefingComplete} />
      )}
      {stage === 'prompt' && currentEvent && (
        <EventPrompt
          key={screenKey}
          event={currentEvent}
          showBanner={showBanner}
          isLast={isLastEvent}
          canDecrypt={canDecrypt}
          currentIndex={currentIndex}
          total={events.length}
          onContinue={handleContinue}
          onDecrypt={handleDecrypt}
          onExit={handleExit}
        />
      )}
      {stage === 'prompt' && !currentEvent && (
        <div className="space-y-2 text-sm text-amber-crt-dim">
          <TerminalLine>data.json sin eventos disponibles.</TerminalLine>
        </div>
      )}
      {stage === 'minigame' && currentEvent && minigame && (
        <MinigamePanel
          minigame={minigame}
          event={currentEvent}
          onGainPoint={handleGainPoint}
          onLoseLife={handleLoseLife}
        />
      )}
      {stage === 'victory' && <VictoryScreen onContinue={handleVictoryContinue} />}
      {stage === 'exit' && <ExitSequence onRestart={handleRestart} />}
    </TerminalFrame>
  )
}

export default TerminalApp

