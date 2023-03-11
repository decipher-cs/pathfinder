import { Box, Paper, Button, Chip, Container } from '@mui/material'
import { cloneDeep } from 'lodash'
import { useReducer, useState } from 'react'
import './index.css'
import GridCell from './components/GridCell'
import { dfs } from './pathfindingAlgorithms/dfs'

export type CellType = 'open' | 'close' | 'start' | 'end'

export interface Cell {
    cellId: number
    cellCoordinates: [number, number]
    cellType: CellType
    cellVisited: boolean
}

export interface GridProperties {
    rows: number
    columns: number
}

export interface Grid {
    cell: { [key: string | number]: Cell }
    properties: GridProperties
}

export type Action = {
    type:
        | 'changeCellType'
        | 'changeCellVisitedStatusToTrue'
        | 'flipCellOpenCloseStatus'
        | 'hardResetAllGrid'
        | 'changeCellTypeToStart'
        | 'changeCellTypeToEnd'
    payload?: {
        cellId: number // This is the id that corresponds to cellCoordinates. Ex. <0,0> = id: 0, <0,1> = id: 1 ...
        newCellType?: CellType
        newCellVisitedStatus?: boolean
    }
}

const gridConstructor = (m: number, n: number): Grid => {
    let grid: Grid = Object()
    grid.properties = {
        rows: m,
        columns: n,
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
    grid.cell = cell
    return grid
}

let reducer = (grid: Grid, action: Action): Grid => {
    let { type: actionType, payload: { cellId, newCellType, newCellVisitedStatus } = {} } = action
    let clonedGrid = cloneDeep(grid)
    switch (actionType) {
        case 'changeCellTypeToStart':
            Object.keys(clonedGrid.cell).forEach(key => {
                if (clonedGrid.cell[key].cellType === 'start') clonedGrid.cell[key].cellType = 'open'
            })
            if (cellId !== undefined) clonedGrid.cell[cellId].cellType = 'start'
            break
        case 'changeCellTypeToEnd':
            Object.keys(clonedGrid.cell).forEach(key => {
                if (clonedGrid.cell[key].cellType === 'end') clonedGrid.cell[key].cellType = 'open'
            })
            if (cellId !== undefined) clonedGrid.cell[cellId].cellType = 'end'
            break
        case 'hardResetAllGrid':
            Object.keys(clonedGrid.cell).forEach(key => {
                clonedGrid.cell[key].cellType = 'open'
                clonedGrid.cell[key].cellVisited = false
            })
            break
        case 'flipCellOpenCloseStatus':
            if (cellId === undefined) return grid
            clonedGrid.cell[cellId].cellType = clonedGrid.cell[cellId].cellType === 'open' ? 'close' : 'open'
            break
        case 'changeCellType':
            if (cellId === undefined) return grid
            return { ...grid, [cellId]: { ...grid.cell[cellId], cellType: newCellType } }
            break
        case 'changeCellVisitedStatusToTrue':
            if (cellId === undefined) return grid
            clonedGrid.cell[cellId].cellVisited = true
            break
        default:
            break
    }
    return clonedGrid
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

    const [gridState, dispatch] = useReducer(reducer, gridConstructor(6, 6))

    const getStartCellCoordinates = () =>
        Object.values(gridState.cell).find(val => val.cellType === 'start')?.cellCoordinates

    const getEndCellCoordinates = () =>
        Object.values(gridState.cell).find(val => val.cellType === 'end')?.cellCoordinates

    let startSearch = () => {
        const startCellCoordinates = getStartCellCoordinates()
        const endCellCoordinates = getEndCellCoordinates()
        if (startCellCoordinates !== undefined && endCellCoordinates !== undefined) {
            const result = dfs(gridState, startCellCoordinates, endCellCoordinates)
            console.log('starting point: ', startCellCoordinates, 'end point: ', endCellCoordinates, 'result: ', result)
        } else console.log('undefined start/end points')
    }

    return (
        <Container sx={{ display: 'grid', justifyItems: 'center' }} onMouseMove={handleMouseMoveWhileLeftBtnPressed}>
            <Button onClick={e => dispatch({ type: 'hardResetAllGrid' })} variant='outlined' size='small'>
                Hard Reset
            </Button>
            <Button onClick={e => startSearch()} variant='outlined' size='small'>
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
                {Array.from({ length: gridState.properties.rows * gridState.properties.columns }, (_, i) => (
                    <GridCell
                        key={i}
                        cellId={i}
                        cellProperties={gridState.cell[i]}
                        dispatch={dispatch}
                        isMouseLeftButtonPressed={isMouseLeftButtonPressed}
                    />
                ))}
            </Paper>
            Mouse Left Button : {isMouseLeftButtonPressed ? 'Held down' : 'Not pressed'}
            <Button onClick={() => console.log(gridState)}>Debugger</Button>
        </Container>
    )
}

export default App
