import { splitLines, arrayify, sum } from '../../shared/utils'

export function solver(inputStr: string) {
  const pairs = inputStr.split('\n\n')
  const res = pairs.map(checkPair)

  console.log('Part 1:', sum(...res))

  const packets = inputStr.replace(/\n\n/g, '\n')
  const a = [[2]]
  const b = [[6]]

  const sorted = splitLines(packets)
    .map((item) => JSON.parse(item))
    .concat([a, b])
    .sort(compare)

  console.log('Part 2:', (sorted.indexOf(a) + 1) * (sorted.indexOf(b) + 1))
}

function checkPair(pair: string, index: number) {
  const [topStr, bottomStr] = splitLines(pair)
  const top: number[] = JSON.parse(topStr)
  const bottom: number[] = JSON.parse(bottomStr)
  const val = compare(top, bottom)
  return val >= 0 ? 0 : index + 1
}

function compare(leftArr: number[], rightArr: number[]) {
  for (const [i, left] of leftArr.entries()) {
    const right = rightArr[i]

    if (right === undefined) {
      return 1
    }

    if (typeof left === 'number' && typeof right === 'number') {
      if (right < left) {
        return 1
      }

      if (right > left) {
        return -1
      }

      continue
    }

    const value = compare(arrayify(left), arrayify(right))

    if (value !== 0) {
      return value
    }
  }

  return rightArr.length > leftArr.length ? -1 : 0
}
