import { parseMap, parseNumber, result, sum } from '../../shared/utils'

type Pos = [x: number, y: number]

export const solver: Solver = (inputStr) => {
  const trailHeads: Pos[] = []

  const { moveDown, moveUp, moveRight, moveLeft, getItem } = parseMap(inputStr, {
    parser: parseNumber,
    iterator: (char, x, y) => {
      if (char === 0) {
        trailHeads.push([x, y])
      }
    },
  })

  const scores: number[] = []
  const ratings: number[] = []

  trailHeads.forEach((head) => {
    const targets = new Set<string>()
    let rating = 0

    const queue = [{ coord: head, elevation: 0 }]

    while (queue.length) {
      const item = queue.shift()!
      const nextElevation = item.elevation + 1
      const moves = [moveLeft(item.coord), moveRight(item.coord), moveUp(item.coord), moveDown(item.coord)]

      for (const coord of moves) {
        const elevation = getItem(coord)
        if (elevation === nextElevation) {
          if (elevation === 9) {
            rating++
            targets.add(coord.join(','))
            continue
          }
          queue.push({ coord: coord, elevation: nextElevation })
        }
      }
    }

    ratings.push(rating)
    scores.push(targets.size)
  })

  result(1, sum(...scores))
  result(2, sum(...ratings))
}
