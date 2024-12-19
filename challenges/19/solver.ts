import { result, sum } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const [patternStr, designsStr] = inputStr.split('\n\n')
  const availablePatterns = patternStr.split(', ')
  const desiredDesigns = designsStr.split('\n')

  const possibleDesigns = []

  for (const design of desiredDesigns) {
    const queue = availablePatterns.filter((pattern) => design.startsWith(pattern)).map((pattern) => [pattern, design])

    while (queue.length > 0) {
      const [pattern, des] = queue.pop()

      const newDesign = des.replace(pattern, '')

      if (newDesign.length === 0) {
        possibleDesigns.push(design)
        break
      }

      for (const newPattern of availablePatterns.filter((pattern) => newDesign.startsWith(pattern))) {
        queue.push([newPattern, newDesign])
      }
    }
  }

  result(1, possibleDesigns.length)

  const getPossibleDesigns = memoize((design: string): number => {
    if (design.length === 0) {
      return 1
    }

    return availablePatterns
      .filter((pattern) => design.startsWith(pattern))
      .reduce((acc, pattern) => acc + getPossibleDesigns(design.replace(pattern, '')), 0)
  })

  result(2, sum(...possibleDesigns.map(getPossibleDesigns)))
}

function memoize<Params extends any[], Output>(fn: (...args: Params) => Output) {
  const cache = {}
  return function (...args: Params): Output {
    const stringifiedArgs = JSON.stringify(args)
    if (cache[stringifiedArgs]) {
      return cache[stringifiedArgs]
    }

    const result = fn(...args)
    cache[stringifiedArgs] = result

    return result
  }
}
