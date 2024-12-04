import { result, sum, transposeArray } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  const maps = inputStr.split('\n\n')
  result(1, sum(...maps.map((map) => calculate(map, 0))), 29213)
}

export const solver2: Solver = (inputStr) => {
  const maps = inputStr.split('\n\n')
  result(1, sum(...maps.map((map) => calculate(map, 1))), 37453)
}

function calculate(mapStr: string, allowedDiff: number) {
  const map = mapStr.split('\n').map((row) => row.split(''))

  let foundX = findReflection(map, allowedDiff)

  if (foundX > 0) {
    return foundX * 100
  }

  return findReflection(transposeArray(map), allowedDiff)
}

function findReflection(map: string[][], allowedDiff: number) {
  let foundX = 0
  map.forEach((rowStr, y, originalRows) => {
    if (foundX > 0) {
      return
    }

    let splitIndex = -1

    const previousRow = originalRows[y - 1]?.join('')
    const row = rowStr.join('')

    if (previousRow == null) {
      return
    }

    if (diffString(previousRow, row) <= allowedDiff) {
      splitIndex = y - 1
    }

    if (splitIndex === -1) {
      return
    }

    const firstRows = originalRows.slice(0, splitIndex + 1)
    const secondRows = originalRows.slice(splitIndex + 1)

    const size = Math.min(firstRows.length, secondRows.length)
    const before = firstRows
      .reverse()
      .slice(0, size)
      .map((row) => row.join(''))
    const after = secondRows.slice(0, size).map((row) => row.join(''))

    if (diffArray(before, after) === allowedDiff) {
      foundX = splitIndex + 1
      return
    }
  })

  return foundX
}

function diffArray(a: string[], b: string[]): number {
  let diffs = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diffs++
  }
  return diffs
}

function diffString(a: string, b: string): number {
  return diffArray(a.split(''), b.split(''))
}
