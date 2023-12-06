import { last, parseNumber, splitLines, repeat, createArray } from '../../shared/utils'

export function solver(inputStr: string, isExample: boolean) {
  type Coordinate = [x: number, y: number]

  const sensorsAndBeacons = splitLines(inputStr)
    .map((line) =>
      line
        .replace('Sensor at ', '')
        .replace(' closest beacon is at ', '')
        .split(':')
        .map(
          (entry) =>
            entry.replace('x=', '').replace('y=', '').split(', ').map(parseNumber) as Coordinate
        )
    )
    .map(([sensor, beacon]) => [sensor, distance(sensor, beacon)] as const)

  const LINE = isExample ? 10 : 2000000
  const RANGE = isExample ? 20 : 4000000

  console.time('Part 1 execution')
  const part1 = findCoveredRanges(LINE).reduce((total, cur) => total + cur[1] - cur[0], 0)
  console.log('Part 1', part1)
  // Correct part 1: 4665948
  console.timeEnd('Part 1 execution')

  console.time('Part 2 execution')
  let [x, y] = findGap()
  const part2 = x * 4000000 + y
  console.log('Part 2:', part2)
  // Correct part 2: 13543690671045
  console.timeEnd('Part 2 execution')

  function findGap() {
    let y = 0

    while (y < RANGE) {
      const range = findCoveredRanges(y, [0, RANGE])
      if (range.length > 1) {
        // We know that there will be more than one range only when there is a gap
        return [range[0][1] + 1, y] as Coordinate
        break
      }

      y++
    }
  }

  function findCoveredRanges(
    targetY: number,
    limits: Coordinate = [-Infinity, Infinity]
  ): Coordinate[] {
    const axisIndex = 1
    const crossAxisIndex = 0

    const coveredRanges: Coordinate[] = sensorsAndBeacons
      .filter((sensor) => sensor[axisIndex] === targetY)
      .map(([sensor]) => [sensor[crossAxisIndex], sensor[crossAxisIndex]] as Coordinate)

    for (const [sensorCoordinates, dist] of sensorsAndBeacons) {
      const sensorReach = dist - Math.abs(sensorCoordinates[axisIndex] - targetY)

      if (sensorReach <= 0) {
        continue
      }

      const crossAxisValue = sensorCoordinates[crossAxisIndex]

      const coveredRange: Coordinate = [
        Math.max(crossAxisValue - sensorReach, limits[0]),
        Math.min(crossAxisValue + sensorReach, limits[1]),
      ]

      const overlappingIndices = []

      for (const [i, range] of coveredRanges.entries()) {
        if (areOverlapping(range, coveredRange)) {
          overlappingIndices.push(i)
        }
      }

      if (overlappingIndices.length > 0) {
        const firstOverlapping = overlappingIndices[0]
        const lastOverlapping = last(overlappingIndices)
        const merged: Coordinate = [
          Math.min(coveredRange[0], coveredRanges[firstOverlapping][0]),
          Math.max(coveredRange[1], coveredRanges[lastOverlapping][1]),
        ]

        coveredRanges.splice(firstOverlapping, lastOverlapping - firstOverlapping + 1, merged)
      } else {
        coveredRanges.push(coveredRange)
      }

      coveredRanges.sort((a, b) => a[0] - b[0])
    }

    // Merge adjacent ranges
    return coveredRanges.reduce((ranges, range, index) => {
      const lastItem = ranges[index - 1]

      if (!lastItem || lastItem[1] !== range[0] - 1) {
        ranges.push(range)
      } else {
        lastItem[1] = range[1]
      }

      return ranges
    }, [])
  }

  function distance([x0, y0]: Coordinate, [x1, y1]: Coordinate) {
    return Math.abs(x1 - x0) + Math.abs(y1 - y0)
  }

  function areOverlapping([x0, x1]: Coordinate, [y0, y1]: Coordinate) {
    return x0 <= y1 && y0 <= x1
  }
}
