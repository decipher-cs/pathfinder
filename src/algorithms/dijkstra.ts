import { Cell, Grid } from '../types'

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
export function dijkstra(grid: Grid): number[] {
    // Initialize the visited nodes array
    let visitedNodes: number[] = []

    // Initialize the distances array with Infinity
    let distances: number[] = Array(grid.length).fill(Infinity)

    // Initialize the priority queue
    let queue = new PriorityQueue()

    // Find the start node
    let startNode = grid.find(cell => cell.type === 'start')
    if (!startNode) {
        throw new Error('Start node not found')
    }

    // Set the distance of the start node to 0
    distances[startNode.index] = 0

    // Enqueue the start node
    queue.enqueue(startNode.index, 0)

    while (queue.nodes.length) {
        let currentNode = queue.dequeue()

        if (currentNode) {
            let currentCell = grid[currentNode.index]

            // Mark the current node as visited
            visitedNodes.push(currentNode.index)
            currentCell.visitedStatus = 'visited'

            // If the current node is the finish node, break the loop
            if (currentCell.type === 'finish') {
                break
            }

            // Calculate the tentative distances to the neighboring nodes
            let neighbors = getNeighbors(currentNode.index, grid)
            for (let neighbor of neighbors) {
                let alt = distances[currentNode.index] + 1 // Assuming all edges have a weight of 1
                if (alt < distances[neighbor.index]) {
                    distances[neighbor.index] = alt
                    queue.enqueue(neighbor.index, alt)
                }
            }
        }
    }

    return visitedNodes
}

// Define a function to get the neighbors of a node
function getNeighbors(index: number, grid: Grid): Cell[] {
    // Assuming the grid is a square grid
    let size = Math.sqrt(grid.length)
    let neighbors: Cell[] = []

    // Up
    if (index >= size) {
        neighbors.push(grid[index - size])
    }

    // Down
    if (index < grid.length - size) {
        neighbors.push(grid[index + size])
    }

    // Left
    if (index % size !== 0) {
        neighbors.push(grid[index - 1])
    }

    // Right
    if (index % size !== size - 1) {
        neighbors.push(grid[index + 1])
    }

    return neighbors.filter(cell => cell.type !== 'close' && cell.visitedStatus === 'unvisited')
}
