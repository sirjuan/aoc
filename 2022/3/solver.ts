import assert from 'assert'
import { splitChars, splitLines } from '../../shared/utils'

export function solver(inputStr: string) {
  const input = splitLines(inputStr).filter(Boolean)

  const solution1 = countPriorities(input.map((sack) => findCommon(...splitInHalf(sack))))

  console.log('Solution to part 1:', solution1)

  // Part 2

  const solution2 = countPriorities(
    chunkArr(input, 3).map((chunk) => findCommon(...chunk.map(splitChars)))
  )

  console.log('Solution to part 2:', solution2)
}

function splitInHalf(str: string) {
  const arr = splitChars(str)
  return chunkArr(arr, arr.length / 2)
}

function isLowerCase(char: string) {
  return char === char.toLowerCase()
}

function findCommon<TData>(...arrs: TData[][]) {
  const [first, ...rest] = arrs
  for (const char of first) {
    if (rest.every((arr) => arr.includes(char))) {
      return char
    }
  }
  throw new Error('Common character not found')
}

function chunkArr<TData>(inputArray: TData[], perChunk = inputArray.length): TData[][] {
  return inputArray.reduce<TData[][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex]?.push(item)

    return resultArray
  }, [])
}

function countPriorities(arr: string[]) {
  return arr.reduce((total, char) => total + getPriority(char), 0)
}

function getPriority(char: string) {
  const lowerCaseDiff = 96
  const upperCaseDiff = 38
  const diff = isLowerCase(char) ? lowerCaseDiff : upperCaseDiff
  return char.charCodeAt(0) - diff
}
