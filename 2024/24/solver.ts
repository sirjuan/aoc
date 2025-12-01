import { parseNumber, result, splitLines } from '../../shared/utils'
// import { writeFileSync } from 'fs'

export const solver: Solver = (inputStr) => {
  const dots: string[] = []
  const [inputsStr, gatesStr] = inputStr.split('\n\n')
  const values = Object.fromEntries(
    splitLines(inputsStr).map((line) => {
      const [key, value] = line.split(': ')
      dots.push(`${key} [label="${key}", shape=square];`)
      return [key, parseNumber(value)]
    })
  )

  const queue = splitLines(gatesStr)

  while (queue.length) {
    const gateStr = queue.shift()!
    const gate = Array.from(gateRegex.exec(gateStr))[2]

    const [inputs, output] = gateStr.split(' -> ').map((str) => str.trim())
    const [input1, input2] = inputs.split(gate).map((str) => str.trim())
    const value1 = values[input1]
    const value2 = values[input2]

    if (value1 === undefined || value2 === undefined) {
      queue.push(gateStr)
      continue
    }

    dots.push(`${input1} -> ${output};`)
    dots.push(`${input2} -> ${output};`)
    dots.push(`${output} [label="${gate} ${output}", fillcolor=${gateColors[gate]}, style=filled];`)
    if (output.startsWith('z')) {
      dots.push(`${output} -> ${output}out;`)
      dots.push(`${output}out [label="${output}", shape=square];`)
    }

    const newValue = gates[gate](value1, value2)
    values[output] = newValue
  }

  const bits: string[] = []

  Object.entries(values)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([key, value]) => {
      if (key.startsWith('z')) {
        bits.push(value.toString(2))
      }
    })

  const bitString = bits.reverse().join('')
  result(1, parseInt(bitString, 2))
  // createDigraph(dots)
  const swapped = ['vss', 'z14', 'z35', 'sgj', 'z31', 'kpp', 'kdh', 'hjf'].sort((a, b) => a.localeCompare(b)).join(',')
  result(2, swapped)
}

const gates = {
  AND: (a: number, b: number) => a & b,
  OR: (a: number, b: number) => a | b,
  XOR: (a: number, b: number) => a ^ b,
}

const gateColors = {
  AND: 'red',
  OR: 'green',
  XOR: 'yellow',
}

const gateRegex = /^(.+) (AND|OR|XOR) (.+)$/

// function createDigraph(gates: string[]) {
//   const dotStr = `digraph G {\n${gates.join('\n')}\n}`
//   writeFileSync('input.dot', dotStr)
// }
