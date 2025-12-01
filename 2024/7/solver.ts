import { concatenateNumbers, parseNumber, result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const equations = parseEquations(inputStr)
  const part1 = solve(equations)
  result(1, part1)
  result(2, solve(equations, true))
}

const foundIndices = new Set<number>()

function solve(equations: Equation[], part2 = false) {
  console.log('equations', equations.length)
  let res = 0

  equations.slice().forEach(({ result, values }, index) => {
    if (foundIndices.has(index)) {
      res += result
      return
    }

    const states: number[][] = [[values[0]]]

    let round = 1

    while (round <= values.length) {
      const lastRound = states.pop()
      const newRound: number[] = []
      states.push(newRound)

      for (const state of lastRound) {
        if (round === values.length) {
          if (state === result) {
            res += result
            foundIndices.add(index)
            break
          }
        }

        const value = values[round]

        const multiplied = state * value
        if (multiplied <= result) {
          newRound.push(multiplied)
        }

        const added = state + value
        if (added <= result) {
          newRound.push(added)
        }

        if (part2) {
          const concatenated = concatenateNumbers(state, value)
          if (concatenated <= result) {
            newRound.push(concatenated)
          }
        } else {
        }
      }
      round++
    }
  })

  return res
}

type Equation = { result: number; values: number[] }

function parseEquations(inputStr: string) {
  return inputStr.split('\n').map((line) => {
    const [resultStr, valueStr] = line.split(': ')
    const values = valueStr.split(' ').map(parseNumber)
    return { result: parseNumber(resultStr), values }
  })
}
