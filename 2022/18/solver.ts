import { initial } from 'lodash'
import { parseNumber, splitLines, toRecord } from '../../shared/utils'

export function solver(inputStr: string) {
  const cubes = splitLines(inputStr)

  let allExposedSides = cubes.length * 6

  for (const [aStr, bStr] of combinations(cubes, 2)) {
    const a = aStr.split(',').map(parseNumber)
    const b = bStr.split(',').map(parseNumber)

    const dist = distance(a as Coordinate, b as Coordinate)
    if (dist === 1) {
      allExposedSides -= 2
    }
  }

  console.log('Part 1:', allExposedSides)

  const grid = cubes.reduce<Record<string, string>>((acc, cur) => ({ ...acc, [cur]: cur }), {})

  let exposedSides = 0

  floodFill([0, 0, 0])

  console.log('Part 2:', exposedSides)

  type Coordinate = [x: number, y: number, z: number]

  function stringify([x, y, z]: Coordinate) {
    return `${x},${y},${z}`
  }

  function distance([x0, y0, z0]: Coordinate, [x1, y1, z1]: Coordinate) {
    return Math.abs(x1 - x0) + Math.abs(y1 - y0) + Math.abs(z1 - z0)
  }

  function combinations<TData>(array: TData[], size: number) {
    function p(t: TData[], i: number) {
      //console.log({ t, i })
      if (t.length === size) {
        result.push(t as TData)
        return
      }
      if (i + 1 > array.length) {
        return
      }
      p(t.concat(array[i]), i + 1)
      p(t, i + 1)
    }

    var result: TData[] = []
    p([], 0)
    return result
  }

  function floodFill(initial: Coordinate) {
    const high = 21
    const low = -1
    const queue = [initial]

    while (queue.length > 0) {
      const coord = queue.pop()
      const [x, y, z] = coord
      const id = stringify(coord)

      // Check the boundary condition
      if (x < low || x >= high || y < low || y >= high || z < low || z >= high) {
        continue
      }

      const item = grid[id]
      if (item) {
        if (item.length > 3) {
          exposedSides++
        }

        continue
      }

      grid[id] = 'x'

      // Look for neighboring cell

      queue.push(
        [x + 1, y, z],
        [x - 1, y, z],
        [x, y + 1, z],
        [x, y - 1, z],
        [x, y, z + 1],
        [x, y, z - 1]
      )
    }
  }
}
