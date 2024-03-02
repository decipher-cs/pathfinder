import {
    AlgorithmReturnType,
    Cell as CellWithoutCoordinates,
    Grid as GridWithoutCoordinates,
    GridWithCoordinates as Grid,
    CellWithCoordinates as Cell,
} from '../types'
import indexToCoordinates from './indexToCoordinates'

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
export function bfs(gridWithoutCoordinates: GridWithoutCoordinates, columns: number): AlgorithmReturnType {
    console.log('starting', gridWithoutCoordinates)
    const grid = gridWithoutCoordinates.map(cell => ({
        ...cell,
        coordinates: indexToCoordinates(cell.index, columns),
    })) satisfies Grid

    // Initialize the visited nodes array
    const visitedNodes = new Set<number>()

    // Initialize the queue
    const queue = new Queue()

    // Find the start node
    const startNode = grid.find(cell => cell.type === 'start')
    const endNode = grid.find(cell => cell.type === 'finish')

    if (!startNode || !endNode) {
        throw new Error('Start/ Finish node not found')
    }

    // Enqueue the start node
    queue.enqueue(startNode.index)

    while (queue.nodes.length) {
        const currentNode = queue.dequeue()
        console.log(queue.nodes.length, currentNode)

        if (!currentNode) continue

        const currentCell = grid[currentNode.index]

        visitedNodes.add(currentCell.index)

        if (currentCell.type === 'finish') break

        // Enqueue the unvisited neighbors
        const neighbors = getNeighbors(currentCell, grid)

        for (const neighbor of neighbors) {
            if (!visitedNodes.has(neighbor.index)) {
                queue.enqueue(neighbor.index)
            }
        }
    }
    console.log('done', visitedNodes )

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
