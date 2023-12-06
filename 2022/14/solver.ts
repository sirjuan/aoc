import { createArray, parseNumber, repeat, splitLines } from '../../shared/utils'

export function solver(inputStr: string) {
  type Coordinate = [x: number, y: number]

  const xCoords: number[] = []
  const yCoords: number[] = []

  const rockPatterns = splitLines(inputStr).map((pattern) =>
    pattern.split(' -> ').map(
      (coords) =>
        coords.split(',').map((n, i) => {
          const coord = parseNumber(n)
          if (i === 0) {
            xCoords.push(coord)
          }

          if (i === 1) {
            yCoords.push(coord)
          }
          return coord
        }) as Coordinate
    )
  )

  const yMax = Math.max(...yCoords)
  const yMin = Math.min(...yCoords, 0)
  const xMax = Math.max(...xCoords)
  let xMin = Math.min(...xCoords)

  const initialWidth = xMax - xMin + 2
  const floorIndex = yMax - yMin + 2

  const grid = createArray(yMax - yMin + 2, (y) => createArray(initialWidth, (x) => '.'))

  rockPatterns.forEach((pattern, y) =>
    pattern.forEach((coord, i, original) => {
      const [x, y] = coord
      setGridValue(x, y, '#')
      const lastCoord = original[i - 1]
      if (lastCoord) {
        const [lastX, lastY] = lastCoord
        const diffX = Math.abs(x - lastX)
        const diffY = Math.abs(y - lastY)

        if (diffX !== 0) {
          const min = Math.min(x, lastX)
          repeat((i) => {
            setGridValue(min + i, y, '#')
          }, diffX)
        }

        if (diffY !== 0) {
          const min = Math.min(y, lastY)
          repeat((i) => {
            setGridValue(x, min + i, '#')
          }, diffY)
        }
      }
    })
  )

  grid.push(createArray(initialWidth, (x) => '#'))

  let canFall = true
  let settledCount = 0

  while (canFall) {
    let settled = false

    let x = 500
    let y = 0

    while (!settled) {
      let below = getGridValue(x, y + 1)
      if (!below) {
        throw new Error('Where is the floor!!!')
      }

      if (below === '.') {
        y = y + 1
        continue
      }

      let diagonallyLeft = getGridValue(x - 1, y + 1)
      if (!diagonallyLeft) {
        xMin--
        grid.forEach((line, index) => {
          line.unshift(index !== floorIndex ? '.' : '#')
        })
        diagonallyLeft = getGridValue(x - 1, y + 1)
      }

      if (diagonallyLeft === '.') {
        y = y + 1
        x = x - 1
        continue
      }

      let diagonallyRight = getGridValue(x + 1, y + 1)
      if (!diagonallyRight) {
        grid.forEach((line, index) => {
          line.push(index !== floorIndex ? '.' : '#')
        })
        diagonallyRight = getGridValue(x + 1, y + 1)
      }
      if (diagonallyRight === '.') {
        y = y + 1
        x = x + 1
        continue
      }

      if (y === 0 && below !== '.') {
        canFall = false
      }

      setGridValue(x, y, 'o')
      settled = true
      settledCount++
    }
  }

  //   const drawing = grid.map((line) => line.join('')).join('\n')
  // console.log(rawding)
  console.log(settledCount)

  function setGridValue(x: number, y: number, value: string) {
    grid[y][x - xMin] = value
    return value
  }

  function getGridValue(x: number, y: number): string {
    return grid[y]?.[x - xMin]
  }
}
