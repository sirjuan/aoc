import { createArray, last, parseNumber, splitLines, splitWords } from '../../shared/utils'

export function solver(inputStr: string) {
  const commands = splitLines(inputStr).reverse()

  const signalStrengths = [1]

  while (commands.length > 0) {
    const lastSignalStrength = last(signalStrengths)
    signalStrengths.push(lastSignalStrength)

    const command = commands.pop()

    if (command === 'noop') {
      continue
    }

    const delta = parseNumber(last(splitWords(command)))
    signalStrengths.push(lastSignalStrength + delta)
  }

  let result = 0
  for (let i = 20; i <= 220; i += 40) {
    result += signalStrengths[i - 1] * i
  }

  console.log('Part 1 result:', result)

  const displayWidth = 40
  const displayHeight = 6

  const lines = createArray<string[]>(displayHeight, () => [])

  signalStrengths.slice(0, displayHeight * displayWidth).forEach((signalStrength, index) => {
    const line = lines[Math.floor(index / displayWidth)]
    const lineWidth = line.length
    const isOnSprite = lineWidth >= signalStrength - 1 && lineWidth <= signalStrength + 1
    line.push(isOnSprite ? '#' : '.')
  })

  console.log('Part 2 result:')
  console.log(lines.map((line) => line.join('')).join('\n'))
}
