import { mapUtils, parseMap, result, sum } from '../../shared/utils'

type Position = [x: number, y: number]
type Direction = keyof typeof moves

export const solver1: Solver = (inputStr) => {
  result(1, solve(inputStr, 1))
  result(2, solve(inputStr, 2))
}

function solve(inputStr: string, factor: number) {
  let currentPosition = 0
  const boxes: Box[] = []
  const walls = new Set<number>()
  const [mapStr, instructions] = inputStr.split('\n\n')
  parseMap(mapStr, {
    iterator: (char, x, y) => {
      const position = getCoordNumber([x * factor, y])
      const doubledPosition = factor === 2 ? getCoordNumber([x * factor + 1, y]) : null
      const positions = [position, doubledPosition].filter((c) => c !== null)
      if (char === '@') {
        currentPosition = position
      } else if (char === 'O') {
        boxes.push(new Box(...positions))
      } else if (char === '#') {
        positions.forEach((c) => walls.add(c))
      }
    },
  })

  instructions: for (const direction of instructions) {
    if (!isDirection(direction)) {
      continue
    }

    const nextPosition = move(direction, currentPosition)

    if (walls.has(nextPosition)) {
      continue
    }

    const overlappingBoxes = boxes.filter((box) => box.isOnPosition(nextPosition))

    if (overlappingBoxes.length === 0) {
      currentPosition = nextPosition
      continue
    }

    const movableBoxes = new Set<Box>()

    while (overlappingBoxes.length > 0) {
      const box = overlappingBoxes.shift()!
      if (movableBoxes.has(box)) {
        continue
      }
      movableBoxes.add(box)

      const nextPositions = box.getPushPositions(direction)

      if (nextPositions.some((pos) => walls.has(pos))) {
        // Can't push the box
        continue instructions
      }

      overlappingBoxes.push(...boxes.filter((box) => nextPositions.some((pos) => box.isOnPosition(pos))))
    }

    movableBoxes.forEach((box) => box.push(direction))
    currentPosition = nextPosition
  }

  return sum(...boxes.map((box) => box.positions[0]))
}

class Box {
  positions: number[]

  constructor(...positions: number[]) {
    this.positions = positions
  }

  isOnPosition(position: number) {
    return this.positions.includes(position)
  }

  getPushPositions(direction: Direction) {
    return this.positions.map((pos) => {
      const [x, y] = parseCoordNumber(pos)
      switch (direction) {
        case '>':
          return getCoordNumber([x + 1, y])
        case '<':
          return getCoordNumber([x - 1, y])
        case '^':
          return getCoordNumber([x, y - 1])
        case 'v':
          return getCoordNumber([x, y + 1])
      }
    })
  }

  push(direction: Direction) {
    this.positions = this.getPushPositions(direction)
  }
}

const moves = {
  '>': mapUtils.moveRight,
  '<': mapUtils.moveLeft,
  '^': mapUtils.moveUp,
  v: mapUtils.moveDown,
}

const moveTypes = new Set(Object.keys(moves))

function isDirection(char: string): char is Direction {
  return moveTypes.has(char)
}

function move(direction: Direction, position: number) {
  return getCoordNumber(moves[direction](parseCoordNumber(position)))
}

function getCoordNumber([x, y]: Position): number {
  return y * 100 + x
}

function parseCoordNumber(num: number): Position {
  return [num % 100, Math.floor(num / 100)]
}
