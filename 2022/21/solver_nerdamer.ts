import { last, parseNumber, splitLines } from '../../shared/utils'
import nerdamer from 'nerdamer'
import 'nerdamer/Solve'

const KEYS = { root: 'root', human: 'humn' }

export function solver(inputStr: string) {
  const lines = splitLines(inputStr)
  const root = lines.find((line) => line.startsWith(KEYS.root))

  // Part 1
  console.time('Part 1')
  const filtered1 = lines.filter((line) => !line.startsWith(KEYS.root))
  const expression1 = getExpression([root, ...filtered1])
  const solution1 = eval(expression1)
  console.log('Part 1:', solution1) // 168502451381566
  console.timeEnd('Part 1')

  // Part 2
  console.time('Part 2')
  const filtered2 = filtered1.filter((line) => !line.startsWith(KEYS.human))
  const expression2 = getExpression([root.replace('+', '='), ...filtered2])
  const solution2 = solveEquationFor(expression2, KEYS.human)
  console.log('Part 2:', solution2) // 3343167719435
  console.timeEnd('Part 2')
}

function getExpression(input: string[]) {
  const newLine = '\n'
  let output = input.join(newLine)

  while (splitLines(output).length > 1) {
    const ops = splitLines(output)

    if (last(ops).startsWith(KEYS.root)) {
      return
    }

    const [name, operation] = ops.pop().split(': ')
    const regex = new RegExp(name, 'g')
    output = ops.join(newLine).replace(regex, `(${operation})`)
  }

  return output.replace(KEYS.root + ': ', '')
}

function solveEquationFor(expression: string, solveFor: string) {
  return parseNumber(nerdamer(expression).solveFor(solveFor).toString())
}
