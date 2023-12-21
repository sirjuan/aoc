import { result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const startingPoint: Coord = [0, 0]
  const rockCoords = new Set<string>()
  const grid = inputStr.split('\n').map((row, y) => {
    const line = row.split('')
    line.forEach((char, x) => {
      if (char === '#') {
        rockCoords.add(stringifyCoord([x, y]))
      }
      if (char === 'S') {
        startingPoint[0] = x
        startingPoint[1] = y
      }
    })
    return line
  })

  const gridWidth = grid[0].length
  const gridHeight = grid.length

  const maxSteps = 64

  function isOutsideGrid(point: Coord) {
    const [x, y] = point
    return x < 0 || y < 0 || x >= gridWidth || y >= gridHeight
  }

  let currentStep = 0

  const states = [new Set<string>([stringifyCoord(startingPoint)])]

  while (currentStep < maxSteps) {
    states[currentStep + 1] ??= new Set<string>()

    for (const coorsStr of states[currentStep]) {
      const point = parseCoord(coorsStr)
      const [x, y] = point

      if (isOutsideGrid(point)) {
        continue
      }

      if (rockCoords.has(coorsStr)) {
        continue
      }

      const newCoords: Coord[] = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ]

      newCoords
        .filter((coord) => {
          if (isOutsideGrid(coord)) {
            return false
          }
          return !rockCoords.has(stringifyCoord(coord))
        })
        .forEach((coord) => {
          states[currentStep + 1].add(stringifyCoord(coord))
        })
    }
    currentStep++
  }

  result(1, states[maxSteps].size)
}

function stringifyCoord(coord: Coord) {
  return coord.join(',')
}

function parseCoord(coordStr: string): Coord {
  return coordStr.split(',').map((n) => parseInt(n, 10)) as Coord
}

// This is default and not needed if you don't need some custom parsing
// export const parser: Parser = (inputStr) => inputStr.trim()

type Coord = [number, number]
