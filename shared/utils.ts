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

export function result(part: number, value: number, expected?: number) {
  if (expected == null || value === expected) {
    console.log(`\nPart ${part}`.green, value, '\n')
    toClipboard(value)
  } else {
    console.error('Incorrect!'.bgRed, 'Expected', expected, 'but got', value)
    console.error('Diff:', expected - value)
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
