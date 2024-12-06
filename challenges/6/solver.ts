import { map } from 'lodash'
import { parseMap, parseNumber, result, uniq } from '../../shared/utils'

type Direction = 'up' | 'down' | 'left' | 'right'
type Position = [x: number, y: number]

export const solver: Solver = (inputStr) => {
  const { map, startPosition } = getMap(inputStr)
  const [visited] = detectLoop(map, startPosition)
  result(1, visited.length)

  const part2 = visited.slice(1).reduce((acc, pos) => {
    const [x, y] = pos.split(',').map(parseNumber)
    const original = map[y][x]
    if (original === '#') {
      return acc
    }
    map[y][x] = '#'
    const [, loop] = detectLoop(map, startPosition)
    map[y][x] = original
    return acc + (loop ? 1 : 0)
  }, 0)
  result(2, part2)
}

function detectLoop(map: string[][], startPosition: Position): [string[], boolean] {
  let currentDirection: Direction = 'up'
  const visited = new Set<string>([stringify(startPosition, currentDirection)])
  const visitedPositions: Position[] = [startPosition]

  while (true) {
    const currentPos = visitedPositions.at(-1)
    const nextPos = move(currentDirection, currentPos)
    const nextItem = getItem(map, nextPos)

    const coord = stringify(nextPos, currentDirection)

    if (visited.has(coord)) {
      return [uniq(visitedPositions.map((pos) => pos.join(','))), true]
    }

    if (nextItem == null) {
      return [uniq(visitedPositions.map((pos) => pos.join(','))), false]
    }

    if (nextItem === '#') {
      currentDirection = changeDirectionClockwise(currentDirection)
      continue
    }

    visitedPositions.push(nextPos)
    visited.add(coord)
  }
}

function getMap(inputStr: string) {
  let startPosition: Position = [0, 0]

  const { map } = parseMap(inputStr, (char, x, y) => {
    if (char === '^') {
      startPosition = [x, y]
    }
  })

  return { map, startPosition }
}

function move(direction: Direction, currentPos: Position): Position {
  switch (direction) {
    case 'up':
      return [currentPos[0], currentPos[1] - 1]
    case 'down':
      return [currentPos[0], currentPos[1] + 1]
    case 'left':
      return [currentPos[0] - 1, currentPos[1]]
    case 'right':
      return [currentPos[0] + 1, currentPos[1]]
  }
}

function changeDirectionClockwise(direction: Direction): Direction {
  switch (direction) {
    case 'up':
      return 'right'
    case 'right':
      return 'down'
    case 'down':
      return 'left'
    case 'left':
      return 'up'
  }
}

function stringify(pos: Position, direction: Direction): string {
  return [...pos, direction].join(',')
}

function getItem(map: string[][], pos: [number, number]): string | null {
  return map[pos[1]]?.[pos[0]] ?? null
}
