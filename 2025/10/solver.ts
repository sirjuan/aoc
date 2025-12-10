import { initial } from 'lodash'
import { PriorityQueue } from '../../shared/queue'
import { PathNode } from '../../shared/shortestPath'
import { createArray, result, splitLines } from '../../shared/utils'

import { init } from 'z3-solver'

const { Context } = await init()
const { Int, Sum, Optimize } = Context('main')
const optimizer = new Optimize()

// [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
// [...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
// [.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
// The manual describes one machine per line. Each line contains a single indicator light diagram in [square brackets],
// one or more button wiring schematics in (parentheses), and joltage requirements in {curly braces}.

interface State {
  target: string[]
  currentState: string[]
  buttons: number[][]
  joltageTarget: number[]
  currentJoltages: number[]
  pressCount: number
}

export const solver: Solver = async (inputStr) => {
  let part1 = 0
  let part2 = 0

  const states = splitLines(inputStr).map((line): State => {
    const lightsMatch = line.match(/\[(.*?)\]/)
    const buttonsMatch = [...line.matchAll(/\((.*?)\)/g)]
    const joltsMatch = line.match(/\{(.*?)\}/)

    const lights = lightsMatch ? lightsMatch[1] : ''
    const buttons = buttonsMatch.map((m) => m[1].split(',').map(Number))
    const jolts = joltsMatch ? joltsMatch[1].split(',').map(Number) : []

    return {
      target: lights.split(''),
      currentState: createArray(lights.length, '.'),
      buttons,
      joltageTarget: jolts,
      currentJoltages: createArray(jolts.length, 0),
      pressCount: 0,
    }
  })

  let index = 0

  for (const state of states) {
    index++
    const presses = await solve2(state)
    part1 += solve1(state)
    part2 += presses
  }

  result(1, part1)
  result(2, part2)
}

function isFinished(currentState: string[], target: string[]): boolean {
  for (let i = 0; i < target.length; i++) {
    if (currentState[i] !== target[i]) {
      return false
    }
  }
  return true
}

function solve1(state: State): number {
  const queue: State[] = [state]
  const seen = new Set<string>()

  while (queue.length > 0) {
    const current = queue.shift()!

    const stateKey = current.currentState.join(',')
    if (seen.has(stateKey)) {
      continue
    }
    seen.add(stateKey)

    // Check if target achieved
    if (isFinished(current.currentState, current.target)) {
      return current.pressCount
    }

    // Try pressing each button
    for (const button of current.buttons) {
      const newState = { ...current, currentState: [...current.currentState], pressCount: current.pressCount + 1 }

      for (const index of button) {
        newState.currentState[index] = newState.currentState[index] === '.' ? '#' : '.'
      }

      queue.push(newState)
    }
  }

  return -1 // No solution found
}

// Helped by Claude
async function solve2(state: State): Promise<number> {
  // Create a fresh context and optimizer for each machine
  const { Context } = await init()
  const { Int, Sum, Optimize } = Context('main')
  const optimizer = new Optimize()

  // Create a variable for each button's press count
  const buttonVars = state.buttons.map((_, i) => Int.const(`b${i}`))

  // Each button must be pressed >= 0 times
  buttonVars.forEach((b) => optimizer.add(b.ge(0)))

  // For each counter, sum of affecting buttons = target
  state.joltageTarget.forEach((target, counterIndex) => {
    // Find all buttons that affect this counter
    const affectingButtonVars = state.buttons
      .map((buttonCounters, buttonIndex) => {
        // Does this button affect counterIndex?
        if (buttonCounters.includes(counterIndex)) {
          return buttonVars[buttonIndex]
        }
        return null
      })
      .filter((b) => b !== null)

    // Sum of presses of affecting buttons must equal target
    if (affectingButtonVars.length > 0) {
      optimizer.add(Sum(...affectingButtonVars).eq(target))
    }
  })

  // Minimize total presses
  optimizer.minimize(Sum(...buttonVars))

  // Solve and get result
  const satisfied = await optimizer.check()
  if (satisfied === 'sat') {
    const model = optimizer.model()
    let total = 0
    for (const buttonVar of buttonVars) {
      total += Number(model.eval(buttonVar).toString())
    }
    return total
  }

  return -1 // No solution
}
