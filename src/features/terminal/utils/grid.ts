export const createGrid = (width: number, height: number, fill = ' ') =>
  Array.from({ length: height }, () => Array.from({ length: width }, () => fill))

export const renderGrid = (grid: string[][]) => grid.map((row) => row.join(''))

export const withBorder = (lines: string[]) => {
  const width = lines[0]?.length ?? 0
  const top = `+${'-'.repeat(width)}+`
  const middle = lines.map((line) => `|${line}|`)
  return [top, ...middle, top]
}

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

export const wrap = (value: number, min: number, max: number) => {
  if (value < min) return max
  if (value > max) return min
  return value
}

export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
