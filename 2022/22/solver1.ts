import { parseNumber, repeat, splitChars, splitLines } from '../../shared/utils'

// Don't trim
export const parser: Parser = (inputStr) => inputStr

export const solver: Solver = (inputStr) => {
  const [mapStr, directions] = inputStr.split('\n\n')

  const lines = splitLines(mapStr)

  const xMax = Math.max(...lines.map((line) => line.length))

  const mapArr = splitLines(mapStr)
    .map((line) => line.padEnd(xMax, ' '))
    .map(splitChars)

  const yMax = mapArr.length

  const map = new Map<string, string>()

  mapArr.forEach((line, y) => {
    line.forEach((char, x) => {
      map.set(stringify({ x, y }), char)
    })
  })

  const startingCoord: Coordinate = { x: mapArr[0].findIndex((char) => char !== ' '), y: 0 }
  const startingId = stringify(startingCoord)

  let lastPosition = { id: startingId, coord: startingCoord }

  const turns = directions.trim().replace(/\d/g, '').split('') as ('R' | 'L')[]
  const moves = directions.split(/[RL]/).map(parseNumber)

  console.log(JSON.stringify(turns))

  const max = Math.max(turns.length, moves.length)

  let currentFace: Face = 'right'

  repeat((index) => {
    const moveCount = moves[index]
    const turnDir = turns[index]

    move(currentFace, moveCount)

    if (turnDir) {
      currentFace = turn(currentFace, turnDir)
      map.set(lastPosition.id, drawArrow(currentFace))
    }
  }, max)

  const lastX = lastPosition.coord.x + 1
  const lastY = lastPosition.coord.y + 1
  const facing = getFaceCount(currentFace)

  console.log('Part 1: ', { lastX, lastY, facing }, 1000 * lastY + 4 * lastX + facing)

  function drawMap() {
    let str = ''
    for (let y = 0; y < yMax; y++) {
      for (let x = 0; x < xMax; x++) {
        str += map.get(stringify({ x, y }))
      }
      str += '\n'
    }

    console.log(str)
  }

  function move(face: Face, moveCount: number) {
    const axis: 'x' | 'y' = ['left', 'right'].includes(face) ? 'x' : 'y'
    const otherAxis: 'x' | 'y' = ['left', 'right'].includes(face) ? 'y' : 'x'
    const count = ['down', 'right'].includes(face) ? 1 : -1

    for (let i = 1; i <= moveCount; i++) {
      const { coord } = lastPosition
      const lastAxisCoord = coord[axis]
      const lastOtherAxisCoord = coord[otherAxis]
      const newAxisCoord = lastAxisCoord + count
      const newCoord: Coordinate = {
        [axis]: newAxisCoord,
        [otherAxis]: lastOtherAxisCoord,
      } as Coordinate

      const existing = getTile(newCoord)

      if (!existing || existing === ' ') {
        // handle other side

        if (axis === 'x') {
          const line = mapArr[lastOtherAxisCoord]
          const playAreaStart = line.findIndex((char) => /[.#]/.test(char))
          const isOnEnd = newAxisCoord > playAreaStart

          if (isOnEnd) {
            moveTo(currentFace, { ...newCoord, x: playAreaStart })
            continue
          }

          const playAreaEnd = Math.max(line.lastIndexOf('.'), line.lastIndexOf('#'))
          moveTo(currentFace, { ...newCoord, x: playAreaEnd })
          continue
        }

        if (axis === 'y') {
          const line = mapArr.map((l) => l[lastOtherAxisCoord])

          const playAreaStart = line.findIndex((char) => /[.#]/.test(char))
          const isOnEnd = newAxisCoord > playAreaStart

          if (isOnEnd) {
            moveTo(currentFace, { ...newCoord, y: playAreaStart })
            continue
          }

          const playAreaEnd = Math.max(line.lastIndexOf('.'), line.lastIndexOf('#'))
          moveTo(currentFace, { ...newCoord, y: playAreaEnd })
          continue
        }
      }

      if (existing === '#') {
        // Cannot move
      }

      // All good, move
      moveTo(currentFace, newCoord)
    }
  }

  function moveTo(face: Face, coord: Coordinate) {
    const id = stringify(coord)
    const tile = getTile(coord)
    if (tile !== '#') {
      setTile(coord, drawArrow(face))
      lastPosition = { id, coord }
    }
  }

  function getTile(coord: Coordinate) {
    return map.get(stringify(coord))
  }

  function setTile(coord: Coordinate, char: string) {
    return map.set(stringify(coord), char)
  }
}

function getFaceCount(face: Face) {
  const map = { left: 2, right: 0, up: 3, down: 1 } as const
  return map[face]
}

const faces = { left: '<', right: '>', up: '^', down: 'v' } as const

type Coordinate = { x: number; y: number }
type Face = keyof typeof faces

function stringify({ x, y }: Coordinate) {
  return [x, y].join(',')
}

function drawArrow(face: Face) {
  return faces[face]
}

function turn(face: Face, direction: 'R' | 'L') {
  const R: Record<Face, Face> = { right: 'down', down: 'left', left: 'up', up: 'right' }
  const L: Record<Face, Face> = { down: 'right', right: 'up', up: 'left', left: 'down' }
  const map = { L, R }

  if (!map[direction]) {
    console.log({ map, direction, face })
  }

  return map[direction][face]
}
