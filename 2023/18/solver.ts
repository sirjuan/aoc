import { parseNumber, result } from '../../shared/utils'

const directions = ['R', 'D', 'L', 'U'] as const

export const solver1: Solver = (inputStr) => {
  const solved = solve(inputStr, (line) => {
    const [dir, countStr] = line.split(' ')
    return [dir as Direction, parseNumber(countStr)]
  })

  result(1, solved, 62500)
}

export const solver2: Solver = (inputStr) => {
  const solved = solve(inputStr, (line) => {
    const [, , colorStr] = line.split(' ')
    const count = parseInt(colorStr.slice(2, 7), 16)
    const direction = directions[parseNumber(colorStr.at(-2))]
    return [direction, count]
  })

  result(2, solved, 122109860712709)
}

function solve(inputStr: string, callback: (line: string) => [direction: Direction, count: number]) {
  const vertices: Coord[] = [[0, 0]]
  let currentCoordinates: Coord = [0, 0]
  let perimeter = 0

  inputStr.split('\n').forEach((line) => {
    const [direction, count] = callback(line)

    switch (direction) {
      case 'U':
        currentCoordinates[1] += count
        break
      case 'D':
        currentCoordinates[1] -= count

        break
      case 'L':
        currentCoordinates[0] -= count
        break
      case 'R':
        currentCoordinates[0] += count
        break
    }
    vertices.push(currentCoordinates.slice() as Coord)
    perimeter += count
  })

  return shoeLaceArea(vertices) + perimeter / 2 + 1
}

type Coord = [number, number]
type Direction = (typeof directions)[number]

function shoeLaceArea(vertices: [number, number][]) {
  let sum1 = 0
  let sum2 = 0

  for (let i = 0; i < vertices.length - 2; i++) {
    sum1 += vertices[i][0] * vertices[i + 1][1]
    sum2 += vertices[i][1] * vertices[i + 1][0]
  }

  return Math.abs(sum1 - sum2) / 2
}
