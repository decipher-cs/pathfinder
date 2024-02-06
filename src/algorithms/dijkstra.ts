import { AlgorithmReturnType, Cell, Grid } from '../types'

// Define a type for a priority queue node
type PriorityQueueNode = {
    index: number
    priority: number
}

// Define a class for a priority queue
class PriorityQueue {
    nodes: PriorityQueueNode[]

    constructor() {
        this.nodes = []
    }

    enqueue(index: number, priority: number) {
        this.nodes.push({ index, priority })
        this.nodes.sort((a, b) => a.priority - b.priority)
    }

    dequeue() {
        return this.nodes.shift()
    }
}

// Define the Dijkstra function
export function dijkstra(grid: Grid): AlgorithmReturnType {
    // Initialize the visited nodes array
    const visitedNodes = new Set<number>()

    // Initialize the distances array with Infinity
    const distances: number[] = Array(grid.length).fill(Infinity)

    // Initialize the priority queue
    let queue = new PriorityQueue()

    // Find the start node
    const startNode = grid.find(cell => cell.type === 'start')
    const endNode = grid.find(cell => cell.type === 'finish')

    if (!startNode || !endNode) {
        throw new Error('Start/ Finish node not found')
    }

    // Set the distance of the start node to 0
    distances[startNode.index] = 0

    // Enqueue the start node
    queue.enqueue(startNode.index, 0)

    while (queue.nodes.length) {
        const currentNode = queue.dequeue()

        if (!currentNode) continue

        const currentCell = grid[currentNode.index]

        // Mark the current node as visited
        visitedNodes.add(currentNode.index)

        // If the current node is the finish node, break the loop
        if (currentCell.type === 'finish') break

        // Calculate the tentative distances to the neighboring nodes
        const neighbors = getNeighbors(grid[currentNode.index], grid).filter(
            neighbor => !visitedNodes.has(neighbor.index),
        )

        for (const neighbor of neighbors) {
            const alt = distances[currentNode.index] + 1 // Assuming all edges have a weight of 1
            if (alt < distances[neighbor.index]) {
                distances[neighbor.index] = alt
                queue.enqueue(neighbor.index, alt)
            }
        }
    }

    return { pathTaken: Array.from(visitedNodes), shortestPath: null }
}

function getNeighbors(cell: Cell, grid: Grid): Cell[] {
    const [x, y] = cell.coordinates
    const neighbors: Cell[] = []

    const directions: [number, number][] = [
        [-1, 0], // left
        [1, 0], // right
        [0, -1], // up
        [0, 1], // down
    ]

    for (const [dx, dy] of directions) {
        const newX = x + dx
        const newY = y + dy
        const neighbor = grid.find(cell => cell.coordinates[0] === newX && cell.coordinates[1] === newY)

        if (neighbor) {
            neighbors.push(neighbor)
        }
    }

    return neighbors.filter(cell => cell.type !== 'close')
}
