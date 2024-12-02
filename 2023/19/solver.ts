import { parseNumber, result, sum } from '../../shared/utils'

const REJECTED = 'R'
const ACCEPTED = 'A'

export const solver: Solver = (inputStr) => {
  const [workflowStr, ratingsStr] = inputStr.split('\n\n')

  const parts = ratingsStr.split('\n').map((rating) => {
    let replaced: Record<string, number> = {}
    eval('replaced = ' + rating.replace(/[=]/g, ':'))
    return replaced
  })

  const workflows = workflowStr.split('\n').map((workflow) => {
    const [name, stepsStr] = workflow.replace('}', '').split('{')
    const steps = stepsStr.split(',').flatMap((step) => {
      const splitted = step.split(':')
      return splitted.length === 1
        ? { calc: undefined, ifTrue: splitted[0] }
        : { calc: splitted[0], ifTrue: splitted[1] }
    })
    return { name, steps }
  })

  const workflowsByName: Record<string, { calc: string | undefined; ifTrue: string }[]> = {}

  for (const workflow of workflows) {
    workflowsByName[workflow.name] = workflow.steps
  }

  const queue = parts.map((part) => ({ part, workflows: ['in'] }))

  let total = 0

  queueLoop: while (queue.length > 0) {
    const { part, workflows } = queue.shift()
    const workflow = workflows[workflows.length - 1]
    const workFlow = workflowsByName[workflow]

    workflowLoop: for (const step of workFlow) {
      function handleInstruction(instruction: string) {
        if (instruction === REJECTED) {
          return
        }
        if (instruction === ACCEPTED) {
          total += sum(...Object.values(part))
          return
        }

        queue.push({ part, workflows: [...workflows, instruction] })
      }

      if (!step.calc) {
        handleInstruction(step.ifTrue)
        continue queueLoop
      }

      const result: boolean = eval(replaceWhole(step.calc, part))

      if (result) {
        handleInstruction(step.ifTrue)
        continue queueLoop
      } else {
        continue workflowLoop
      }
    }
  }

  result(1, total, 333263)
}

export const solver2: Solver = (inputStr) => {
  const [workflowStr] = inputStr.split('\n\n')

  const workflows = workflowStr.split('\n').map((workflow) => {
    const [name, stepsStr] = workflow.replace('}', '').split('{')
    const steps = stepsStr.split(',').flatMap((step) => {
      const splitted = step.split(':')
      return splitted.length === 1
        ? { calc: undefined, ifTrue: splitted[0] }
        : { calc: splitted[0], ifTrue: splitted[1] }
    })
    return { name, steps }
  })

  const workflowsByName: Record<string, { calc: string | undefined; ifTrue: string }[]> = {}

  for (const workflow of workflows) {
    workflowsByName[workflow.name] = workflow.steps
  }

  let accepted = 0
  let rejected = 0

  const range: Record<string, [number, number]> = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  }

  const queue = [{ range, workflow: 'in', workFlowIndex: 0 }]

  queueLoop: while (queue.length > 0) {
    const { range, workflow: workflowName, workFlowIndex } = queue.pop()
    const workFlow = workflowsByName[workflowName]

    if (!workFlow) {
      throw new Error('No workflow found')
    }

    const step = workFlow[workFlowIndex]

    function handleInstruction(isTrue: boolean, r: typeof range) {
      if (!isTrue) {
        queue.push({ range: r, workflow: workflowName, workFlowIndex: workFlowIndex + 1 })
        return
      }

      const instruction = step.ifTrue

      if (instruction === REJECTED) {
        rejected += Object.values(r).reduce((acc, [a, b]) => acc * (b - a + 1), 1)
        return
      }

      if (instruction === ACCEPTED) {
        accepted += Object.values(r).reduce((acc, [a, b]) => acc * (b - a + 1), 1)
        return
      }

      queue.push({ range: r, workflow: instruction, workFlowIndex: 0 })
    }

    if (!step.calc) {
      handleInstruction(true, range)
      continue queueLoop
    }

    const comparator = step.calc.match(/[<>]/)?.[0]
    const [char, valueStr] = step.calc.split(comparator)
    const value = parseNumber(valueStr)

    const r = range[char]
    const first = r[0]
    const last = r[1]

    const lowerResult = eval(replace(step.calc, first))
    const upperResult = eval(replace(step.calc, last))

    if (lowerResult === upperResult) {
      handleInstruction(lowerResult, range)
      continue queueLoop
    }

    const splitValue = comparator === '<' ? value - 1 : value

    const lower = structuredClone(range)
    lower[char] = [first, splitValue]
    handleInstruction(lowerResult, lower)

    const upper = structuredClone(range)
    upper[char] = [splitValue + 1, last]
    handleInstruction(upperResult, upper)
  }

  if (accepted + rejected !== 4000 ** 4) {
    throw new Error('Wrong total')
  }

  result(2, accepted, 130745440937650)
}

function replace(str: string, n: number) {
  return str.replace(/[xmas]/g, n.toString())
}

function replaceWhole(str: string, obj: Record<string, number>) {
  for (const key in obj) {
    str = str.replace(key, obj[key].toString())
  }
  return str
}
