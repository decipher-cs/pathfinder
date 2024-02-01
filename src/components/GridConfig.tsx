import { Box, Button, ButtonGroup, MenuItem, Paper, Slider, TextField } from '@mui/material'
import { memo, useRef, useState } from 'react'
import { Grid, GridConfigActions, SearchAlgorithm, searchAlgorithms } from '../types'
import { dfs } from '../algorithms/dfs'
import { astar } from '../algorithms/astar'
import { dijkstra } from '../algorithms/dijkstra'
import { bfs } from '../algorithms/bfs'
import { constructGrid, useGridConfig } from '../stateStore/gridConfigStore'

export const solveGrid = (grid: Grid, algorithm: SearchAlgorithm): number[] => {
    switch (algorithm) {
        case 'dfs':
            return dfs(grid)
        case 'astar':
            return astar(grid)
        case 'bfs':
            return bfs(grid)
        case 'dijkstra':
            return dijkstra(grid)
        default:
            throw new Error('Unsupported Algorithm')
    }
}

type GridConfigProps = {
    grid: Grid
    setGrid: GridConfigActions['setGrid']
    rows: number
    columns: number
}

const GridConfig = (props: GridConfigProps) => {
    const { grid, setGrid, rows, columns } = props

    const { animationSpeed, cellSize, density } = useGridConfig()
    const { changeColumns, changeDensity, changeCellSize, changeAnimationSpeed, changeRows } = useGridConfig.getState()

    const [selectedSearchAlgorithm, setSelectedSearchAlgorithm] = useState<SearchAlgorithm>(searchAlgorithms[0])

    const timeoutQueue = useRef<ReturnType<typeof setTimeout>[]>([])

    const resetGrid = () => {
        setGrid(() => constructGrid(rows, columns))
        dismissOngoingAnimation()
    }

    const dismissOngoingAnimation = () => {
        timeoutQueue.current.forEach(timeoutId => clearTimeout(timeoutId))
        timeoutQueue.current = []
    }

    const animatePathWithDelay = (cellIndexArr: number[], delayInMs = 1000 / animationSpeed): void => {
        let timeout = 0
        const animationSequence = cellIndexArr.map(cellIndex => {
            return new Promise(res => {
                const timeoutId = setTimeout(
                    () => {
                        setGrid(p => {
                            return p.map(cell => {
                                if (cell.index === cellIndex) return { ...cell, visitedStatus: 'visited' }
                                return cell
                            })
                        })
                        res(cellIndex)
                    },
                    (timeout += delayInMs),
                )
                timeoutQueue.current.push(timeoutId)
            })
        })
        Promise.all(animationSequence).then(cellIndexArr => {
            // Reset all visited paths to unvisited. This ready ups the grid for another run
            cellIndexArr.forEach(cellIndex => {
                setGrid(p => {
                    return p.map(cell => {
                        if (cell.index === cellIndex) return { ...cell, visitedStatus: 'unvisited' }
                        return cell
                    })
                })
            })
        })
    }

    const successAnimation = () => {}

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
                flexWrap: 'wrap',
                p: 4,
            }}
        >
            <Paper sx={{ p: 2 }}>
                <TextField
                    select
                    value={selectedSearchAlgorithm}
                    label={'search algorithm'}
                    onChange={e => setSelectedSearchAlgorithm(e.target.value as SearchAlgorithm)}
                >
                    {searchAlgorithms.map(name => (
                        <MenuItem key={name} value={name}>
                            {name}
                        </MenuItem>
                    ))}
                </TextField>
            </Paper>
            <Paper>
                <ButtonGroup sx={{ background: 'white', px: 3, py: 2 }} variant='outlined'>
                    <Button onClick={resetGrid}>Reset</Button>
                    <Button
                        onClick={() => {
                            const result = solveGrid(structuredClone(grid), selectedSearchAlgorithm)
                            animatePathWithDelay(result)
                        }}
                    >
                        solve
                    </Button>
                </ButtonGroup>
            </Paper>
            <Paper sx={{ p: 2, width: '20%' }}>
                Rows: {rows}
                <Slider
                    step={5}
                    value={rows}
                    marks
                    valueLabelDisplay='auto'
                    min={10}
                    max={50}
                    onChange={(_, v) => (Array.isArray(v) ? changeRows(v[0]) : changeRows(v))}
                />
                Columns: {columns}
                <Slider
                    value={columns}
                    step={5}
                    valueLabelDisplay='auto'
                    marks
                    min={10}
                    max={50}
                    onChange={(_, v) => (Array.isArray(v) ? changeColumns(v[0]) : changeColumns(v))}
                />
            </Paper>
            <Paper sx={{ p: 2, width: '20%' }}>
                animation speed
                <TextField
                    type='number'
                    InputProps={{ endAdornment: 'X' }}
                    size='small'
                    value={animationSpeed}
                    onChange={e => {
                        const value = Number(e.target.value)
                        if (typeof value === 'number') changeAnimationSpeed(value)
                    }}
                    helperText='Greater value yields faster animation'
                />
            </Paper>
        </Box>
    )
}

export default memo(GridConfig)
