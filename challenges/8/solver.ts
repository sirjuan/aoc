import { parseMap, result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  result(1, solve(inputStr))
  result(2, solve(inputStr, true))
}

function solve(inputStr: string, part2 = false) {
  const antennaPositions: Record<string, Pos[]> = {}

  const { map } = parseMap(inputStr, (char, x, y) => {
    if (char !== '.') {
      antennaPositions[char] ??= []
      antennaPositions[char].push([x, y])
    }
  })

  const positionSet = new Set<string>()

  Object.values(antennaPositions).forEach((positions, i) => {
    while (positions.length > 0) {
      const current = positions.pop()
      for (const pos of positions) {
        const [x1, y1] = current
        const [x2, y2] = pos
        const xDiff = x1 - x2
        const yDiff = y1 - y2

        if (part2) {
          positionSet.add(current.join(','))
          positionSet.add(pos.join(','))
        }

        let i = 1
        while (true) {
          const first = [x1 + xDiff * i, y1 + yDiff * i]
          const second = [x2 - xDiff * i, y2 - yDiff * i]

          const firstItem = map[first[1]]?.[first[0]]
          const secondItem = map[second[1]]?.[second[0]]

          if (firstItem == null && secondItem == null) {
            break
          }

          if (firstItem != null) {
            positionSet.add(first.join(','))
          }
          if (secondItem != null) {
            positionSet.add(second.join(','))
          }

          i++

          if (!part2) {
            break
          }
        }
      }
    }
  })

  return positionSet.size
}

type Pos = [x: number, y: number]
