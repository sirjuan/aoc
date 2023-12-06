import { isConstructorDeclaration } from 'typescript'
import { createArray, splitLines, uniq } from '../../shared/utils'

type Position = [x: number, y: number]

type State = {
  histories: Position[][]
}

const SNAKE_LENGTH = 10

const startPosition: Position = [50, 50]

const state: State = {
  histories: createArray(SNAKE_LENGTH, () => [startPosition]),
}

export function solver(inputStr: string) {
  const lines = splitLines(inputStr)

  for (const instruction of lines.slice()) {
    const [direction, moveCountStr] = instruction.split(' ')
    const moveCount = parseInt(moveCountStr, 10)

    console.log(instruction)

    repeat((moveIndex) => {
      const headHistory = state.histories[0]
      const lastHead = last(headHistory)

      switch (direction) {
        case 'U': {
          headHistory.push([lastHead[0], lastHead[1] + 1])
          repeat((tailIndex) => {
            const comparer = last(state.histories[tailIndex])
            const ownHistory = state.histories[tailIndex + 1]
            const lastPosition = last(ownHistory)
            if (shouldMove(comparer, lastPosition)) {
              const horizontalDiff = Math.max(Math.min(comparer[0] - lastPosition[0], 1), -1)
              const verticalDiff = Math.max(Math.min(comparer[1] - lastPosition[1], 1), -1)
              const newPosition: Position = [
                lastPosition[0] + horizontalDiff,
                lastPosition[1] + verticalDiff,
              ]

              ownHistory.push(newPosition)
            }
          }, SNAKE_LENGTH - 1)

          break
        }

        case 'D': {
          headHistory.push([lastHead[0], lastHead[1] - 1])

          repeat((tailIndex) => {
            const comparer = last(state.histories[tailIndex])
            const ownHistory = state.histories[tailIndex + 1]
            const lastPosition = last(ownHistory)

            if (shouldMove(comparer, lastPosition)) {
              const horizontalDiff = Math.max(Math.min(comparer[0] - lastPosition[0], 1), -1)
              const verticalDiff = Math.max(Math.min(comparer[1] - lastPosition[1], 1), -1)
              const newPosition: Position = [
                lastPosition[0] + horizontalDiff,
                lastPosition[1] + verticalDiff,
              ]

              ownHistory.push(newPosition)
            }
          }, SNAKE_LENGTH - 1)

          break
        }

        case 'R': {
          headHistory.push([lastHead[0] + 1, lastHead[1]])

          repeat((tailIndex) => {
            const comparer = last(state.histories[tailIndex])
            const ownHistory = state.histories[tailIndex + 1]
            const lastPosition = last(ownHistory)
            if (shouldMove(comparer, lastPosition)) {
              const horizontalDiff = Math.max(Math.min(comparer[0] - lastPosition[0], 1), -1)
              const verticalDiff = Math.max(Math.min(comparer[1] - lastPosition[1], 1), -1)
              const newPosition: Position = [
                lastPosition[0] + horizontalDiff,
                lastPosition[1] + verticalDiff,
              ]

              ownHistory.push(newPosition)
            }
          }, SNAKE_LENGTH - 1)

          break
        }

        case 'L': {
          headHistory.push([lastHead[0] - 1, lastHead[1]])

          repeat((tailIndex) => {
            const comparer = last(state.histories[tailIndex])

            if (tailIndex === 6) {
              console.log(JSON.stringify(state.histories[tailIndex]))
              console.log({
                comparer,
                check: state.histories[tailIndex][state.histories[tailIndex].length - 1],
              })
            }

            const ownHistory = state.histories[tailIndex + 1]
            const lastPosition = last(ownHistory)

            if (shouldMove(comparer, lastPosition)) {
              const horizontalDiff = Math.max(Math.min(comparer[0] - lastPosition[0], 1), -1)
              const verticalDiff = Math.max(Math.min(comparer[1] - lastPosition[1], 1), -1)
              const newPosition: Position = [
                lastPosition[0] + horizontalDiff,
                lastPosition[1] + verticalDiff,
              ]

              ownHistory.push(newPosition)
            }
          }, SNAKE_LENGTH - 1)
          break
        }
      }
      console.log(instruction, ', move', moveIndex + 1)
      // drawSnapShot()
    }, moveCount)
  }

  function drawSnapShot() {
    let drawingArr = createArray(100, () => createArray(100, '.'))

    for (const [index, history] of state.histories.entries()) {
      const lastEntry = last(history)
      drawingArr[lastEntry[1]][lastEntry[0]] = index === 0 ? 'H' : index.toString()
    }

    const drawing = drawingArr
      .reverse()
      .map((line) => line.join(''))
      .join('\n')

    console.log(drawing)
  }
  const histories = [
    [
      [25, 25],
      [26, 25],
      [27, 25],
      [28, 25],
      [29, 25],
      [30, 25],
    ],
    [
      [25, 25],
      [24, 25],
      [23, 25],
      [22, 25],
      [21, 25],
    ],
    [
      [25, 25],
      [24, 25],
      [23, 25],
      [22, 25],
    ],
    [
      [25, 25],
      [24, 25],
      [23, 25],
    ],
    [
      [25, 25],
      [24, 25],
    ],
    [[25, 25]],
    [[25, 25]],
    [[25, 25]],
    [[25, 25]],
    [[25, 25]],
    [[25, 25]],
  ]
  const lastTail = last(state.histories)

  const coords = uniq(lastTail.map((hist) => `${hist[0]}x${hist[1]}`))

  const xCoords = lastTail.map((tail) => tail[0])
  const yCoords = lastTail.map((tail) => tail[1])

  const minX = Math.min(...xCoords)
  const maxX = Math.max(...xCoords)
  const minY = Math.min(...yCoords)
  const maxY = Math.max(...yCoords)

  let str = ''

  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      str += coords.includes(stringifyCoord([x, y])) ? '#' : '.'
    }
    str += '\n'
  }

  // console.log(lastTail, coords.length)

  console.log(str)
  console.log(coords.length)
}

const stringifyCoord = (position: Position) => `${position[0]}x${position[1]}`

function shouldMove(head: Position, tail: Position) {
  const horizontal = Math.abs(head[0] - tail[0])
  const vertical = Math.abs(head[1] - tail[1])
  return horizontal > 1 || vertical > 1
}

export const repeat = (callback: (index: number) => void, times: number) => {
  const runs = createArray(times, (index) => index)
  for (const runCount of runs) {
    callback(runCount)
  }
}

export const last = <TData>(arr: TData[]): TData => arr.slice(-1)[0]
