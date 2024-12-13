import { split } from 'lodash'
import { parseMap, parseNumber, result, coordToString, sum } from '../../shared/utils'

type Coord = [x: number, y: number]

class Node {
  key: string
  coordString: string
  coord: [x: number, y: number]
  neighbors: Set<Node> = new Set()

  constructor(public x: number, public y: number, key: string) {
    this.coord = [x, y]
    this.coordString = coordToString(this.coord)
    this.key = key
  }

  addNeighbor(node: Node) {
    if (this.key === node.key) {
      this.neighbors.add(node)
      node.neighbors.add(this)
    }
  }
}

const directions = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
} satisfies Record<string, Coord>

function getNeighbors(coord: Coord): Coord[] {
  return Object.values(directions).map((dir) => combineCoords(coord, dir))
}

export const solver: Solver = (inputStr) => {
  const regions: Record<string, Array<Set<string>>> = {}

  const nodes: Record<string, Node> = {}

  const { map, getItem } = parseMap(inputStr, {})

  map.forEach((line, y) => {
    line.forEach((char, x) => {
      regions[char] ??= []
      const coord = coordToString([x, y])
      nodes[coord] ??= new Node(x, y, char)
      const node = nodes[coord]

      for (const [x1, y1] of getNeighbors([x, y])) {
        const key = getItem([x1, y1])
        if (key !== char) {
          continue
        }

        const neighborCoord = coordToString([x1, y1])
        nodes[neighborCoord] ??= new Node(x1, y1, key)
        const neighbor = nodes[neighborCoord]
        node.addNeighbor(neighbor)
      }
    })
  })

  const visited = new Set<Node>()
  const prices1: number[] = []
  const prices2: number[] = []

  for (const node of Object.values(nodes)) {
    if (visited.has(node) || node.neighbors.size > 3) {
      visited.add(node)
      continue
    }
    visited.add(node)

    const nodes = new Set<Node>([node])
    const perimeter = new Set<string>()

    const stack: Node[] = [node]
    while (stack.length > 0) {
      const current = stack.pop() as Node
      visited.add(current)

      let dirs: Coord[] = Object.values(directions)

      for (const neighbor of current.neighbors) {
        dirs = dirs.filter((dir) => !neighbor.coordString.includes(coordToString(combineCoords(current.coord, dir))))
        if (!visited.has(neighbor)) {
          stack.push(neighbor)
          nodes.add(neighbor)
        }
      }

      for (const dir of dirs) {
        perimeter.add(coordsToString(current.coord, dir))
      }
    }
    const area = nodes.size
    const sides = countSides(perimeter)

    prices1.push(area * perimeter.size)
    prices2.push(area * sides)
  }

  result(1, sum(...prices1))
  result(2, sum(...prices2))
}

const horizontal = [directions.left, directions.right]
const vertical = [directions.up, directions.down]

function countSides(perimeterOriginal: Set<string>): number {
  let sides = 0

  let perimeter = Array.from(perimeterOriginal)

  while (perimeter.length > 0) {
    sides += 1
    const coordStr = perimeter.pop()!
    const [coord, dir] = parseCoords(coordStr)
    const directions = dir[1] === 0 ? vertical : horizontal

    for (const [deltaX, deltaY] of directions) {
      const neighboringCoord: Coord = [coord[0] + deltaX, coord[1] + deltaY]

      // Remove all the sides that are the "same" as the current side
      while (perimeter.includes(coordsToString(neighboringCoord, dir))) {
        perimeter = perimeter.filter((p) => p !== coordsToString(neighboringCoord, dir))
        neighboringCoord[0] += deltaX
        neighboringCoord[1] += deltaY
      }
    }
  }

  return sides
}

function coordsToString(...coords: Coord[]): string {
  return coords.map((coord) => coordToString(coord)).join('|')
}

function parseCoords(str: string): [Coord, Coord] {
  return str.split('|').map((coord) => coord.split(',').map(parseNumber)) as [Coord, Coord]
}

function combineCoords(coord1: Coord, coord2: Coord): Coord {
  return [coord1[0] + coord2[0], coord1[1] + coord2[1]]
}
