import { PathNode, shortestPath } from '../../shared/shortestPath'
import { parseMap, parseNumber, result, isExample } from '../../shared/utils'

export const solver2: Solver = (inputStr) => {
  result(1, solve(inputStr, 2, isExample ? 1 : 100))
  result(2, solve(inputStr, 20, isExample ? 50 : 100))
}

function solve(inputStr: string, cheatDuration: number, threshold: number) {
  const walls = new Set<string>()
  const startCoord: Coord = [0, 0]
  let endPoint = ''
  const map = parseMap(inputStr, {
    iterator: (char, x, y) => {
      if (char === '#') {
        walls.add(stringifyCoords([x, y]))
      }
      if (char === 'S') {
        startCoord[0] = x
        startCoord[1] = y
      }
      if (char === 'E') {
        endPoint = stringifyCoords([x, y])
      }
    },
  })

  const isOutOfBounds = ([x, y]: Coord) => x <= 0 || y <= 0 || x >= map.width - 1 || y >= map.height - 1

  const pathWithoutCheats = findShortestPath({ startCoord, endPoint, walls })
  const traveledPoints = getPath(pathWithoutCheats)

  let result = 0

  const indices: Record<string, number> = {}

  traveledPoints.forEach((point, index) => {
    indices[point] = index
  })

  traveledPoints.forEach((startPoint, index) => {
    const startCoord = parseCoords(startPoint)

    for (let x = startCoord[0] - cheatDuration; x <= startCoord[0] + cheatDuration; x++) {
      for (let y = startCoord[1] - cheatDuration; y <= startCoord[1] + cheatDuration; y++) {
        const cheatCoord: Coord = [x, y]
        if (isOutOfBounds(cheatCoord)) {
          continue
        }
        const distance = manhattanDistance(startCoord, cheatCoord)
        if (distance > cheatDuration) {
          continue
        }
        const cheatPoint = stringifyCoords(cheatCoord)
        if (walls.has(cheatPoint)) {
          continue
        }

        const pointIndex = indices[cheatPoint]
        const saved = pointIndex - distance - index
        if (saved >= threshold) {
          result++
        }
      }
    }
  })

  return result
}

type Coord = [number, number]

function parseNode(str: string) {
  const [coordStr, ...cheatPoints] = str.split('|')
  const coord = coordStr.split(',').map(parseNumber) as Coord
  const cheatCoords = cheatPoints.map(parseCoords)
  return { coord, cheatPoints, cheatCoords, point: coordStr }
}

function findShortestPath({
  startCoord,
  endPoint,
  walls,
  target,
}: {
  startCoord: Coord
  endPoint: string
  walls: Set<string>
  target?: number
}) {
  const endCoord = parseNode(endPoint).coord

  return shortestPath({
    target,
    initial: stringifyCoords(startCoord),
    isTarget: (pathNode) => parseNode(pathNode.point).point === endPoint,
    edges: (pathNode) => {
      const node = parseNode(pathNode.point)
      const distance = manhattanDistance(node.coord, endCoord)
      if (distance + pathNode.cost > target) {
        return []
      }

      return getNeighbors(parseCoords(pathNode.point))
        .filter(([x, y]) => x >= 0 && y >= 0 && !walls.has(stringifyCoords([x, y])))
        .map((coord) => [stringifyCoords(coord), 1])
    },
  })[0]
}

function getNeighbors(coord: Coord): Coord[] {
  const [x, y] = coord
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]
}

function manhattanDistance(coord1: Coord, coord2: Coord) {
  return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1])
}

function stringifyCoords(coord: Coord) {
  return `${coord[0]},${[coord[1]]}`
}

function parseCoords(str: string): Coord {
  return str.split(',').map(parseNumber) as Coord
}

function getPath<T>(node: PathNode<T>) {
  const path: T[] = []
  const queue = [node]

  while (queue.length > 0) {
    const current = queue.shift()
    path.unshift(current.point)
    if (current.previous) {
      queue.push(current.previous)
    }
  }

  return path
}
