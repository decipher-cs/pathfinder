import { Cell, Grid } from '../types'

export const dfs = (grid: Grid): number[] => {
    const stack: Cell[] = []
    const startCell = grid.find(cell => cell.type === 'start')
    const finishCell = grid.find(cell => cell.type === 'finish')
    const pathsTried = new Set<number>()

    if (!startCell || !finishCell) throw new Error('Start or finish cell not found')

    stack.push(startCell)

    while (stack.length > 0) {
        const currentCell = stack.pop()

        if (!currentCell) continue

        currentCell.visitedStatus = 'visited'
        pathsTried.add(currentCell.index)

        if (currentCell.type === 'finish') break

        // helper function to return adjacent cells
        const neighbors = getNeighbors(currentCell, grid)

        for (const neighbor of neighbors) {
            if (neighbor.visitedStatus === 'unvisited' && neighbor.type !== 'close') {
                stack.push(neighbor)
            }
        }
    }

    return Array.from(pathsTried)
}

function getNeighbors(cell: Cell, grid: Grid): Cell[] {
    const [x, y] = cell.coordinates
    const neighbors: Cell[] = []

    const directions: [number, number][] = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ] // Up, Down, Left, Right

    for (const [dx, dy] of directions) {
        const newX = x + dx
        const newY = y + dy
        const neighbor = grid.find(cell => cell.coordinates[0] === newX && cell.coordinates[1] === newY)

        if (neighbor) {
            neighbors.push(neighbor)
        }
    }

    return neighbors
}
