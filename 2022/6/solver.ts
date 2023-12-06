import { splitChars, splitLines } from '../../shared/utils'

export function solver(input: string) {
  for (const i of splitLines(input).filter(Boolean)) {
    console.log(findMarkerPosition(i, 14))
  }
}

function findMarkerPosition(input: string, markerLength: number) {
  return splitChars(input).findIndex(
    (_, i, chars) => new Set(chars.slice(i - markerLength, i)).size === markerLength
  )
}
