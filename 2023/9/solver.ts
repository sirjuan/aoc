import { parseNumber, result, splitLines } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  const part1 = calculateSequences(inputStr).reduce((acc, sequence) => {
    sequence.forEach((line, index, original) => {
      if (index === 0) {
        line.push(0)
      }
      const next = original[index + 1]
      if (next === undefined) {
        return
      }
      next.push(next.at(-1) + line.at(-1))
    })

    return acc + sequence.at(-1).at(-1)
  }, 0)

  result(1, part1, 2008960228)
}

export const solver2: Solver = (inputStr) => {
  const part2 = calculateSequences(inputStr).reduce((acc, sequence) => {
    sequence.forEach((line, index, original) => {
      if (index === 0) {
        line.unshift(0)
      }
      const next = original[index + 1]
      if (next === undefined) {
        return
      }
      next.unshift(next[0] - line[0])
    })

    return acc + sequence.at(-1)[0]
  }, 0)

  result(2, part2, 1097)
}

function calculateSequences(inputStr: string) {
  const lines = splitLines(inputStr)
  const values = lines.map((line) => line.split(' ').map(parseNumber))
  return values.map(calculateSequence)
}

function calculateSequence(values: number[]): number[][] {
  const sequences = [values]
  while (sequences.at(-1).some((val) => val !== 0)) {
    const last = sequences.at(-1)
    sequences.push(
      last.reduce((acc, val, i, original) => {
        const next = original[i + 1]
        if (next === undefined) return acc
        return [...acc, next - val]
      }, [])
    )
  }
  return sequences.reverse()
}
