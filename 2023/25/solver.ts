export const solver: Solver = (inputStr) => {
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

  let str = ''

  for (const node of Object.values(graph)) {
    for (const connection of node.connections) {
      console.log(connection)
      str += `${node.name} -- ${connection}\n`
    }
  }

  console.log(str)

  const filtered = Object.values(graph).filter((node) => node.connections.size === 1)
  console.log(filtered)
  console.log(graph)
}

type Node = {
  name: string
  connections: Set<string>
}
