import { result } from '../../shared/utils'

const directions: Direction[] = ['up', 'right', 'down', 'left']
type Direction = 'up' | 'right' | 'down' | 'left'

export const solver1: Solver = (inputStr) => {
  const grid = parseGrid(inputStr)
  const start: Coord = [1, 0]
  const end: Coord = [grid[grid.length - 1].findIndex((char) => char === '.'), grid.length - 1]
  const endStr = stringifyCoord(end)

  const item: { coord: Coord; direction: Direction; visited: Set<string> } = {
    coord: start,
    direction: 'down',
    visited: new Set<string>(),
  }

  const queue = [item]

  let maxVisited = 0

  while (queue.length > 0) {
    const { coord, direction, visited } = queue.pop()

    const key = stringifyCoord(coord)
    const item = getItem(grid, coord)

    if (item === '#') {
      continue
    }

    if (key === endStr) {
      maxVisited = Math.max(maxVisited, visited.size)
    }

    if (visited.has(key)) {
      continue
    }

    visited.add(key)

    const arrowDir = arrowToDirection(item)

    if (arrowDir !== null) {
      queue.push({
        coord: move(coord, arrowDir),
        direction: arrowDir,
        visited: new Set<string>(visited),
      })
      continue
    }

    const newDirections = directions.filter((dir) => oppositeDirection(dir) !== direction)
    for (const newDirection of newDirections) {
      const nextCoord = move(coord, newDirection)
      const nextItem = getItem(grid, nextCoord)

      if (nextItem === '#') {
        continue
      }

      queue.push({
        coord: nextCoord,
        direction: newDirection,
        visited: new Set<string>(visited),
      })
    }
  }

  result(1, maxVisited, 2166)
}

export const solver2: Solver = (inputStr) => {
  const grid = parseGrid(inputStr)
  const start: Coord = [1, 0]
  const end: Coord = [grid[grid.length - 1].findIndex((char) => char === '.'), grid.length - 2]
  const { startJunction, endJunction } = parseJunctions(grid, start, end)

  const queue = [{ junction: startJunction, visited: new Set<Junction>([startJunction]), distance: 0 }]

  let maxDistance = 0

  while (queue.length > 0) {
    const { junction, visited, distance } = queue.pop()

    visited.add(junction)

    for (const [nextJunction, nextDistance] of junction.connections.entries()) {
      if (nextJunction === endJunction) {
        maxDistance = Math.max(maxDistance, distance + nextDistance)
        continue
      }
      if (!visited.has(nextJunction)) {
        queue.push({ junction: nextJunction, visited: new Set<Junction>(visited), distance: distance + nextDistance })
      }
    }
  }

  result(2, maxDistance + 1, 6378)
}

type Grid = string[][]
type Coord = [number, number]

function stringifyCoord(coord: Coord): string {
  return JSON.stringify(coord)
}

const directionDelta: Record<Direction, Coord> = {
  down: [0, 1],
  right: [1, 0],
  up: [0, -1],
  left: [-1, 0],
}

function oppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case 'up':
      return 'down'
    case 'right':
      return 'left'
    case 'down':
      return 'up'
    case 'left':
      return 'right'
  }
}

function move(coord: Coord, direction: Direction): Coord {
  return [coord[0] + directionDelta[direction][0], coord[1] + directionDelta[direction][1]]
}

function parseGrid(inputStr: string): Grid {
  return inputStr.split('\n').map((line) => line.split(''))
}

type Distance = number

type Junction = {
  coord: Coord
  id: string
  connections: Map<Junction, Distance>
}

function parseJunctions(grid: Grid, start: Coord, end: Coord): Record<string, Junction> {
  const startJunction: Junction = { coord: start, id: stringifyCoord(start), connections: new Map() }
  const endJunction: Junction = { coord: end, id: stringifyCoord(end), connections: new Map() }

  const junctions: Record<string, Junction> = {
    [stringifyCoord(start)]: startJunction,
    [stringifyCoord(end)]: endJunction,
  }
  for (let y = 0; y < grid.length; y++) {
    const line = grid[y]
    for (let x = 0; x < line.length; x++) {
      const char = line[x]
      if (char === '.') {
        const adjacent = directions
          .map((dir) => move([x, y], dir))
          .map((coord) => getItem(grid, coord))
          .filter((char) => char != null && char !== '#')

        if (adjacent.length <= 2) {
          continue
        }
        const coord: Coord = [x, y]
        const id = stringifyCoord(coord)
        const junction = { coord, id, connections: new Map<Junction, Distance>() }
        junctions[junction.id] = junction
      }
    }
  }

  for (const junction of Object.values(junctions)) {
    const { coord } = junction
    const queue = [{ coord, distance: 0 }]
    const visited = new Set<string>()
    while (queue.length > 0) {
      const item = queue.pop()
      const key = stringifyCoord(item.coord)
      if (visited.has(key)) {
        continue
      }
      visited.add(key)

      const moves = directions
        .map((dir) => move(item.coord, dir))
        .map((coord) => ({ coord, item: getItem(grid, coord) }))
        .filter(({ item }) => item != null && item !== '#')

      for (const move of moves) {
        const adjacentJunction = junctions[stringifyCoord(move.coord)]
        if (adjacentJunction) {
          junction.connections.set(adjacentJunction, item.distance + 1)
        } else {
          queue.push({ coord: move.coord, distance: item.distance + 1 })
        }
      }
    }
  }

  return { startJunction, endJunction }
}

function getItem(grid: Grid, coord: Coord): string {
  return grid[coord[1]]?.[coord[0]] ?? '#'
}

function arrowToDirection(arrow: string): Direction | null {
  switch (arrow) {
    case '^':
      return 'up'
    case '>':
      return 'right'
    case 'v':
      return 'down'
    case '<':
      return 'left'
    default:
      return null
  }
}
