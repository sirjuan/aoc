import _ from 'lodash'
import { parseNumber, last, splitLines, toRecord, repeat } from '../../shared/utils'

export function solver(inputStr: string) {
  function addFlow(graph, openValves) {
    let sum = 0
    for (const key in openValves) {
      sum += graph[key].flowRate
    }
    return sum
  }

  // part1()

  // function part1() {
  //   const time = 30 //minutes
  //   const graph = getInput()
  //   console.log('parsed ✅')

  //   const queue = []
  //   const root = { node: 'AA', time, flowRate: 0, openValves: {} }
  //   queue.push(root)

  //   let maxFlow = 0

  //   while (queue.length > 0) {
  //     const current = queue.shift()

  //     if (current.time <= 0) {
  //       throw new Error('should not happen')
  //     }
  //     // Moving to another valve **that can be opened**
  //     const options = Object.values(graph).filter(
  //       (valve) => valve.flowRate > 0 && !current.openValves[valve.id]
  //     )

  //     if (options.length === 0) {
  //       // End condition
  //       const ending = current.flowRate + current.time * addFlow(graph, current.openValves)
  //       maxFlow = Math.max(maxFlow, ending)
  //     }
  //     for (const { id } of options) {
  //       // Move AND open the valve
  //       const steps = graph[current.node].paths[id] + 1

  //       const nextTime = current.time - steps

  //       if (nextTime <= 0) {
  //         // End condition
  //         const ending = current.flowRate + current.time * addFlow(graph, current.openValves)
  //         maxFlow = Math.max(maxFlow, ending)
  //       } else {
  //         queue.push({
  //           node: id,
  //           time: nextTime,
  //           flowRate: current.flowRate + steps * addFlow(graph, current.openValves),
  //           openValves: { ...current.openValves, [id]: nextTime },
  //         })
  //       }
  //     }
  //   }

  //   console.log(maxFlow)
  // }

  part2()

  function part2() {
    const time = 26 //minutes
    const graph = getInput()
    console.log('parsed ✅')

    const queue = []
    const root = { node: 'AA', time, flowRate: 0, openValves: {} }
    queue.push(root)

    let maxFlow = 0
    const nodes = []

    while (queue.length > 0) {
      const current = queue.shift()

      if (current.time <= 0) {
        throw new Error('should not happen')
      }
      // Moving to another valve **that can be opened**
      const options = Object.values(graph).filter(
        (valve) => valve.flowRate > 0 && !current.openValves[valve.id]
      )

      if (options.length === 0) {
        // End condition
        const ending = current.flowRate + current.time * addFlow(graph, current.openValves)
        maxFlow = Math.max(maxFlow, ending)
      }
      for (const { id } of options) {
        // Move AND open the valve
        const steps = graph[current.node].paths[id] + 1

        const nextTime = current.time - steps

        if (nextTime <= 0) {
          // End condition
          const ending = current.flowRate + current.time * addFlow(graph, current.openValves)
          maxFlow = Math.max(maxFlow, ending)
        } else {
          nodes.push({
            node: id,
            time: nextTime,
            flowRate: current.flowRate + steps * addFlow(graph, current.openValves),
            openValves: { ...current.openValves, [id]: nextTime },
          })

          queue.push({
            node: id,
            time: nextTime,
            flowRate: current.flowRate + steps * addFlow(graph, current.openValves),
            openValves: { ...current.openValves, [id]: nextTime },
          })
        }
      }
    }

    const target = 1707
    console.log(maxFlow)
    console.log(target / maxFlow)
    console.log(maxFlow / target)
    console.log(target - maxFlow)

    console.log('Nodes', nodes.length)

    const validPairs = []
    const secondNodes = nodes.slice()

    let maxSum = 0

    while (nodes.length > 0) {
      const node1 = nodes.shift()
      if (nodes.length % 1000 === 0) {
        console.log(nodes.length, 'max', maxSum)
      }

      const firstEntries = Object.entries<number>(node1.openValves).sort(
        (a, b) => (b[1] as number) - (a[1] as number)
      )

      const first = firstEntries.map((i) => i[0])

      for (const node2 of secondNodes) {
        const secondEntries = Object.entries<number>(node2.openValves).sort(
          (a, b) => (b[1] as number) - (a[1] as number)
        )
        const second = secondEntries.map((i) => i[0])

        const int = _.intersection(first, second)

        if (int.length === 0) {
          const firstFlow = countFlow(graph, Object.fromEntries(firstEntries))
          const secondFlow = countFlow(graph, Object.fromEntries(secondEntries))
          maxSum = Math.max(maxSum, firstFlow + secondFlow)
        }
      }
    }

    // console.log('Valid pairs', validPairs.length)

    // const maxSum = validPairs.reduce((max, pair) => {
    //   const [first, second] = pair
    //   const firstEntries = Object.entries(first.openValves).slice(0, 4)
    //   const firstFlow = countFlow(graph, Object.fromEntries(firstEntries))
    //   const secondEntries = Object.entries(second.openValves).slice(0, 4)
    //   const secondFlow = countFlow(graph, Object.fromEntries(secondEntries))
    //   return Math.max(max, firstFlow + secondFlow)
    // }, 0)

    console.log({ maxSum })

    function countFlow(graph, openValves) {
      let sum = 0
      for (const [key, value] of Object.entries(openValves)) {
        sum += graph[key].flowRate * (value as number)
      }
      return sum
    }
  }

  // Return a new object to avoid side effects between part 1 and 2
  function getInput() {
    const array = splitLines(inputStr).map(parseValve)

    const graph = toRecord(array, 'id')

    for (const node of array) {
      bfs(graph, node)
    }

    return graph
  }

  function bfs(graph: Record<string, Valve>, root) {
    const queue = []
    root.paths = {}
    const explored = new Set()
    explored.add(root.id)
    queue.push(root)

    while (queue.length > 0) {
      const current = queue.shift()
      for (const valve of graph[current.id].adjacentTo) {
        if (!explored.has(valve)) {
          explored.add(valve)
          root.paths[valve] = (root.paths[current.id] || 0) + 1
          queue.push(graph[valve])
        }
      }
    }
  }

  type Valve = ReturnType<typeof parseValve>

  function parseValve(lineStr: string) {
    const [valve, rest] = lineStr.replace('Valve', '').split('has flow rate=')
    const [rateStr, pathStr] = rest.replace(/tunnels? leads? to valves?/, '').split(';')
    return {
      id: valve.trim(),
      flowRate: parseNumber(rateStr),
      adjacentTo: pathStr.trim().split(', '),
      paths: [],
    }
  }
}
