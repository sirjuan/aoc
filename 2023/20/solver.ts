import { first } from 'lodash'
import { multiply, result } from '../../shared/utils'

type Type = ReturnType<typeof getType>

export const solver1: Solver = (inputStr) => {
  // Flip-flop modules (prefix %) are either on or off; they are initially off.
  const flipFlops: Record<string, boolean> = {}

  const destinationArr = inputStr.split('\n').map((line): { type: Type; name: string; destinations: string[] } => {
    const [nameWithType, destinationStr] = line.split(' -> ')
    const destinations = destinationStr.split(', ')
    const type = getType(nameWithType) as Type

    const name = nameWithType.replace(/[%&]/, '').trim()

    if (type === 'flipflop') {
      flipFlops[name] = false
    }

    return { type, name, destinations }
  })

  const sources: Record<string, string[]> = {}
  const processors: Record<string, (typeof destinationArr)[number]> = {}
  for (const item of destinationArr) {
    processors[item.name] = item
    for (const destination of item.destinations) {
      sources[destination] ??= []
      sources[destination].push(item.name)
    }
  }

  const cycles: Record<string, number> = {}
  for (const targetNode of sources.rx.flatMap((source) => sources[source])) {
    cycles[targetNode] = 0
  }

  // Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their
  // connected input modules; they initially default to remembering a low pulse for each input.
  const conjunctions: Record<string, Record<string, number>> = {}
  for (const dest of destinationArr) {
    for (const destination of dest.destinations) {
      const processor = processors[destination]
      if (processor?.type === 'conjunction') {
        conjunctions[processor.name] ??= {}
        conjunctions[processor.name][dest.name] = 0
      }
    }
  }

  const counts = [0, 0]

  let buttonPress = 1

  while (multiply(...Object.values(cycles)) === 0) {
    const broadcaster = destinationArr.find((item) => item.type === 'broadcaster')
    const firstPulse = { ...broadcaster, pulse: 0, from: 'button' }
    const pulses = [firstPulse]

    while (pulses.length) {
      const { from, type, name, destinations, pulse: pulse } = pulses.shift()!

      if (buttonPress <= 1000) {
        counts[pulse]++
      }

      if (cycles.hasOwnProperty(name)) {
        if (pulse === 0) {
          // The final machine responsible for moving the sand down to Island Island has a module attached named rx.
          // The machine turns on when a single low pulse is sent to rx.
          // All targets are conjunctions that lead to conjunction that lead to rx
          // 0 -> 1 -> 0
          // define cycles of each target
          cycles[name] = buttonPress
        }
      }

      // There is a single broadcast module (named broadcaster). When it receives a pulse, it sends the same pulse to all of its destination modules.
      if (type === 'broadcaster') {
        for (const destinationName of destinations) {
          const destination = processors[destinationName]
          pulses.push({ ...destination, pulse: pulse, from: name })
        }
        continue
      }

      if (type === 'flipflop') {
        // If a flip-flop module receives a high pulse, it is ignored and nothing happens.
        if (pulse === 1) {
          continue
        }

        const isOn = flipFlops[name]
        // However, if a flip-flop module receives a low pulse, it flips between on and off.
        flipFlops[name] = !isOn
        // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
        const newType = isOn ? 0 : 1

        // console.log(isOn, newType)
        for (const destinationName of destinations) {
          const destination = processors[destinationName]
          pulses.push({ ...destination, pulse: newType, from: name })
        }
        continue
      }

      if (type === 'conjunction') {
        // When a pulse is received, the conjunction module first updates its memory for that input.
        conjunctions[name][from] = pulse

        // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
        const newPulseType = Object.values(conjunctions[name]).every((pulse) => pulse === 1) ? 0 : 1
        for (const destinationName of destinations) {
          const destination = processors[destinationName]
          pulses.push({ ...destination, pulse: newPulseType, from: name })
        }

        continue
      }
    }
    buttonPress++
  }

  result(1, multiply(...counts), 949764474)
  result(2, multiply(...Object.values(cycles)), 243221023462303)
}

function getType(name: string) {
  if (name.includes('%')) return 'flipflop'
  if (name.includes('&')) return 'conjunction'
  return 'broadcaster'
}
