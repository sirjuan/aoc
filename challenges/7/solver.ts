import { parseNumber, result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  // Solution part 1
  result(1, solve(inputStr, ['A', 'K', 'Q', 'J', 'T', 9, 8, 7, 6, 5, 4, 3, 2], 2), 249638405)

  // Solution part 2
  result(2, solve(inputStr, ['A', 'K', 'Q', 'T', 9, 8, 7, 6, 5, 4, 3, 2, 'J'], 1), 249776650)
}

function solve(inputStr: string, types: Array<string | number>, offset: number) {
  return inputStr
    .split('\n')
    .map((line) => {
      const cardTypes = types.map((val) => val.toString()).reverse()
      const [hand, bid] = line.split(' ')
      const cards = hand.split('').map((val) => cardTypes.indexOf(val) + offset)
      const cardValues = cards.slice().reduce((total, card) => total + card.toString().padStart(2, '00'), '')
      const value = parseNumber(getMultiplierWithJokers(cards).toString() + cardValues)
      return { value, bid: parseNumber(bid) }
    })
    .sort((a, b) => a.value - b.value)
    .map((hand, index) => hand.bid * (index + 1))
    .reduce((a, b) => a + b, 0)
}

function getMultiplierWithJokers(cards: number[]) {
  const countArray = getCardCounts(cards.filter((card) => card !== 1))
  const jokerCount = cards.filter((card) => card === 1).length

  countArray[0] ??= 0
  countArray[0] += jokerCount

  const max = countArray[0]

  if (max > 3) {
    return max + 1
  }

  if (countArray.length === 2) {
    return 4
  }

  if (max === 3) {
    return max
  }

  if (countArray.length === 3) {
    return 2
  }

  return max - 1
}

function getCardCounts(cards: number[]) {
  const counts: Record<string, number> = {}
  cards.forEach((card) => {
    counts[card] ??= 0
    counts[card]++
  })
  return Object.values(counts).sort((a, b) => b - a)
}
