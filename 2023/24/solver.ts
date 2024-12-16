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

  const first = hailstones.slice(0, 3)

  const { t1, t2 } = calculateCollisionTimes(first)
  const { c1, c2 } = calculateCollisionLocations(first, t1, t2)
  const { v, p } = calculateRockVelocityAndPosition(c1, c2, t1, t2)

  result(2, p.x + p.y + p.z)
}

type Coord2D = [number, number]
type Hailstone = ReturnType<typeof parseHailstones>[number]

function parseHailstones(inputStr: string) {
  return inputStr.split('\n').map((row) => {
    const [x, y, z, vx, vy, vz] = parseNumbersFromStr(row)
    const slope = vy / vx
    return {
      slope,
      intercept: y - slope * x,
      position: { x, y, z },
      velocity: { x: vx, y: vy, z: vz },
    }
  })
}

function checkIntersection(h1: Hailstone, h2: Hailstone, min: number, max: number): Coord2D | null {
  if (h1.slope === h2.slope) {
    return null
  }

  const interceptX = (h2.intercept - h1.intercept) / (h1.slope - h2.slope)
  const interceptY = h1.slope * interceptX + h1.intercept

  const time1 = (interceptX - h1.position.x) / h1.velocity.x
  const time2 = (interceptX - h2.position.x) / h2.velocity.x

  // check if the intercept is in the future
  if (time1 < 0 || time2 < 0) {
    return null
  }

  if (min <= interceptX && interceptX <= max && min <= interceptY && interceptY <= max) {
    return [interceptX, interceptY]
  }

  return null
}

type Vector3D = { x: number; y: number; z: number }

function crossProduct(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

function dotProduct(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function subtractVectors(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  }
}

function addVectors(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  }
}

function scaleVector(v: Vector3D, scalar: number): Vector3D {
  return {
    x: v.x * scalar,
    y: v.y * scalar,
    z: v.z * scalar,
  }
}

function calculateCollisionTimes(hailstones: Hailstone[]): { t1: number; t2: number } {
  const p1 = subtractVectors(hailstones[1].position, hailstones[0].position)
  const v1 = subtractVectors(hailstones[1].velocity, hailstones[0].velocity)
  const p2 = subtractVectors(hailstones[2].position, hailstones[0].position)
  const v2 = subtractVectors(hailstones[2].velocity, hailstones[0].velocity)

  const p1xp2 = crossProduct(p1, p2)
  const v1xp2 = crossProduct(v1, p2)
  const p1xv2 = crossProduct(p1, v2)
  const v1xv2 = crossProduct(v1, v2)

  const t1 = -dotProduct(p1xp2, v2) / dotProduct(v1xp2, v2)
  const t2 = -dotProduct(p1xp2, v1) / dotProduct(p1xv2, v1)

  return { t1, t2 }
}

function calculateCollisionLocations(hailstones: Hailstone[], t1: number, t2: number): { c1: Vector3D; c2: Vector3D } {
  const c1 = addVectors(hailstones[1].position, scaleVector(hailstones[1].velocity, t1))
  const c2 = addVectors(hailstones[2].position, scaleVector(hailstones[2].velocity, t2))

  return { c1, c2 }
}

function calculateRockVelocityAndPosition(
  c1: Vector3D,
  c2: Vector3D,
  t1: number,
  t2: number
): { v: Vector3D; p: Vector3D } {
  const v = scaleVector(subtractVectors(c2, c1), 1 / (t2 - t1))
  const p = subtractVectors(c1, scaleVector(v, t1))

  return { v, p }
}
