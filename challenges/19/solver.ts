import { memoize, result, sum } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const [patternStr, designsStr] = inputStr.split('\n\n')
  const patterns = patternStr.split(', ')

  const possibleDesigns = []

  for (const design of designsStr.split('\n')) {
    const queue = patterns.filter((p) => design.startsWith(p)).map((pattern) => [pattern, design])

    while (queue.length > 0) {
      const [pattern, des] = queue.pop()

      const newDesign = des.replace(pattern, '')

      if (newDesign.length === 0) {
        possibleDesigns.push(design)
        break
      }

      queue.push(...patterns.filter((p) => newDesign.startsWith(p)).map((p) => [p, newDesign]))
    }
  }

  result(1, possibleDesigns.length)

  const getPossibleDesigns = memoize((design: string): number => {
    if (design.length === 0) {
      return 1
    }

    return patterns
      .filter((pattern) => design.startsWith(pattern))
      .reduce((acc, pattern) => acc + getPossibleDesigns(design.replace(pattern, '')), 0)
  })

  result(2, sum(...possibleDesigns.map(getPossibleDesigns)))
}
