import { parseNumber, result, splitLines, sum } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  result(1, sum(...splitLines(inputStr).map((sn) => calculateSecretNumbers(parseNumber(sn), 2000))))
}

export const solver2: Solver = (inputStr) => {
  const sequencePrices: Record<string, number> = {}

  splitLines(inputStr).forEach((snStr) => {
    const processed = new Set<string>()
    let changes: number[] = []
    let sn = parseNumber(snStr)
    let lastPrice = 0

    for (let i = 0; i < 2000; i++) {
      if (i > 0) {
        sn = calculateSecretNumber(sn)
      }
      const price = sn % 10
      changes.push(price - lastPrice)
      lastPrice = price
      const sequence = changes.slice(-4)
      if (sequence.length === 4) {
        // This is 100ms faster than using sequence.join(',')
        const key = sequence[0] + ',' + sequence[1] + ',' + sequence[2] + ',' + sequence[3]
        if (!processed.has(key)) {
          processed.add(key)
          sequencePrices[key] ??= 0
          sequencePrices[key] += price
        }
      }
    }
  })

  result(2, Math.max(...Object.values(sequencePrices)))
}

function calculateSecretNumbers(sn: number, count: number) {
  for (let i = 0; i < count; i++) {
    sn = calculateSecretNumber(sn)
  }
  return sn
}

function calculateSecretNumber(sn: number) {
  sn ^= sn * 64
  sn = sn >>> 0
  sn = sn % 16777216
  sn ^= Math.floor(sn / 32)
  sn = sn >>> 0
  sn = sn % 16777216
  sn ^= sn * 2048
  sn = sn >>> 0
  sn = sn % 16777216
  return sn
}
