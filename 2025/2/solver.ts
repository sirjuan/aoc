import { result, sum } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  let part1 = 0

  const idRanges = inputStr.split(',').map((pair) => {
    const [first, second] = pair.split('-').map(Number)
    return { first: Math.min(first, second), second: Math.max(first, second) }
  })

  idRanges.forEach(({ first, second }) => {
    for (let i = first; i <= second; i++) {
      const str = i.toString()

      for (let repeatSize = 1; repeatSize <= Math.floor(str.length / 2); repeatSize++) {
        const testChars = str.slice(0, repeatSize)
        const restChars = str.slice(repeatSize)
        if (testChars === restChars) {
          part1 += i
          break
        }
      }
    }
  })

  result(1, part1)
}

export const solver2: Solver = (inputStr) => {
  const part2 = new Set<number>()

  const idRanges = inputStr.split(',').map((pair) => {
    const [first, second] = pair.split('-').map(Number)
    return { first: Math.min(first, second), second: Math.max(first, second) }
  })

  idRanges.forEach(({ first, second }) => {
    for (let id = first; id <= second; id++) {
      const str = id.toString()
      const allChars = new Set(str.split(''))

      if (id < 10) {
        // Single digit ids cannot be repeating
        continue
      }

      // Optimization for long repeating sequences
      if (allChars.size === 1) {
        // All chars are the same, definitely repeating
        part2.add(id)
        continue
      }

      for (let repeatSize = Math.floor(str.length / 2); repeatSize > 0; repeatSize--) {
        const testStr = str.slice(0, repeatSize)
        const rest = str.slice(repeatSize)
        const cur = new Set(testStr.split(''))

        if (allChars.size > cur.size) {
          // allChars contains some chars not in testStr, cannot be repeating
          continue
        }

        const testRegex = new RegExp(`^(${testStr})+`)
        const match = rest.match(testRegex)

        if (match) {
          let chars = rest
          while (chars.startsWith(testStr)) {
            chars = chars.slice(repeatSize)
          }

          if (chars.length === 0) {
            // Perfect match
            part2.add(id)
            break
          }
        }
      }
    }
  })

  result(2, sum(...part2))
}
