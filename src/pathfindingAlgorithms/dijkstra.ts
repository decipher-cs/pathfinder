import { AlgorithmArgs, AlgorithmRetrunValue, gridHelperFunctions } from '../App'

export const dijkstra = (props: AlgorithmArgs): AlgorithmRetrunValue => {
    const gridSize = props.size
    const startingCellId = props.startingPoint
    const endingCellId = props.endingPoint

    const visited: Set<number> = new Set()
    const shortestPath: Set<number> = new Set()
    const distances = new Map<number, number>()
    const prevExploredCell = new Map<number, number | undefined>()
    const unexplored: Set<number> = new Set()

    for (let cell = 0; cell <= gridSize - 1; cell++) {
        distances.set(cell, Infinity)
        prevExploredCell.set(cell, undefined)
        unexplored.add(cell)
    }
    distances.set(startingCellId, 0)

    const getNeighbours = (cellId: number): number[] => {
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
            props.unavailableCells.includes(cellId)
        )
            return false
        return true
    }

    const getUnexploredCellWithLeastDist = () => {
        let leastDist: { cell: undefined | number; dist: number } = { cell: undefined, dist: Infinity }
        unexplored.forEach(cell => {
            const cellDist = distances.get(cell) as number
            if (cellDist < leastDist.dist) {
                leastDist.dist = cellDist
                leastDist.cell = cell
            }
        })
        return leastDist
    }

    while (unexplored.size > 0) {
        const exploringCell = getUnexploredCellWithLeastDist().cell
        if (exploringCell === undefined) {
            console.log('nothing found in dijkstra')
            break
        }

        visited.add(exploringCell)

        if (exploringCell === endingCellId) {
            console.log('found at', exploringCell)
            break
        }

        const neighbours = getNeighbours(exploringCell)
        const exploringCellDist = distances.get(exploringCell) as number

        for (const cell of neighbours) {
            if (cellIsValid(cell) === false) continue
            const cellDist = distances.get(cell) as number
            if (cellDist > exploringCellDist + 1) {
                distances.set(cell, exploringCellDist + 1)
                prevExploredCell.set(cell, exploringCell)
            }
        }

        unexplored.delete(exploringCell)
    }

    const getShortestPath = () => {
        let currCell = prevExploredCell.get(endingCellId) 

        while (currCell !== startingCellId) {
            if (currCell === undefined) break
            shortestPath.add(currCell)
            currCell = prevExploredCell.get(currCell) 
        }
    }

    visited.delete(startingCellId)
    visited.delete(endingCellId)
    getShortestPath()
    console.log(shortestPath)
    return {
        allTakedPath: visited,
        shortestPath: shortestPath,
    }
}
