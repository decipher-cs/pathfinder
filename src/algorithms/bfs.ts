import { Cell, Grid } from '../types'

// Define a type for a queue node
type QueueNode = {
    index: number
}

// Define a class for a queue
class Queue {
    nodes: QueueNode[]

    constructor() {
        this.nodes = []
    }

    enqueue(index: number) {
        this.nodes.push({ index })
    }

    dequeue() {
        return this.nodes.shift()
    }
}

// Define the BFS function
export function bfs(grid: Grid): number[] {
    // Initialize the visited nodes array
    let visitedNodes = new Set<number>()

    // Initialize the queue
    let queue = new Queue()

    // Find the start node
    let startNode = grid.find(cell => cell.type === 'start')
    if (!startNode) {
        throw new Error('Start node not found')
    }

    // Enqueue the start node
    queue.enqueue(startNode.index)

    while (queue.nodes.length) {
        let currentNode = queue.dequeue()

        if (currentNode) {
            let currentCell = grid[currentNode.index]

            // Mark the current node as visited
            visitedNodes.add(currentNode.index)
            currentCell.visitedStatus = 'visited'

            // If the current node is the finish node, break the loop
            if (currentCell.type === 'finish') {
                break
            }

            // Enqueue the unvisited neighbors
            let neighbors = getNeighbors(currentNode.index, grid)
            for (let neighbor of neighbors) {
                if (neighbor.visitedStatus === 'unvisited') {
                    queue.enqueue(neighbor.index)
                }
            }
        }
    }

    return Array.from(visitedNodes)
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
