import { splitChars, splitLines, splitWords } from '../../shared/utils'

export function solver(input: string) {
  const [stacksWithNumbers, instructionsString] = input.split('\n\n')

  const [numbers, ...lines] = splitLines(stacksWithNumbers).reverse()

  const indices = splitChars(numbers).reduce<number[]>(
    (indices, cur, i) => (!isNaN(parseInt(cur, 10)) ? indices.concat(i) : indices),
    []
  )

  const stacks = indices.map((index) =>
    lines.map((line) => line.charAt(index)).filter((char) => Boolean(char.trim()))
  )

  for (const instruction of splitLines(instructionsString).filter(Boolean)) {
    const [, count, , from, , to] = splitWords(instruction).map((item) => parseInt(item, 10))

    const fromIndex = from - 1
    const toIndex = to - 1

    const items = stacks[fromIndex].splice(-count)
    stacks[toIndex].push(...items)
  }

  const solution = stacks.map((stack) => stack.slice(-1)[0]).join('')

  console.log('Solution', solution)
}
