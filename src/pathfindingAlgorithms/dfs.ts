import { Grid } from '../App'

export const dfs = (
    grid: Grid,
    gridStartPoint: [number, number],
    gridEndPoint: [number, number],
    changeCellVisitedStatus: (id: number) => void,
    resetGlobalTimeoutTimer: () => void
) => {
    const visited: Set<number> = new Set()
    const gridSize = grid.properties.rows * grid.properties.columns

    const search = (currValueInCoordinates: [number, number]): boolean => {
        const [row, col] = currValueInCoordinates
        const currCellId = grid.helperFunctions.coordinateToCellId([row, col])
        if (
            col >= grid.properties.columns ||
            row >= grid.properties.rows ||
            col < 0 ||
            row < 0 ||
            visited.has(currCellId)
        )
            return false
        if (grid.cell[currCellId]?.cellType === undefined || grid.cell[currCellId].cellType === 'close') {
            visited.add(currCellId)
            return false
        }
        if (grid.cell[currCellId].cellType === 'end') return true

        visited.add(currCellId)
        changeCellVisitedStatus(currCellId)
        return search([row + 1, col]) || search([row - 1, col]) || search([row, col + 1]) || search([row, col - 1])
    }
    resetGlobalTimeoutTimer()
    return search(gridStartPoint)
}
