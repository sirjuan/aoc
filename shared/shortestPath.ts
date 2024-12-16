import { PriorityQueue } from './queue'

interface PathNode<T> {
  point: T
  previous: PathNode<T> | null
  distance: number
}

export function shortestPath<T>({
  initial,
  isTarget,
  edges,
  multiple = false,
}: {
  initial: T
  isTarget: (node: T) => boolean
  edges: (node: T) => [T, number][]
  multiple?: boolean
}): PathNode<T>[] {
  const init: PathNode<T> = { point: initial, previous: null, distance: 0 }
  const nodes = new Map<T, PathNode<T>>()
  nodes.set(initial, init)
  const queue = new PriorityQueue({ initial: [init], comparator: (a, b) => a.distance - b.distance })
  const targets = new Set<PathNode<T>>()
  let target = Infinity

  main: while (!queue.isEmpty()) {
    const current = queue.pop()

    for (const [point, distance] of edges(current.point)) {
      const newDistance = current.distance + distance

      if (newDistance > target) {
        continue
      }

      const newNode: PathNode<T> = { point, previous: current, distance: newDistance }
      if (isTarget(point)) {
        if (newDistance > target) {
          break main
        }
        targets.add(newNode)
        if (!multiple) {
          break main
        }
        nodes.set(point, newNode)
        target = newDistance
      }

      const existing = nodes.get(point)

      if (!existing || newDistance <= existing.distance) {
        nodes.set(point, newNode)
        queue.push(newNode)
      }
    }
  }

  console.log('target', target)

  return [...targets].filter((node) => node.distance === target)
}
