import { parseNumber, result, splitLines } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  let part1 = 0

  const points: Point[] = splitLines(inputStr).map((line) => {
    const [xStr, yStr] = line.split(',')
    return { x: parseNumber(xStr), y: parseNumber(yStr) }
  })

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      part1 = Math.max(part1, getArea(points[i], points[j]))
    }
  }

  result(1, part1)
}

export const solver2: Solver = (inputStr) => {
  let part2 = 0

  const pointsByX = new Map<number, Point[]>()
  const pointsByY = new Map<number, Point[]>()

  const horizontalLines: Array<{ y: number; x1: number; x2: number }> = []
  const verticalLines: Array<{ x: number; y1: number; y2: number }> = []

  const points: Point[] = splitLines(inputStr).map((line) => {
    const [xStr, yStr] = line.split(',')
    const point = { x: parseNumber(xStr), y: parseNumber(yStr) }
    if (!pointsByX.has(point.x)) {
      pointsByX.set(point.x, [])
    }
    pointsByX.get(point.x)!.push(point)

    if (!pointsByY.has(point.y)) {
      pointsByY.set(point.y, [])
    }
    pointsByY.get(point.y)!.push(point)
    return point
  })

  const containsCache = new Map<string, boolean>()

  points.forEach((point, index) => {
    const previousPoint = points[index - 1]
    if (previousPoint) {
      drawLine(previousPoint, point)
    }
  })

  drawLine(points[points.length - 1], points[0])

  function isInsideRayCast(point: Point) {
    const key = stringify(point)
    if (containsCache.has(key)) {
      return containsCache.get(key)!
    }
    const result = contains(points, point)
    containsCache.set(key, result)
    return result
  }

  function drawLine(from: Point, to: Point) {
    if (from.x === to.x) {
      const minY = Math.min(from.y, to.y)
      const maxY = Math.max(from.y, to.y)
      verticalLines.push({ x: from.x, y1: minY, y2: maxY })
      for (let y = minY; y <= maxY; y++) {
        containsCache.set(stringify({ x: from.x, y }), true)
      }
    } else if (from.y === to.y) {
      const minX = Math.min(from.x, to.x)
      const maxX = Math.max(from.x, to.x)
      horizontalLines.push({ y: from.y, x1: minX, x2: maxX })
      for (let x = minX; x <= maxX; x++) {
        containsCache.set(stringify({ x, y: from.y }), true)
      }
    } else {
      throw new Error('Only horizontal or vertical lines are supported')
    }
  }

  for (let i = 0; i < points.length; i++) {
    outer: for (let j = i + 1; j < points.length; j++) {
      const a = points[i]
      const b = points[j]
      const c = { x: a.x, y: b.y }
      const d = { x: b.x, y: a.y }

      if (!isInsideRayCast(c) || !isInsideRayCast(d)) {
        continue
      }

      const minX = Math.min(a.x, b.x)
      const maxX = Math.max(a.x, b.x)
      const minY = Math.min(a.y, b.y)
      const maxY = Math.max(a.y, b.y)

      const vertical = [
        { x: minX, y1: minY, y2: maxY },
        { x: maxX, y1: minY, y2: maxY },
      ]

      const horizontal = [
        { y: minY, x1: minX, x2: maxX },
        { y: maxY, x1: minX, x2: maxX },
      ]

      // Check if vertical lines cross any horizontal lines      for (const vLine of vertical) {
      for (const vLine of vertical) {
        for (const hLine of horizontalLines) {
          if (vLine.x > hLine.x1 && vLine.x < hLine.x2 && hLine.y > vLine.y1 && hLine.y < vLine.y2) {
            continue outer
          }
        }
      }

      // Check if horizontal lines cross any vertical lines
      for (const hLine of horizontal) {
        for (const vLine of verticalLines) {
          if (hLine.y > vLine.y1 && hLine.y < vLine.y2 && vLine.x > hLine.x1 && vLine.x < hLine.x2) {
            continue outer
          }
        }
      }

      part2 = Math.max(part2, getArea(a, b))
    }
  }

  result(2, part2)
}

interface Point {
  x: number
  y: number
}

function getArea(pointA: Point, pointB: Point): number {
  const minX = Math.min(pointA.x, pointB.x)
  const maxX = Math.max(pointA.x, pointB.x)
  const minY = Math.min(pointA.y, pointB.y)
  const maxY = Math.max(pointA.y, pointB.y)

  const width = maxX - minX + 1
  const height = maxY - minY + 1

  return width * height
}

function stringify({ x, y }: Point) {
  return `${x},${y}`
}

function contains(bounds: Point[], point: Point): boolean {
  //https://rosettacode.org/wiki/Ray-casting_algorithm
  var count = 0
  for (var b = 0; b < bounds.length; b++) {
    var vertex1 = bounds[b]
    var vertex2 = bounds[(b + 1) % bounds.length]
    if (west(vertex1, vertex2, point.x, point.y)) ++count
  }
  return count % 2 === 1

  /**
   * @return {boolean} true if (x,y) is west of the line segment connecting A and B
   */
  function west(A, B, x, y) {
    if (A.y <= B.y) {
      if (y <= A.y || y > B.y || (x >= A.x && x >= B.x)) {
        return false
      } else if (x < A.x && x < B.x) {
        return true
      } else {
        return (y - A.y) / (x - A.x) > (B.y - A.y) / (B.x - A.x)
      }
    } else {
      return west(B, A, x, y)
    }
  }
}
