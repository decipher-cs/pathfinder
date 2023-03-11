import { Grid } from '../App'

const coordinateToCellId = (gridColumnSize: number, [row, col]: [number, number]) => row * gridColumnSize + col

export let dfs = (grid: Grid, gridStartPoint: [number, number], gridEndPoint: [number, number]) => {
    const visited: Set<number> = new Set()
    const gridSize = grid.properties.rows * grid.properties.columns

    const search = (currValue: [number, number]): boolean => {
        const [x, y] = currValue
        const currCellId = coordinateToCellId(grid.properties.columns, [y, x])
        if (
            grid.cell[currCellId]?.cellType === undefined ||
            grid.cell[currCellId].cellType === 'close' ||
            x >= grid.properties.columns ||
            y >= grid.properties.rows ||
            x < 0 ||
            y < 0 ||
            visited.has(currCellId)
        ) {
            visited.add(currCellId)
            return false
        }
        if (grid.cell[currCellId].cellType === 'end') return true
        visited.add(currCellId)
        return search([x + 1, y]) || search([x - 1, y]) || search([x, y + 1]) || search([x, y - 1])
    }
    return search(gridStartPoint)
}
