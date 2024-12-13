import { PriorityQueue } from '../../shared/queue'
import { parseNumber, result } from '../../shared/utils'

export const solver1: Solver = (inputStr) => {
  const intRegex = /-?\d+/

  function getNumber(str: string) {
    return str.match(intRegex)!.map(parseNumber)[0]
  }

  let res = 0

  inputStr.split('\n\n').forEach((machine) => {
    const [buttonAStr, buttonBStr, targetStr] = machine.split('\n')
    const buttonADelta = buttonAStr.split(': ')[1].split(',').map(getNumber) as [number, number]
    const buttonBDelta = buttonBStr.split(': ')[1].split(',').map(getNumber) as [number, number]
    const [targetX, targetY] = targetStr.split(': ')[1].split(',').map(getNumber) as [number, number]

    const buttonA = { delta: buttonADelta, cost: 3 }
    const buttonB = { delta: buttonBDelta, cost: 1 }

    const target = `${targetX},${targetY}`

    const bail = (node: string) => {
      const coord = node.split(',').map(parseNumber) as [number, number]
      return coord[0] > targetX || coord[1] > targetY
    }

    const edges = (node: string) => {
      const coord = node.split(',').map(parseNumber) as [number, number]
      return [buttonA, buttonB].map((button) => {
        const newCoord = [coord[0] + button.delta[0], coord[1] + button.delta[1]] as [number, number]
        return [newCoord.join(','), button.cost] as const
      })
    }

    const isTarget = (node: string) => {
      return node === target
    }

    interface PathNode<T> {
      point: T
      previous: PathNode<T> | null
      distance: number
      counts: number[]
    }

    const init: PathNode<string> = { point: '0,0', previous: null, distance: 0, counts: [0, 0] }
    const nodes: Record<string, PathNode<string>> = {}
    nodes['0,0'] = init
    const queue = new PriorityQueue({ initial: [init], comparator: (a, b) => a.distance - b.distance })
    const targets = new Set<string>()

    while (!queue.isEmpty()) {
      const previous = queue.pop()

      if (bail(previous.point) || previous.counts.some((count) => count > 100)) {
        continue
      }

      for (const [index, [point, distance]] of edges(previous.point).entries()) {
        if (isTarget(point)) {
          targets.add(point)
        }

        const newDistance = previous.distance + distance
        const pointStr = JSON.stringify(point)
        if (!nodes[pointStr] || newDistance < previous.distance) {
          const counts = [...previous.counts]
          counts[index]++
          const newNode: PathNode<string> = { point, previous, distance: newDistance, counts }
          nodes[pointStr] = newNode
          queue.push(newNode)
        }
      }
    }

    const targetNode = [...targets]
      .map((target) => nodes[JSON.stringify(target)])
      .sort((a, b) => a.distance - b.distance)[0]

    res += targetNode?.distance ?? 0
  })

  result(1, res)
}

export const solver2: Solver = (inputStr) => {
  let res = 0
  const addition = 10000000000000

  inputStr.split('\n\n').forEach((machine) => {
    const [buttonAStr, buttonBStr, targetStr] = machine.split('\n')
    const buttonA = parseCoordinates(buttonAStr)
    const buttonB = parseCoordinates(buttonBStr)
    const target = parseCoordinates(targetStr, addition)

    // Equation 1:
    // acount * buttonA.x + bcount * buttonB.x = target.x
    // acount * ax = target.x - bcount * buttonB.x
    // acount = (target.x - bcount * buttonB.x) / buttonA.x
    // Equation 2:
    // acount * buttonA.y + bcount * buttonB.y = target.y
    // acount * ay = target.y - bcount * buttonB.y
    // acount = (target.y - bcount * buttonB.y) / buttonA.y
    // Combine:
    // (target.x - bcount * buttonB.x) / buttonA.x = (target.y - bcount * buttonB.y) / buttonA.y
    // Multiply both sides by buttonA.y * buttonA.x:
    // (target.x - bcount * buttonB.x) * buttonA.y = (target.y - bcount * buttonB.y) * buttonA.x
    // Solve:
    const acount = (target.x * buttonA.y - target.y * buttonA.x) / (buttonA.y * buttonB.x - buttonA.x * buttonB.y)
    const bcount = (target.x - acount * buttonB.x) / buttonA.x

    if (Number.isInteger(acount) && Number.isInteger(bcount)) {
      res += acount + 3 * bcount
    }
  })
  result(2, res)
}

function getNumber(str: string) {
  return str.match(/-?\d+/)!.map(parseNumber)[0]
}

function parseCoordinates(str: string, addition = 0) {
  const [x, y] = str.split(': ')[1].split(',').map(getNumber) as [number, number]
  return { x: x + addition, y: y + addition }
}
