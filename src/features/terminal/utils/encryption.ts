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
  tokens: createTokens(text),
})

export const buildEncryptedEvent = (
  entry: TimelineEntry,
  index: number,
): EncryptedEvent => {
  const lines = [
    createLine('Titulo', entry.titulo),
    createLine('Anio', entry.anio),
    createLine('Descripcion', entry.descripcion),
  ]
  const totalWords = lines.reduce((acc, line) => acc + line.tokens.length, 0)

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
  let revealed = false

  const lines = event.lines.map((line) => {
    const tokens = line.tokens.map((token) => {
      if (token.revealed || revealed) {
        return token
      }
      revealed = true
      return { ...token, revealed: true }
    })

    return { ...line, tokens }
  })

  if (!revealed) {
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
