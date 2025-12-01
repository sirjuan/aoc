import { result } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  let state = 50
  let part1 = 0
  const totalCount = 100

  function turnDial(str: string) {
    const direction = str[0]
    const amount = parseInt(str.slice(1), 10)
    if (direction === 'L') {
      state = state - amount
    } else if (direction === 'R') {
      state = state + amount
    }

    if (state % totalCount === 0) {
      part1 += 1
    }
  }

  inputStr.split('\n').forEach(turnDial)

  result(1, part1)
}

export const solver2: Solver = (inputStr) => {
  let state = 50
  let part2 = 0
  const totalCount = 100

  function turnDial(str: string, index: number) {
    const direction = str[0]
    const amount = parseInt(str.slice(1), 10)
    const oldState = state
    state = direction === 'L' ? state - amount : state + amount

    const rangeStart = Math.min(oldState, state)
    const rangeEnd = Math.max(oldState, state)

    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i % totalCount === 0 && i !== oldState) {
        part2 += 1
      }
    }
  }

  inputStr.split('\n').forEach(turnDial)

  result(2, part2)
}
