import { result, sum } from '../../shared/utils'

const ratings = {}

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

      const result: boolean = eval(replace(step.calc, part))

      if (result) {
        handleInstruction(step.ifTrue)
        continue queueLoop
      } else {
        continue workflowLoop
      }
    }
  }

  result(1, total)
}

const replace = (str: string, obj: Record<string, number>) => {
  for (const key in obj) {
    str = str.replace(key, obj[key].toString())
  }
  return str
}
