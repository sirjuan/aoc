import { parseNumber, parseNumberFromStr, repeat } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const cards = inputStr
    .split('\n')
    .slice()
    .map((line) => {
      const [numberString, parts] = line.split(/: +/g)
      const number = parseNumberFromStr(numberString)
      const [winningNumbers, myNumbers] = parts
        .split(' | ')
        .map((part) => part.split(/ +/).map(parseNumber))
      const allNumbers = winningNumbers.concat(myNumbers)
      const uniqueNumbers = [...new Set(allNumbers)]

      return { number, matchingNumbers: allNumbers.length - uniqueNumbers.length }
    })

  // Solution part 1

  const part1 = cards
    .map((card) =>
      card.matchingNumbers === 0 ? card.matchingNumbers : 2 ** (card.matchingNumbers - 1)
    )
    .reduce((acc, curr) => acc + curr, 0)

  console.log(part1)

  // Solution part 2

  let part2 = 0

  const queue = cards.slice()

  while (queue.length > 0) {
    const item = queue.pop()
    part2++

    repeat((index) => {
      queue.push(cards[item.number + index])
    }, item.matchingNumbers)
  }

  console.log(part2)
}
