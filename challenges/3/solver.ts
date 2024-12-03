import { result } from '../../shared/utils'

function calculate(str: string) {
  const regex = /mul\((\d+),(\d+)\)/g
  const matches = str.match(regex)
  const numbers = matches.map((match) => match.match(/mul\((\d+),(\d+)\)/)!.slice(1, 3))
  return numbers.reduce((acc, [x, y]) => acc + parseInt(x) * parseInt(y), 0)
}

export const solver: Solver = (inputStr) => {
  result(1, calculate(inputStr))

  let str = inputStr
  let enabled = true
  let part2 = 0

  while (true) {
    const splitter = enabled ? "don't()" : 'do()'
    const [first, ...rest] = str.split(splitter)
    if (enabled) {
      part2 += calculate(first)
    }
    if (rest.length === 0) {
      break
    }
    enabled = !enabled
    str = rest.join(splitter)
  }

  result(2, part2)
}
