import { Box, Paper, Button, Chip, Container } from '@mui/material'
import { cloneDeep } from 'lodash'
import { useReducer, useRef, useState } from 'react'
import './index.css'
import GridCell from './components/GridCell'
import { dfs } from './pathfindingAlgorithms/dfs'
import { SpringProps, SpringRef, SpringValue, useSpring, useSprings } from '@react-spring/web'
import { bfs } from './pathfindingAlgorithms/bfs'

export type CellType = 'open' | 'close' | 'start' | 'end'

export interface Cell {
    cellId: number
    cellCoordinates: [number, number]
    cellType: CellType
    cellVisited: boolean
}

// export interface GridHelperFuntions {
//     coordinateToCellId: ([row, col]: [number, number]) => number
//     cellIdToCoordinate: (cellId: number) => [number, number]
//     getStartingCellId: any
//     getEndingCellId: () => Cell['cellId']
//     getStartingCellCoordinates: () => [number, number] | number
//     getEndingCellCoordinates: () => [number, number] | number
// }

export interface GridProperties {
    rows: number
    columns: number
    size: number
}

export interface Grid {
    cell: { [key: string | number]: Cell }
    properties: GridProperties
    // helperFunctions: GridHelperFuntions
}

export type CellReducerActions = {
    type:
        | 'changeCellType'
        | 'changeCellVisitedStatusToTrue'
        | 'flipCellOpenCloseStatus'
        | 'hardResetAllGrid'
        | 'resetVisitedCell'
        | 'changeCellTypeToStart'
        | 'changeCellTypeToEnd'
    payload?: {
        cellId: number // This is the id that corresponds to cellCoordinates. Ex. <0,0> = id: 0, <0,1> = id: 1 ...
        newCellType?: CellType
        newCellVisitedStatus?: boolean
    }
}

export const gridHelperFunctions = (grid: Grid) => {
    const { rows, columns, size } = grid.properties
    let coordinateToCellId = ([row, col]: [number, number]) => row * columns + col
    let cellIdToCoordinate = (id: number) => [Math.floor(id / columns), id % columns]
    let getEndingCellId = () => {
        for (const key in grid.cell) {
            if (grid.cell[key].cellType === 'end') return Number(key)
        }
        return Infinity
    }
    let getStartingCellId = () => {
        for (const key in grid.cell) {
            if (grid.cell[key].cellType === 'start') return Number(key)
        }
        return Infinity
    }
    let getStartingCellCoordinates = () => grid.cell[getStartingCellId()].cellCoordinates

    let getEndingCellCoordinates = () => grid.cell[getEndingCellId()].cellCoordinates

    return {
        coordinateToCellId,
        cellIdToCoordinate,
        getEndingCellId,
        getStartingCellId,
        getStartingCellCoordinates,
        getEndingCellCoordinates,
    }
}

const gridConstructor = (m: number, n: number): Grid => {
    let grid: Grid = Object()
    grid.properties = {
        rows: m,
        columns: n,
        size: m * n,
    }
    const cell: Grid['cell'] = {}
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            let currCoordinate = row * n + col
            cell[currCoordinate] = {
                cellId: Number(currCoordinate),
                cellCoordinates: [row, col],
                cellType: 'open',
                cellVisited: false,
            }
        }
    }
    cell[44].cellType = 'start'
    cell[99].cellType = 'end'
    grid.cell = cell
    return grid
}

const App = (): JSX.Element => {
    const [isMouseLeftButtonPressed, setIsMouseLeftButtonPressed] = useState(false)

    const handleMouseMoveWhileLeftBtnPressed = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.buttons === 1) {
            setIsMouseLeftButtonPressed(true)
        } else {
            setIsMouseLeftButtonPressed(false)
        }
    }

    const [cellSprings, cellSpringsApi] = useSprings(100, index => ({
        to: {
            opacity: 1,
            backgroundColor: 'white',
        },
        delay: index * 10,
    }))

    let reducer =
        (springApi: typeof cellSpringsApi) =>
        (grid: Grid, action: CellReducerActions): Grid => {
            let { type: actionType, payload: { cellId, newCellType, newCellVisitedStatus } = {} } = action
            let clonedGrid = cloneDeep(grid)

            switch (actionType) {
                case 'changeCellTypeToStart':
                    if (cellId === undefined) break
                    Object.keys(clonedGrid.cell).forEach(key => {
                        if (clonedGrid.cell[key].cellType === 'start') {
                            clonedGrid.cell[key].cellType = 'open'
                            springApi.start((i: number) => {
                                if (i === Number(key)) return { backgroundColor: 'white' }
                            })
                        }
                    })
                    clonedGrid.cell[cellId].cellType = 'start'
                    springApi.start((i: number) => {
                        if (i === cellId) return { backgroundColor: 'green' }
                    })
                    break

                case 'changeCellTypeToEnd':
                    if (cellId === undefined) break
                    Object.keys(clonedGrid.cell).forEach(key => {
                        if (clonedGrid.cell[key].cellType === 'end') {
                            clonedGrid.cell[key].cellType = 'open'
                            springApi.start((i: number) => {
                                if (i === Number(key)) return { backgroundColor: 'white' }
                            })
                        }
                    })
                    clonedGrid.cell[cellId].cellType = 'end'
                    springApi.start((i: number) => {
                        if (i === cellId) return { backgroundColor: 'red' }
                    })
                    break

                case 'resetVisitedCell':
                    Object.keys(clonedGrid.cell).forEach(key => {
                        if (clonedGrid.cell[key].cellVisited === true) {
                            clonedGrid.cell[key].cellVisited = false
                            cellSpringsApi.start((i: number) => {
                                if (i === Number(key)) return { backgroundColor: 'white' }
                            })
                        }
                    })
                    break

                case 'hardResetAllGrid':
                    Object.keys(clonedGrid.cell).forEach(key => {
                        clonedGrid.cell[key].cellType = 'open'
                        clonedGrid.cell[key].cellVisited = false
                    })
                    cellSpringsApi.start(() => ({ backgroundColor: 'white' }))
                    break

                case 'flipCellOpenCloseStatus':
                    if (cellId === undefined) break
                    if (clonedGrid.cell[cellId].cellType === 'open') {
                        clonedGrid.cell[cellId].cellType = 'close'
                        cellSpringsApi.start((i: number) => {
                            if (i === cellId) return { backgroundColor: 'blue' }
                        })
                    } else {
                        clonedGrid.cell[cellId].cellType = 'open'
                        cellSpringsApi.start((i: number) => {
                            if (i === cellId) return { backgroundColor: 'white' }
                        })
                    }

                    break

                case 'changeCellType':
                    if (cellId === undefined || newCellType === undefined) break
                    clonedGrid.cell[cellId].cellType = newCellType
                    break

                case 'changeCellVisitedStatusToTrue':
                    if (cellId === undefined) break
                    clonedGrid.cell[cellId].cellVisited = true
                    springApi.start((i: number) => {
                        if (i === cellId) return { backgroundColor: 'cyan' }
                    })
                    break

                default:
                    break
            }
            return clonedGrid
        }

    const [gridState, dispatch] = useReducer(reducer(cellSpringsApi), gridConstructor(10, 10))

    const globalTimeoutTimer = useRef(0)

    const dispatchWithTimeout = (cellId: number) => {
        const waitTime = 100
        setTimeout(
            () => dispatch({ type: 'changeCellVisitedStatusToTrue', payload: { cellId } }),
            globalTimeoutTimer.current * waitTime
        )
        globalTimeoutTimer.current = globalTimeoutTimer.current + 1
    }

    const resetGlobalTimeoutTimer = () => (globalTimeoutTimer.current = 0)

    let startSearch = () => {
        // const getStartCellCoordinates = () =>
        //     Object.values(gridState.cell).find(val => val.cellType === 'start')?.cellCoordinates
        //
        // const getEndCellCoordinates = () =>
        //     Object.values(gridState.cell).find(val => val.cellType === 'end')?.cellCoordinates
        // const startCellCoordinates = getStartCellCoordinates()
        // const endCellCoordinates = getEndCellCoordinates()
        resetGlobalTimeoutTimer()
        const result = bfs(gridState, dispatchWithTimeout, resetGlobalTimeoutTimer)
        // const result = dfs(gridState, startCellCoordinates, endCellCoordinates, dispatchWithTimeout, resetGlobalTimeoutTimer)
    }

    return (
        <Container sx={{ display: 'grid', justifyItems: 'center' }} onMouseMove={handleMouseMoveWhileLeftBtnPressed}>
            <Button onClick={e => dispatch({ type: 'hardResetAllGrid' })} variant='outlined' size='small'>
                Hard Reset
            </Button>
            <Button
                onClick={e => {
                    startSearch()
                    dispatch({ type: 'resetVisitedCell' })
                }}
                variant='outlined'
                size='small'
            >
                Run BFS Search
            </Button>
            <Paper
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${gridState.properties.rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${gridState.properties.columns}, 1fr)`,
                    width: 'fit-content',
                    // marginInline: 'auto',
                }}
            >
                {cellSprings.map((cellProps, i) => (
                    <GridCell
                        key={i}
                        cellId={i}
                        cellProperties={gridState.cell[i]}
                        cellProps={cellProps}
                        dispatch={dispatch}
                        isMouseLeftButtonPressed={isMouseLeftButtonPressed}
                    />
                ))}
            </Paper>
            Mouse Left Button : {isMouseLeftButtonPressed ? 'Held down' : 'Not pressed'}
            <Button
                onClick={() =>
                    cellSpringsApi.start(i => {
                        if (i === 2)
                            return {
                                opacity: 1,
                                scale: 0.6,
                            }
                    })
                }
            >
                Debugger
            </Button>
        </Container>
    )
}

export default App
