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
  const cardCounts = getCardCounts(cards.filter((card) => card !== 1))
  const countArray = Object.values(cardCounts).sort((a, b) => b - a)
  const max = Math.max(...countArray)
  const min = Math.min(...countArray)

  const jokerCount = cards.filter((card) => card === 1).length

  const FIVE_OF_A_KIND = 6
  const FOUR_OF_A_KIND = 5
  const FULL_HOUSE = 4
  const THREE_OF_A_KIND = 3
  const TWO_PAIR = 2
  const ONE_PAIR = 1
  const HIGH_CARD = 0

  const jokerHandlers = [ONE_PAIR, THREE_OF_A_KIND, FOUR_OF_A_KIND, FIVE_OF_A_KIND]

  if (max === 5) {
    return FIVE_OF_A_KIND
  }

  if (max === 4) {
    return jokerHandlers[jokerCount + 2] ?? FOUR_OF_A_KIND
  }

  if (max === 3 && min === 2) {
    return FULL_HOUSE
  }

  if (max === 3) {
    return jokerHandlers[jokerCount + 1] ?? ONE_PAIR
  }
  if (countArray.filter((val) => val === 2).length === 2) {
    if (jokerCount > 0) {
      return FULL_HOUSE
    }
    return TWO_PAIR
  }

  if (max === 2) {
    return jokerHandlers[jokerCount] ?? ONE_PAIR
  }

  if (jokerCount === 0) {
    return HIGH_CARD
  }

  return jokerCount >= 4 ? FIVE_OF_A_KIND : jokerHandlers[jokerCount - 1]
}

function getCardCounts(cards: number[]) {
  const counts: Record<string, number> = {}
  cards.forEach((card) => {
    if (counts[card]) {
      counts[card]++
    } else {
      counts[card] = 1
    }
  })
  return counts
}
