import { parseNumber, repeat, result, sum } from '../../shared/utils'

export const solver = (inputStr: string) => {
  result(1, solve(inputStr, 25))
  result(2, solve(inputStr, 75))
}

function solve(inputStr: string, blinks: number) {
  let stones = Object.fromEntries(inputStr.split(' ').map((stone) => [stone, 1]))

  repeat(() => {
    const newStones = {}
    for (const [stone, count] of Object.entries(stones)) {
      for (const replacement of getReplacements(stone)) {
        newStones[replacement] ??= 0
        newStones[replacement] += count
      }
    }
    stones = newStones
  }, blinks)

  return sum(...Object.values(stones))
}

function getReplacements(stone: string): string[] {
  if (parseNumber(stone) === 0) {
    return ['1']
  }

  const stoneStr = stone.toString()
  if (stoneStr.length % 2 === 0) {
    const half = stoneStr.length / 2
    return [stoneStr.slice(0, half), parseNumber(stoneStr.slice(half)).toString()]
  }

  return [(parseNumber(stone) * 2024).toString()]
}
