import { PriorityQueue } from './queue'

export function shortestPath<T>({
  initial,
  isTarget,
  edges,
}: {
  initial: T
  isTarget: (node: T) => boolean
  edges: (node: T) => [T, number][]
}): T[] | null {
  interface PathNode<T> {
    point: T
    previous: PathNode<T> | null
    distance: number
  }

  const init: PathNode<T> = { point: initial, previous: null, distance: 0 }
  const nodes = new Map<T, PathNode<T>>()
  nodes.set(initial, init)
  const queue = new PriorityQueue({ initial: [init], comparator: (a, b) => a.distance - b.distance })
  const targets = new Set<T>()

  while (!queue.isEmpty()) {
    const previous = queue.pop()

    for (const [point, distance] of edges(previous.point)) {
      if (isTarget(point)) {
        targets.add(point)
      }

      const newDistance = previous.distance + distance
      if (!nodes.has(point) || newDistance < previous.distance) {
        const newNode: PathNode<T> = { point, previous, distance: newDistance }
        nodes.set(point, newNode)
        queue.push(newNode)
      }
    }
  }

  const targetNode = [...targets].map(nodes.get).sort((a, b) => a.distance - b.distance)[0]
  if (targetNode != null) {
    const result = []
    let node: PathNode<T> | null = targetNode
    while (node?.previous != null) {
      result.push(node.point)
      node = node.previous
    }
    return result.reverse()
  }
  return null
}
