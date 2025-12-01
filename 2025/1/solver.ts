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

// Alternative solution using sign normalization trick
// NOTE: Not mine!
export const solver2Alt: Solver = (inputStr) => {
  let curr = 50
  let zeros = 0

  for (const line of inputStr.split('\n')) {
    const sign = line[0] === 'L' ? -1 : 1
    const diff = sign * parseInt(line.slice(1), 10)

    let newPos = curr + diff
    newPos *= sign
    curr *= sign
    zeros += Math.floor(newPos / 100) - Math.floor(curr / 100)
    curr = (sign * newPos) % 100
  }

  result(2, zeros)
}
