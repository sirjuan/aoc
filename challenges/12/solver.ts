import { createArray, memo, parseNumber, result, splitLines } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  const lines = splitLines(inputStr)
  let count = 0

  lines.map((line) => {
    const [arrangement, countsStr] = line.split(' ')
    const counts = countsStr.split(',').map(parseNumber)

    let unknownIndex = arrangement.indexOf('?')
    let possibleArrangements: string[] = [arrangement]

    while (unknownIndex !== -1 && unknownIndex < arrangement.length) {
      possibleArrangements = possibleArrangements.flatMap((arrangement) => {
        return [replaceCharAtIndex(arrangement, unknownIndex, '#'), replaceCharAtIndex(arrangement, unknownIndex, '.')]
      })

      const index = arrangement.slice(unknownIndex + 1).indexOf('?')
      if (index === -1) {
        break
      }

      unknownIndex = unknownIndex + 1 + index
    }

    const JSONCounts = JSON.stringify(counts)

    const filteredArrangements = possibleArrangements.filter((arrangement) => {
      const groups = Array.from(arrangement.matchAll(/#+/g)).map((match) => match[0].length)
      return JSON.stringify(groups) === JSONCounts
    })

    count += filteredArrangements.length
  })

  result(1, count, 7792)

  function replaceCharAtIndex(str: string, index: number, char: string) {
    return str.slice(0, index) + char + str.slice(index + 1)
  }
}

export const solver2: Solver = (inputStr) => {
  const lines = splitLines(inputStr)
  let count = 0

  const multiplier = 5
  lines.forEach((line) => {
    const [conditions, countsStr] = line.split(' ')

    const arrangement = createArray(multiplier, () => conditions).join('?')
    const counts = createArray(multiplier, () => countsStr)
      .join(',')
      .split(',')
      .map(parseNumber)

    count += countValid(arrangement, counts)
  })

  result(2, count, 13012052341533)
}

const countValid = memo((arrangement: string, counts: readonly number[]): number => {
  const VALID = 1
  const INVALID = 0

  // Checks for quick exit

  if (arrangement.length === 0) {
    // No more arrangement, check if we have any counts left
    return counts.length === 0 ? VALID : INVALID
  }

  if (counts.length === 0) {
    return arrangement.indexOf('#') === -1 ? VALID : INVALID
  }

  const totalCount = counts.reduce((acc, cur) => acc + cur)

  const neededOperationalCount = totalCount + counts.length - 1

  if (arrangement.length < neededOperationalCount) {
    // The line is not long enough for all runs
    return INVALID
  }

  // Start normal procedures

  if (arrangement[0] === '.') {
    return countValid(arrangement.slice(1), counts)
  }

  if (arrangement[0] === '#') {
    const [currentCount, ...remainingCounts] = counts

    // Check if we have enough space for the current count
    if (arrangement.slice(0, currentCount).indexOf('.') !== -1) {
      return INVALID
    }

    // Check that the count will not overflow
    if (arrangement[currentCount] === '#') {
      return INVALID
    }

    return countValid(arrangement.slice(currentCount + 1), remainingCounts)
  }

  // First char is '?' so we need to try both ways
  return countValid('#' + arrangement.slice(1), counts) + countValid('.' + arrangement.slice(1), counts)
})
