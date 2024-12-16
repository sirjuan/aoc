import { shortestPath } from '../../shared/shortestPath'
import { parseMap, parseNumber, result } from '../../shared/utils'

type Direction = 'N' | 'E' | 'S' | 'W'
type Coord = [number, number]

export const solver: Solver = (inputStr) => {
  let initial: string
  let endPosition = ''
  const map = parseMap(inputStr, {
    iterator: (char, x, y) => {
      if (char === 'S') {
        initial = stringify([x, y], 'E')
        return '.'
      }
      if (char === 'E') {
        endPosition = stringify([x, y])
        return '.'
      }
    },
  })

  const targets = shortestPath({
    initial,
    isTarget: (node) => endPosition === node.split('-')[0],
    edges: (node: string): [string, number][] => {
      const [coord, direction] = parse(node)
      const delta = getDelta(direction)
      const next = addCoords(coord, delta)
      const edges = []

      if (map.getItem(next) === '.') {
        edges.push([stringify(next, direction), 1])
      }

      for (const [delta, turn] of getTurnsWithDelta(direction)) {
        if (map.getItem(addCoords(coord, delta)) === '.') {
          edges.push([stringify(coord, turn), 1000])
        }
      }

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

function getDelta(direction: Direction): Coord {
  return (
    {
      N: [0, -1],
      E: [1, 0],
      S: [0, 1],
      W: [-1, 0],
    } satisfies Record<Direction, Coord>
  )[direction as Direction]
}

function getTurnsWithDelta(direction: Direction): [Coord, Direction][] {
  return getTurns(direction).map((turn) => [getDelta(turn), turn])
}

function addCoords(a: Coord, b: Coord): Coord {
  return [a[0] + b[0], a[1] + b[1]]
}

function stringify(coord: Coord, direction?: Direction): string {
  return [coord.join(','), direction].filter(Boolean).join('-')
}

function parse(node: string): [Coord, Direction] {
  const [pos, dir] = node.split('-')
  return [pos.split(',').map(parseNumber) as Coord, dir as Direction]
}
