import { memoize, parseNumber, result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  result(1, solve(inputStr, 2))
  result(2, solve(inputStr, 25))
}

function solve(inputStr: string, robotCount: number) {
  return inputStr
    .split('\n')
    .reduce((acc, sequence) => acc + getNumber(sequence) * solveRobots(sequence, robotCount + 1, true), 0)
}

const solveRobots = memoize((code: string, count: number, isNumpad: boolean): number => {
  if (count === 0) {
    return code.length
  }

  let minPath = 0

  for (let i = 0; i < code.length; i++) {
    const paths = getShortestPaths(code[i - 1] ?? 'A', code[i], isNumpad).map((path) =>
      solveRobots(path, count - 1, false)
    )
    minPath += Math.min(...paths)
  }

  return minPath
})

const getShortestPaths = memoize((from: string, to: string, isNumpad: boolean): string[] => {
  const paths: string[] = []
  const queue = [[from, '']]
  let minPathLength = Infinity

  while (queue.length > 0) {
    const [current, path] = queue.shift()

    if (current === to) {
      paths.push(path + 'A')
      minPathLength = Math.min(path.length, minPathLength)
      continue
    }

    if (path.length > minPathLength) {
      continue
    }

    const neighbors = isNumpad ? numPadNeighbors : arrowPadNeighbors

    for (const [key, neighbor] of Object.entries(neighbors[current])) {
      if (typeof neighbor === 'string') {
        queue.push([neighbor, path + key])
      }
    }
  }

  return paths
})

// NumPad
// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+
const numPadNeighbors = {
  0: { '^': '2', v: null, '<': null, '>': 'A' },
  1: { '^': '4', v: null, '<': null, '>': '2' },
  2: { '^': '5', v: '0', '<': '1', '>': '3' },
  3: { '^': '6', v: 'A', '<': '2', '>': null },
  4: { '^': '7', v: '1', '<': null, '>': '5' },
  5: { '^': '8', v: '2', '<': '4', '>': '6' },
  6: { '^': '9', v: '3', '<': '5', '>': null },
  7: { '^': null, v: '4', '<': null, '>': '8' },
  8: { '^': null, v: '5', '<': '7', '>': '9' },
  9: { '^': null, v: '6', '<': '8', '>': null },
  A: { '^': '3', v: null, '<': '0', '>': null },
}

// ArrowPad
//     +---+---+
//     | ^ | A |
// +---+---+---+
// | < | v | > |
// +---+---+---+

const arrowPadNeighbors = {
  '^': { '^': null, v: 'v', '<': null, '>': 'A' },
  v: { '^': '^', v: null, '<': '<', '>': '>' },
  '<': { '^': null, v: null, '<': null, '>': 'v' },
  '>': { '^': 'A', v: null, '<': 'v', '>': null },
  A: { '^': null, v: '>', '<': '^', '>': null },
}

function getNumber(str: string) {
  return str.match(/-?\d+/)!.map(parseNumber)[0]
}
