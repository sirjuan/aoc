import { parseMap, result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const keyColumns: number[][] = []
  const lockColumns: number[][] = []
  let height = 0

  inputStr.split('\n\n').map((keyOrLockStr) => {
    let isKey = false
    const columnCounts: number[] = []
    const map = parseMap(keyOrLockStr, {
      iterator: (char, x, y) => {
        if (char === '#') {
          columnCounts[x] = (columnCounts[x] ?? -1) + 1
        }
        if (y === 0 && char !== '#') {
          isKey = true
        }
      },
    })

    height = map.height

    if (isKey) {
      keyColumns.push(columnCounts)
    } else {
      lockColumns.push(columnCounts)
    }
  })

  let res = 0

  for (const lockColumnsRow of lockColumns) {
    for (const keyColumnsRow of keyColumns) {
      let found = true
      for (let i = 0; i < lockColumnsRow.length; i++) {
        if (lockColumnsRow[i] + keyColumnsRow[i] >= height - 1) {
          found = false
          break
        }
      }
      if (found) {
        res++
      }
    }
  }

  result(1, res)
}
