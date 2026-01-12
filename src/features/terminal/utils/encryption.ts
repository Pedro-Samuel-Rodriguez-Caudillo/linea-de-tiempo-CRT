import type { EncryptedEvent, EncryptedLine, TimelineEntry, WordToken } from '../types'

const encodeWord = (word: string) =>
  word
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ')

const createTokens = (text: string): WordToken[] =>
  text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({
      original: word,
      encrypted: encodeWord(word),
      revealed: false,
    }))

const createLine = (label: string, text: string): EncryptedLine => ({
  label,
  labelTokens: createTokens(label),
  tokens: createTokens(text),
})

export const buildEncryptedEvent = (
  entry: TimelineEntry,
  index: number,
): EncryptedEvent => {
  const lines = [
    createLine('Título', entry.titulo),
    createLine('Año', entry.anio),
    createLine('Descripción', entry.descripcion),
  ]
  const totalWords = lines.reduce(
    (acc, line) => acc + line.labelTokens.length + line.tokens.length,
    0,
  )

  return {
    id: `evento-${index + 1}`,
    lines,
    totalWords,
    revealedWords: 0,
    decryptable: true,
  }
}

export const buildEncryptedEvents = (entries: TimelineEntry[]) =>
  entries.map((entry, index) => buildEncryptedEvent(entry, index))

export const revealNextWord = (event: EncryptedEvent): EncryptedEvent => {
  const revealState = { revealed: false }

  const revealTokens = (tokens: WordToken[]) =>
    tokens.map((token) => {
      if (token.revealed || revealState.revealed) {
        return token
      }
      revealState.revealed = true
      return { ...token, revealed: true }
    })

  const lines = event.lines.map((line) => ({
    ...line,
    labelTokens: revealTokens(line.labelTokens),
    tokens: revealTokens(line.tokens),
  }))

  if (!revealState.revealed) {
    return event
  }

  return {
    ...event,
    lines,
    revealedWords: Math.min(event.revealedWords + 1, event.totalWords),
  }
}

export const isEventComplete = (event: EncryptedEvent) =>
  event.revealedWords >= event.totalWords
