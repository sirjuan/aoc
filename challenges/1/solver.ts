import { parseNumber, result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const lefts: number[] = []
  const rights: number[] = []
  const counts: Record<number, number> = {}

  inputStr.split('\n').forEach((line) => {
    const [left, right] = line.split('   ').map(parseNumber)
    lefts.push(left)
    rights.push(right)
    counts[right] ??= 0
    counts[right]++
  })

  lefts.sort((a, b) => a - b)
  rights.sort((a, b) => a - b)

  let part1 = 0
  let part2 = 0

  lefts.forEach((left, index) => {
    part1 += Math.abs(left - rights[index])
    part2 += left * (counts[left] ?? 0)
  })

  result(1, part1)
  result(2, part2)
}
