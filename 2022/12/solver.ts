import { exists, splitChars, splitLines, last, parseNumber, uniq } from '../../shared/utils'

type Position = [x: number, y: number]
type Square = { id: string; position: Position; elevation: number }
type Edge = Square & { moves: string[] }

export function solver(inputStr: string) {
  let startPosition: Edge = { id: '0x0', position: [0, 0], elevation: 0, moves: [] }
  let endPosition: Edge = { id: '0x0', position: [0, 0], elevation: getElevation('E'), moves: [] }

  const part2StartPositions: Edge[] = []

  const grid = splitLines(inputStr).map((line, y) =>
    splitChars(line).map((char, x) => {
      const elevation = getElevation(char)

      const square: Edge = { id: stringify([x, y]), position: [x, y], elevation, moves: [] }

      if (char === 'S') {
        startPosition = square
      }

      if (char === 'E') {
        endPosition = square
      }

      if (char === 'a') {
        part2StartPositions.push(square)
      }

      return square
    })
  )

  const queue1: Edge[] = [startPosition]
  const visited1 = new Set<string>([startPosition.id])

  const path1 = breadthFirstSearch(queue1, visited1)
  console.log('Path 1', path1.length)

  const queue2: Edge[] = part2StartPositions
  const visited2 = new Set<string>(part2StartPositions.map((p) => p.id))

  const path2 = breadthFirstSearch(queue2, visited2)
  console.log('Path 2', path2.length)

  function breadthFirstSearch(queue: Edge[], visited: Set<string>) {
    while (queue.length > 0) {
      const currentNode = queue.shift()

      if (currentNode.id === endPosition.id) {
        return currentNode.moves
      }

      const adjacentPositions = getAdjacent(currentNode.position).filter(
        (move) => move.elevation - currentNode.elevation <= 1 && !visited.has(move.id)
      )

      for (const position of adjacentPositions) {
        visited.add(position.id)
        queue.push({ ...position, moves: [...currentNode.moves, position.id] })
      }
    }

    console.log('Sorry, no node found!')
  }

  function stringify([x, y]: Position) {
    return `${x}x${y}`
  }

  function getGridValue(x: number, y: number): Edge {
    return grid[y]?.[x]
  }

  function getAdjacent([x, y]: Position) {
    const left = getGridValue(x - 1, y)
    const right = getGridValue(x + 1, y)
    const up = getGridValue(x, y - 1)
    const down = getGridValue(x, y + 1)
    return [left, right, up, down].filter(exists)
  }

  function getElevation(char: string) {
    if (char === 'S') {
      return 1
    }

    if (char === 'E') {
      return getCharIndex('z')
    }

    return getCharIndex(char)
  }

  function getCharIndex(char: string) {
    return char.charCodeAt(0) - 96
  }
}
