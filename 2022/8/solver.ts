import { splitChars, splitLines } from '../../shared/utils'
import { v4 } from 'uuid'

export function solver(inputStr: string) {
  const grid = splitLines(inputStr)
    .filter(Boolean)
    .map((line, y) =>
      splitChars(line).map((height, x) => ({ id: `${x}x${y}`, height: parseInt(height, 10) }))
    )

  //   console.log(grid)

  //   // Above

  //   const solution = grid.reduce<Record<string, number>>((total, line, lineIndex) => {
  //     if (lineIndex === 0 || lineIndex === grid.length - 1) {
  //       line.forEach((tree) => {
  //         total[tree.id] = tree.height
  //       })
  //     }

  //     const firstTree = line[0]
  //     const lastTree = line[line.length - 1]

  //     total[firstTree.id] = firstTree.height
  //     total[lastTree.id] = lastTree.height

  //     // From left
  //     for (const [index, tree] of line.entries()) {
  //       if (index === 0) {
  //         total[tree.id] = tree.height
  //         continue
  //       }

  //       const compareTreeHeight = Math.max(...line.slice(0, index).map((tree) => tree.height))

  //       if (tree.height > compareTreeHeight) {
  //         total[tree.id] = tree.height
  //         continue
  //       }
  //     }

  //     const reversedLine = line.slice().reverse()

  //     let topCount = 0

  //     // From right
  //     for (const [index, tree] of reversedLine.entries()) {
  //       const compareHeights = reversedLine.slice(0, index).map((tree) => tree.height)

  //       console.log(compareHeights)

  //       const compareTreeHeight = Math.max(...compareHeights)

  //       if (tree.height > compareTreeHeight) {
  //         total[tree.id] = tree.height
  //         continue
  //       }
  //     }

  //     if (lineIndex === 0) {
  //       // From top
  //       for (const [x, tree] of line.entries()) {
  //         if (x === 0) {
  //           total[tree.id] = tree.height
  //           continue
  //         }

  //         for (let y = 1; y < grid.length; y++) {
  //           const currentTree = grid[y][x]
  //           const previousValues = Array.from({ length: y }, (_, i) => grid[i][x]).map(
  //             (tree) => tree.height
  //           )

  //           console.log(previousValues)

  //           const compareTreeHeight = Math.max(...previousValues)
  //           if (currentTree.height > compareTreeHeight) {
  //             topCount++
  //             total[currentTree.id] = currentTree.height
  //             continue
  //           }
  //         }
  //       }
  //     }

  //     let bottomCount = 0

  //     if (lineIndex === 0) {
  //       // From bottom
  //       for (const [x, tree] of line.entries()) {
  //         if (x === 0) {
  //           total[tree.id] = tree.height
  //           continue
  //         }

  //         const reversedGrid = grid.slice().reverse()

  //         for (let y = reversedGrid.length - 2; y > 0; y--) {
  //           const currentTree = reversedGrid[y][x]
  //           const previousValues = Array.from({ length: y }, (_, i) => reversedGrid[i][x]).map(
  //             (tree) => tree.height
  //           )
  //           const compareTreeHeight = Math.max(...previousValues)
  //           if (currentTree.height > compareTreeHeight) {
  //             console.log({ x, y, currentTree })
  //             bottomCount++
  //             total[currentTree.id] = currentTree.height
  //             continue
  //           }
  //         }
  //       }
  //     }

  //     // console.log({ bottomCount })

  //     return total
  //   }, {})

  //   console.log(
  //     Object.fromEntries(
  //       Object.entries(solution).filter(
  //         ([key]) =>
  //           !key.startsWith('0x') &&
  //           !key.endsWith('x0') &&
  //           !key.startsWith('4x') &&
  //           !key.endsWith('x4')
  //       )
  //     )
  //   )

  //   const actual = Object.keys(solution).length
  //   const expected = 21

  //   console.log({ actual, expected })

  let totals: number[] = []

  for (const [y, line] of grid.entries()) {
    for (const [x, tree] of line.entries()) {
      const onLeft = line.slice(0, x).reverse()
      const onRight = line.slice(x + 1)
      const onTop = grid
        .slice(0, y)
        .map((l) => l[x])
        .reverse()
        .filter(Boolean)
      const onBottom = grid
        .slice(y + 1)
        .map((l) => l[x])
        .filter(Boolean)

      //   if (tree.id === '2x3') {
      //     console.log({ onTop, onLeft, onRight, onBottom })
      //   }

      const counts = [
        count(tree, onTop),
        count(tree, onLeft),
        count(tree, onBottom),
        count(tree, onRight),
      ]

      totals.push(counts.reduce((tot, cur) => tot * cur, 1))

      console.log(tree.id, counts)
    }
  }

  console.log('Totals', totals)
  console.log('Max', Math.max(...totals))
}

function count(
  currentTree: { id: string; height: number },
  trees: { id: string; height: number }[]
) {
  let num = 0

  for (const tree of trees) {
    num++
    if (currentTree.height <= tree.height) {
      break
    }
  }
  return num
}
