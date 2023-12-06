import { multiply, parseNumber, parseNumbersFromStr } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const lines = inputStr.split('\n')

  // Solution part 1
  console.time('Part 1')

  const games: [number, number][] = []

  lines.forEach((line, lineIndex) => {
    parseNumbersFromStr(line).forEach((num, index) => {
      if (!games[index]) {
        games[index] = [0, 0]
      }
      games[index][lineIndex] = num
    })
  })

  const part1 = multiply(...games.map(playGame))

  console.timeEnd('Part 1')
  console.log(part1)

  // Solution part 2
  console.time('Part 2')

  const game = lines.map((line) => parseNumber(line.split(': ')[1].replace(/ /g, ''))) as Game

  const part2 = playGame(game)

  console.timeEnd('Part 2')
  console.log(part2)
}

type Game = [time: number, distance: number]

function playGame([time, distance]: Game) {
  let winCount = 0
  for (let buttonPressTime = 1; buttonPressTime < time + 1; buttonPressTime++) {
    const newDistance = buttonPressTime * (time - buttonPressTime)

    if (newDistance > distance) {
      winCount++
    }
  }
  return winCount
}
