import { parseMap, parseNumber, result, sum } from '../../shared/utils'

type Pos = [x: number, y: number]

export const solver: Solver = (inputStr) => {
  const trailHeads: Pos[] = []

  const { moveDown, moveUp, moveRight, moveLeft, checkItem } = parseMap(inputStr, {
    parser: parseNumber,
    iterator: (char, x, y) => {
      if (char === 0) {
        trailHeads.push([x, y])
      }
    },
  })

  let part1 = 0
  let part2 = 0

  trailHeads.forEach((head) => {
    const targets: string[] = []

    const queue = [{ coord: head, elevation: 0 }]

    while (queue.length) {
      const item = queue.shift()!
      const nextElevation = item.elevation + 1
      const moves = [moveLeft(item.coord), moveRight(item.coord), moveUp(item.coord), moveDown(item.coord)]

      for (const coord of moves) {
        if (checkItem(coord, nextElevation)) {
          if (nextElevation === 9) {
            targets.push(coord.join(','))
          } else {
            queue.push({ coord: coord, elevation: nextElevation })
          }
        }
      }
    }

    part1 += new Set(targets).size
    part2 += targets.length
  })

  result(1, part1)
  result(2, part2)
}
