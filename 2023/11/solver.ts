import { createArray, repeat, result, splitLines } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  result(1, solve(inputStr, 2), 9550717)
}

export const solver2: Solver = (inputStr) => {
  result(2, solve(inputStr, 1_000_000), 648458253817)
}

function solve(inputStr: string, multiplier: number) {
  const lines = splitLines(inputStr)
  const emptyRowIndices = []
  const nonEmptyColIndices = createArray(lines[0].length, false)

  let count = 0
  const map = new Map<number, Coordinate>()

  inputStr.split('\n').forEach((line, y) => {
    if (!line.includes('#')) {
      emptyRowIndices.push(y)
    }
    line.split('').forEach((char, x) => {
      if (char === '#') {
        map.set(++count, [x, y])
        nonEmptyColIndices[x] = true
      }
    })
  })

  const emptyColIndices = nonEmptyColIndices.map((val, i) => (val ? null : i)).filter((val) => val !== null)
  const calculatedPairs = new Set<string>()

  let totalDistances = 0

  for (let i = 1; i <= count; i++) {
    for (let j = 1; j <= count; j++) {
      if (i === j) continue
      const pair = [i, j].sort((a, b) => a - b).join(',')
      if (calculatedPairs.has(pair)) continue
      calculatedPairs.add(pair)
      const a = map.get(i)!.slice() as Coordinate
      const b = map.get(j)!.slice() as Coordinate
      const maxRow = Math.max(a[1], b[1])
      const minRow = Math.min(a[1], b[1])
      const maxCol = Math.max(a[0], b[0])
      const minCol = Math.min(a[0], b[0])
      const emptyRowCountBetween = emptyRowIndices.filter((index) => index > minRow && index < maxRow).length
      const emptyColCountBetween = emptyColIndices.filter((index) => index > minCol && index < maxCol).length
      const colMultiplier = Math.max(0, emptyColCountBetween * multiplier - emptyColCountBetween)
      const rowMultiplier = Math.max(0, emptyRowCountBetween * multiplier - emptyRowCountBetween)

      totalDistances += distance(a, b) + colMultiplier + rowMultiplier
    }
  }

  return totalDistances
}

type Coordinate = [x: number, y: number]

function distance([x0, y0]: Coordinate, [x1, y1]: Coordinate) {
  return Math.abs(x1 - x0) + Math.abs(y1 - y0)
}
