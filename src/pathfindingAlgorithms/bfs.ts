import { Grid, gridHelperFunctions } from '../App'

export const bfs = (grid: Grid, changeCellVisitedStatus: (id: number) => void, resetGlobalTimeoutTimer: () => void) => {
    const gridSize = grid.properties.size
    const startingPoint = gridHelperFunctions(grid).getStartingCellId()
    const endingPoint = gridHelperFunctions(grid).getEndingCellId()
    const visited: Set<number> = new Set()
    const q = []
    q.push(startingPoint)

    const neighbours = (cellId: number): number[] => {
        const neighbours = []
        const [row, col] = gridHelperFunctions(grid).cellIdToCoordinate(cellId)
        neighbours.push(gridHelperFunctions(grid).coordinateToCellId([row - 1, col]))
        neighbours.push(gridHelperFunctions(grid).coordinateToCellId([row, col + 1]))
        neighbours.push(gridHelperFunctions(grid).coordinateToCellId([row + 1, col]))
        neighbours.push(gridHelperFunctions(grid).coordinateToCellId([row, col - 1]))
        return neighbours
    }
    const cellIsValid = (cellId: number) => {
        const [row, col] = gridHelperFunctions(grid).cellIdToCoordinate(cellId)
        if (
            col >= grid.properties.columns ||
            row >= grid.properties.rows ||
            col < 0 ||
            row < 0 ||
            visited.has(cellId) ||
            grid.cell[cellId].cellType === 'close'
        )
            return false
        return true
    }

    while (q.length >= 1) {
        let currCell = q.shift()
        if (currCell === undefined) break
        if (cellIsValid(currCell) === true) {
            changeCellVisitedStatus(currCell)
            visited.add(currCell)
            if (grid.cell[currCell].cellType === 'end') {
                console.log('found', currCell, grid.cell[currCell].cellCoordinates)
                return true
            }
            const nodes = neighbours(currCell)
            for (let node of nodes) {
                q.push(node)
            }
        }
    }
    return false
}
