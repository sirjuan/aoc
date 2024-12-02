export const solver: Solver = (inputStr) => {
  const [seedRow, ...categoryRows] = inputStr.split('\n\n')
  const seeds = seedRow.split(/: +/g)[1].split(' ').map(Number)

  // Solution part 1

  console.time('Part 1')

  const gategoryMappers = categoryRows.map((category) => {
    const mappers = parseCategoryString(category)
    return (seed: number) => {
      const mapper = mappers.find((mapper) => mapper.start <= seed && seed <= mapper.end)
      return mapper ? mapper.destination + seed - mapper.start : seed
    }
  })

  const queue = seeds.map((seed) => ({ index: 0, current: seed }))

  let part1 = Infinity

  while (queue.length) {
    const item = queue.shift()!
    const mappedNumber = gategoryMappers[item.index](item.current)

    if (item.index === gategoryMappers.length - 1) {
      part1 = Math.min(part1, mappedNumber)
    } else {
      queue.push({ index: item.index + 1, current: mappedNumber })
    }
  }

  console.timeEnd('Part 1')
  console.log(part1)

  // Solution part 2

  console.time('Part 2')

  let part2 = Infinity

  const gategoryRangeMappers = categoryRows.map((category) => {
    const rangeMappers = parseCategoryString(category)
    return (splittableRange: Range) =>
      splitRange(splittableRange, rangeMappers).map((range) => {
        const mapper = rangeMappers.find((m) => inRange(range, m))
        if (!mapper) return range
        const start = range.start - mapper.start + mapper.destination
        const end = start + range.end - range.start
        return { start, end }
      })
  })

  seeds.forEach((originalSeed, seedIndex, original) => {
    if (seedIndex % 2 !== 0) {
      return
    }

    const next = original[seedIndex + 1]

    const queue = [{ start: originalSeed, end: originalSeed + next, index: 0 }]

    while (queue.length) {
      const range = queue.shift()!

      const ranges = gategoryRangeMappers[range.index](range)

      if (range.index === gategoryRangeMappers.length - 1) {
        part2 = Math.min(part2, ...ranges.map((r) => r.start))
      } else {
        queue.push(...ranges.map((r) => ({ ...r, index: range.index + 1 })))
      }
    }
  })

  console.timeEnd('Part 2')
  console.log(part2)
}

function parseCategoryString(str: string) {
  return str
    .split('\n')
    .slice(1)
    .map((row) => {
      const [destination, start, count] = row.split(' ').map(Number)
      return { destination, start, end: start + count - 1 }
    })
    .sort((a, b) => a.start - b.start)
}

type Range = { start: number; end: number }

function splitRange(range: Range, splitters: Range[]): Range[] {
  let ranges: Range[] = [{ start: range.start, end: range.end }]

  for (const splitter of splitters) {
    if (splitter.end < range.start || splitter.start > range.end) {
      continue
    }

    const previous = ranges.at(-1)

    previous.end = Math.min(previous.end, splitter.end)

    if (previous.end < range.end) {
      ranges.push({ start: previous.end + 1, end: range.end })
    }
  }

  return ranges
}

function inRange(range: Range, target: Range) {
  return target.start <= range.start && range.end <= target.end
}
