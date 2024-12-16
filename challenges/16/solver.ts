import { PriorityQueue } from '../../shared/queue'
import { parseMap, parseNumber, result } from '../../shared/utils'

type Direction = 'N' | 'E' | 'S' | 'W'
type Position = `${number},${number}-${Direction}`
type Coord = [number, number]

export const solver: Solver = (inputStr) => {
  let startPosition = ''
  let endPosition = ''
  const map = parseMap(inputStr, {
    iterator: (char, x, y) => {
      if (char === 'S') {
        startPosition = `${x},${y}-E`
        return '.'
      }
      if (char === 'E') {
        endPosition = `${x},${y}`
        return '.'
      }
    },
  })

  function getTurns(direction: Direction): [Direction, Direction] {
    switch (direction) {
      case 'N':
        return ['W', 'E']
      case 'E':
        return ['N', 'S']
      case 'S':
        return ['E', 'W']
      case 'W':
        return ['S', 'N']
    }
  }

  interface PathNode {
    point: string
    previous: PathNode | null
    distance: number
  }

  const isTarget = (node: string) => endPosition === node.split('-')[0]

  const edges = (node: string): [string, number][] => {
    const [pos, dir] = node.split('-')
    const direction = dir as Direction
    const [x, y] = pos.split(',').map(parseNumber)
    const edges = []

    // Can move forward
    const [dx, dy] = {
      N: [0, -1],
      E: [1, 0],
      S: [0, 1],
      W: [-1, 0],
    }[direction as Direction]
    const next: Coord = [x + dx, y + dy]

    const nextPos: Position = `${x + dx},${y + dy}-${direction}`
    if (map.getItem(next) === '.') {
      edges.push([nextPos, 1])
    }

    getTurns(direction as Direction).forEach((turn) => {
      const [dx, dy] = {
        N: [0, -1],
        E: [1, 0],
        S: [0, 1],
        W: [-1, 0],
      }[turn as Direction]
      if (map.getItem([x + dx, y + dy]) === '.') {
        edges.push([`${x},${y}-${turn}`, 1000])
      }
    })

    // Can continut straight or turn left or right

    return edges
  }

  const init: PathNode = { point: startPosition, previous: null, distance: 0 }
  const nodes = new Map<string, PathNode>()
  nodes.set(startPosition, init)
  const queue = new PriorityQueue({ initial: [init], comparator: (a, b) => a.distance - b.distance })
  const targets = new Set()

  while (!queue.isEmpty()) {
    const previous = queue.pop()

    for (const [point, distance] of edges(previous.point)) {
      if (isTarget(point)) {
        targets.add(point)
      }

      const newDistance = previous.distance + distance
      if (!nodes.has(point) || newDistance < nodes.get(point)!.distance) {
        const newNode: PathNode = { point, previous, distance: newDistance }
        nodes.set(point, newNode)
        queue.push(newNode)
      }
    }
  }

  const targetNodes = Array.from(targets)
    .map((n) => nodes.get(n))
    .sort((a, b) => a.distance - b.distance)

  const targetNode = targetNodes[0]

  for (const targetNode of targetNodes) {
    const result = []
    let node: PathNode | null = targetNode
    while (node?.previous != null) {
      result.push([node.point, node.distance])
      node = node.previous
    }
  }

  const part1 = targetNode?.distance

  result(1, part1)
  result(2, solver2(inputStr, part1))
}

function solver2(inputStr: string, target: number) {
  let startPosition = ''
  let endPosition = ''
  const map = parseMap(inputStr, {
    iterator: (char, x, y) => {
      if (char === 'S') {
        startPosition = `${x},${y}-E`
        return '.'
      }
      if (char === 'E') {
        endPosition = `${x},${y}`
        return '.'
      }
    },
  })

  const endCoord = endPosition.split(',').map(parseNumber) as Coord

  function getTurns(direction: Direction): [Direction, Direction] {
    switch (direction) {
      case 'N':
        return ['W', 'E']
      case 'E':
        return ['N', 'S']
      case 'S':
        return ['E', 'W']
      case 'W':
        return ['S', 'N']
    }
  }

  interface PathNode {
    point: string
    previous: PathNode | null
    distance: number
  }

  const isTarget = (node: string) => endPosition === node.split('-')[0]

  const edges = (node: string): [string, number][] => {
    const [pos, dir] = node.split('-')
    const direction = dir as Direction
    const [x, y] = pos.split(',').map(parseNumber)
    const edges = []

    // Can move forward
    const [dx, dy] = {
      N: [0, -1],
      E: [1, 0],
      S: [0, 1],
      W: [-1, 0],
    }[direction as Direction]
    const next: Coord = [x + dx, y + dy]

    const nextPos: Position = `${x + dx},${y + dy}-${direction}`
    if (map.getItem(next) === '.') {
      edges.push([nextPos, 1])
    }

    getTurns(direction as Direction).forEach((turn) => {
      const [dx, dy] = {
        N: [0, -1],
        E: [1, 0],
        S: [0, 1],
        W: [-1, 0],
      }[turn as Direction]
      if (map.getItem([x + dx, y + dy]) === '.') {
        edges.push([`${x},${y}-${turn}`, 1000])
      }
    })

    return edges
  }

  const init: PathNode = { point: startPosition, previous: null, distance: 0 }
  const nodes = new Map<string, PathNode>()
  nodes.set(startPosition, init)
  const queue = new PriorityQueue({ initial: [init], comparator: (a, b) => a.distance - b.distance })
  const targets = new Set<PathNode>()

  while (!queue.isEmpty()) {
    if (queue.size() > 10000) {
      queue.slice(0, 1000)
    }
    const current = queue.pop()

    for (const [point, distance] of edges(current.point)) {
      const newDistance = current.distance + distance

      if (newDistance > target) {
        continue
      }

      const newNode: PathNode = { point, previous: current, distance: newDistance }
      if (isTarget(point) && newDistance === target) {
        targets.add(newNode)
        nodes.set(point, newNode)
      }

      const existing = nodes.get(point)

      if (!existing || newDistance <= existing.distance) {
        nodes.set(point, newNode)
        queue.push(newNode)
      }
    }
  }

  console.log('path finding complete')

  // 480 too low

  const points = new Set<string>([startPosition.split('-')[0], endPosition.split('-')[0]])

  for (const targetNode of targets) {
    let node: PathNode | null = targetNode
    while (node?.previous != null) {
      points.add(node.point.split('-')[0])
      node = node.previous
    }
  }

  return points.size
}

function manhattan([x0, y0]: Coord, [x1, y1]: Coord) {
  return Math.abs(x1 - x0) + Math.abs(y1 - y0)
}
