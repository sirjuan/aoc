import { parseMap, result, rotateMatrix45deg } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  const { horizontalLines, verticalLines, map } = parseMap(inputStr)
  const diagonalClockwise = rotateMatrix45deg(map, 'clockwise').map((line) => line.join(''))
  const diagonalCounterClockwise = rotateMatrix45deg(map, 'counterClockwise').map((line) => line.join(''))
  const allLines = [...horizontalLines, ...verticalLines, ...diagonalClockwise, ...diagonalCounterClockwise]
  const regex = /(?=(XMAS|SAMX))/g
  const res = allLines.reduce((acc, line) => acc + (line.match(regex)?.length ?? 0), 0)
  result(1, res)
}

export const solver2: Solver = (inputStr) => {
  const aPositions: [x: number, y: number][] = []

  const { map } = parseMap(inputStr, (char, x, y) => {
    if (char === 'A') {
      aPositions.push([x, y])
    }
  })

  const res = aPositions.reduce((acc, [x, y]) => {
    const NE = map[y - 1]?.[x + 1]
    const SE = map[y + 1]?.[x + 1]
    const SW = map[y + 1]?.[x - 1]
    const NW = map[y - 1]?.[x - 1]
    const chars = [NE, SE, SW, NW]

    if (
      chars.filter((char) => char === 'S').length === 2 &&
      chars.filter((char) => char === 'M').length === 2 &&
      ((NE === 'S' && SW === 'M') || (NE === 'M' && SW === 'S'))
    ) {
      return acc + 1
    }

    return acc
  }, 0)

  result(2, res)
}
