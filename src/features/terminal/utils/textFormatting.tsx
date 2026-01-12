import type { ReactNode } from 'react'

export const parseFormattedText = (text: string): ReactNode => {
  const parts: ReactNode[] = []
  let current = ''
  
  for (let i = 0; i < text.length; i++) {
    // Check for [P]C or [E]C pattern
    if (text[i] === '[' && i + 3 < text.length && text[i + 2] === ']') {
      const type = text[i + 1]
      // Only process known types to avoid accidental matching
      if (type === 'P' || type === 'E') {
        const char = text[i + 3]
        
        if (current) {
          parts.push(current)
          current = ''
        }
        
        const className = type === 'P' ? 'crt-entity-player' : 'crt-entity-enemy'
        parts.push(<span key={i} className={className}>{char}</span>)
        
        i += 3 // Skip [, type, ] (3 chars). Loop increments 1, so total 4 chars skipped (the marker + the char)
        continue
      }
    }
    current += text[i]
  }
  
  if (current) {
    parts.push(current)
  }
  
  return <>{parts}</>
}