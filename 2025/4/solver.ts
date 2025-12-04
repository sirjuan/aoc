import { parseMap, result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const map = parseMap(inputStr)

  let part1 = 0

  map.iterate((item, x, y) => {
    if (item !== '.') {
      part1 += map.getAllNeighborsCount([x, y], (neighbor) => neighbor !== '@')
    }
  })

  map.print()

  result(1, part1)
}

export const solver2: Solver = (inputStr) => {
  const map = parseMap(inputStr)

  let part1 = 0

  const hasRoll = new Set<string>()

  map.iterate((item, x, y) => {
    if (item === '@') {
      hasRoll.add(stringify(x, y))
    }
  })

  const rollCount = hasRoll.size

  const remainingRolls = iterate(hasRoll)

  result(2, rollCount - remainingRolls.size)
}

function getAllNeighborCoords(coord: string) {
  const [x, y] = parseCoord(coord)
  return [
    stringify(x + 1, y),
    stringify(x - 1, y),
    stringify(x, y + 1),
    stringify(x, y - 1),
    stringify(x + 1, y + 1),
    stringify(x - 1, y - 1),
    stringify(x + 1, y - 1),
    stringify(x - 1, y + 1),
  ]
}

function iterate(rolls: Set<string>) {
  const removed = new Set<string>()
  for (const roll of rolls) {
    const neighborCoords = getAllNeighborCoords(roll)
    const neighborsWithRoll = neighborCoords.filter((nc) => rolls.has(nc))
    if (neighborsWithRoll.length < 4) {
      removed.add(roll)
    }
  }
  if (removed.size === 0) {
    return rolls
  }
  for (const r of removed) {
    rolls.delete(r)
  }
  return iterate(rolls)
}

function stringify(x: number, y: number) {
  return `${x},${y}`
}

function parseCoord(coord: string) {
  const [xStr, yStr] = coord.split(',')
  return [parseInt(xStr, 10), parseInt(yStr, 10)]
}
