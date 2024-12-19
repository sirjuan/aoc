import { PriorityQueue } from '../../shared/queue'
import { isExample, parseNumber, result } from '../../shared/utils'

const mapWidth = isExample ? 6 : 70
const mapHeight = isExample ? 6 : 70
const part1Index = isExample ? 12 : 1024

export const solver: Solver = (inputStr) => {
  const bytes = inputStr.split('\n')

  result(1, solve(bytes.slice(0, part1Index))[0].cost)

  let rangeStart = part1Index
  let rangeEnd = bytes.length
  let previousCurrent = 0

  while (rangeStart < rangeEnd) {
    const current = Math.floor((rangeStart + rangeEnd) / 2)
    if (current === previousCurrent) {
      result(2, bytes[current])
      break
    }
    previousCurrent = current
    const [node] = solve(bytes.slice(0, current))
    if (node) {
      rangeStart = current
    } else {
      rangeEnd = current
    }
  }
}

function solve(fallenBytesArr: string[]) {
  const fallenBytes = new Set(fallenBytesArr)
  return shortestPath({
    initial: stringifyCoord([0, 0]),
    isTarget: (node) => node.point === stringifyCoord([mapWidth, mapHeight]),
    edges: (node) => {
      const edges: [string, number][] = []
      const coord = parseCoord(node.point)

      directions.forEach((delta) => {
        const nextCoord = addCoords(coord, delta)
        const nextPoint = stringifyCoord(nextCoord)

        if (inBounds(nextCoord) && !fallenBytes.has(nextPoint)) {
          edges.push([nextPoint, 1])
        }
      })

      return edges
    },
  })
}

type Coord = [x: number, y: number]

function stringifyCoord([x, y]: Coord) {
  return `${x},${y}`
}

function parseCoord(str: string): Coord {
  const [x, y] = str.split(',').map(parseNumber)
  return [x, y]
}

function addCoords([x1, y1]: Coord, [x2, y2]: Coord): Coord {
  return [x1 + x2, y1 + y2]
}

interface PathNode<T> {
  point: T
  previous: PathNode<T> | null
  cost: number
}

export function shortestPath<T>({
  initial,
  isTarget,
  edges,
}: {
  initial: T
  isTarget: (node: PathNode<T>) => boolean
  edges: (node: PathNode<T>) => [T, number][]
}): PathNode<T>[] {
  const init: PathNode<T> = { point: initial, previous: null, cost: 0 }
  const nodes = new Map<T, PathNode<T>>()
  nodes.set(initial, init)
  const queue = new PriorityQueue({ initial: [init], comparator: (a, b) => 1 })
  const targets = new Set<PathNode<T>>()
  let target = Infinity

  main: while (!queue.isEmpty()) {
    const current = queue.pop()

    for (const [point, cost] of edges(current)) {
      const newCost = current.cost + cost
      const newNode: PathNode<T> = { point, previous: current, cost: newCost }

      if (isTarget(newNode)) {
        if (newCost > target) {
          break main
        }
        targets.add(newNode)
        nodes.set(point, newNode)
        if (newCost < target) {
          target = newCost
        }
      }

      const existing = nodes.get(point)

      if (!existing || newCost < existing.cost) {
        nodes.set(point, newNode)
        queue.push(newNode)
      }
    }
  }

  return [...targets].filter((node) => node.cost <= target).sort((a, b) => a.cost - b.cost)
}

function inBounds([x, y]: Coord): boolean {
  return x >= 0 && y >= 0 && x <= mapWidth && y <= mapHeight
}

const directions: Coord[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]