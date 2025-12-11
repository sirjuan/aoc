import { result, splitLines } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  result(1, countPaths('you', 'out', parseConnections(inputStr)))
}

export const solver2: Solver = (inputStr) => {
  const connections = parseConnections(inputStr)

  result(
    2,
    countPaths('svr', 'fft', connections) *
      countPaths('fft', 'dac', connections) *
      countPaths('dac', 'out', connections)
  )
}

function countPaths(start: string, target: string, conn: Record<string, Set<string>>): number {
  const memo: Record<string, number> = {}

  function dfs(current: string): number {
    if (memo[current] !== undefined) {
      return memo[current]
    }

    if (current === target) {
      return 1
    }

    let totalPaths = 0

    conn[current]?.forEach((next) => {
      totalPaths += dfs(next)
    })

    memo[current] = totalPaths
    return totalPaths
  }

  return dfs(start)
}

function parseConnections(inputStr: string) {
  const conn: Record<string, Set<string>> = {}

  splitLines(inputStr).forEach((line) => {
    const [id, connStr] = line.split(': ')
    const connections = connStr.split(' ')
    conn[id] ??= new Set()
    connections.forEach((c) => {
      // Oneway connection
      conn[id].add(c)
    })
  })
  return conn
}
