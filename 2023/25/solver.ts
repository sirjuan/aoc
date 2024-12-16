import { writeFileSync } from 'fs'
import { result } from '../../shared/utils'

export const solver: Solver = (inputStr) => {
  writeFileSync('input.dot', generateDot(inputStr))

  const graph: Record<string, Node> = {}

  for (const line of inputStr.split('\n')) {
    const [name, connectionsStr] = line.split(': ')
    const connections = connectionsStr.split(' ')
    graph[name] ??= { name, connections: new Set() }
    for (const connection of connections) {
      graph[name].connections.add(connection)
      graph[connection] ??= { name: connection, connections: new Set() }
      graph[connection].connections.add(name)
    }
  }

  // obtained watching the graph in graphviz
  const severedConnections = [
    ['nvg', 'vfj'],
    ['sqh', 'jbz'],
    ['fch', 'fvh'],
  ]

  severedConnections.forEach(([node1, node2]) => {
    graph[node1].connections.delete(node2)
    graph[node2].connections.delete(node1)
  })

  const firstGroup = collectGroup(graph, Object.values(graph)[0])
  const secondGroup = collectGroup(graph, Object.values(graph).find((node) => !firstGroup.has(node.name))!)

  result(1, firstGroup.size * secondGroup.size)
}

function collectGroup(graph: Record<string, Node>, node: Node) {
  const group = new Set<string>()
  const queue = [node]
  while (queue.length) {
    const currentNode = queue.shift()!
    if (group.has(currentNode.name)) {
      continue
    }
    group.add(currentNode.name)
    queue.push(...Array.from(currentNode.connections).map((name) => graph[name]))
  }
  return group
}

function generateDot(inputStr: string) {
  const lines = inputStr.split('\n')
  let dot = 'digraph G {\n'

  lines.forEach((line) => {
    const [node, edges] = line.split(':')
    const trimmedNode = node.trim()
    const trimmedEdges = edges.trim().split(' ')

    trimmedEdges.forEach((edge) => {
      dot += `  ${trimmedNode} -> ${edge};\n`
    })
  })

  dot += '}'

  return dot
}

type Node = {
  name: string
  connections: Set<string>
}
