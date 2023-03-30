import { AlgorithmFluff, Grid, gridHelperFunctions } from '../App'

export const bfs = (props: AlgorithmFluff) => {
    const gridSize = props.size
    const startingPoint = props.startingPoint
    const endingPoint = props.endingPoint
    const visited: Set<number> = new Set()
    const q = []
    q.push(startingPoint)
    const neighbours = (cellId: number): number[] => {
        const neighbours: number[] = []
        const [row, col] = gridHelperFunctions.cellIdToCoordinate(cellId, props.columns)
        if (row - 1 >= 0) {
            neighbours.push(gridHelperFunctions.coordinateToCellId([row - 1, col], props.columns))
        }
        if (col + 1 <= props.columns - 1) {
            neighbours.push(gridHelperFunctions.coordinateToCellId([row, col + 1], props.columns))
        }
        if (row + 1 <= props.rows - 1) {
            neighbours.push(gridHelperFunctions.coordinateToCellId([row + 1, col], props.columns))
        }
        if (col - 1 >= 0) {
            neighbours.push(gridHelperFunctions.coordinateToCellId([row, col - 1], props.columns))
        }
        return neighbours
    }
    const cellIsValid = (cellId: number) => {
        const [row, col] = gridHelperFunctions.cellIdToCoordinate(cellId, props.columns)
        if (
            col > props.columns - 1 ||
            row > props.rows - 1 ||
            col < 0 ||
            row < 0 ||
            visited.has(cellId) ||
            props.unavailableCells.includes(cellId)
        )
            return false
        return true
    }
    while (q.length >= 1) {
        let currCell = q.shift()
        if (currCell === undefined) break
        if (currCell === endingPoint) {
            break
        }
        visited.add(currCell)
        const neighbouringCells = neighbours(currCell)
        for (let cell of neighbouringCells) {
            if (cellIsValid(cell) === true) {
                q.push(cell)
            }
        }
    }

    visited.delete(startingPoint)
    return visited
}
