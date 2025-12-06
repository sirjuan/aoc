import { result, splitLines } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  interface Equation {
    numbers: number[]
    operator: string
  }

  const equations: Equation[] = []
  const lines = splitLines(inputStr)

  for (const line of lines) {
    const whitespaceRegex = /\s+/
    const parts = line.split(whitespaceRegex).filter((p) => p.length > 0)
    parts.forEach((part, index) => {
      if (equations[index] == null) {
        equations[index] = { numbers: [], operator: '' }
      }
      const partNumber = parseInt(part, 10)
      if (!isNaN(partNumber)) {
        equations[index].numbers.push(partNumber)
      } else {
        equations[index].operator = part
      }
    })
  }

  let part1 = 0

  for (const equation of equations) {
    part1 += eval(equation.numbers.join(equation.operator))
  }

  result(1, part1)
}

export const solver2: Solver = (inputStr) => {
  interface Equation {
    numbers: string[]
    operator: string
  }

  const lines = splitLines(inputStr)

  const numberStrings: string[] = []
  const operators: string[] = []

  for (const line of lines.map((l) => l.split('').reverse().join(''))) {
    for (let i = 0; i < line.length; i++) {
      const char = line.charAt(i)
      if (numberStrings[i] == null) {
        numberStrings[i] = ''
      }
      if (char === ' ') {
        continue
      }
      const isNumber = !isNaN(parseInt(char, 10))
      if (isNumber) {
        numberStrings[i] += char
      } else if (char.length > 0) {
        operators.push(char)
      }
    }
  }
  const equations: Equation[] = [{ numbers: [], operator: operators.shift()! }]

  for (const numberString of numberStrings) {
    const eq = equations.at(-1)!
    if (numberString.length === 0) {
      equations.push({ numbers: [], operator: operators.shift()! })
    } else {
      eq.numbers.push(numberString)
    }
  }

  let part2 = 0

  for (const equation of equations) {
    part2 += eval(equation.numbers.join(equation.operator))
  }

  result(2, part2)
}
