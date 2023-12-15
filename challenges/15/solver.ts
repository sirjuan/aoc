import { parseNumber, result, sum } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const items = inputStr.split(',').map((item) => decryptHash(item))
  result(1, sum(...items), 494980)
}

export const solver2: Solver = (inputStr) => {
  const boxes: Record<string, Array<{ label: string; focalLength: number }>> = {}

  inputStr.split(',').forEach((item) => {
    const operation = item.includes('=') ? '=' : '-'
    const [label, focalLengthStr] = item.split(operation)
    const focalLength = parseNumber(focalLengthStr)
    const boxKey = decryptHash(label)
    boxes[boxKey] ??= []

    if (operation === '=') {
      const foundIndex = boxes[boxKey].findIndex((item) => item.label === label)
      if (foundIndex !== -1) {
        boxes[boxKey][foundIndex].focalLength = focalLength
      } else {
        boxes[boxKey].push({ label, focalLength })
      }
    } else {
      boxes[boxKey] = boxes[boxKey].filter((item) => item.label !== label)
    }
  })

  let total = 0

  for (const [boxKey, boxContents] of Object.entries(boxes)) {
    const key = parseNumber(boxKey) + 1
    boxContents.forEach(({ focalLength }, index) => {
      total += key * (index + 1) * focalLength
    })
  }

  result(2, total, 247933)
}

function decryptHash(input: string) {
  return input.split('').reduce((acc, char) => ((acc + char.charCodeAt(0)) * 17) % 256, 0)
}
