import { createArray, result, splitLines } from '../../shared/utils'

const bottomLeft = 'L'
const bottomRight = 'J'
const topRight = '7'
const topLeft = 'F'
const horizontal = '-'
const vertical = '|'
const start = 'S'

const graph = {
  [bottomLeft]: { top: [vertical, topLeft, topRight], right: [bottomRight, topRight, horizontal] },
  [bottomRight]: { top: [vertical, topLeft, topRight], left: [bottomLeft, topLeft, topRight, horizontal] },
  [topRight]: {
    bottom: [vertical, bottomLeft, bottomRight],
    left: [topLeft, bottomLeft, horizontal],
  },
  [topLeft]: {
    bottom: [vertical, bottomLeft, bottomRight],
    right: [topRight, bottomRight, horizontal],
  },
  [start]: {
    top: [vertical, topLeft, topRight],
    right: [bottomRight, topRight, horizontal],
    bottom: [vertical, bottomLeft, bottomRight],
    left: [bottomLeft, topLeft, horizontal],
  },
  [horizontal]: {
    left: [start, horizontal, topLeft, bottomLeft],
    right: [start, horizontal, topRight, bottomRight],
  },
  [vertical]: {
    top: [start, vertical, topLeft, topRight],
    bottom: [start, vertical, bottomLeft, bottomRight],
  },
}

export const solver1: Solver = (inputStr) => {
  const [, maxDistance] = getLoopMap(inputStr)
  result(1, maxDistance, 7063)
}

export const solver2: Solver = (inputStr) => {
  const [loopGrid] = getLoopMap(inputStr)

  const zoomMapper = {
    [bottomLeft]: `.|.\n.L-\n...`,
    [bottomRight]: `.|.\n-J.\n...`,
    [topRight]: `...\n-7.\n.|.`,
    [topLeft]: `...\n.F-\n.|.`,
    [horizontal]: `...\n---\n...`,
    [vertical]: `.|.\n.|.\n.|.`,
    [start]: `SSS\nSSS\nSSS`,
    '.': `...\n...\n...`,
  }

  const zoomedGrid = loopGrid
    .flatMap((line) => {
      return line.reduce(
        (acc, char) => {
          const zoomedChar = zoomMapper[char]
          zoomedChar.split('\n').forEach((charLine, index) => {
            acc[index].push(charLine.split(''))
          })
          return acc
        },
        [[], [], []]
      )
    })
    .map((line) => line.flatMap((line) => line.join('').split('')))

  const queue2 = [{ y: 0, x: 0 }]

  const low = -1
  const maxY = zoomedGrid.length
  const maxX = zoomedGrid[0].length
  const visited2 = new Set<string>()

  // Flood fill
  while (queue2.length > 0) {
    const coord = queue2.pop()
    const { x, y } = coord

    const item = zoomedGrid[y]?.[x]

    if (visited2.has(`${x},${y}`)) {
      continue
    }

    visited2.add(`${x},${y}`)

    // Check the boundary condition
    if (x < low || x > maxX || y < low || y > maxY) {
      continue
    }

    if (!['.', undefined].includes(item)) {
      continue
    }

    if (item === '.') {
      zoomedGrid[y][x] = 'x'
    }

    queue2.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 })
  }

  const shrinked = []

  zoomedGrid.forEach((line, y) => {
    if (y % 3 !== 1) {
      return
    }
    shrinked.push(line.filter((_, x) => x % 3 === 1))
  })

  const mapped = shrinked.map((line) => line.join('')).join('\n')

  result(2, Array.from(mapped.matchAll(/\./g)).length, 589)
}

type Point = { x: number; y: number }

function getLoopMap(inputStr: string) {
  const lines = splitLines(inputStr)
  const originalGrid = lines.map((line) => line.split(''))

  let startingPoint: Point = { x: 0, y: 0 }
  lines.forEach((line, y) => {
    const x = line.indexOf('S')
    if (x !== -1) {
      startingPoint = { x, y }
    }
  })

  const stringify = (point: Point) => `${point.x},${point.y}`

  const queue = [[{ ...startingPoint, distance: 0, char: 'S' }]]
  let visited = new Set(stringify(startingPoint))
  let maxDistance = 0

  const loopGrid = createArray(originalGrid.length, () => createArray(originalGrid[0].length, () => '.'))

  while (queue.length > 0) {
    const items = queue.shift()

    items.forEach(({ x, y, char, distance }) => {
      const neighbors = [
        { x, y: y - 1, type: 'top' },
        { x: x + 1, y, type: 'right' },
        { x, y: y + 1, type: 'bottom' },
        { x: x - 1, y, type: 'left' },
      ]

      loopGrid[y][x] = char
      maxDistance = Math.max(maxDistance, distance)

      const graphItem = graph[char]

      queue.push(
        neighbors
          .filter(({ x, y, type }) => {
            const neighbor = originalGrid[y]?.[x]
            const mapped = graphItem?.[type]
            return neighbor && mapped?.includes(neighbor)
          })
          .filter((point) => !visited.has(stringify(point)))
          .map((point) => {
            visited.add(stringify(point))
            return { ...point, distance: distance + 1, char: originalGrid[point.y]?.[point.x] }
          })
      )
    })
  }
  return [loopGrid, maxDistance] as const
}
