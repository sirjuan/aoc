import path from 'path'

export function solver(inputStr: string) {
  const input = inputStr
    .split('$')
    .filter(Boolean)
    .map((str) => str.trim())

  let cwd = '/'
  let totalSize = 0
  const sizes: Record<string, number> = {}

  for (const line of input) {
    const [cmd, ...output] = line.split('\n')

    if (cmd.startsWith('cd')) {
      cwd = path.join(cwd, cmd.split(' ')[1])
    }

    if (cmd === 'ls') {
      const size = output
        .filter((outputLine) => !outputLine.startsWith('dir'))
        .reduce((total, line) => total + parseInt(line.split(' ')[0], 10), 0)

      totalSize += size
      sizes[cwd] = (sizes[cwd] ?? 0) + size

      let parentDir = path.join(cwd)
      do {
        parentDir = path.join(parentDir, '..')
        sizes[parentDir] = (sizes[parentDir] ?? 0) + size
      } while (parentDir !== '/')
    }
  }

  const TARGET = 100000
  const SPACE_AVAILABLE = 70000000
  const SPACE_NEEDED = 30000000

  const availableSpace = SPACE_AVAILABLE - totalSize
  const neededSpace = Math.abs(availableSpace - SPACE_NEEDED)

  const sizeEntries = Object.entries(sizes)
  const totalSizes = sizeEntries.map(([, size]) => size as number)

  const totalSizeUnderTarget = totalSizes
    .filter((size) => size <= TARGET)
    .reduce((total, size) => total + size, 0)

  console.log('Solution 1', totalSizeUnderTarget)

  for (const size of totalSizes.sort((a, b) => a - b)) {
    if (size >= neededSpace) {
      console.log('Solution 2', size)
      break
    }
  }
}
