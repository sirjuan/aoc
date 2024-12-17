import { parseNumber, result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const [registersStr, programStr] = inputStr.trim().split('\n\n')
  const [a, b, c] = registersStr.split('\n').map((str) => parseNumber(str.split(': ')[1])) as [number, number, number]
  const program = programStr.split(': ')[1]

  result(1, solve([a, b, c], program).join(), '5,1,4,0,5,1,0,2,6')

  let states = [0]

  for (const value of program.split(',').map(parseNumber).reverse()) {
    const newStates = []
    for (const state of states) {
      let aVal = state * 8
      const current = aVal
      const reg: [number, number, number] = [aVal, b, c]
      while (aVal < current + 8) {
        reg[0] = aVal
        const out = solve(reg, program, true)
        if (out[0] === value) {
          newStates.push(aVal)
        }
        aVal++
      }
    }
    states = newStates
  }

  result(2, states.sort((a, b) => a - b)[0], 202322936867370)
}

function solve(registers: [number, number, number], programStr: string, part2 = false): number[] {
  const program = programStr.split(',').map(parseNumber)

  let pointer = 0
  const output: number[] = []

  const instructionsMap = {
    // The adv instruction (opcode 0) performs division. The numerator is the value in the A register.
    // The denominator is found by raising 2 to the power of the instruction's combo operand.
    // (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.)
    // The result of the division operation is truncated to an integer and then written to the A register.
    adv: (combo: number) => {
      registers[0] = Math.floor(registers[0] / 2 ** combo)
      return null
    },
    // The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand,
    // then stores the result in register B.
    bxl: (literal: number) => {
      registers[1] = registers[1] ^ literal
      return null
    },
    // The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only
    // its lowest 3 bits), then writes that value to the B register.
    bst: (combo: number) => {
      registers[1] = combo % 8
      return null
    },
    // The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero,
    // it jumps by setting the instruction pointer to the value of its literal operand; if this instruction jumps,
    // the instruction pointer is not increased by 2 after this instruction.
    jnz: (literal: number) => {
      if (registers[0] !== 0) {
        return literal - 2
      }
      return null
    },
    // The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B.
    // (For legacy reasons, this instruction reads an operand but ignores it.)
    bxc: () => {
      registers[1] = registers[1] ^ registers[2]
      return null
    },
    // The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value.
    // (If a program outputs multiple values, they are separated by commas.)
    out: (combo: number) => {
      output.push(combo & 7)
      return null
    },
    // The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register.
    // (The numerator is still read from the A register.)
    bdv: (combo: number) => {
      registers[1] = Math.floor(registers[0] / (1 << combo))
      return null
    },
    // The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register.
    // (The numerator is still read from the A register.)
    cdv: (combo: number) => {
      registers[2] = Math.floor(registers[0] / (1 << combo))
      return null
    },
  } satisfies Record<string, (a: number) => number | null>

  const instructions = Object.values(instructionsMap)

  function literalToCombo(combo: number) {
    // Combo operands 0 through 3 represent literal values 0 through 3.
    // Combo operand 4 represents the value of register A.
    // Combo operand 5 represents the value of register B.
    // Combo operand 6 represents the value of register C.
    // Combo operand 7 is reserved and will not appear in valid programs.
    return [0, 1, 2, 3, registers[0], registers[1], registers[2], Infinity][combo]
  }

  while (pointer < program.length) {
    const opcode = program[pointer]
    const literal = program[pointer + 1]

    const combo = literalToCombo(literal)
    const result = instructions[opcode](opcode === 1 ? literal : combo)

    if (typeof result === 'number') {
      pointer = result
    } else if (part2 && opcode === 3) {
      return output
    }

    pointer += 2
  }

  return output
}
