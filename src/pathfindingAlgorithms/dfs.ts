import { AlgorithmArgs, AlgorithmRetrunValue, gridHelperFunctions } from '../App'

export const dfs = (props: AlgorithmArgs): AlgorithmRetrunValue => {
    const visited: Set<number> = new Set()
    const gridSize = props.size
    const endingCoordinates = gridHelperFunctions.cellIdToCoordinate(props.endingPoint, props.columns)
    const startingCoordinates = gridHelperFunctions.cellIdToCoordinate(props.startingPoint, props.columns)

    const search = (currValueInCoordinates: [number, number]): boolean => {
        const [row, col] = currValueInCoordinates
        const currCellId = gridHelperFunctions.coordinateToCellId([row, col], props.columns)
        if (
            col >= props.columns ||
            row >= props.rows ||
            col < 0 ||
            row < 0 ||
            props.unavailableCells.includes(currCellId) ||
            visited.has(currCellId)
        )
            return false
        if (currCellId === undefined) {
            console.log('currCellId unavaialbe in dfs. This should no be possible')
            return false
        }
        if (currCellId === props.endingPoint) return true
        // if (grid.cell[currCellId].cellType === 'end') return true

        visited.add(currCellId)
        // changeCellVisitedStatus(currCellId)
        return search([row + 1, col]) || search([row - 1, col]) || search([row, col + 1]) || search([row, col - 1])
    }
    const res = search(startingCoordinates)
    console.log('result from dfs', res)
    visited.delete(props.startingPoint)
    return { allTakedPath: visited }
}
