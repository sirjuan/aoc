export const solver: Solver = (inputStr) => {
  // Solution part 1

  const part1 = inputStr
    .split('\n')
    .map((line) => line.match(/\d/g))
    .map((match) => parseInt(match[0] + match.at(-1), 10))
    .reduce((a, b) => a + b, 0)

  // Solution part 2

  const characters = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ]

  const map = Object.fromEntries(
    characters.flatMap((key, index) => [
      [key, index.toString()],
      [index, index.toString()],
    ])
  )

  const keys = Object.keys(map).join('|')
  const regex = new RegExp(`(?=(${keys}))`, 'g')

  const part2 = inputStr
    .split('\n')
    .map((line) => Array.from(line.matchAll(regex)).map((x) => map[x[1]]))
    .map((match) => parseInt(match[0] + match.at(-1)), 10)
    .reduce((a, b) => a + b, 0)
}
