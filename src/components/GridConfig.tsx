import { Box, Button, ButtonGroup, MenuItem, Paper, Slider, TextField } from '@mui/material'
import { memo, useRef, useState } from 'react'
import { Grid, GridConfigActions, SearchAlgorithm, searchAlgorithms } from '../types'
import { dfs } from '../algorithms/dfs'
import { astar } from '../algorithms/astar'
import { dijkstra } from '../algorithms/dijkstra'
import { bfs } from '../algorithms/bfs'
import { constructGrid, useGridConfig } from '../stateStore/gridConfigStore'

export const worker = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' })

export const solveGrid = async (grid: Grid, algorithm: SearchAlgorithm): Promise<number[]> => {
    return new Promise((res, rej) => {
        worker.postMessage({ grid, algorithm } satisfies { grid: Grid; algorithm: SearchAlgorithm })

        const handleResult = (e: MessageEvent<number[]>) => {
            res(e.data)
            worker.removeEventListener('message', handleResult)
        }
        const handleError = (e: ErrorEvent) => {
            rej(e.message)
            worker.removeEventListener('error', handleError)
        }

        worker.onmessage = handleResult
        worker.onerror = handleError
    })
}

type GridConfigProps = {
    grid: Grid
    setGrid: GridConfigActions['setGrid']
    rows: number
    columns: number
}

const GridConfig = (props: GridConfigProps) => {
    const { grid, setGrid, rows, columns } = props

    const { animationSpeed } = useGridConfig()

    const { changeColumns, changeAnimationSpeed, changeRows } = useGridConfig.getState()

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

    useEffect(() => {
        return () => {
            worker.terminate()
        }
    }, [])

    return (
        <Box
            component={motion.div}
            animate={{ scale: [0, 1] }}
            transition={{ delay: 1 }}
            sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                p: 2,
            }}
        >
            <Paper sx={{ p: 2, width: '20%' }}>
                <TextField
                    sx={{ width: '100%' }}
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
                    inputProps={{ min: 0, max: 90 }}
                    required
                    value={animationSpeed}
                    onChange={e => {
                        const value = Number(e.target.value)
                        if (typeof value === 'number') changeAnimationSpeed(value)
                    }}
                    helperText='Greater value yields faster animation'
                />
            </Paper>

            <div style={{ width: '100%' }}></div>

            <Paper sx={{ p: 2 }}>
                <ButtonGroup variant='contained'>
                    <Button onClick={resetGrid}>Reset</Button>
                    <Button
                        onClick={async () => {
                            try {
                                const result = await solveGrid(grid, selectedSearchAlgorithm)
                                animatePathWithDelay(result)
                            } catch (err) {
                                console.log('caught error:', err)
                            }
                        }}
                    >
                        solve
                    </Button>
                </ButtonGroup>
            </Paper>
        </Box>
    )
}

export default memo(GridConfig)
