import { parseNumber, repeat, result } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  const blocks: FileSystem = []
  let idx = 0

  inputStr.split('').forEach((size, index) => {
    const id = index % 2 === 0 ? idx++ : null
    repeat(() => {
      blocks.push(id)
    }, parseNumber(size))
  })

  let currentIndex = 0
  let res = 0

  while (true) {
    const id = blocks[currentIndex]
    if (id === undefined) {
      break
    }

    if (id === null) {
      const lastBlock = getLastFileBlock(blocks)
      blocks.splice(currentIndex, 1, lastBlock)
      res += lastBlock * currentIndex
    } else {
      res += id * currentIndex
    }

    currentIndex++
  }

  result(1, res)
}

export const solver2: Solver = (inputStr) => {
  const blocks: FileSystem = []
  const files: Array<{ startIndex: number; endIndex: number; size: number; id: number }> = []
  const emptySpaces: [number, number][] = []
  let fileIndex = 0

  inputStr.split('').forEach((sizeStr, index) => {
    const size = parseNumber(sizeStr)
    const id = index % 2 === 0 ? fileIndex++ : null

    if (id != null) {
      files.unshift({ size, startIndex: blocks.length, endIndex: blocks.length + size, id })
    } else {
      emptySpaces.push([blocks.length, blocks.length + size])
    }
    repeat(() => {
      blocks.push(id)
    }, size)
  })

  files.forEach((file) => {
    for (const [emptySpaceIndex, emptySpace] of emptySpaces.entries()) {
      const [startIndex, endIndex] = emptySpace

      if (startIndex > file.startIndex) {
        break
      }

      if (file.size <= endIndex - startIndex) {
        repeat((index) => {
          blocks[startIndex + index] = file.id
          blocks[file.startIndex + index] = null
        }, file.size)

        if (file.size === endIndex - startIndex) {
          emptySpaces.splice(emptySpaceIndex, 1)
        } else {
          emptySpace[0] = startIndex + file.size
        }

        break
      }
    }
  })

  result(
    2,
    blocks.reduce((acc, cur, i) => acc + (cur ?? 0) * i, 0)
  )
}

// Not 8597959775130 too high

type FileSystem = Array<number | null>

function getLastFileBlock(blocks: FileSystem) {
  const block = blocks.pop()
  return block === null ? getLastFileBlock(blocks) : block
}
