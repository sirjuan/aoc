import { v4 } from 'uuid'
import { parseNumber, repeat, splitLines, sum } from '../../shared/utils'

export function solver(inputStr: string) {
  const input = splitLines(inputStr).map(parseNumber)
  console.log('Part 1', part1(input)) // 11037
  console.log('Part 2', part2(input)) // 3033720253914
}

type GroveCoordinate = { id: string; value: number }

function shuffle(input: GroveCoordinate[], times = 1) {
  const shuffled = input.slice()

  repeat(() => {
    for (const number of input) {
      const fromIndex = shuffled.indexOf(number)
      shuffled.splice(fromIndex, 1)
      const toIndex = (fromIndex + number.value) % shuffled.length
      if (toIndex === 0) {
        shuffled.push(number)
      } else {
        shuffled.splice(toIndex, 0, number)
      }
    }
  }, times)

  return shuffled
}

function calculate(arr: GroveCoordinate[]) {
  const zeroIndex = arr.findIndex(({ value }) => value === 0)
  const numbers = [1000, 2000, 3000].map((offset) => arr[(zeroIndex + offset) % arr.length].value)
  return sum(...numbers)
}

function part1(input: number[]) {
  const numbers = input.map((value) => ({ id: v4(), value }))
  const result = shuffle(numbers)
  return calculate(result)
}

function part2(input: number[]) {
  const encryptionKey = 811589153
  const numbers = input.map((value) => ({ id: v4(), value: value * encryptionKey }))
  const result = shuffle(numbers, 10)
  return calculate(result)
}
