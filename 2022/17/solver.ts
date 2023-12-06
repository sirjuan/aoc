import { createArray, last, parseNumber, splitChars } from '../../shared/utils'

function parseInput(inputStr: string) {
  return splitChars(inputStr).map((char) => (char === '<' ? -1 : 1))
}

export function solver(inputStr: string, isExample: boolean) {
  console.log('Part 1', calculate(inputStr, 2022)) // 3106
  console.log('Part 2', calculate(inputStr, 1_000_000_000_000)) // 1537175792495
}

function calculate(inputStr: string, rockCount: number) {
  const rocks = circularArray(['@@@@', '.@.\n@@@\n.@.', '..@\n..@\n@@@', '@\n@\n@\n@', '@@\n@@'])
  const jets = circularArray(parseInput(inputStr))

  let count = 0

  const patterns = new Map()
  let additionalHeight = 0

  let tower = [createArray(7, '#')]

  while (count < rockCount) {
    count++

    const rockStr = rocks.next()
    const rockArr = rockStr.split('\n')
    const rockArrReversed = rockArr.slice().reverse()
    const rockHeight = rockArr.length

    let xIndex = 2
    let settled = false

    tower = tower.filter((line) => line.some((item) => item !== '.'))

    tower.push(createEmptyLine())
    tower.push(createEmptyLine())
    tower.push(createEmptyLine())

    for (const rockLine of rockArr.slice()) {
      const line = createEmptyLine()
      rockLine.split('').forEach((rock, index) => {
        line[xIndex + index] = rock
      })
      tower.push(line)
    }

    draw(`Starting rock fall: ${count}`)

    while (!settled) {
      const wind = jets.next()
      const origX = xIndex
      const newIndex = xIndex + wind
      xIndex = minMax(newIndex, 6, 0)

      // Wind adjust

      const firstCurrent = tower.findIndex((line) => line.includes('@'))

      const linesWithRocks = tower.slice(firstCurrent)

      const newWindLines = []
      let shouldMove = true

      linesWithRocks.forEach((line, index) => {
        const filteredLine = line.map((item) => (item === '@' ? '.' : item))
        const rockLine = rockArrReversed[index]
        if (rockLine) {
          rockLine.split('').forEach((rock, index) => {
            const nextIndex = xIndex + index
            const current = filteredLine[nextIndex]
            if (rock === '.') {
              return
            }
            if (!current || current !== '.' || !numberIsBetween(nextIndex, 0, 6)) {
              //   console.log({ current, nextIndex, xIndex, index, rock })
              shouldMove = false
              return
            }
            filteredLine[nextIndex] = rock
          })
        }

        newWindLines.push(filteredLine)
      })

      if (shouldMove) {
        const replaceLength = newWindLines.length
        tower.splice(-replaceLength, replaceLength)
        tower.push(...newWindLines)
      } else {
        xIndex = origX
      }

      draw(`After wind adjust: ${wind > 0 ? 'right' : 'left'}`)

      // Rock fall

      const immediateBelowIndex = -rockHeight - 1

      const firstCurrentIndex = tower.findIndex((line) => line.includes('@'))
      const firstBelowIndex = firstCurrentIndex - 1
      const below = tower.slice(firstBelowIndex)
      const rest = tower.slice(0, firstBelowIndex)

      const [immediateBelow] = below

      // If line immediately below is empty, it's safe to remove

      if (immediateBelow.every((item) => item === '.')) {
        tower.splice(immediateBelowIndex, 1)
        draw('After descent (empty line below)')
        continue
      }

      const newLines = []

      below.forEach((line, index) => {
        const filteredLine = line.map((item) => (item === '@' ? '.' : item))

        const rockLine = (''.padStart(xIndex, '.') + rockArrReversed[index]).padEnd(7, '.')
        if (rockLine) {
          rockLine.split('').forEach((rock, rockIndex) => {
            if (rock !== '@') {
              return
            }

            const current = filteredLine[rockIndex]

            if (!current || current !== '.') {
              // console.log({ filteredLine, current, rock, xIndex, index, rockIndex })
              settled = true
              return
            }

            filteredLine[rockIndex] = rock
          })
        }

        newLines.push(filteredLine)
      })

      if (!settled) {
        const add = newLines.filter((line) => line.some((item) => item !== '.'))
        tower = [...rest, ...add]
        draw('After descent')
      } else {
        tower = tower.map((line) => line.map((item) => (item === '@' ? '#' : item)))
        draw('After settle')
      }
    }

    const height = tower.length

    let patternKey = `${jets.index}|${rocks.index}`
    for (const line of tower.slice(-5)) {
      patternKey += `|${line.join('')}`
    }

    // Check if current pattern has already been seen.
    // If yes, then add differences to total height and count.
    if (patterns.has(patternKey)) {
      const previous = patterns.get(patternKey)
      const rockCountChange = count - previous.count
      const heightChange = height - previous.height
      const cycles = Math.floor((rockCount - previous.count) / rockCountChange) - 1
      additionalHeight += cycles * heightChange
      count += cycles * rockCountChange
    } else {
      patterns.set(patternKey, { count, height })
    }
  }

  return tower.length + additionalHeight - 1

  function draw(message: string) {
    if (count > -1) {
      return
    }
    const lastStuff = tower.slice(-10).reverse()
    const drawing = lastStuff.map((line) => line.join('')).join('\n')
    console.log('\n')
    console.log(message)
    console.log(drawing)
  }
}

const circularArray = <TData>(arr: TData[]) => {
  return {
    index: 0,
    next() {
      const item = arr[this.index]
      this.index++
      if (this.index >= arr.length) this.index = 0
      return item
    },
    length: arr.length,
  }
}

function createEmptyLine() {
  return createArray(7, '.')
}

function minMax(num: number, check1: number, check2: number) {
  const min = Math.min(check1, check2)
  const max = Math.max(check1, check2)
  return Math.max(Math.min(num, max), min)
}

function numberIsBetween(num: number, check1: number, check2: number) {
  return minMax(num, check1, check2) === num
}
