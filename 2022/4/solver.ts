import assert from 'assert'
import { createArray, splitLines } from '../../shared/utils'

export function solver(inputStr: string) {
  let count = 0

  for (const line of splitLines(inputStr)) {
    const [first, second] = line.split(',')
    const firstRange = getRange(first)
    const secondRange = getRange(second)
    const intersection = intersect(firstRange, secondRange)

    if (
      intersection.length > 0 &&
      (fullyContained(firstRange, intersection) || fullyContained(secondRange, intersection))
    ) {
      count++
    }
  }

  console.log({ count })
}

function getRange(str: string) {
  const [first, second] = str.split('-').map((char) => parseInt(char, 10))
  return createArray(second - first + 1, (index) => first + index)
}

function intersect<TData>(array1: TData[], array2: TData[]): TData[] {
  return array1.filter((value) => array2.includes(value))
}

function fullyContained<TData>(array1: TData[], array2: TData[]) {
  return array1.every((value) => array2.includes(value))
}
