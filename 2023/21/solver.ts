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

  function normalizeCoord(point: Coord) {
    const [x, y] = point
    let normalizedX = x % gridWidth
    if (x < 0) {
      normalizedX = gridWidth + normalizedX
    }
    let normalizedY = y % gridHeight
    if (y < 0) {
      normalizedY = gridHeight + normalizedY
    }
    return [normalizedX, normalizedY] as Coord
  }

  function isRock(point: Coord) {
    return rockCoords.has(stringifyCoord(normalizeCoord(point)))
  }

  const maxSteps = 50
  let currentStep = 0

  const startCoord = stringifyCoord(startingPoint)

  const states = [{ [startCoord]: [startCoord] }]

  while (currentStep < maxSteps) {
    const nextStep = currentStep + 1
    states[nextStep] ??= {}

    const newCoords = new Set<string>()

    for (const [coorsStr] of Object.entries(states[currentStep])) {
      const point = parseCoord(coorsStr)
      const [x, y] = point

      newCoords.add(stringifyCoord([x + 1, y]))
      newCoords.add(stringifyCoord([x - 1, y]))
      newCoords.add(stringifyCoord([x, y + 1]))
      newCoords.add(stringifyCoord([x, y - 1]))
    }

    Array.from(newCoords).forEach((coordStr) => {
      const coord = parseCoord(coordStr)
      if (isRock(coord)) {
        return
      }

      const key = stringifyCoord(normalizeCoord(coord))
      states[nextStep][key] ??= []
      states[nextStep][key].push(stringifyCoord(coord))
    })

    currentStep++
  }

  const maybe = 161412551529951

  const res = getPlotsCountBig(inputStr, 26501365)
  console.log(res)
  result(2, res, 634549784009844)
}

function stringifyCoord(coord: Coord) {
  return coord.join(',')
}

function parseCoord(coordStr: string): Coord {
  return coordStr.split(',').map((n) => parseInt(n, 10)) as Coord
}

type Coord = [number, number]

const getKey = (x: number, y: number, z: number) => (z * 1000 + x) * 1000 + y

const findPlots = (
  map: string[][],
  x: number,
  y: number,
  maxSteps: number,
  visited = new Set<number>(),
  distance = 0
): number => {
  const key = getKey(x, y, distance)

  if (visited.has(key)) return 0
  visited.add(key)

  if (distance === maxSteps) return 1

  let plots = 0

  const neighbors = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]

  neighbors.forEach(([nx, ny]) => {
    if (nx < 0 || ny < 0 || nx >= map[0].length || ny >= map.length) return

    if (map[ny][nx] === '.') {
      plots += findPlots(map, nx, ny, maxSteps, visited, distance + 1)
    }
  })

  return plots
}

/**
 * Alignment of the repeating gardens:
 *
 * O = Odd garden ( oddGardenPlots )
 * E = Even garden ( evenGardenPlots )
 * S = Small side garden ( NEPlotsSM, SWPlotsSM, NWPlotsSM, SEPlotsSM )
 * L = Large side garden ( NEPlotsLG, SWPlotsLG, NWPlotsLG, SEPlotsLG )
 * C = Center garden (Starting point)
 * North = North garden ( northPlots )
 * East = East garden ( eastPlots )
 * South = South garden ( southPlots )
 * West = West garden ( westPlots )
 *
 *                 North
 *                 S | S
 *               L - E - L
 *             S |   |   | S
 *           L - E - O - E - L
 *         S |   |   |   |   | S
 *    West - E - O - C - O - E - East
 *         S |   |   |   |   | S
 *           L - E - O - E - L
 *             S |   |   | S
 *               L - E - L
 *                 S | S
 *                 South
 */

const getPlotsCountBig = (input: string, steps: number) => {
  const map = input.split('\n').map((line) => line.split(''))

  const startY = map.findIndex((line) => line.includes('S'))
  const startX = map[startY].findIndex((char) => char === 'S')

  map[startY][startX] = '.'

  const mapWidth = map.length

  const gardenGridDiameter = Math.trunc(steps / mapWidth) - 1

  const oddGardens = (Math.trunc(gardenGridDiameter / 2) * 2 + 1) ** 2
  const evenGardens = (Math.trunc((gardenGridDiameter + 1) / 2) * 2) ** 2

  console.log({ oddGardens, evenGardens, mapWidth, gardenGridDiameter })

  const oddGardenPlots = findPlots(map, startX, startY, mapWidth * 2 + 1)
  const evenGardenPlots = findPlots(map, startX, startY, mapWidth * 2)

  const northPlots = findPlots(map, startX, mapWidth - 1, mapWidth - 1)
  const eastPlots = findPlots(map, 0, startY, mapWidth - 1)
  const southPlots = findPlots(map, startX, 0, mapWidth - 1)
  const westPlots = findPlots(map, mapWidth - 1, startY, mapWidth - 1)

  const smallSteps = Math.trunc(mapWidth / 2) - 1

  const NEPlotsSM = findPlots(map, 0, mapWidth - 1, smallSteps)
  const NWPlotsSM = findPlots(map, mapWidth - 1, mapWidth - 1, smallSteps)
  const SEPlotsSM = findPlots(map, 0, 0, smallSteps)
  const SWPlotsSM = findPlots(map, mapWidth - 1, 0, smallSteps)

  const largeSteps = Math.trunc((mapWidth * 3) / 2) - 1

  const NEPlotsLG = findPlots(map, 0, mapWidth - 1, largeSteps)
  const NWPlotsLG = findPlots(map, mapWidth - 1, mapWidth - 1, largeSteps)
  const SEPlotsLG = findPlots(map, 0, 0, largeSteps)
  const SWPlotsLG = findPlots(map, mapWidth - 1, 0, largeSteps)

  // console.log({ SEPlotsSM, SWPlotsSM, NWPlotsSM, NEPlotsSM });
  // console.log({ SEPlotsLG, SWPlotsLG, NWPlotsLG, NEPlotsLG });
  // console.log({ oddGardenPlots, evenGardenPlots });

  const mainGardenPlots = oddGardens * oddGardenPlots + evenGardens * evenGardenPlots

  const smallSidePlots = (gardenGridDiameter + 1) * (SEPlotsSM + SWPlotsSM + NWPlotsSM + NEPlotsSM)

  const largeSidePlots = gardenGridDiameter * (SEPlotsLG + SWPlotsLG + NWPlotsLG + NEPlotsLG)

  return mainGardenPlots + smallSidePlots + largeSidePlots + northPlots + eastPlots + southPlots + westPlots
}

function plotPaths(grid: string[][], startingPoint: Coord, rockCoords: Set<string>, maxSteps: number) {
  const gridWidth = grid[0].length
  const gridHeight = grid.length

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

  return states[maxSteps].size
}
