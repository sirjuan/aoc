import { result } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  let part1 = 0
  let part2 = 0

  inputStr.split('\n').forEach((bank) => {
    part1 += Number(solve(bank, 2))
    part2 += Number(solve(bank, 12))
  })

  result(1, part1)
  result(2, part2)
}

function solve(bank: string, pickCount: number): string {
  let result = ''
  let startIndex = 0

  for (let remaining = pickCount; remaining > 0; remaining--) {
    const endIndex = bank.length - remaining

    let maxDigit = '0'
    let maxPos = startIndex
    for (let i = startIndex; i <= endIndex; i++) {
      if (bank[i] > maxDigit) {
        maxDigit = bank[i]
        maxPos = i
      }
    }

    result += maxDigit
    startIndex = maxPos + 1
  }

  return result
}
