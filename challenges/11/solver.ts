import { parseNumber, repeat, result, sum } from '../../shared/utils'

export const solver = (inputStr: string) => {
  result(1, solve(inputStr, 25))
  result(2, solve(inputStr, 75))
}

function solve(inputStr: string, blinks: number) {
  let stonesRecord: Record<string, number> = Object.fromEntries(inputStr.split(' ').map((stone) => [stone, 1]))

  repeat(() => {
    const stoneRec: Record<string, number> = {}
    for (const [stone, count] of Object.entries(stonesRecord)) {
      const replaceMents = replace(stone)
      for (const replacement of replaceMents) {
        if (stoneRec[replacement]) {
          stoneRec[replacement] += count
        } else {
          stoneRec[replacement] = count
        }
      }
    }
    stonesRecord = stoneRec
  }, blinks)

  return sum(...Object.values(stonesRecord))
}

function replace(stone: string): string[] {
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
