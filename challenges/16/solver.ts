import { result } from '../../shared/utils'

const deflectionMirrors = ['/', '\\'] as const
const splitMirrors = ['|', '-'] as const
const mirrors = [...deflectionMirrors, ...splitMirrors] as const
const directions = ['N', 'S', 'E', 'W'] as const

export const solver: Solver = (inputStr) => {
  const grid = createGrid(inputStr)

  result(1, getEnergized(grid, [0, 0], 'E'), 7608)

  const results: number[] = []

  let grid2 = grid

  for (let y = 0; y < grid.length; y++) {
    results.push(getEnergized(grid2, [0, y], 'E'))
    results.push(getEnergized(grid2, [grid2[y].length - 1, y], 'W'))
  }

  for (let x = 0; x < grid[0].length; x++) {
    results.push(getEnergized(grid2, [x, 0], 'S'))
    results.push(getEnergized(grid2, [x, grid2.length - 1], 'N'))
  }

  result(2, Math.max(...results))
}

function getEnergized(grid: Grid, coord: Coord, direction: Direction) {
  const queue: { coord: Coord; direction: Direction }[] = [{ coord, direction }]
  const state = new Set<string>([stringifyCoordWithDirection(coord, 'E')])

  while (queue.length) {
    const { coord, direction } = queue.shift()!

    const nextItem = get(grid, coord)

    if (isEmpty(nextItem)) {
      const nextCoord = move(grid, coord, direction)
      if (!nextCoord) {
        continue
      }
      const nextStringified = stringifyCoordWithDirection(nextCoord, direction)
      if (!state.has(nextStringified)) {
        queue.push({ coord: nextCoord, direction })
        state.add(nextStringified)
      }
    }

    if (isDeflectionMirror(nextItem)) {
      const newDirection = handleDeflectionMirror(nextItem, direction)
      const nextCoord = move(grid, coord, newDirection)
      if (!nextCoord) {
        continue
      }
      const nextStringified = stringifyCoordWithDirection(nextCoord, newDirection)
      if (!state.has(nextStringified)) {
        queue.push({ coord: nextCoord, direction: newDirection })
        state.add(nextStringified)
      }
    }

    if (isSplitMirror(nextItem)) {
      const newDirections = handleSplitMirror(nextItem, direction)
      for (const newDirection of newDirections) {
        const nextCoord = move(grid, coord, newDirection)
        if (nextCoord) {
          const nextStringified = stringifyCoordWithDirection(nextCoord, newDirection)
          if (!state.has(nextStringified)) {
            queue.push({ coord: nextCoord, direction: newDirection })
            state.add(nextStringified)
          }
        }
      }
      continue
    }
  }

  const coordSet = new Set<string>()
  for (const coord of state) {
    coordSet.add(coord.split(' ')[0])
  }

  return coordSet.size
}

type Coord = readonly [x: number, y: number]
type Grid = GridItem[][]
type Direction = (typeof directions)[number]
type Mirror = (typeof mirrors)[number]
type DeflectionMirror = (typeof deflectionMirrors)[number]
type SplitMirror = (typeof splitMirrors)[number]
type Empty = '.'
type GridItem = Mirror | Empty

function createGrid(input: string) {
  const grid = input.split('\n').map((row) => row.replace(/[\\\\]/g, '\\').split(/\s*/))
  return grid as Grid
}

function get(grid: Grid, [x, y]: Coord) {
  return grid[y]?.[x]
}

function stringifyCoordWithDirection([x, y]: Coord, direction: Direction) {
  return `${x},${y} ${direction}`
}

function handleDeflectionMirror(mirror: DeflectionMirror, direction: Direction): Direction {
  switch (mirror) {
    case '/':
      if (direction === 'N') {
        return 'E'
      }
      if (direction === 'S') {
        return 'W'
      }
      if (direction === 'E') {
        return 'N'
      }
      if (direction === 'W') {
        return 'S'
      }
    case '\\':
      if (direction === 'N') {
        return 'W'
      }
      if (direction === 'S') {
        return 'E'
      }
      if (direction === 'E') {
        return 'S'
      }
      if (direction === 'W') {
        return 'N'
      }
  }
}

function handleSplitMirror(mirror: SplitMirror, direction: Direction): Direction[] {
  switch (mirror) {
    case '|':
      if (direction === 'N' || direction === 'S') return [direction]
      return ['N', 'S']
    case '-':
      if (direction === 'E' || direction === 'W') return [direction]
      return ['E', 'W']
  }
}

function move(grid: Grid, [x, y]: Coord, direction: Direction): Coord | null {
  const [dx, dy] = directionToCoord(direction)
  const coord: Coord = [x + dx, y + dy]
  if (isOutOfBounds(grid, coord)) {
    return null
  }
  return coord
}

function isOutOfBounds(grid: Grid, [x, y]: Coord) {
  return !grid[y]?.[x]
}

function directionToCoord(direction: string) {
  switch (direction) {
    case 'N':
      return [0, -1] as const
    case 'S':
      return [0, 1] as const
    case 'E':
      return [1, 0] as const
    case 'W':
      return [-1, 0] as const
  }
}

function isEmpty(item: GridItem): item is Empty {
  return item === '.'
}

function isDeflectionMirror(item: GridItem): item is DeflectionMirror {
  return deflectionMirrors.includes(item as DeflectionMirror)
}

function isSplitMirror(item: GridItem): item is SplitMirror {
  return splitMirrors.includes(item as SplitMirror)
}
