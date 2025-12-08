import { parseNumber, result, splitLines } from '../../shared/utils'

interface Junction {
  id: string
  x: number
  y: number
  z: number
  connections: Set<string>
  distances: Map<string, number>
}

export const solver1: Solver = (inputStr) => {
  const ids = new Set<string>()
  const unconnectedJunctions = splitLines(inputStr).map((line): Junction => {
    const [x, y, z] = line.split(',').map(parseNumber)
    ids.add(line)
    return { x, y, z, id: line, connections: new Set(), distances: new Map() }
  })

  let calculatedDistances = new Set<string>()
  const distances: [number, string, string][] = []

  unconnectedJunctions.map((junction) => {
    for (const otherJunction of unconnectedJunctions) {
      if (junction.id === otherJunction.id) continue
      const distance = euclideanDistance(junction, otherJunction)
      junction.distances.set(otherJunction.id, distance)
      const comboId = [junction.id, otherJunction.id].sort().join('|')
      if (calculatedDistances.has(comboId)) continue
      calculatedDistances.add(comboId)
      distances.push([distance, junction.id, otherJunction.id])
    }
  })

  const circuts: string[][] = []
  const circuitIndices: Record<string, number> = {}

  distances.sort((a, b) => a[0] - b[0])

  for (const [distance, idA, idB] of distances.slice(0, 1000)) {
    ids.delete(idA)
    ids.delete(idB)
    const aIndex = circuitIndices[idA]
    const bIndex = circuitIndices[idB]

    if (aIndex === undefined && bIndex === undefined) {
      const newCircuitIndex = circuts.length
      circuts.push([idA, idB])
      circuitIndices[idA] = newCircuitIndex
      circuitIndices[idB] = newCircuitIndex
      continue
    }
    if (aIndex !== undefined && bIndex === undefined) {
      circuts[aIndex].push(idB)
      circuitIndices[idB] = aIndex
      continue
    }
    if (aIndex === undefined && bIndex !== undefined) {
      circuts[bIndex].push(idA)
      circuitIndices[idA] = bIndex
      continue
    }

    if (aIndex === bIndex) {
      // already connected
      continue
    }

    // MErge circuits
    const circuitA = circuts[aIndex]
    const circuitB = circuts[bIndex]

    const newCircuit = circuitB.concat(circuitA)
    circuts[bIndex] = newCircuit
    for (const id of circuitA) {
      circuitIndices[id] = bIndex
    }
    circuts[aIndex] = []
  }

  const part1 = circuts
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)
    .reduce((sum, circuit) => sum * circuit.length, 1)

  // 8379 not
  result(1, part1)
}

export const solver2: Solver = (inputStr) => {
  const ids = new Set<string>()
  const unconnectedJunctions = splitLines(inputStr).map((line): Junction => {
    const [x, y, z] = line.split(',').map(parseNumber)
    ids.add(line)
    return { x, y, z, id: line, connections: new Set(), distances: new Map() }
  })

  let calculatedDistances = new Set<string>()
  const distances: [number, string, string][] = []

  unconnectedJunctions.map((junction) => {
    for (const otherJunction of unconnectedJunctions) {
      if (junction.id === otherJunction.id) continue
      const distance = euclideanDistance(junction, otherJunction)
      junction.distances.set(otherJunction.id, distance)
      const comboId = [junction.id, otherJunction.id].sort().join('|')
      if (calculatedDistances.has(comboId)) continue
      calculatedDistances.add(comboId)
      distances.push([distance, junction.id, otherJunction.id])
    }
  })

  const circuts: string[][] = []
  const circuitIndices: Record<string, number> = {}

  distances.sort((a, b) => a[0] - b[0])

  let lastProcessed: string[] = []

  for (const [distance, idA, idB] of distances) {
    if (ids.size === 0) {
      break
    }
    ids.delete(idA)
    ids.delete(idB)
    lastProcessed = [idA, idB]
    const aIndex = circuitIndices[idA]
    const bIndex = circuitIndices[idB]

    if (aIndex === undefined && bIndex === undefined) {
      const newCircuitIndex = circuts.length
      circuts.push([idA, idB])
      circuitIndices[idA] = newCircuitIndex
      circuitIndices[idB] = newCircuitIndex
      continue
    }
    if (aIndex !== undefined && bIndex === undefined) {
      circuts[aIndex].push(idB)
      circuitIndices[idB] = aIndex
      continue
    }
    if (aIndex === undefined && bIndex !== undefined) {
      circuts[bIndex].push(idA)
      circuitIndices[idA] = bIndex
      continue
    }

    if (aIndex === bIndex) {
      // already connected
      continue
    }

    // MErge circuits
    const circuitA = circuts[aIndex]
    const circuitB = circuts[bIndex]

    const newCircuit = circuitB.concat(circuitA)
    circuts[bIndex] = newCircuit
    for (const id of circuitA) {
      circuitIndices[id] = bIndex
    }
    circuts[aIndex] = []
  }

  result(
    2,
    lastProcessed.map((id) => id.split(',').map(parseNumber)).reduce((sum, coord) => sum * coord[0], 1)
  )
}

function euclideanDistance(a: Junction, b: Junction): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2))
}
