import { result } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  const map = generateMap(inputStr)
  roll(map, 0, -1)
  result(1, calculateLoad(map), 109596)
}

export const solver2: Solver = (inputStr) => {
  const map = generateMap(inputStr)
  const patterns = new Map()
  const cycles = 1000000000

  for (let cycleIndex = 0; cycleIndex < cycles; cycleIndex++) {
    const cycleMap = [
      drawMap(roll(map, 0, -1)),
      drawMap(roll(map, -1, 0)),
      drawMap(roll(map, 0, 1)),
      drawMap(roll(map, 1, 0)),
    ].join('\n')

    // Check if current pattern has already been seen.
    if (patterns.has(cycleMap)) {
      const previousIndex = patterns.get(cycleMap)
      const patternSize = cycleIndex - previousIndex

      const cyclesLeft = cycles - cycleIndex
      if (patternSize > cyclesLeft) {
        continue
      }
      const countedCycles = Math.floor(cyclesLeft / patternSize)
      cycleIndex += patternSize * countedCycles
    } else {
      patterns.set(cycleMap, cycleIndex)
    }
  }

  result(2, calculateLoad(map), 96105)
}

const types = { rollableRock: 'O', squareRock: '#', emptySpace: '.' } as const

type TileType = (typeof types)[keyof typeof types]
type Coordinate = [number, number]
type RockMap = Record<TileType, Set<string>>

function roll(map: RockMap, xIterator: number, yIterator: number): RockMap {
  for (const rollableRock of Array.from(map[types.rollableRock])
    .slice()
    .sort((a, b) => {
      if (yIterator !== 0) {
        return yIterator * (parseCoordinate(b)[1] - parseCoordinate(a)[1])
      }
      return xIterator * (parseCoordinate(b)[0] - parseCoordinate(a)[0])
    })) {
    let currentTile = parseCoordinate(rollableRock)
    const [x, y] = currentTile
    let tileAbove: Coordinate = [x + xIterator, y + yIterator]
    let tileAboveStr = stringifyCoordinate(tileAbove)
    let currentTileStr = stringifyCoordinate(currentTile)

    while (map[types.emptySpace].has(tileAboveStr)) {
      map[types.emptySpace].delete(tileAboveStr)
      map[types.rollableRock].delete(currentTileStr)
      map[types.rollableRock].add(tileAboveStr)
      map[types.emptySpace].add(currentTileStr)
      currentTile = tileAbove.slice() as Coordinate
      currentTileStr = stringifyCoordinate(currentTile)

      tileAbove = [tileAbove[0] + xIterator, tileAbove[1] + yIterator]
      tileAboveStr = stringifyCoordinate(tileAbove)
    }
  }
  return map
}

function calculateLoad(map: RockMap): number {
  const [, , , maxY] = getBounds(map)
  let load = 0
  for (const rollableRock of map[types.rollableRock]) {
    const [, y] = parseCoordinate(rollableRock)
    load += maxY - y + 1
  }

  return load
}

function generateMap(input: string): RockMap {
  const map: RockMap = { [types.rollableRock]: new Set(), [types.squareRock]: new Set(), [types.emptySpace]: new Set() }

  input.split('\n').map((line, y) =>
    line.split('').forEach((tile, x) => {
      map[tile] = map[tile].add(stringifyCoordinate([x, y]))
    })
  )

  return map
}

function stringifyCoordinate([x, y]: Coordinate): string {
  return `${x},${y}`
}

function parseCoordinate(str: string): Coordinate {
  const [x, y] = str.split(',').map(Number)
  return [x, y] as const
}

function getBounds(map: RockMap): [number, number, number, number] {
  const xs: number[] = []
  const ys: number[] = []

  for (const tile of map[types.rollableRock]) {
    const [x, y] = parseCoordinate(tile)
    xs.push(x)
    ys.push(y)
  }

  for (const tile of map[types.squareRock]) {
    const [x, y] = parseCoordinate(tile)
    xs.push(x)
    ys.push(y)
  }

  for (const tile of map[types.emptySpace]) {
    const [x, y] = parseCoordinate(tile)
    xs.push(x)
    ys.push(y)
  }

  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
}

function drawMap(map: RockMap): string {
  const [minX, maxX, minY, maxY] = getBounds(map)
  const lines: string[] = []

  for (let y = minY; y <= maxY; y++) {
    let line = ''

    for (let x = minX; x <= maxX; x++) {
      const tile = stringifyCoordinate([x, y])

      if (map[types.rollableRock].has(tile)) {
        line += types.rollableRock
      } else if (map[types.squareRock].has(tile)) {
        line += types.squareRock
      } else if (map[types.emptySpace].has(tile)) {
        line += types.emptySpace
      } else {
        line += ' '
      }
    }

    lines.push(line)
  }

  return lines.join('\n')
}
