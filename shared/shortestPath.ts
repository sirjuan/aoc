import { PriorityQueue } from './queue'

export interface PathNode<T> {
  point: T
  previous: PathNode<T> | null
  cost: number
}

export function shortestPath<T>({
  initial,
  isTarget,
  edges,
  target: initialTarget = Infinity,
}: {
  initial: T
  isTarget: (node: PathNode<T>) => boolean
  edges: (node: PathNode<T>) => [T, number][]
  target?: number
}): PathNode<T>[] {
  const init: PathNode<T> = { point: initial, previous: null, cost: 0 }
  const nodes = new Map<T, PathNode<T>>()
  nodes.set(initial, init)
  const queue = new PriorityQueue({ initial: [init], comparator: (a, b) => a.cost - b.cost })
  const targets = new Set<PathNode<T>>()
  let target = initialTarget

  main: while (!queue.isEmpty()) {
    const current = queue.pop()

    for (const [point, distance] of edges(current)) {
      const newCost = current.cost + distance
      if (newCost > target) {
        continue
      }
      const newNode: PathNode<T> = { point, previous: current, cost: newCost }

      if (isTarget(newNode)) {
        if (newCost > target) {
          continue
        }
        targets.add(newNode)
        nodes.set(point, newNode)
        if (newCost < target) {
          target = newCost
        }
      }

      const existing = nodes.get(point)

      if (!existing || newCost <= existing.cost) {
        nodes.set(point, newNode)
        queue.push(newNode)
      }
    }
  }

  return [...targets].filter((node) => node.cost <= target).sort((a, b) => a.cost - b.cost)
}
