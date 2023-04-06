import {
    Box,
    Paper,
    Button,
    Chip,
    Container,
    RadioGroup,
    FormControl,
    FormLabel,
    FormControlLabel,
    Radio,
    Alert,
    Snackbar,
    AlertProps,
    AlertColor,
    ButtonGroup,
    Input,
    Slider,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material'
import './App.css'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import './index.css'
import GridCell from './components/GridCell'
import { dfs } from './pathfindingAlgorithms/dfs'
import {
    animated,
    ForwardProps,
    SpringProps,
    SpringRef,
    SpringValue,
    useSpring,
    useSprings,
    useSpringValue,
} from '@react-spring/web'
import { bfs } from './pathfindingAlgorithms/bfs'
import { dijkstra } from './pathfindingAlgorithms/dijkstra'

export type CellType = 'open' | 'close' | 'start' | 'end'

export type CursorSelectionType = 'start' | 'end' | 'open/close'

export type Algorithm = 'bfs' | 'dfs' | 'astar' | 'dijkstra'

export interface Cell {
    cellId: number
    cellCoordinates: [number, number]
    cellType: CellType
    cellVisited: boolean
}

export interface AlgorithmFluff {
    startingPoint: number
    endingPoint: number
    unavailableCells: number[]
    rows: number
    columns: number
    size: number
}

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
        | 'reinitGrid'
    payload?: {
        cellId?: number // This is the id that corresponds to cellCoordinates. Ex. <0,0> = id: 0, <0,1> = id: 1 ...
        newCellType?: CellType
        newCellVisitedStatus?: boolean
        newGridSize?: number
    }
}

// Algorithms like dfs, bfs make use of these functions
export const gridHelperFunctions = {
    coordinateToCellId: ([row, col]: [number, number], columns: number) => row * columns + col,
    cellIdToCoordinate: (id: number, columns: number): [number, number] => [Math.floor(id / columns), id % columns],
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
    grid.cell = cell

    // initialize grid with a random start and end points
    const randomStartCell = Math.floor(Math.random() * m * n)
    const randomEndCell = Math.floor(Math.random() * m * n)
    cell[randomStartCell].cellType = 'start'
    cell[randomEndCell].cellType = 'end'

    return grid
}

let reducer = (grid: Grid, action: CellReducerActions): Grid => {
    let { type: actionType, payload: { cellId, newCellType, newCellVisitedStatus, newGridSize } = {} } = action
    let clonedGrid = cloneDeep(grid)
    switch (actionType) {
        case 'changeCellTypeToStart':
            if (cellId === undefined) break
            Object.keys(clonedGrid.cell).forEach(key => {
                if (clonedGrid.cell[key].cellType === 'start') {
                    clonedGrid.cell[key].cellType = 'open'
                }
            })
            clonedGrid.cell[cellId].cellType = 'start'
            break

        case 'changeCellTypeToEnd':
            if (cellId === undefined) break
            Object.keys(clonedGrid.cell).forEach(key => {
                if (clonedGrid.cell[key].cellType === 'end') {
                    clonedGrid.cell[key].cellType = 'open'
                }
            })
            clonedGrid.cell[cellId].cellType = 'end'
            break

        case 'resetVisitedCell':
            Object.keys(clonedGrid.cell).forEach(key => {
                if (clonedGrid.cell[key].cellVisited === true) {
                    clonedGrid.cell[key].cellVisited = false
                }
            })
            break

        case 'hardResetAllGrid':
            Object.keys(clonedGrid.cell).forEach(key => {
                clonedGrid.cell[key].cellType = 'open'
                clonedGrid.cell[key].cellVisited = false
            })
            break

        case 'flipCellOpenCloseStatus':
            if (cellId === undefined) break
            if (clonedGrid.cell[cellId].cellType === 'open') {
                clonedGrid.cell[cellId].cellType = 'close'
            } else if (clonedGrid.cell[cellId].cellType === 'close') {
                clonedGrid.cell[cellId].cellType = 'open'
            }

            break

        case 'changeCellType':
            if (cellId === undefined || newCellType === undefined) break
            clonedGrid.cell[cellId].cellType = newCellType
            break

        case 'changeCellVisitedStatusToTrue':
            if (cellId === undefined) break
            clonedGrid.cell[cellId].cellVisited = true
            break
        case 'reinitGrid':
            if (newGridSize === undefined) break
            clonedGrid.properties.rows = newGridSize
            clonedGrid.properties.columns = newGridSize
            clonedGrid.properties.size = newGridSize * newGridSize
            break

        default:
            break
    }
    return clonedGrid
}

const PaperWithDefaults = (props: { children: React.ReactNode }) => {
    return <Paper sx={{ p: 3 }}>{props.children}</Paper>
}

const INITIAL_GRID_SIZE = 20
const MAX_GRID_SIZE = 20

const App = (): JSX.Element => {
    const [gridSize, setGridSize] = useState<number>(INITIAL_GRID_SIZE)

    const [isMouseLeftButtonPressed, setIsMouseLeftButtonPressed] = useState(false)

    const [cursorClickActionMode, setCursorClickActionMode] = useState<CursorSelectionType>('open/close')

    const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('dijkstra')

    const sliderValue = useRef(INITIAL_GRID_SIZE)

    const [gridState, dispatch] = useReducer(reducer, gridConstructor(gridSize, gridSize))

    const handleMouseMoveWhileLeftBtnPressed = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.buttons === 1) {
            setIsMouseLeftButtonPressed(true)
        } else {
            setIsMouseLeftButtonPressed(false)
        }
    }

    const handleGridSizeChange = (newGridSize: number) => {
        setGridSize(newGridSize)
        dispatch({ type: 'reinitGrid', payload: { newGridSize } })
    }

    const handleCursorClickSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arr: CursorSelectionType[] = ['open/close', 'start', 'end']
        if (arr.includes(e.target.value as CursorSelectionType)) {
            setCursorClickActionMode(e.target.value as CursorSelectionType)
        }
    }

    const handleAlgorithmSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arr: Algorithm[] = ['bfs', 'dfs', 'astar', 'dijkstra']
        if (arr.includes(e.target.value as Algorithm)) {
            setSelectedAlgorithm(e.target.value as Algorithm)
        }
    }

    const runSelectedAlgorithm = (selectedAlgorithm: Algorithm) => {
        /* algorithm parameters should take the follwing properties
         * Grid Starting/ Ending Point
         * Unavailable cells aka walls
         */
        const gridCells = Object.entries(gridState.cell)
        let canContinue: boolean = true

        // put snackbar here
        dispatch({ type: 'resetVisitedCell' })
        const algorithmFluff: AlgorithmFluff = {
            startingPoint: (() => {
                const cell = gridCells.find(cell => cell[1].cellType === 'start')
                if (cell === undefined) {
                    canContinue = false
                    return Infinity
                }
                return cell[1].cellId
            })(),
            endingPoint: (() => {
                const cell = gridCells.find(cell => cell[1].cellType === 'end')
                if (cell === undefined) {
                    canContinue = false
                    return Infinity
                }
                return cell[1].cellId
            })(),
            unavailableCells: (() => {
                let unavailableCells = gridCells
                    .filter(cell => cell[1].cellType === 'close')
                    .map(cell => cell[1].cellId)
                return unavailableCells
            })(),
            rows: gridState.properties.rows,
            columns: gridState.properties.columns,
            size: gridState.properties.size,
        }
        let visitedCells: { allTakedPath: Set<number>; shortestPath: Set<number> } = {
            allTakedPath: new Set(),
            shortestPath: new Set(),
        }
        if (!canContinue) return false

        switch (selectedAlgorithm) {
            case 'dfs':
                visitedCells.allTakedPath = dfs(algorithmFluff)
                break
            case 'bfs':
                visitedCells.allTakedPath = bfs(algorithmFluff)
                break
            case 'dijkstra':
                visitedCells = dijkstra(algorithmFluff)
                break

            default:
                throw 'check runSelectionAlgorithm in App.tsx'
        }
        animatePath(Object.values(visitedCells))
    }

    const animatePath = async (groups: (number[] | Set<number>)[]) => {
        for (const arr of groups[0]) {
            await new Promise(res => {
                setTimeout(() => {
                    dispatch({ type: 'changeCellVisitedStatusToTrue', payload: { cellId: arr } })
                    res('completed')
                }, 0)
            })
        }
        await new Promise(res => {
            setTimeout(() => {
                dispatch({ type: 'resetVisitedCell' })
                res('completed')
            }, 1000)
        })
        for (const arr of groups[1]) {
            await new Promise(res => {
                setTimeout(() => {
                    dispatch({ type: 'changeCellVisitedStatusToTrue', payload: { cellId: arr } })
                    res('completed')
                }, 0)
            })
        }
        await new Promise(res => {
            setTimeout(() => {
                dispatch({ type: 'resetVisitedCell' })
                res('completed')
            }, 1000)
        })
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} p={2}>
            <Container
                sx={{
                    display: 'flex',
                    gap: 1.4,
                    flexWrap: 'wrap',
                    width: 'fit-content',
                    placeContent: 'center',
                }}
            >
                <PaperWithDefaults>
                    <Typography> Grid Size </Typography>
                    <Slider
                        defaultValue={INITIAL_GRID_SIZE}
                        step={5}
                        marks
                        min={5}
                        max={MAX_GRID_SIZE}
                        onChange={(e: any) => (sliderValue.current = e.target.value)}
                    />
                    {/* <Button variant='outlined' size='small' onClick={()=>console.log(sliderValue.current)}> */}
                    <Button variant='outlined' size='small' onClick={() => handleGridSizeChange(sliderValue.current)}>
                        Recreate Grid
                    </Button>
                </PaperWithDefaults>

                <PaperWithDefaults>
                    <Typography> Click Action Type </Typography>
                    <RadioGroup row value={cursorClickActionMode} onChange={e => handleCursorClickSelection(e)}>
                        <FormControlLabel label='open/close' value='open/close' name='selection' control={<Radio />} />
                        <FormControlLabel label='start' value='start' name='selection' control={<Radio />} />
                        <FormControlLabel label='end' value='end' name='selection' control={<Radio />} />
                    </RadioGroup>
                </PaperWithDefaults>

                <PaperWithDefaults>
                    <Typography> Algorithm Type </Typography>
                    <RadioGroup row value={selectedAlgorithm} onChange={e => handleAlgorithmSelection(e)}>
                        <FormControlLabel label='BFS' value='bfs' name='selection' control={<Radio />} />
                        <FormControlLabel label='DFS' value='dfs' name='selection' control={<Radio />} />
                        <FormControlLabel label='dijkstra' value='dijkstra' name='selection' control={<Radio />} />
                    </RadioGroup>
                </PaperWithDefaults>

                <PaperWithDefaults>
                    <ButtonGroup>
                        <Button variant='outlined' size='small' onClick={e => runSelectedAlgorithm(selectedAlgorithm)}>
                            Run
                        </Button>
                        <Button onClick={e => dispatch({ type: 'hardResetAllGrid' })} variant='outlined' size='small'>
                            Reset Entire Grid
                        </Button>
                        <Button onClick={e => dispatch({ type: 'resetVisitedCell' })} variant='outlined' size='small'>
                            Reset visited cells
                        </Button>
                        <Button
                            onClick={e => console.log('TODO: saving layout currently not supported')}
                            variant='outlined'
                            size='small'
                        >
                            Save Current Layout
                        </Button>
                    </ButtonGroup>
                </PaperWithDefaults>
            </Container>

            <Container
                sx={{ display: 'grid', placeItems: 'center', placeContent: 'center', width: 'min-content' }}
                onMouseMove={handleMouseMoveWhileLeftBtnPressed}
            >
                <Box
                    className={'bg-transition'}
                    sx={{
                        display: 'grid',
                        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        padding: '0.2em',
                    }}
                >
                    {new Array(gridSize * gridSize).fill('').map((cellProps, i, cellApi) => (
                        <GridCell
                            key={i}
                            cellId={i}
                            cellProperties={gridState.cell[i]}
                            cellProps={cellProps}
                            dispatch={dispatch}
                            cursorClickActionMode={cursorClickActionMode}
                            isMouseLeftButtonPressed={isMouseLeftButtonPressed}
                        />
                    ))}
                </Box>
            </Container>
        </Box>
    )
}

export default App
