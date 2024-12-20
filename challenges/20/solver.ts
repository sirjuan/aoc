import { PathNode, shortestPath } from '../../shared/shortestPath'
import { parseMap, parseNumber, result, isExample } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  result(1, solve(inputStr, 2, isExample ? 1 : 100))
}

export const solver2: Solver = (inputStr) => {
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
      } else if (char === 'S') {
        startCoord[0] = x
        startCoord[1] = y
      } else if (char === 'E') {
        endPoint = stringifyCoords([x, y])
      }
    },
  })

  const path = findShortestPath({ startCoord, endPoint, walls })
  const points = getPath(path)
  const indices = Object.fromEntries(points.map((point, index) => [point, index]))

  let result = 0

  points.forEach((startPoint, startIndex) => {
    const startCoord = parseCoords(startPoint)

    for (let x = startCoord[0] - cheatDuration; x <= startCoord[0] + cheatDuration; x++) {
      for (let y = startCoord[1] - cheatDuration; y <= startCoord[1] + cheatDuration; y++) {
        const cheatCoord: Coord = [x, y]
        if (!map.inBounds(cheatCoord)) {
          continue
        }

        const distance = Math.abs(x - startCoord[0]) + Math.abs(y - startCoord[1])
        if (distance > cheatDuration) {
          continue
        }

        const cheatPoint = stringifyCoords(cheatCoord)
        if (indices[cheatPoint] - distance - startIndex >= threshold) {
          result++
        }
      }
    }
  })

  return result
}

type Coord = [number, number]

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
  return shortestPath({
    target,
    initial: stringifyCoords(startCoord),
    isTarget: (pathNode) => pathNode.point === endPoint,
    edges: (pathNode) =>
      getNeighbors(parseCoords(pathNode.point))
        .filter((c) => !walls.has(stringifyCoords(c)))
        .map((c) => [stringifyCoords(c), 1]),
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

function stringifyCoords(coord: Coord) {
  return coord[0] + ',' + coord[1]
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
