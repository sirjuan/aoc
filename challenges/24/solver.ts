import { parseNumbersFromStr, result } from '../../shared/utils'

export const solver: Solver = (inputStr, isExample) => {
  const min = isExample ? 7 : 200000000000000
  const max = isExample ? 27 : 400000000000000
  const hailstones = parseHailstones(inputStr)

  const intersections: Coord2D[] = []

  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const intersection = checkIntersection(hailstones[i], hailstones[j], min, max)
      if (intersection) {
        intersections.push(intersection)
      }
    }
  }

  result(1, intersections.length)
}

type Coord2D = [number, number]
type Hailstone = ReturnType<typeof parseHailstones>[number]

function parseHailstones(inputStr: string) {
  return inputStr.split('\n').map((row) => {
    const [x, y, z, vx, vy, vz] = parseNumbersFromStr(row)
    const slope = vy / vx
    return { x, y, z, vx, vy, vz, slope, intercept: y - slope * x }
  })
}

function checkIntersection(h1: Hailstone, h2: Hailstone, min: number, max: number): Coord2D | null {
  if (h1.slope === h2.slope) {
    return null
  }

  const interceptX = (h2.intercept - h1.intercept) / (h1.slope - h2.slope)
  const interceptY = h1.slope * interceptX + h1.intercept

  const time1 = (interceptX - h1.x) / h1.vx
  const time2 = (interceptX - h2.x) / h2.vx

  // check if the intercept is in the future
  if (time1 < 0 || time2 < 0) {
    return null
  }

  if (min <= interceptX && interceptX <= max && min <= interceptY && interceptY <= max) {
    return [interceptX, interceptY]
  }

  return null
}
