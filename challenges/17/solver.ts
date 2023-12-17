import { memo, parseNumber, result, uniq } from '../../shared/utils'

const directions = ['N', 'S', 'E', 'W'] as const

export const solver1: Solver = (inputStr) => {
  const grid = createGrid(inputStr)

  const queue: QueueItem[][] = [
    [
      { coord: [0, 0], directions: ['E'] },
      { coord: [0, 0], directions: ['S'] },
    ],
  ]

  const lastCoord: Coord = [grid[0].length - 1, grid.length - 1]
  const lastCoordStr = JSON.stringify(lastCoord)
  const seen = new Set<string>()

  let heatLoss = 0
  let completed = false

  while (!completed) {
    if (!queue[heatLoss]) {
      heatLoss++
      continue
    }

    for (const item of queue[heatLoss]) {
      const { coord, directions } = item

      function handleMove(direction: Direction) {
        const nextCoord = move(grid, coord, direction)

        if (!nextCoord) {
          return
        }

        const item = get(grid, nextCoord!)

        const newHeatLoss = heatLoss + get(grid, nextCoord!)

        if (JSON.stringify(nextCoord) === lastCoordStr) {
          heatLoss += item
          completed = true
          return
        }

        const nextItem = { coord: nextCoord, directions: directions.concat(direction).slice(-3) }
        const key = JSON.stringify(nextItem)

        if (seen.has(key)) {
          return
        }
        seen.add(key)
        queue[newHeatLoss] ??= []
        queue[newHeatLoss].push(nextItem)
      }

      handleMove(getLeftDirection(directions[directions.length - 1]))
      handleMove(getRightDirection(directions[directions.length - 1]))

      if (directions.length < 3 || uniq(directions.slice(-3)).length > 1) {
        handleMove(directions[directions.length - 1])
      }
    }

    heatLoss++
  }

  result(1, heatLoss - 1, 1099)
}

export const solver2: Solver = (inputStr) => {
  const grid = createGrid(inputStr)

  const queue: QueueItem[][] = [
    [
      { coord: [0, 0], directions: ['E'] },
      { coord: [0, 0], directions: ['S'] },
    ],
  ]

  const lastCoord: Coord = [grid[0].length - 1, grid.length - 1]
  const lastCoordStr = JSON.stringify(lastCoord)

  const seen = new Set<string>()

  let heatLoss = 0
  let completed = false

  while (!completed) {
    if (!queue[heatLoss]) {
      heatLoss++
      continue
    }

    for (const item of queue[heatLoss]) {
      const { coord, directions } = item

      const currentDirection = directions.at(-1)
      const chunkCount = getLastChunkCount(directions, currentDirection)

      if (JSON.stringify(coord) === lastCoordStr) {
        if (chunkCount < 4) {
          continue
        }
        completed = true
        break
      }

      if (chunkCount >= 4) {
        handleMove(getLeftDirection(currentDirection))
        handleMove(getRightDirection(currentDirection))
      }

      if (chunkCount < 10) {
        handleMove(currentDirection)
      }

      function handleMove(direction: Direction) {
        const nextCoord = move(grid, coord, direction)

        if (!nextCoord) {
          return
        }

        const nextItem = { coord: nextCoord, directions: directions.concat(direction).slice(-10) }
        const key = JSON.stringify(nextItem)

        if (seen.has(key)) {
          return
        }
        seen.add(key)

        const newHeatLoss = heatLoss + get(grid, nextCoord)
        queue[newHeatLoss] ??= []
        queue[newHeatLoss].push(nextItem)
      }
    }

    heatLoss++
  }

  result(2, heatLoss - 1, 1266)
}

const getLastChunkCount = memo((arr: Direction[], item: Direction) => {
  const filteredDirections = directions.filter((direction) => direction !== item)
  const directionRegex = new RegExp(`[${filteredDirections.join('')}]`)
  const chunk = arr.slice().reverse().join('').split(directionRegex)[0]
  return chunk[0] === item ? chunk.length : 0
})

type QueueItem = { coord: Coord; directions: Direction[] }
type Coord = readonly [x: number, y: number]
type Grid = GridItem[][]
type Direction = (typeof directions)[number]
type GridItem = number

function getLeftDirection(direction: Direction) {
  switch (direction) {
    case 'N':
      return 'W'
    case 'S':
      return 'E'
    case 'E':
      return 'N'
    case 'W':
      return 'S'
  }
}

function getRightDirection(direction: Direction) {
  switch (direction) {
    case 'N':
      return 'E'
    case 'S':
      return 'W'
    case 'E':
      return 'S'
    case 'W':
      return 'N'
  }
}

function createGrid(input: string) {
  const grid = input.split('\n').map((row) => row.split('').map(parseNumber))
  return grid as Grid
}

function get(grid: Grid, [x, y]: Coord) {
  return grid[y]?.[x]
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
