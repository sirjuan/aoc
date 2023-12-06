import { parseNumber, splitChars, splitLines } from '../../shared/utils'

type Coordinate = [x: number, y: number]
type Direction = keyof typeof adjacentPositions
type Proposition = { direction: Direction; from: string; to: string }
type MoveDirection = 'N' | 'S' | 'W' | 'E'
type MoveChecker = { direction: MoveDirection; check: (dirs: Direction[]) => boolean }

const NE: Coordinate = [1, -1]
const N: Coordinate = [0, -1]
const NW: Coordinate = [-1, -1]
const W: Coordinate = [-1, 0]
const SW: Coordinate = [-1, 1]
const S: Coordinate = [0, 1]
const SE: Coordinate = [1, 1]
const E: Coordinate = [1, 0]

const adjacentPositions = { NE, N, NW, W, SW, S, SE, E }

export const solver: Solver = (inputStr) => {
  const currentPositions = parseInput(inputStr)

  const checker = (direction: MoveDirection, checkDirections: Direction[]): MoveChecker => ({
    direction,
    check: (dirs) => dirs.filter((dir) => checkDirections.includes(dir)).length === 0,
  })

  const state = {
    round: 0,
    moveCheckers: [
      checker('N', ['N', 'NE', 'NW']),
      checker('S', ['S', 'SE', 'SW']),
      checker('W', ['W', 'NW', 'SW']),
      checker('E', ['E', 'NE', 'SE']),
    ],
  }

  while (true) {
    const positionIterator = Array.from(currentPositions).reverse()
    let propositions: Proposition[] = []
    while (positionIterator.length > 0) {
      const position = positionIterator.pop()
      const proposition = proposeMove(position)
      if (proposition) {
        propositions.push({ from: position, to: proposition.id, direction: proposition.direction })
      }
    }

    let movedCount = 0

    while (propositions.length > 0) {
      const proposition = propositions.pop()
      const oldLength = propositions.length
      propositions = propositions.filter(({ to }) => to !== proposition.to)
      if (propositions.length === oldLength) {
        // There was no other moves
        currentPositions.delete(proposition.from)
        currentPositions.add(proposition.to)
        movedCount++
      }
    }

    if (movedCount === 0) {
      console.log('Part 2:', state.round + 1)
      break
    }

    state.moveCheckers.push(state.moveCheckers.shift())
    state.round++

    if (state.round === 10) {
      console.log('Part 1:', getEmptyCoordinates(currentPositions))
    }
  }

  function proposeMove(position: string) {
    const coord = parseCoordinate(position)
    const directions = getPossibleDirections(currentPositions, coord)

    if (directions.length === 0) {
      return null
    }

    for (const stuff of state.moveCheckers) {
      const canMove = stuff.check(directions)
      if (canMove) {
        return createProposition(coord, stuff.direction)
      }
    }

    return null
  }

  function getNewCoordinate(current: Coordinate, direction: Direction) {
    return mergeCoordinates(current, adjacentPositions[direction])
  }

  function createProposition(current: Coordinate, direction: Direction) {
    const newCoordinate = getNewCoordinate(current, direction)
    return { direction, id: stringifyCoordinate(newCoordinate) }
  }

  function getPossibleDirections(map: Set<string>, coord: Coordinate) {
    const adjacent = Object.entries(adjacentPositions).reduce((acc, [key, pos]) => {
      const merged = mergeCoordinates(pos, coord)
      const stringified = stringifyCoordinate(merged)
      const hasElf = map.has(stringified) ? true : false
      return { ...acc, [key as Direction]: { hasElf } }
    }, {} as Record<Direction, { hasElf: boolean; outOfBounds: boolean }>)

    const elfLess = Object.values(adjacent).every((jee) => !jee.hasElf)

    if (elfLess) {
      return []
    }

    return Object.entries(adjacent)
      .filter(([, char]) => char.hasElf || char.outOfBounds)
      .map((entry) => entry[0] as Direction)
  }
}

function drawMap(currentPositions: Set<string>, message = 'Drawing map') {
  const coordinates = Array.from(currentPositions).map((pos) => parseCoordinate(pos))
  const xs = coordinates.map((coord) => coord[0])
  const ys = coordinates.map((coord) => coord[1])
  const yMin = Math.min(...ys)
  const yMax = Math.max(...ys)
  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)
  let str = `\n${message}\n`
  for (let y = yMin; y < yMax + 1; y++) {
    for (let x = xMin; x < xMax + 1; x++) {
      const id = stringifyCoordinate([x, y])
      str += currentPositions.has(id) ? '#' : '.'
    }
    str += '\n'
  }
  console.log(str)
}

function getEmptyCoordinates(currentPositions: Set<string>) {
  const coordinates = Array.from(currentPositions).map((pos) => parseCoordinate(pos))
  const xs = coordinates.map((coord) => coord[0])
  const ys = coordinates.map((coord) => coord[1])
  const yMin = Math.min(...ys)
  const yMax = Math.max(...ys)
  const xMin = Math.min(...xs)
  const xMax = Math.max(...xs)

  let emptyPoints = 0

  for (let y = yMin; y < yMax + 1; y++) {
    for (let x = xMin; x < xMax + 1; x++) {
      const id = stringifyCoordinate([x, y])
      if (!currentPositions.has(id)) {
        emptyPoints++
      }
    }
  }
  return emptyPoints
}

function stringifyCoordinate([x, y]: Coordinate) {
  return [x, y].join(',')
}

function parseCoordinate(coordString: string): Coordinate {
  return coordString.split(',').slice(0, 2).map(parseNumber) as unknown as Coordinate
}

function parseInput(inputStr: string) {
  const mapArr = splitLines(inputStr).map((line) => splitChars(line.trim()))
  const currentPositions = new Set<string>()

  mapArr.forEach((line, y) => {
    line.forEach((char, x) => {
      if (char === '#') {
        currentPositions.add(stringifyCoordinate([x, y]))
      }
    })
  })

  return currentPositions
}

function mergeCoordinates([x1, y1]: Coordinate, [x2, y2]: Coordinate): Coordinate {
  return [x1 + x2, y1 + y2]
}
