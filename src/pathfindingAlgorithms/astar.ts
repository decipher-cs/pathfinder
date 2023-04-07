import { AlgorithmArgs, AlgorithmRetrunValue, gridHelperFunctions } from '../App'

export const astart = (props: AlgorithmArgs): AlgorithmRetrunValue => {
    const gridSize = props.size
    const startingCellId = props.startingPoint
    const endingCellId = props.endingPoint
    const [endingCellRow, endingCellColumn] = gridHelperFunctions.cellIdToCoordinate(endingCellId, props.columns)
    const walls = props.unavailableCells

    const shortestPath: Set<number> = new Set()
    const parentNodes = new Map<number, number>()

    // f= g+h, h= heuristic cost, g=cost from starting node to current node
    const cost: Map<number, { f: number; g: number; h: number }> = new Map()
    const explored: Set<number> = new Set()
    const unexplored: Set<number> = new Set() // this should be a priority queue

    for (let cell = 0; cell <= gridSize - 1; cell++) {
        const max = Number.MAX_VALUE
        cost.set(cell, { f: max, g: max, h: max })
    }

    unexplored.add(startingCellId)
    cost.set(startingCellId, { f: 0, g: 0, h: 0 })

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
        if (col > props.columns - 1 || row > props.rows - 1 || col < 0 || row < 0 || walls.includes(cellId))
            return false
        return true
    }

    const cellWithLeastF = () => {
        let temoObj: { cellId: undefined | number; fCost: number } = { cellId: undefined, fCost: Infinity }
        for (const cell of unexplored) {
            const costs = cost.get(cell)
            if (costs === undefined) continue
            const { f, g, h } = costs
            if (f < temoObj.fCost) {
                temoObj.cellId = cell
                temoObj.fCost = f
            }
        }
        return temoObj
    }

    const getHeuristic = (cellId: number) => {
        const [row, col] = gridHelperFunctions.cellIdToCoordinate(cellId, props.columns)
        return Math.abs(endingCellRow - row) + Math.abs(endingCellColumn - col)
    }

    while (unexplored.size >= 1) {
        let currCell = cellWithLeastF().cellId

        if (currCell === undefined) throw 'what? check astart. Quick!'

        unexplored.delete(currCell)

        if (currCell === endingCellId) {
            console.log('found end cell at', currCell)
            break
        }

        explored.add(currCell)

        const neighbours = getNeighbours(currCell)
        const currCellCost = cost.get(currCell)
        if (currCellCost === undefined) throw 'check astart. this should not be possible'

        // variable name feels bad. maybe change it?
        const { f: cf, g: cg, h: ch } = currCellCost

        for (const neighbour of neighbours) {
            if (cellIsValid(neighbour) === false) continue
            if (explored.has(neighbour)) continue

            const nCost = cost.get(neighbour)
            if (nCost === undefined) throw 'check astart. this should not be possible'
            let { f: nf, g: ng, h: nh } = nCost

            if (cg + 1 < ng || !unexplored.has(neighbour)) {
                parentNodes.set(neighbour, currCell)

                nh = getHeuristic(neighbour)
                ng = cg + 1
                nf = nh + ng
                cost.set(neighbour, { g: ng, h: nh, f: nf })

                if (!unexplored.has(neighbour)) {
                    unexplored.add(neighbour)
                }
            }
        }
    }

    const getShortestPath = () => {
        let currCell = parentNodes.get(endingCellId)

        while (currCell !== startingCellId) {
            if (currCell === undefined) break
            shortestPath.add(currCell)
            currCell = parentNodes.get(currCell)
        }
    }

    explored.delete(startingCellId)
    getShortestPath()

    return {
        allTakedPath: explored,
        shortestPath: shortestPath,
    }
}
