import { parseNumber, splitLines, sum } from '../../shared/utils'

export function solver(inputStr: string) {
  const time = 30 //minutes
  const blueprints = splitLines(inputStr).map(parseInput)

  type Item = {
    node: Type
    time: number
    productionRates: Record<Type, number>
    inventory: Record<Type, number>
    skipped: Type[]
  }

  const highestStates = blueprints.reduce<Record<number, number>>(
    (acc, cur) => ({ ...acc, [cur.id]: 0 }),
    {}
  )

  let deadEnds = 0

  console.time('Exection time')

  for (const blueprint of blueprints.slice(0, 3)) {
    console.log('Blueprint', blueprint)
    console.log('Start blueprint', blueprint.id)
    let count = 0

    const maxCounts: Record<Type, number> = {
      ore: Math.max(
        blueprint.costs.ore.ore,
        blueprint.costs.clay.ore,
        blueprint.costs.obsidian.ore,
        blueprint.costs.geode.ore
      ),
      clay: blueprint.costs.obsidian.clay,
      obsidian: blueprint.costs.geode.obsidian,
      geode: Infinity,
    }
    const queue: Item[] = [
      {
        node: 'ore',
        time,
        skipped: [],
        productionRates: {
          ore: 1,
          clay: 0,
          obsidian: 0,
          geode: 0,
        },
        inventory: {
          ore: 2,
          clay: 0,
          obsidian: 0,
          geode: 0,
        },
      },
    ]

    while (queue.length > 0) {
      const current = queue.pop()
      const graph = blueprint.costs
      const nextTime = current.time - 1

      count++

      if (count % 10_000_000 === 0) {
        console.log(
          'Blueprint',
          blueprint.id,
          'Next time',
          nextTime,
          'Queue size',
          queue.length,
          'Count',
          count,
          'Max geodes',
          highestStates[blueprint.id],
          'Dead ends',
          deadEnds
        )
      }

      if (current.time <= 0) {
        throw new Error('should not happen')
      }

      const canBuildGeode = Object.entries(blueprint.costs.geode).every(([type, cost = 0]) => {
        return cost <= current.inventory[type]
      })

      const currentMax = highestStates[blueprint.id]

      const cannotBuildMore =
        current.inventory.geode + current.productionRates.geode * current.time + T(current.time) <=
        currentMax + 1

      // console.log({ cannotBuildMore, current, highestStates })

      if (cannotBuildMore) {
        deadEnds++
      }

      if (nextTime <= 0 || cannotBuildMore) {
        // End condition
        const finalGeodeCount = current.inventory.geode + current.productionRates.geode ?? 0
        //  console.log({ current, finalGeodeCount, highestStates })
        highestStates[blueprint.id] = Math.max(highestStates[blueprint.id], finalGeodeCount)
        continue
      }

      // Always build geode if we can, ignore other branches
      if (canBuildGeode) {
        const inventory: Record<string, number> = Object.fromEntries(
          Object.entries(current.inventory).map(([type, count]) => {
            return [
              type as Type,
              count + current.productionRates[type] - (blueprint.costs.geode[type] ?? 0),
            ]
          })
        )
        const productionRates = { ...current.productionRates }
        productionRates.geode += 1
        const next: Item = {
          skipped: [],
          node: 'geode',
          time: nextTime,
          productionRates: productionRates,
          inventory,
        }
        queue.push(next)
        continue
      }

      const inventory: Record<string, number> = Object.fromEntries(
        Object.entries(current.inventory).map(([type, count]) => {
          return [type as Type, count + current.productionRates[type]]
        })
      )

      // Moving to another valve **that can be opened**
      let options = Object.entries(graph).filter(([nodeType, costs]) => {
        // console.log(nodeType, current.productionRates[nodeType], maxCounts[nodeType])
        return (
          current.productionRates[nodeType] <= maxCounts[nodeType] &&
          !current.skipped.includes(nodeType as Type) &&
          Object.entries(costs).every(([type, cost]) => {
            return cost <= current.inventory[type]
          })
        )
      })

      const next: Item = {
        ...current,
        time: current.time - 1,
        inventory,
        skipped: options.map((opt) => opt[0] as Type),
      }
      queue.push(next)

      // Build robot
      for (const [node, costs] of options) {
        // Move AND open the valve
        const newInventory: Record<string, number> = Object.fromEntries(
          Object.entries(current.inventory).map(([type, count]) => {
            return [type as Type, count + current.productionRates[type] - (costs[type] ?? 0)]
          })
        )

        const productionRates = { ...current.productionRates }
        productionRates[node] += 1
        const next: Item = {
          skipped: [],
          node: node as Type,
          time: nextTime,
          productionRates: productionRates,
          inventory: newInventory,
        }
        queue.push(next)
      }
    }
  }

  console.timeEnd('Exection time')

  const all = Object.entries(highestStates).map(([key, value]) => parseNumber(key) * value)

  console.log('HighestState', highestStates, sum(...all))
}

type Type = 'ore' | 'clay' | 'obsidian' | 'geode'

function T(t: number) {
  return (t - 1) * t
}

function parseInput(inputStr: string) {
  const [blueprintStr, ...costStrings] = inputStr
    .replace(/\./g, '')
    .split('Each')
    .map((str) => str.trim())

  const id = parseNumber(blueprintStr.replace('Blueprint ', '').replace(':', ''))

  const costs = costStrings.reduce<Record<Type, Partial<Record<Type, number>>>>(
    (acc, cur) => {
      const [type, costsStr] = cur.split(' robot costs ')

      const costMap = costsStr
        .split(' and ')
        .reduce<Partial<Record<Type, number>>>((map, costStr) => {
          const [amountStr, costType] = costStr.split(' ')
          map[costType] = parseNumber(amountStr)
          return map
        }, {})

      acc[type] = costMap

      return acc
    },
    {
      ore: {},
      clay: {},
      obsidian: {},
      geode: {},
    }
  )

  return { id, costs }
}
