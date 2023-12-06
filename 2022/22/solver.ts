import {
  chunkArr,
  chunkString,
  parseNumber,
  repeat,
  splitChars,
  splitLines,
} from '../../shared/utils'

// Don't trim
export const parser: Parser = (inputStr) => inputStr

const realTransitions = (lastIndex: number): CubeTransitions => ({
  1: {
    down: ({ x, y }) => ({ cube: 3, face: 'down', x, y: 0 }),
    up: ({ x, y }) => ({ cube: 6, face: 'right', x: 0, y: x }),
    left: ({ x, y }) => ({ cube: 4, face: 'right', x: 0, y: lastIndex - y }),
    right: ({ x, y }) => ({ cube: 2, face: 'right', x: 0, y }),
  },
  2: {
    down: ({ x, y }) => ({ cube: 3, face: 'left', x: lastIndex, y: x }),
    up: ({ x, y }) => ({ cube: 6, face: 'up', x, y: lastIndex }),
    left: ({ x, y }) => ({ cube: 1, face: 'left', x: lastIndex, y }),
    right: ({ x, y }) => ({ cube: 5, face: 'left', x: lastIndex, y: lastIndex - y }),
  },
  3: {
    down: ({ x, y }) => ({ cube: 5, face: 'down', x, y: 0 }),
    up: ({ x, y }) => ({ cube: 1, face: 'up', x, y: lastIndex }),
    left: ({ x, y }) => ({ cube: 4, face: 'down', x: y, y: 0 }),
    right: ({ x, y }) => ({ cube: 2, face: 'up', x: y, y: lastIndex }),
  },
  4: {
    down: ({ x, y }) => ({ cube: 6, face: 'down', x, y: 0 }),
    up: ({ x, y }) => ({ cube: 3, face: 'right', x: 0, y: x }),
    left: ({ x, y }) => ({ cube: 1, face: 'right', x: 0, y: lastIndex - y }),
    right: ({ x, y }) => ({ cube: 5, face: 'right', x: 0, y }),
  },
  5: {
    down: ({ x, y }) => ({ cube: 6, face: 'left', x: lastIndex, y: x }),
    up: ({ x, y }) => ({ cube: 3, face: 'up', x, y: lastIndex }),
    left: ({ x, y }) => ({ cube: 4, face: 'left', x: lastIndex, y }),
    right: ({ x, y }) => ({ cube: 2, face: 'left', x: lastIndex, y: lastIndex - y }),
  },
  6: {
    down: ({ x, y }) => ({ cube: 2, face: 'down', x, y: 0 }),
    up: ({ x, y }) => ({ cube: 4, face: 'up', x, y: lastIndex }),
    left: ({ x, y }) => ({ cube: 1, face: 'down', x: y, y: 0 }),
    right: ({ x, y }) => ({ cube: 5, face: 'up', x: y, y: lastIndex }),
  },
})

const exampleTransitions = (lastIndex: number): CubeTransitions => ({
  1: {
    down: ({ x, y }) => ({ cube: 4, face: 'down', x, y: 0 }),
    up: ({ x, y }) => ({ cube: 2, face: 'down', x, y: 0 }),
    left: ({ x, y }) => ({ cube: 3, face: 'down', x: y, y: 0 }),
    right: ({ x, y }) => ({ cube: 6, face: 'left', x: lastIndex, y: lastIndex - y }),
  },
  2: {
    down: ({ x, y }) => ({ cube: 5, face: 'up', x: lastIndex - x, y: lastIndex }),
    up: ({ x, y }) => ({ cube: 1, face: 'down', x: lastIndex - x, y: 0 }),
    left: ({ x, y }) => ({ cube: 6, face: 'up', x: lastIndex - y, y: lastIndex }),
    right: ({ x, y }) => ({ cube: 3, face: 'right', x: 0, y }),
  },
  3: {
    down: ({ x, y }) => ({ cube: 5, face: 'right', x: 0, y: x }),
    up: ({ x, y }) => ({ cube: 1, face: 'right', x: 0, y: x }),
    left: ({ x, y }) => ({ cube: 2, face: 'left', x: lastIndex, y }),
    right: ({ x, y }) => ({ cube: 4, face: 'right', x: 0, y }),
  },
  4: {
    down: ({ x, y }) => ({ cube: 5, face: 'down', x, y: 0 }),
    up: ({ x, y }) => ({ cube: 1, face: 'up', x, y: lastIndex }),
    left: ({ x, y }) => ({ cube: 3, face: 'left', x: 0, y }),
    right: ({ x, y }) => ({ cube: 6, face: 'down', x: lastIndex - y, y: 0 }),
  },
  5: {
    down: ({ x, y }) => ({ cube: 2, face: 'up', x: lastIndex - x, y: lastIndex }),
    up: ({ x, y }) => ({ cube: 4, face: 'up', x, y: lastIndex }),
    left: ({ x, y }) => ({ cube: 3, face: 'up', x, y: lastIndex }),
    right: ({ x, y }) => ({ cube: 6, face: 'right', x: lastIndex - y, y }),
  },
  6: {
    down: ({ x, y }) => ({ cube: 2, face: 'right', x: 0, y: lastIndex - x }),
    up: ({ x, y }) => ({ cube: 4, face: 'left', x: lastIndex, y: lastIndex - x }),
    left: ({ x, y }) => ({ cube: 5, face: 'left', x: lastIndex, y }),
    right: ({ x, y }) => ({ cube: 1, face: 'left', x: lastIndex, y: lastIndex - y }),
  },
})

type Face = keyof typeof faces
type CubeNumber = 1 | 2 | 3 | 4 | 5 | 6
type Coordinate = { x: number; y: number }
type Position = { cube: CubeNumber } & Coordinate
type PositionState = { face: Face } & Position
type Transition = (pos: PositionState) => PositionState
type Transitions = Record<Face, Transition>
type CubeTransitions = Record<CubeNumber, Transitions>
type MapValue = { char: string; originalCoords: Coordinate }

export const solver: Solver = (inputStr, isExample) => {
  const [mapStr, directions] = inputStr.split('\n\n')
  const lines = splitLines(mapStr)
  const mapStrLine = mapStr.replace(/[ \n]/g, '')
  const sideSize = Math.sqrt(mapStrLine.length / 6)
  const lastIndex = sideSize - 1
  const cubeTransitions = isExample ? exampleTransitions(lastIndex) : realTransitions(lastIndex)
  const map = new Map<string, MapValue>()

  const chunks: { originalCoords: Coordinate; chunk: string[] }[] = []

  for (const [yIndex, lineChunk] of chunkArr(lines, sideSize).entries()) {
    const chunkedLines = lineChunk.map((line) => chunkString(line, sideSize))
    const size = chunkedLines[0].length
    repeat((index) => {
      const chunk = chunkedLines.map((chunk) => chunk[index])
      const originalCoords = { x: index * sideSize, y: yIndex * sideSize }
      chunks.push({ originalCoords, chunk })
    }, size)
  }

  for (const [index, set] of chunks.filter(({ chunk }) => chunk[0].trim() !== '').entries()) {
    const { originalCoords: original, chunk } = set
    const cube = (index + 1) as CubeNumber
    chunk.map(splitChars).forEach((line, y) => {
      line.forEach((char, x) => {
        const originalCoords = { x: original.x + x, y: original.y + y }
        map.set(stringify({ cube, x, y }), { originalCoords, char })
      })
    })
  }

  const turns = directions.trim().replace(/\d/g, '').split('') as ('R' | 'L')[]
  const moves = directions.split(/[RL]/).map(parseNumber)
  const instructionCount = Math.max(turns.length, moves.length)

  let currentPosition: PositionState = { cube: 1, x: 0, y: 0, face: 'right' }

  repeat((index) => {
    move(moves[index])
    const turnDir = turns[index]
    if (turnDir) {
      turnFace(turnDir)
    }
  }, instructionCount)

  const { originalCoords } = getTile(currentPosition)
  const lastX = originalCoords.x + 1
  const lastY = originalCoords.y + 1
  const faceCount = getFaceCount(currentPosition.face)
  const solution = 1000 * lastY + 4 * lastX + faceCount

  console.log('Part 2: ', solution) // 95316

  function move(moveCount: number) {
    for (let i = 1; i <= moveCount; i++) {
      const { cube, face } = currentPosition
      const axis: 'x' | 'y' = ['left', 'right'].includes(face) ? 'x' : 'y'
      const crossAxis: 'x' | 'y' = ['left', 'right'].includes(face) ? 'y' : 'x'
      const count = ['down', 'right'].includes(face) ? 1 : -1
      const currentAxisCoord = currentPosition[axis]
      const currentCrossAxisCoord = currentPosition[crossAxis]
      const axisCoord = currentAxisCoord + count
      const newCoord = { [axis]: axisCoord, [crossAxis]: currentCrossAxisCoord } as Coordinate
      const newPosition = { ...currentPosition, ...newCoord }

      const existing = getTile(newPosition)

      if (!existing?.char || existing.char === ' ') {
        const transition = cubeTransitions[cube][face]
        moveTo(transition(currentPosition))
        continue
      }

      if (existing.char === '#') {
        // Cannot move
        break
      }

      // All good, move
      moveTo(newPosition)
    }
  }

  function turnFace(turnDir: 'R' | 'L') {
    const tile = getTile(currentPosition)
    currentPosition.face = turn(currentPosition.face, turnDir)
    map.set(stringify(currentPosition), { ...tile, char: drawArrow(currentPosition.face) })
  }

  function moveTo(position: PositionState) {
    const tile = getTile(position)
    if (tile.char !== '#') {
      // Commit
      setTile(position, drawArrow(position.face))
      currentPosition = position
    }
  }

  function getTile(position: Position) {
    return map.get(stringify(position))
  }

  function setTile(coord: Position, char: string) {
    const tile = getTile(coord)
    return map.set(stringify(coord), { ...tile, char })
  }

  function drawMap(cube: CubeNumber) {
    let str = ''
    for (let y = 0; y < sideSize; y++) {
      for (let x = 0; x < sideSize; x++) {
        const id = stringify({ cube, x, y })
        str += map.get(id).char
      }
      str += '\n'
    }
    console.log('Cube', cube, '\n')
    console.log(str)
  }
}

function getFaceCount(face: Face) {
  const map = {
    left: 2,
    right: 0,
    up: 3,
    down: 1,
  } as const

  return map[face]
}

const faces = { left: '<', right: '>', up: '^', down: 'v' } as const

function stringify({ cube, x, y }: Omit<Position, 'face'>) {
  return [cube, x, y].join(',')
}

function drawArrow(face: Face) {
  return faces[face]
}

function turn(face: Face, direction: 'R' | 'L') {
  const R: Record<Face, Face> = {
    right: 'down',
    down: 'left',
    left: 'up',
    up: 'right',
  }

  const L: Record<Face, Face> = {
    down: 'right',
    right: 'up',
    up: 'left',
    left: 'down',
  }

  const map = { L, R }
  return map[direction][face]
}
