import _ from 'lodash'

import { last, parseNumber, repeat, splitLines } from '../../shared/utils'

export function solver(inputStr: string) {
  const monkeys = parseMonkeys(inputStr)

  // Thanks to lamperi
  // https://github.com/lamperi/aoc/blob/master/2022/11/solve.py#L56
  const moduloDivider = monkeys.reduce((acc, cur) => acc * cur.divider, 1)

  const result1 = calculateMonkeyBusiness(monkeys, 20, (num) => Math.floor(num / 3))
  const result2 = calculateMonkeyBusiness(monkeys, 10000, (num) => num % moduloDivider)

  console.log('Result 1:', result1)
  console.log('Result 2:', result2)
}

type Monkeys = ReturnType<typeof parseMonkeys>
type WorryFn = (num: number) => number

function calculateMonkeyBusiness(monkeys: Monkeys, rounds: number, handleWorry: WorryFn) {
  const clonedMonkeys = _.cloneDeep(monkeys)

  repeat(() => {
    for (const monkey of clonedMonkeys) {
      const items = monkey.items.reverse()
      while (items.length > 0) {
        monkey.inspectCount++
        const result = handleWorry(monkey.calculate(items.pop()))
        const monkeyIndex = monkey.getNextMonkey(result)
        clonedMonkeys[monkeyIndex].items.push(result)
      }
    }
  }, rounds)

  return clonedMonkeys
    .map((monkey) => monkey.inspectCount)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((total, cur) => total * cur, 1)
}

function parseMonkeys(inputStr: string) {
  return inputStr.split('\n\n').map((monkeyStr) => {
    const [, itemsStr, operationStr, testStr, trueStr, falseStr] = splitLines(monkeyStr)

    const items = itemsStr.trim().replace('Starting items: ', '').split(', ').map(parseNumber)
    const divider = parseNumber(last(testStr.split(' ')))

    const calculate = (num: number) =>
      eval(operationStr.trim().replace('Operation: new = ', '').replace(/old/g, num.toString()))

    const getNextMonkey = (num: number) =>
      parseNumber(last((num % divider === 0 ? trueStr : falseStr).split(' ')))

    return { items, inspectCount: 0, divider, calculate, getNextMonkey }
  })
}
