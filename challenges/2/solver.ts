import { parseNumber, result } from '../../shared/utils'

function isSafe(numbers: number[]) {
  let safe = true

  let type: 'decreasing' | 'increasing'

  for (const [index, number] of numbers.entries()) {
    if (index === 0) {
      continue
    }

    const prev = numbers[index - 1]

    if (type == null) {
      type = prev < number ? 'increasing' : 'decreasing'
    }

    if ((type === 'increasing' && prev >= number) || (type === 'decreasing' && prev <= number)) {
      safe = false
      break
    }

    const diff = Math.abs(prev - number)
    if (diff < 1 || diff > 3) {
      safe = false
      break
    }
  }

  return safe
}

export const solver1: Solver = (inputStr) => {
  const res = inputStr.split('\n').reduce((acc, line) => {
    const numbers = line.split(' ').map(parseNumber)
    return isSafe(numbers) ? acc + 1 : acc
  }, 0)

  result(1, res)
}

export const solver2: Solver = (inputStr) => {
  const res = inputStr.split('\n').reduce((acc, line) => {
    const numbers = line.split(' ').map(parseNumber)
    if (isSafe(numbers)) {
      return acc + 1
    }

    for (let i = 0; i < numbers.length; i++) {
      if (isSafe(numbers.toSpliced(i, 1))) {
        return acc + 1
      }
    }
    return acc
  }, 0)

  result(2, res)
}
