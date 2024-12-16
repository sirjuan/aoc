import { shortestPath } from '../../shared/shortestPath'
import { parseMap, parseNumber, result } from '../../shared/utils'

type Direction = 'N' | 'E' | 'S' | 'W'
type Position = `${number},${number}-${Direction}`
type Coord = [number, number]

export const solver: Solver = (inputStr) => {
  let initial: Position
  let endPosition = ''
  const map = parseMap(inputStr, {
    iterator: (char, x, y) => {
      if (char === 'S') {
        initial = `${x},${y}-E`
        return '.'
      }
      if (char === 'E') {
        endPosition = `${x},${y}`
        return '.'
      }
    },
  })

  const targets = shortestPath({
    initial,
    isTarget: (node) => endPosition === node.split('-')[0],
    edges: (node: string): [string, number][] => {
      const [pos, dir] = node.split('-')
      const direction = dir as Direction
      const [x, y] = pos.split(',').map(parseNumber)
      const edges = []

      const [dx, dy] = getDelta(direction)
      const next: Coord = [x + dx, y + dy]

      if (map.getItem(next) === '.') {
        const nextPos: Position = `${next[0]},${next[1]}-${direction}`
        edges.push([nextPos, 1])
      }

      getTurns(direction).forEach((turn) => {
        const [dx, dy] = getDelta(turn)
        if (map.getItem([x + dx, y + dy]) === '.') {
          edges.push([`${x},${y}-${turn}`, 1000])
        }
      })

      return edges
    },
    multiple: true,
  })

  const points = new Set<string>([initial.split('-')[0], endPosition])

  for (const targetNode of targets) {
    let node = targetNode
    while (node?.previous != null) {
      points.add(node.point.split('-')[0])
      node = node.previous
    }
  }

  result(1, targets[0].distance)
  result(2, points.size)
}

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

function getDelta(direction: Direction) {
  return {
    N: [0, -1],
    E: [1, 0],
    S: [0, 1],
    W: [-1, 0],
  }[direction as Direction]
}
