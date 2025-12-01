import { coordToString, isExample, parseNumber, result } from '../../shared/utils'

const getMapWidth = () => (isExample ? 11 : 101)
const getMapHeight = () => (isExample ? 7 : 103)

export const solver: Solver = async (inputStr) => {
  const robots = parseRobots(inputStr)
  result(1, solve(robots.slice(), 100))
  result(2, solve(robots.slice(), 101 * 103))
}

function solve(robots: Robot[], rounds: number): number {
  let round = 0

  while (round < rounds) {
    round++
    const positions = new Set<string>()
    robots.forEach((robot) => {
      const position = move(robot.position, robot.vector)
      positions.add(coordToString(position))
      robot.position = position
    })

    if (positions.size === robots.length) {
      return round
    }
  }

  return calculateSafetyFactor(robots)
}

function parseRobots(inputStr: string): Robot[] {
  return inputStr.split('\n').map((line) => {
    const [position, vector] = line.split(' ').map((item) => item.split(',').map(getNumber)) as [
      [number, number],
      [number, number]
    ]
    return { position, vector }
  })
}

function move([x, y]: [number, number], vector: [number, number]): [number, number] {
  const newX = x + vector[0]
  const newY = y + vector[1]
  const mapWidth = getMapWidth()
  const mapHeight = getMapHeight()
  const wrappedX = (newX + mapWidth) % mapWidth
  const wrappedY = (newY + mapHeight) % mapHeight
  return [wrappedX, wrappedY]
}

interface Robot {
  position: [x: number, y: number]
  vector: [x: number, y: number]
}

function getNumber(str: string) {
  return str.match(/-?\d+/)!.map(parseNumber)[0]
}

function calculateSafetyFactor(robots: Robot[]): number {
  const halfWidth = Math.floor(getMapWidth() / 2)
  const halfHeight = Math.floor(getMapHeight() / 2)
  const quadrants = [0, 0, 0, 0]
  robots.forEach((robot) => {
    if (robot.position[0] === halfWidth || robot.position[1] === halfHeight) {
      return
    }
    let quadrant = 0
    if (robot.position[0] > halfWidth) {
      quadrant += 1
    }
    if (robot.position[1] > halfHeight) {
      quadrant += 2
    }
    quadrants[quadrant]++
  }, 0)

  return quadrants.reduce((acc, val) => acc * val, 1)
}
