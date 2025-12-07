import { result, splitChars, splitLines } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  const lines = splitLines(inputStr).map(splitChars)

  const start = lines[0].indexOf('S')

  const splitted = new Set<string>()

  let previousStates = new Set<number>([start])

  lines.forEach((line, y) => {
    if (y === 0) return

    const currentStates = new Set<number>()

    previousStates.forEach((x) => {
      if (line[x] === '^') {
        currentStates.add(x - 1)
        currentStates.add(x + 1)
        splitted.add(`${y}-${x}`)
      } else {
        currentStates.add(x)
      }
    })

    previousStates = currentStates
  })
  result(1, splitted.size)
}

export const solver2: Solver = (inputStr) => {
  let part2 = 1

  const lines = splitLines(inputStr).map(splitChars)

  const start = lines[0].indexOf('S')

  let previousStates: Record<number, number> = { [start]: 1 }

  lines.forEach((line, y) => {
    if (y === 0) return

    const currentStates: Record<number, number> = {}

    Object.entries(previousStates).forEach(([xStr, count]) => {
      const x = Number(xStr)
      if (line[x] === '^') {
        currentStates[x - 1] = (currentStates[x - 1] || 0) + count
        currentStates[x + 1] = (currentStates[x + 1] || 0) + count
        part2++
      } else {
        currentStates[x] = (currentStates[x] || 0) + count
      }
    })

    previousStates = currentStates
  })

  result(
    2,
    Object.values(previousStates).reduce((a, b) => a + b, 0)
  )
}
