import childProcess from 'child_process'
import 'colors'

export function splitChars(str: string) {
  return str.split('')
}

export function splitWords(str: string) {
  return str.split(' ')
}

export function splitLines(str: string) {
  return str.split('\n')
}

export function splitList(str: string) {
  return str.split(',')
}

export function parseNumber(str: string) {
  return parseInt(str, 10)
}

export function parseNumberFromStr(str: string) {
  return parseNumber(str.match(/\d+/)![0])
}

export function parseNumbersFromStr(str: string) {
  return Array.from(str.matchAll(/(-)?\d+/g)).map((match) => parseNumber(match[0]))
}

export function createArray<TData>(length: number, mapper: (index: number) => TData): TData[]
export function createArray<TData>(length: number, data: TData): TData[]
export function createArray<TData>(length: number, mapperOrData: unknown) {
  return Array.from({ length }, (_, index) => (typeof mapperOrData === 'function' ? mapperOrData(index) : mapperOrData))
}

export function repeat(callback: (index: number) => void, times: number) {
  const runs = createArray(times, (index) => index)
  for (const runCount of runs) {
    callback(runCount)
  }
}

export const exists = <Value>(value: Value | undefined | null): value is Value => value !== undefined && value !== null

export const uniq = <TData>(value: TData[]) => Array.from(new Set(value))

export const uniqBy = <TData>(array: TData[], callback: (value: TData) => unknown) => [
  ...new Map(array.map((item) => [callback(item), item])).values(),
]

export const uniqByKey = <TData>(array: TData[], key: keyof TData) => [
  ...new Map(array.map((item) => [item[key], item])).values(),
]

export const chunkArr = <TData>(inputArray: TData[], perChunk = inputArray.length): TData[][] => {
  return inputArray.reduce<TData[][]>((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex]?.push(item)

    return resultArray
  }, [])
}

export function chunkString(str: string, length: number) {
  return str.match(new RegExp('.{1,' + length + '}', 'g')) as string[]
}

export const last = <TData>(arr: TData[]) => arr[arr.length - 1]

export const omit = <TData extends Record<string, unknown>, TOmittedKey extends keyof TData>(
  omittedKeys: TOmittedKey | TOmittedKey[],
  data: TData
): Omit<TData, TOmittedKey> => {
  const keys = Array.isArray(omittedKeys) ? omittedKeys : [omittedKeys]
  const copy = { ...data }
  for (const key of keys) {
    delete copy[key]
  }
  return copy
}

export function hasOwnProperty<T, K extends PropertyKey>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function toRecord<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TObj extends Record<TKey, any>,
  TKey extends string | number
>(array: TObj[], selector: (obj: TObj) => TKey): Record<string, TObj>

export function toRecord<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TObj extends Record<TKey, any>,
  TKey extends keyof TObj
>(array: TObj[], selector: TKey): Record<string, TObj>

export function toRecord<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TObj extends Record<TKey, any>,
  TKey extends keyof TObj | string | number
>(array: TObj[], selector: TKey | ((obj: TObj) => TKey)) {
  const result = {} as Record<string, TObj>

  // eslint-disable-next-line no-restricted-syntax
  for (const item of array) {
    const key = typeof selector === 'function' ? selector(item) : item[selector]
    result[key as string] = item
  }

  return result
}

export function arrayify<TData>(data: TData | TData[]) {
  return Array.isArray(data) ? data : [data]
}

export function sum(...vals: number[]) {
  return vals.reduce((total, item) => total + item, 0)
}

export function multiply(...vals: number[]) {
  return vals.reduce((total, item) => total * item)
}

export function toClipboard(data: any) {
  var proc = childProcess.spawn('pbcopy')
  proc.stdin.write(JSON.stringify(data))
  proc.stdin.end()
}

export function result<T extends number | string>(part: number, value: T, expected?: T) {
  if (expected == null || value === expected) {
    console.log(`\nPart ${part}`.green, value, '\n')
    toClipboard(value)
  } else {
    console.error('Incorrect!'.bgRed, 'Expected', expected, 'but got', value)
    if (typeof expected === 'number' && typeof value === 'number') {
      console.error('Diff:', expected - value)
    }
  }
}

export function leastCommonMultiple(a: number, b: number): number {
  return (a * b) / greatestCommonDivisor(a, b)
}

export function greatestCommonDivisor(a: number, b: number): number {
  return !b ? a : greatestCommonDivisor(b, a % b)
}

export const circularArray = <TData>(arr: TData[]) => {
  return {
    index: 0,
    next() {
      const item = arr[this.index]
      this.index++
      if (this.index >= arr.length) this.index = 0
      return item
    },
    length: arr.length,
  }
}

export function memo<Args extends unknown[], Result>(func: (...args: Args) => Result): (...args: Args) => Result {
  const stored = new Map<string, Result>()

  return (...args) => {
    const k = JSON.stringify(args)
    if (stored.has(k)) {
      return stored.get(k)!
    }
    const result = func(...args)
    stored.set(k, result)
    return result
  }
}

export function transposeArray(array: string[][]) {
  var newArray = []
  const arrayLength = array[0].length

  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < arrayLength; j++) {
      const item = array[i][j]
      if (item != null) {
        newArray[j] ??= []
        newArray[j].push(item)
      }
    }
  }

  return newArray
}

export function rotateMatrix45deg<T>(
  matrix: T[][],
  direction: 'clockwise' | 'counterClockwise',
  padCharacter: any = null
): T[][] {
  var summax = matrix.length + matrix[0].length - 1
  var rotated: T[][] = []
  for (var i = 0; i < summax; ++i) {
    rotated.push([])
  }
  if (direction === 'clockwise') {
    for (var j = 0; j < matrix[0].length; ++j) {
      for (var i = 0; i < matrix.length; ++i) {
        rotated[i + j].push(matrix[i][j])
      }
    }
  } else {
    for (var i = 0; i < matrix.length; ++i) {
      for (var j = 0; j < matrix[0].length; ++j) {
        rotated[j - i + matrix.length - 1].push(matrix[i][j])
      }
    }
  }

  // Pad the empty parts with the provided character on both sides
  for (var i = 0; i < rotated.length; ++i) {
    while (rotated[i].length < matrix.length) {
      rotated[i].unshift(padCharacter)
      if (rotated[i].length < matrix.length) {
        rotated[i].push(padCharacter)
      }
    }
  }

  return rotated
}

type ParserOpts<T> = {
  iterator?: ((char: T, x: number, y: number) => void) | ((char: T, x: number, y: number) => T)
  parser?: (char: string) => T
}

export const mapUtils = {
  moveLeft: ([x, y]: [x: number, y: number]): [x: number, y: number] => [x - 1, y],
  moveRight: ([x, y]: [x: number, y: number]): [x: number, y: number] => [x + 1, y],
  moveUp: ([x, y]: [x: number, y: number]): [x: number, y: number] => [x, y - 1],
  moveDown: ([x, y]: [x: number, y: number]): [x: number, y: number] => [x, y + 1],
}

export function parseMap<T = string>(inputStr: string, { iterator, parser = (char) => char as T }: ParserOpts<T> = {}) {
  const horizontalLines: string[] = []
  const verticalLines: string[] = []
  const map: T[][] = []

  inputStr.split('\n').forEach((line, y) => {
    map.push([])
    horizontalLines.push(line)
    line.split('').forEach((char, x) => {
      const parsed = parser(char)
      const iterated = iterator?.(parsed, x, y)
      const item = (iterated ?? parsed) as T
      verticalLines[x] ??= ''
      verticalLines[x] += item
      map[y].push(item)
    })
  })

  const height = map.length
  const width = map[0].length

  function getItem([x, y]: [x: number, y: number]): T {
    return map[y]?.[x]
  }

  function checkItem([x, y]: [x: number, y: number], val: T): boolean {
    return map[y]?.[x] === val
  }

  function inBounds([x, y]: [x: number, y: number]): boolean {
    return x >= 0 && y >= 0 && y < height && x < width
  }

  function setItem([x, y]: [x: number, y: number], value: T) {
    map[y][x] = value
  }

  function getLine(y: number): T[] {
    return map[y]
  }

  function iterate(callback: (item: T, x: number, y: number) => void) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        callback(getItem([x, y]), x, y)
      }
    }
  }

  interface Neighbors {
    S: T | undefined
    N: T | undefined
    E: T | undefined
    W: T | undefined
  }

  function getNeighbors([x, y]: [x: number, y: number]): Neighbors {
    const deltas = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
    const neighbors: Neighbors = {
      S: getItem([x, y + 1]),
      N: getItem([x, y - 1]),
      E: getItem([x + 1, y]),
      W: getItem([x - 1, y]),
    }

    return neighbors
  }

  function getNeighborCount([x, y]: [x: number, y: number], condition: (item: T | undefined) => boolean): number {
    const neighbors = getNeighbors([x, y])
    let count = 0
    for (const direction of Object.keys(neighbors) as (keyof Neighbors)[]) {
      if (condition(neighbors[direction])) {
        count++
      }
    }
    return count
  }

  interface AllNeighbors {
    NW: T | undefined
    N: T | undefined
    NE: T | undefined
    W: T | undefined
    E: T | undefined
    SW: T | undefined
    S: T | undefined
    SE: T | undefined
  }

  function getAllNeighbors([x, y]: [x: number, y: number]): AllNeighbors {
    const neighbors: AllNeighbors = {
      NW: getItem([x - 1, y - 1]),
      N: getItem([x, y - 1]),
      NE: getItem([x + 1, y - 1]),
      W: getItem([x - 1, y]),
      E: getItem([x + 1, y]),
      SW: getItem([x - 1, y + 1]),
      S: getItem([x, y + 1]),
      SE: getItem([x + 1, y + 1]),
    }

    return neighbors
  }

  function getAllNeighborsCount([x, y]: [x: number, y: number], condition: (item: T | undefined) => boolean): number {
    const neighbors = getAllNeighbors([x, y])
    let count = 0
    for (const direction of Object.keys(neighbors) as (keyof AllNeighbors)[]) {
      if (condition(neighbors[direction])) {
        count++
      }
    }
    return count
  }

  function print() {
    for (let y = 0; y < height; y++) {
      let line = ''
      for (let x = 0; x < width; x++) {
        line += getItem([x, y])
      }
      console.log(line)
    }
  }

  return {
    ...mapUtils,
    horizontalLines,
    verticalLines,
    map,
    getItem,
    setItem,
    checkItem,
    inBounds,
    stringifyCoord: coordToString,
    iterate,
    getLine,
    height,
    width,
    getNeighbors,
    getNeighborCount,
    getAllNeighbors,
    getAllNeighborsCount,
    print,
  }
}

export function concatenateNumbers(a: number, b: number): number {
  let multiplier = 1
  while (multiplier <= b) {
    multiplier *= 10
  }
  return a * multiplier + b
}

export function coordToString([x, y]: [x: number, y: number]) {
  return `${x},${y}`
}

export let isExample = false

export function setExample() {
  isExample = true
}

export function memoize<Params extends any[], Output extends any>(fn: (...args: Params) => Output) {
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

/* eslint-disable no-restricted-syntax */
export function groupBy<
  TData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TKey extends keyof TData
>(array: TData[], selector: (obj: TData) => string): Record<string, TData[]>

export function groupBy<TData, TKey extends keyof TData>(array: TData[], selector: TKey): Record<string, TData[]>

export function groupBy<TData, TKey extends keyof TData>(array: TData[], selector: TKey | ((obj: TData) => TKey)) {
  const result: Record<string, TData[]> = {}

  for (const item of array) {
    const key = (typeof selector === 'function' ? selector(item) : item[selector]) as string

    if (result[key] == null) {
      result[key] = []
    }
    result[key]?.push(item)
  }

  return result
}

export function range(start: number, end: number): number[] {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

export function merge(ranges: [number, number][]) {
  var result: [number, number][] = []
  let last: [number, number] | null = null

  ranges.forEach(function (r) {
    if (!last || r[0] > last[1]) result.push((last = r))
    else if (r[1] > last[1]) last[1] = r[1]
  })

  return result
}
