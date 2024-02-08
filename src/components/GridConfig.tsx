import { Box, Button, ButtonGroup, MenuItem, Paper, Slider, Switch, TextField, Typography } from '@mui/material'
import { memo, useRef, useState } from 'react'
import { AlgorithmReturnType, Grid, SearchAlgorithm, searchAlgorithms } from '../types'
import { constructGrid, useGridConfig } from '../stateStore/gridConfigStore'
import { motion } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'

export const worker = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' })

export const solveGrid = async (grid: Grid, algorithm: SearchAlgorithm): Promise<AlgorithmReturnType> => {
    return new Promise((res, rej) => {
        worker.postMessage({ grid, algorithm } satisfies { grid: Grid; algorithm: SearchAlgorithm })

        const handleResult = (e: MessageEvent<AlgorithmReturnType>) => {
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

const GridConfig = () => {
    const [rows, columns, animationSpeed, actionOnDrag] = useGridConfig(
        useShallow(state => [state.rows, state.columns, state.animationSpeed, state.actionOnDrag]),
    )

    // https://github.com/pmndrs/zustand/discussions/2194
    // same as useGridConfig(useShallow())
    const { changeColumns, changeAnimationSpeed, changeRows, changeActionOnDrag, setGrid, getGrid } =
        useGridConfig.getState()

    const [selectedSearchAlgorithm, setSelectedSearchAlgorithm] = useState<SearchAlgorithm>(searchAlgorithms[2])

    const timeoutQueue = useRef<ReturnType<typeof setTimeout>[]>([])

    const resetGrid = () => {
        setGrid(() => constructGrid(rows, columns))
        dismissOngoingAnimation()
    }

    const dismissOngoingAnimation = () => {
        timeoutQueue.current.forEach(timeoutId => clearTimeout(timeoutId))
        timeoutQueue.current = []
    }

    const animateTakenPathWithDelay = (cellIndexArr: number[], delayInMs = 1000 / animationSpeed) => {
        let timeout = 0
        const animationSequence = cellIndexArr.map(cellIndex => {
            return new Promise(res => {
                const timeoutId = setTimeout(
                    () => {
                        setGrid(p =>
                            p.map(cell => (cell.index === cellIndex ? { ...cell, visitedStatus: 'visited' } : cell)),
                        )
                        res(cellIndex)
                    },
                    (timeout += delayInMs),
                )
                timeoutQueue.current.push(timeoutId)
            })
        })
        return Promise.all(animationSequence)
    }

    const successAnimation = () => {
        alert('success')
    }

    const failureAnimation = () => {
        alert('failed')
    }

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
                flexWrap: 'nowrap',
                p: 2,
            }}
        >
            <Paper sx={{ p: 1.5, width: '20%' }}>
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
                    marks
                    valueLabelDisplay='auto'
                    min={10}
                    max={50}
                    value={rows}
                    onChange={(_, v) => changeRows(Array.isArray(v) ? v[0] : v)}
                />
                Columns: {columns}
                <Slider
                    step={5}
                    valueLabelDisplay='auto'
                    marks
                    min={10}
                    max={50}
                    value={columns}
                    onChange={(_, v) => changeColumns(Array.isArray(v) ? v[0] : v)}
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

            <Paper sx={{ p: 2 }}>
                <ButtonGroup size='small' variant='contained'>
                    <Button onClick={resetGrid}>Reset</Button>
                    <Button
                        onClick={async () => {
                            try {
                                /*
                                 * Animate taken path
                                 * If found 'finish'
                                 *      show shortest path (if shortest path available)
                                 *      play success animation
                                 * Else
                                 *      play failure animation
                                 * Reset the grid
                                 * */

                                const { pathTaken, shortestPath } = await solveGrid(getGrid(), selectedSearchAlgorithm)

                                const [, endingCell] = [pathTaken.shift(), pathTaken.pop()] as [number, number] // remove annotation and do a type check instead

                                const triggeredCells = await animateTakenPathWithDelay(pathTaken)
                                triggeredCells.forEach(cellIndex => {
                                    setGrid(p => {
                                        return p.map(cell => {
                                            if (cell.index === cellIndex) return { ...cell, visitedStatus: 'unvisited' }
                                            return cell
                                        })
                                    })
                                })

                                const finishCell = getGrid().filter(c => c.type === 'finish')[0].index

                                if (endingCell === finishCell) {
                                    if (shortestPath) await animateTakenPathWithDelay(shortestPath)
                                    else successAnimation()
                                } else failureAnimation()
                            } catch (err) {
                                alert('caught error: ' + err)
                            }
                        }}
                    >
                        solve
                    </Button>
                </ButtonGroup>
            </Paper>
            <Paper sx={{ p: 2 }}>
                <Typography>Drag action:</Typography>
                add walls
                <Switch value={actionOnDrag === 'add wall'} onChange={changeActionOnDrag} />
                remove walls
            </Paper>
        </Box>
    )
}

export default memo(GridConfig)
