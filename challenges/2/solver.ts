import {
  multiply,
  parseNumber,
  parseNumberFromStr,
  splitLines,
  splitList,
  splitWords,
  sum,
} from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const games = splitLines(inputStr)
  const colors = ['red', 'green', 'blue']

  // Solution part 1

  const maxes = Object.fromEntries(colors.map((color, index) => [color, 12 + index]))

  const part1 = sum(
    ...games.map((game) => {
      const [gameNumber, gameRules] = game.split(': ')

      for (const bag of gameRules.split('; ')) {
        for (const cubes of splitList(bag)) {
          const [qtStr, color] = splitWords(cubes)
          const quantity = parseNumber(qtStr)

          if (quantity > maxes[color]) {
            return 0
          }
        }
      }

      return parseNumberFromStr(gameNumber)
    })
  )

  console.log(part1)

  // Solution part 2

  const part2 = sum(
    ...games.map((game) => {
      const counts = Object.fromEntries(colors.map((color) => [color, 0]))

      for (const bag of game.split(': ')[1].split('; ')) {
        for (const cubes of splitList(bag)) {
          const [qtStr, color] = splitWords(cubes)
          const quantity = parseNumber(qtStr)
          counts[color] = Math.max(counts[color], quantity)
        }
      }

      return multiply(...Object.values(counts))
    })
  )

  console.log(part2)
}
