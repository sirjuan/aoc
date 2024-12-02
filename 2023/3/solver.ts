import { parseNumber, sum } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const lines = inputStr.split('\n')
  const numberRegex = /(?<numbers>\d+)/g

  // Solution part 1

  const matches: Record<string, number> = {}

  const part1Grid = Array.from({ length: lines.length + 1 }, () =>
    Array.from({ length: lines[0].length }, () => null)
  )

  lines.forEach((line, lineIndex) => {
    Array.from(line.matchAll(/(?<symbols>([^\d.])+)/g)).forEach((match) => {
      const symbolString = match.groups.symbols.replace(/\\\\/g, '\\')
      const index = match.index ?? 0

      for (let i = lineIndex - 1; i < lineIndex + 2; i++) {
        const lind = Math.max(i, 0)
        for (let j = index - 1; j < index + symbolString.length + 1; j++) {
          part1Grid[lind][j] = symbolString
        }
      }
    })
  })

  lines.forEach((line, lineIndex) => {
    Array.from(line.matchAll(numberRegex)).forEach((match) => {
      const numberString = match.groups.numbers
      const numbers = parseNumber(numberString)
      const index = match.index ?? 0
      const id = `${lineIndex}-${index}`

      for (let j = index; j < index + numberString.length; j++) {
        if (typeof part1Grid[lineIndex][j] === 'string') {
          matches[id] = numbers
        }
      }
    })
  })

  console.log('Part 1', sum(...Object.values(matches)))

  // Solution part 2

  const part2Grid = Array.from({ length: lines.length + 1 }, () =>
    Array.from({ length: lines[0].length }, () => [])
  )

  let total = 0

  lines.forEach((line, lineIndex) => {
    Array.from(line.matchAll(numberRegex)).forEach((match) => {
      const numberString = match.groups.numbers
      const numbers = parseNumber(numberString)
      const index = match.index ?? 0

      for (let i = lineIndex - 1; i < lineIndex + 2; i++) {
        const lind = Math.max(i, 0)
        for (let j = index - 1; j < index + numberString.length + 1; j++) {
          // console.log({ lind, j, grid, foo: grid[lind] })
          part2Grid[lind][j]?.push(numbers)
        }
      }
    })
  })

  lines.forEach((line, lineIndex) => {
    Array.from(line.matchAll(/(?<symbols>(\*))/g)).forEach((match) => {
      const symbolString = match.groups.symbols.replace(/\\\\/g, '\\')
      const index = match.index ?? 0

      const numbers: number[] = []

      for (let j = index; j < index + symbolString.length; j++) {
        numbers.push(...part2Grid[lineIndex][j])
      }

      if (numbers.length === 2) {
        total += numbers.reduce((a, b) => a * b, 1)
      }
    })
  })

  console.log('Part 2', total)
}
