import { result } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  const { bricks, brickMap } = initialize(inputStr)

  const disintegratable = new Set<string>()

  for (const brick of bricks) {
    if (brick.supporters.length > 1) {
      for (const name of brick.supporters) {
        if (disintegratable.has(name)) {
          continue
        }
        const canDisintegrate = !brickMap
          .get(name)
          .supporting.some((name) => brickMap.get(name).supporters.length === 1)

        if (canDisintegrate) {
          disintegratable.add(name)
        }
      }
    }

    if (brick.supporting.length === 0) {
      disintegratable.add(brick.name)
    }
  }

  result(1, disintegratable.size, 517)
}

export const solver2: Solver = (inputStr) => {
  const { bricks, brickMap } = initialize(inputStr)

  let fallenCount = 0

  for (const brick of bricks) {
    const queue = [brick]
    const fallen = new Set<string>()

    while (queue.length > 0) {
      const current = queue.shift()!

      for (const supportedName of current.supporting) {
        const supported = brickMap.get(supportedName)!
        const supportedBy = supported.supporters.filter((name) => !fallen.has(name) && name !== brick.name)
        if (supportedBy.length > 0) {
          continue
        }
        if (fallen.has(supportedName)) {
          continue
        }
        fallen.add(supportedName)
        queue.push(supported)
      }
    }

    fallenCount += fallen.size
  }

  result(2, fallenCount, 61276)
}

type Coord = [x: number, y: number, z: number]
type Brick = {
  name: string
  minX: number
  maxX: number
  minY: number
  maxY: number
  minZ: number
  maxZ: number
  supporting: string[]
  supporters: string[]
}

function handleFall(bricks: Brick[], brick: Brick) {
  let bottom = brick.minZ
  while (bottom > 0) {
    const filtered = bricks.filter((otherBrick) => {
      return isSupported(brick, otherBrick)
    })

    filtered.forEach((otherBrick) => {
      brick.supporters.push(otherBrick.name)
      otherBrick.supporting.push(brick.name)
    })

    if (filtered.length > 0) {
      return
    }

    if (bottom > 1) {
      brick.minZ--
      brick.maxZ--
    }

    bottom--
  }
}

function isSupported(brick: Brick, otherBrick: Brick) {
  return (
    otherBrick.minX <= brick.maxX &&
    otherBrick.maxX >= brick.minX &&
    otherBrick.minY <= brick.maxY &&
    otherBrick.maxY >= brick.minY &&
    otherBrick.minZ <= brick.maxZ - 1 &&
    otherBrick.maxZ >= brick.minZ - 1
  )
}

function initialize(inputStr: string) {
  const startCharCode = 'A'.charCodeAt(0)

  const map = new Map<string, Brick>()

  const bricks = inputStr
    .split('\n')
    .map((line, index) => {
      const [first, second] = line
        .split('~')
        .map((param) => param.split(',').map((coord) => parseInt(coord)) as Coord)
        .sort((a, b) => a.at(-1) - b.at(-1))

      return {
        name: String.fromCharCode(startCharCode + index),
        supporting: [],
        supporters: [],
        minX: Math.min(first.at(0), second.at(0)),
        maxX: Math.max(first.at(0), second.at(0)),
        minY: Math.min(first.at(1), second.at(1)),
        maxY: Math.max(first.at(1), second.at(1)),
        minZ: Math.min(first.at(2), second.at(2)),
        maxZ: Math.max(first.at(2), second.at(2)),
      }
    })
    .sort((a, b) => a.minZ - b.minZ)

  const settled: Brick[] = []

  while (bricks.length > 0) {
    const brick = bricks.shift()!
    handleFall(settled, brick)
    settled.unshift(brick)
    map.set(brick.name, brick)
  }

  settled.sort((a, b) => a.minZ - b.minZ)

  return { bricks: settled, brickMap: map }
}
