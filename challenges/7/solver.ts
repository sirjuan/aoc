import { parseNumber, result, sum } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const equations = parseEquations(inputStr)
  result(1, solve(equations))
  result(2, solve(equations, true))
}

function solve(equations: Equation[], concat = false) {
  const corrects: number[] = []

  equations.forEach(({ result, values }, index) => {
    const states: number[][] = [[values[0]]]

    let round = 1

    while (round <= values.length) {
      const lastRound = states.at(-1)
      const newRound: number[] = []
      states.push(newRound)

      for (const state of lastRound) {
        if (round === values.length) {
          if (state === result) {
            corrects.push(result)
            break
          }
        }

        const value = values[round]

        const added = state + value
        if (added <= result) {
          newRound.push(added)
        }

        const multiplied = state * value
        if (multiplied <= result) {
          newRound.push(multiplied)
        }

        if (concat) {
          const concatenated = Number(`${state}${value}`)
          if (concatenated <= result) {
            newRound.push(concatenated)
          }
        }
      }
      round++
    }
  })

  return sum(...corrects)
}

type Equation = { result: number; values: number[] }

function parseEquations(inputStr: string) {
  return inputStr.split('\n').map((line) => {
    const [resultStr, valueStr] = line.split(': ')
    const values = valueStr.split(' ').map(parseNumber)
    return { result: parseNumber(resultStr), values }
  })
}

// This is default and not needed if you don't need some custom parsing
// export const parser: Parser = (inputStr) => inputStr.trim()
