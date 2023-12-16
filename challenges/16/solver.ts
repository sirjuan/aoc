import { result } from '../../shared/utils'

const deflectionMirrors = ['/', '\\'] as const
const splitMirrors = ['|', '-'] as const
const mirrors = [...deflectionMirrors, ...splitMirrors] as const
const directions = ['N', 'S', 'E', 'W'] as const

export const solver: Solver = (inputStr) => {
  const grid = createGrid(inputStr)
  const coord: Coord = [0, 0]
  const queue: { coord: Coord; direction: Direction }[] = [{ coord, direction: 'E' }]
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

  // ######....
  // .#...#....
  // .#...#####
  // .#...##...
  // .#...##...
  // .#...##...
  // .#..####..
  // ########..
  // .#######..
  // .#...#.#..

  // ######....
  // .#...#....
  // .#...#####
  // .#...##...
  // .#...##...
  // .#...##...
  // .#..####..
  // ########..
  // .#######..
  // .#...#.#..

  console.log(state.size)

  const coordSet = new Set<string>()
  for (const coord of state) {
    coordSet.add(coord.split(' ')[0])
  }

  console.log(
    grid.map((row, y) => row.map((char, x) => (coordSet.has(stringifyCoord([x, y])) ? '#' : '.')).join('')).join('\n')
  )

  console.log(coordSet.size)

  // Solution

  result(1, coordSet.size, 7608)
}

// This is default and not needed if you don't need some custom parsing
// export const parser: Parser = (inputStr) => inputStr.trim()

type Coord = readonly [x: number, y: number]
function createGrid(input: string) {
  const grid = input.split('\n').map((row) => row.replace(/[\\\\]/g, '\\').split(/\s*/))
  return grid as Grid
}

type Grid = GridItem[][]

function stringifyGrid(grid: Grid) {
  return grid.map((row) => row.join('')).join('\n')
}

function get(grid: Grid, [x, y]: Coord) {
  return grid[y]?.[x]
}

function set(grid: Grid, [x, y]: Coord, value: GridItem) {
  grid[y][x] = value
}

function stringifyCoord([x, y]: Coord) {
  return `${x},${y}`
}

function stringifyCoordWithDirection([x, y]: Coord, direction: Direction) {
  return `${x},${y} ${direction}`
}

function getAdjacent(grid: Grid, [x, y]: Coord) {
  const adjacents: string[] = []
  if (grid[y - 1]?.[x]) adjacents.push(grid[y - 1][x])
  if (grid[y + 1]?.[x]) adjacents.push(grid[y + 1][x])
  if (grid[y]?.[x - 1]) adjacents.push(grid[y][x - 1])
  if (grid[y]?.[x + 1]) adjacents.push(grid[y][x + 1])
  return adjacents
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

type Direction = (typeof directions)[number]
type Mirror = (typeof mirrors)[number]
type DeflectionMirror = (typeof deflectionMirrors)[number]
type SplitMirror = (typeof splitMirrors)[number]
type Empty = '.'
type GridItem = Mirror | Empty

function isEmpty(item: GridItem): item is Empty {
  return item === '.'
}

function isDeflectionMirror(item: GridItem): item is DeflectionMirror {
  return deflectionMirrors.includes(item as DeflectionMirror)
}

function isSplitMirror(item: GridItem): item is SplitMirror {
  return splitMirrors.includes(item as SplitMirror)
}

function getAdjacentCoords(grid: Grid, [x, y]: Coord) {
  const adjacents: Coord[] = []
  if (grid[y - 1]?.[x]) adjacents.push([x, y - 1])
  if (grid[y + 1]?.[x]) adjacents.push([x, y + 1])
  if (grid[y]?.[x - 1]) adjacents.push([x - 1, y])
  if (grid[y]?.[x + 1]) adjacents.push([x + 1, y])
  return adjacents
}

function getAdjacentCoordsWithDirection(grid: Grid, [x, y]: Coord): Record<Direction, Coord> {
  const adjacents: Record<Direction, Coord> = {
    N: [x, y - 1],
    S: [x, y + 1],
    E: [x + 1, y],
    W: [x - 1, y],
  }
  return adjacents
}
