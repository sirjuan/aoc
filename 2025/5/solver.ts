import { merge, result, splitLines } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  let part1 = 0

  const [freshRangesStr, ingredientIdsStr] = inputStr.split('\n\n')

  const freshRanges = splitLines(freshRangesStr).map((line) => {
    const [minStr, maxStr] = line.split('-')
    return { min: Number(minStr), max: Number(maxStr) }
  })

  const ingredientIds = splitLines(ingredientIdsStr).map(Number)

  ingredientIds.forEach((id) => {
    for (const range of freshRanges) {
      if (id >= range.min && id <= range.max) {
        part1 += 1
        break
      }
    }
  })

  result(1, part1)
}

export const solver2: Solver = (inputStr) => {
  let part2 = 0

  const [freshRangesStr] = inputStr.split('\n\n')

  merge(
    splitLines(freshRangesStr)
      .map((line): [number, number] => {
        const [minStr, maxStr] = line.split('-')
        return [Number(minStr), Number(maxStr)]
      })
      .sort((a, b) => a[0] - b[0])
  ).forEach(([min, max]) => {
    part2 += max - min + 1
  })

  result(2, part2)
}
