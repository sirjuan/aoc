import { circularArray, leastCommonMultiple, result } from '../../shared/utils'

const map = { L: 0, R: 1 }

export const solver1: Solver = (inputStr) => {
  const graph = new Graph()

  const [firstLine, , ...rest] = inputStr.split('\n')

  const instructions = circularArray(firstLine.split('') as ('L' | 'R')[])
  for (const line of rest) {
    const [target, neighbors] = line.split(' = ')
    for (const neighbor of neighbors.replace(/[\(\)]/g, '').split(', ')) {
      graph.addEdge(target, neighbor)
    }
  }

  let count = 0
  let current = 'AAA'
  const target = 'ZZZ'

  while (true) {
    count++
    const instruction = instructions.next()

    const neighbor = graph.getNeighbor(current, instruction)

    if (neighbor === target) {
      break
    }

    current = neighbor
  }

  result(1, count, 16531)
}

export const solver2: Solver = (inputStr) => {
  const graph = new Graph()

  const [firstLine, , ...rest] = inputStr.split('\n')

  for (const line of rest) {
    const [target, neighbors] = line.split(' = ')
    for (const neighbor of neighbors.replace(/[\(\)]/g, '').split(', ')) {
      graph.addEdge(target, neighbor)
    }
  }

  const keys = graph.getKeys()

  const directions = firstLine.split('') as ('L' | 'R')[]

  const tracks = keys.filter((k) => k.endsWith('A'))
  const moveCounts: number[] = new Array(tracks.length).fill(0)

  for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
    for (let moveIndex = 0; ; moveIndex++) {
      const direction = directions[moveIndex % directions.length]
      tracks[trackIndex] = graph.getNeighbor(tracks[trackIndex], direction)
      if (tracks[trackIndex].endsWith('Z')) {
        moveCounts[trackIndex] = moveIndex + 1
        break
      }
    }
  }

  result(2, moveCounts.reduce(leastCommonMultiple, 1), 24035773251517)
}

class Graph {
  neighbors = {}

  addEdge(u: string, v: string) {
    this.neighbors[u] ??= []
    this.neighbors[u].push(v)
  }

  getNeighbor(u: string, direction: 'R' | 'L') {
    return this.neighbors[u][map[direction]] as string
  }

  getKeys() {
    return Object.keys(this.neighbors)
  }
}
