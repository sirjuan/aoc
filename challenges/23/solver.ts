import { result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  const nodes: Record<string, Node> = {}
  const pairs: Node[][] = []

  inputStr.split('\n').forEach((line) => {
    const [n1, n2] = line.split('-')
    const node1 = nodes[n1] ?? new Node(n1)
    const node2 = nodes[n2] ?? new Node(n2)
    nodes[n1] = node1
    nodes[n2] = node2
    node1.addNeighbor(node2)
    node2.addNeighbor(node1)
    pairs.push([node1, node2])
  })

  const triplets = new Set<string>()

  for (const [node1, node2] of pairs) {
    for (const neighbor of node1.neighbors) {
      if (neighbor === node2) {
        continue
      }

      if (node2.hasNeighbor(neighbor)) {
        if ([node1, node2, neighbor].some((node) => node.name.startsWith('t'))) {
          triplets.add(stringify(node1, node2, neighbor))
        }
      }
    }
  }

  result(1, triplets.size)

  const interconnected: string[] = []

  for (const node of Object.values(nodes)) {
    let connections = Array.from(node.neighbors).concat(node)
    const queue = Array.from(node.neighbors)
    const processed = new Set<Node>()

    while (queue.length) {
      const current = queue.pop()!
      for (const neighbor of current.neighbors) {
        if (neighbor === node || processed.has(neighbor) || !connections.includes(neighbor)) {
          continue
        }
        processed.add(neighbor)
        connections = connections.filter((connection) => connection === neighbor || neighbor.hasNeighbor(connection))
        queue.push(neighbor)
      }
    }

    interconnected.push(stringify(...connections))
  }

  result(2, interconnected.sort((a, b) => b.length - a.length)[0])
}

class Node {
  neighbors = new Set<Node>()

  constructor(public name: string) {
    this.name = name
  }

  addNeighbor(node: Node) {
    this.neighbors.add(node)
  }

  hasNeighbor(node: Node) {
    return this.neighbors.has(node)
  }
}

function stringify(...nodes: Node[]) {
  return nodes
    .map((node) => node.name)
    .sort((a, b) => a.localeCompare(b))
    .join(',')
}
