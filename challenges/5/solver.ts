import { parseNumber, repeat, result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const [first, second] = inputStr.split('\n\n')
  const orderingRules = first
    .split('\n')
    .map((line) => line.split('|').map(parseNumber) as [before: number, after: number])

  const updates = second.split('\n')

  let part1 = 0
  let part2 = 0

  updates.forEach((update) => {
    let good = true

    for (const [before, after] of orderingRules) {
      const regex = new RegExp(`(?=.*(${before}))(?=.*(${after}))`, 'g')
      const match = regex.exec(update)
      if (match == null) {
        continue
      }
      const first = update.indexOf(before.toString())
      const second = update.indexOf(after.toString())

      if (first > second) {
        good = false
        break
      }
    }

    const numbers = update.split(',').map(parseNumber)

    if (good) {
      part1 += mid(numbers)
    } else {
      repeat(() => {
        orderingRules.forEach(([before, after]) => {
          numbers.sort((a, b) => {
            if (a === before && b === after) {
              return -1
            }
            if (a === after && b === before) {
              return 1
            }
            return 0
          })
        })
      }, numbers.length)

      part2 += mid(numbers)
    }
  })
  result(1, part1)
  result(2, part2)
}

function mid(arr: number[]): number {
  return arr[Math.floor(arr.length / 2)]
}
