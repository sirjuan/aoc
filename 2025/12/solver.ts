import { result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const shapeDefs = inputStr.split('\n\n')
  const regionsStr = shapeDefs.pop()
  const shapes = shapeDefs.map((def) => def.split(':\n')[1])
  const regions = regionsStr
    .split('\n')
    .map((line) => {
      const [sizeStr, countsStr] = line.split(': ')
      const size = sizeStr.split('x').map(Number)
      const counts = countsStr.split(' ').map((c, i) => {
        return { shapeIdx: i, count: Number(c) }
      })
      return { size, counts }
    })
    .filter((r) => {
      const totalArea = r.size[0] * r.size[1]
      const counts = r.counts.reduce((sum, c) => sum + c.count, 0)
      return counts * 7 < totalArea
    })

  result(1, regions.length)
}
