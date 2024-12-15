import { parseMap, result, sum } from '../../shared/utils'

type Position = [x: number, y: number]
type Direction = '>' | '<' | '^' | 'v'

export const solver1: Solver = (inputStr) => {
  let position = 0
  const boxes = new Set<number>()
  const walls = new Set<number>()
  const [mapStr, instructionStr] = inputStr.split('\n\n')
  const map = parseMap(mapStr, {
    iterator: (char, x, y) => {
      if (char === '@') {
        position = getCoordNumber([x, y])
      } else if (char === 'O') {
        boxes.add(getCoordNumber([x, y]))
      } else if (char === '#') {
        walls.add(getCoordNumber([x, y]))
      }
    },
  })

  const moves = {
    '>': map.moveRight,
    '<': map.moveLeft,
    '^': map.moveUp,
    v: map.moveDown,
  }

  const moveTypes = new Set(Object.keys(moves))

  type Direction = keyof typeof moves

  function move(direction: Direction, position: number) {
    return getCoordNumber(moves[direction](parseCoordNumber(position)))
  }

  for (const char of instructionStr.trim()) {
    if (!moveTypes.has(char)) {
      continue
    }
    const direction = char as Direction
    const maybeNextPosition = move(direction, position)
    if (walls.has(maybeNextPosition)) {
      continue
    }

    if (boxes.has(maybeNextPosition)) {
      let canMove = true
      let pos = maybeNextPosition
      while (true) {
        if (walls.has(pos)) {
          canMove = false
          break
        } else if (boxes.has(pos)) {
          pos = move(direction, pos)
          continue
        } else {
          break
        }
      }
      if (!canMove) {
        continue
      }
      boxes.delete(maybeNextPosition)
      boxes.add(pos)
    }

    position = maybeNextPosition
  }

  result(1, sum(...Array.from(boxes)))
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

export const solver2: Solver = (inputStr) => {
  let position = 0
  const boxes: Box[] = []
  const walls = new Set<number>()
  const [mapStr, instructionStr] = inputStr.split('\n\n')
  const map = parseMap(mapStr, {
    iterator: (char, x, y) => {
      if (char === '@') {
        position = getCoordNumber([x * 2, y])
      } else if (char === 'O') {
        boxes.push(new Box(getCoordNumber([x * 2, y]), getCoordNumber([x * 2 + 1, y])))
      } else if (char === '#') {
        walls.add(getCoordNumber([x * 2, y]))
        walls.add(getCoordNumber([x * 2 + 1, y]))
      }
    },
  })

  const moves = {
    '>': map.moveRight,
    '<': map.moveLeft,
    '^': map.moveUp,
    v: map.moveDown,
  }

  const moveTypes = new Set(Object.keys(moves))

  function move(direction: Direction, position: number) {
    return getCoordNumber(moves[direction](parseCoordNumber(position)))
  }

  instructions: for (const char of instructionStr) {
    if (!moveTypes.has(char)) {
      continue
    }
    const direction = char as Direction
    const maybeNextPosition = move(direction, position)
    if (walls.has(maybeNextPosition)) {
      continue
    }

    const boxesOnPosition = boxes.filter((box) => box.isOnPosition(maybeNextPosition))

    if (boxesOnPosition.length === 0) {
      position = maybeNextPosition
      continue
    }

    const movableBoxes = new Set<Box>()
    const queue = boxesOnPosition.slice()

    while (queue.length > 0) {
      const box = queue.shift()!
      if (movableBoxes.has(box)) {
        continue
      }
      movableBoxes.add(box)
      const nextPositions = box.getPushPositions(direction)

      if (nextPositions.some((pos) => walls.has(pos))) {
        continue instructions
      }

      const nextBoxes = boxes.filter((box) => nextPositions.some((pos) => box.isOnPosition(pos)))
      queue.push(...nextBoxes)
    }

    movableBoxes.forEach((box) => box.push(direction))
    position = maybeNextPosition
  }

  result(2, sum(...boxes.map((box) => box.positions[0])))
}

function getCoordNumber([x, y]: Position): number {
  return y * 100 + x
}

function parseCoordNumber(num: number): Position {
  return [num % 100, Math.floor(num / 100)]
}
