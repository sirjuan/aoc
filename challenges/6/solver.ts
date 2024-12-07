import { parseMap, result, uniq } from '../../shared/utils'

type Dir = 'up' | 'down' | 'left' | 'right'
type Pos = [x: number, y: number]
type PosDir = [x: number, y: number, direction: Dir]

export const solver: Solver = (inputStr) => {
  const { map, startPosition } = getMap(inputStr)
  const start: PosDir = [...startPosition, 'up']
  const path = solve(map, [start])[0]

  result(1, uniq(path.map(stringifyCoords)).length)

  let infiniteLoops = 0
  const visited = new Set<string>()

  path.forEach((step, index) => {
    const stringigied = stringifyCoords(step)
    if (index === 0 || visited.has(stringigied) || getItem(map, step) === '#') {
      return
    }
    visited.add(stringigied)

    if (solve(map, path.slice(0, index), stringigied)[1]) {
      infiniteLoops++
    }
  }, 0)

  result(2, infiniteLoops)
}

function solve(map: string[][], history: PosDir[], extraBlock?: string): [PosDir[], boolean] {
  const visited = new Set<string>(history.map(stringify))
  const visitedPositions: PosDir[] = history.slice()
  let dir: Dir = history.at(-1)[2]

  while (true) {
    const nextPos = move(dir, visitedPositions.at(-1))
    const nextItem = getItem(map, nextPos)
    const entry: PosDir = [...nextPos, dir]
    const stringified = stringify(entry)

    if (visited.has(stringified)) {
      return [visitedPositions, true]
    }

    if (nextItem == null) {
      return [visitedPositions, false]
    }

    if (nextItem === '#' || extraBlock === stringify(nextPos)) {
      dir = turnRight(dir)
      continue
    }

    visitedPositions.push(entry)
    visited.add(stringified)
  }
}

function getMap(inputStr: string) {
  let startPosition: Pos = [0, 0]

  const { map } = parseMap(inputStr, (char, x, y) => {
    if (char === '^') {
      startPosition = [x, y]
    }
  })

  return { map, startPosition }
}

function move(direction: Dir, currentPos: Pos | PosDir): Pos {
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

function turnRight(direction: Dir): Dir {
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

function stringify(pos: Array<number | string>): string {
  return pos.join(',')
}

function stringifyCoords(pos: PosDir): string {
  return pos.slice(0, 2).join(',')
}

function getItem(map: string[][], pos: PosDir | Pos): string | null {
  return map[pos[1]]?.[pos[0]] ?? null
}

function setItem(map: string[][], pos: PosDir | Pos, value: string) {
  map[pos[1]][pos[0]] = value
}
