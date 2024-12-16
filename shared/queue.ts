const topValue = 0
const parentNode = (i: number) => ((i + 1) >>> 1) - 1
const left = (i: number) => (i << 1) + 1
const right = (i: number) => (i + 1) << 1

export class PriorityQueue<T> {
  private heap: T[] = []
  private comparator: (a: T, b: T) => number

  constructor({ comparator, initial = [] }: { comparator: (a: T, b: T) => number; initial?: T[] }) {
    this.comparator = comparator
    this.heap = initial
  }

  public size() {
    return this.heap.length
  }

  public isEmpty() {
    return this.size() == 0
  }

  public peek() {
    return this.heap[topValue]
  }

  public push(...values: T[]) {
    values.forEach((value) => {
      this.heap.push(value)
      this.siftUp()
    })
    return this.size()
  }

  public pop() {
    const poppedValue = this.peek()
    const bottom = this.size() - 1
    if (bottom > topValue) {
      this.swap(topValue, bottom)
    }
    this.heap.pop()
    this.siftDown()
    return poppedValue
  }

  public replace(value: T) {
    const replacedValue = this.peek()
    this.heap[topValue] = value
    this.siftDown()
    return replacedValue
  }

  private greater(i: number, j: number) {
    return this.comparator(this.heap[i], this.heap[j])
  }

  private swap(i: number, j: number) {
    ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  private siftUp() {
    let node = this.size() - 1
    while (node > topValue && this.greater(node, parentNode(node))) {
      this.swap(node, parentNode(node))
      node = parentNode(node)
    }
  }

  private siftDown() {
    let node = topValue
    while (
      (left(node) < this.size() && this.greater(left(node), node)) ||
      (right(node) < this.size() && this.greater(right(node), node))
    ) {
      let maxChild = right(node) < this.size() && this.greater(right(node), left(node)) ? right(node) : left(node)
      this.swap(node, maxChild)
      node = maxChild
    }
  }

  slice(start = 0, end = this.size()) {
    return (this.heap = this.heap.slice(start, end))
  }
}
