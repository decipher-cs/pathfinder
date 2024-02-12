import { GitHub, PlayArrow, Settings } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab } from '@mui/material'
import { useRef, useState } from 'react'
import GridConfig from './GridConfig'
import { AlgorithmReturnType, Grid, SearchAlgorithm } from '../types'
import { useGridConfig } from '../stateStore/gridConfigStore'

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

export const FabGroup = () => {
    const { setGrid, getGrid, animationSpeed } = useGridConfig.getState()

    const [isSettingsDialogOpen, setIsSetingsDialogOpen] = useState(true)

    const handleDialogClose = () => setIsSetingsDialogOpen(false)

    const timeoutQueue = useRef<ReturnType<typeof setTimeout>[]>([])

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
        // animate(scope.current, { rotate: '360deg' })
    }

    const failureAnimation = () => {
        // animate(scope.current, { background: ['#fff', '#000'] })
    }

    const resetGrid = () => {
        // setGrid(() => constructGrid(rows, columns))
        dismissOngoingAnimation()
    }

    const dismissOngoingAnimation = () => {
        timeoutQueue.current.forEach(timeoutId => clearTimeout(timeoutId))
        timeoutQueue.current = []
    }

    return (
        <Box
            sx={{
                '& > :not(style)': { m: 1, mb: 2 },
                position: 'fixed',
                bottom: 0,
                zIndex: 999,
            }}
        >
            <Fab
                variant='circular'
                target='_blank'
                href='https://github.com/decipher-cs/Trailblazer-Pathfinder-Visualizer'
                aria-label='view source code'
            >
                <GitHub />
            </Fab>

            <Fab
                variant='extended'
                aria-label='solve grid'
                onClick={async () => {
                    try {
                        /*
                         * Animate taken path
                         * If found 'finish'
                         *      show shortest path (if shortest path available)
                         *      play success animation
                         * Else
                         *      play failure animation
                         * Reset visited cells
                         * */

                        const { pathTaken, shortestPath } = await solveGrid(getGrid(), 'astar')

                        const startingCell = pathTaken.shift()
                        const endingCell = pathTaken.pop()

                        if (!startingCell || !endingCell)
                            throw new Error(
                                'Start/ finish cell not found while evaluating result. This is unexpected behaviour',
                            )

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

                        /* setGrid(prev =>
                                    prev.map(c =>
                                        c.visitedStatus === 'visited' ? { ...c, visitedStatus: 'unvisited' } : c,
                                    ),
                                ) */
                    } catch (err) {
                        alert('caught error: ' + err)
                    }
                }}
            >
                <PlayArrow sx={{ mr: 1 }} />
                Solve
            </Fab>

            <Fab variant='extended' onClick={() => setIsSetingsDialogOpen(true)} aria-label='open settings'>
                <Settings sx={{ mr: 1 }} />
                Settings
            </Fab>

            <Dialog open={isSettingsDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Settings</DialogTitle>

                <DialogContent dividers>
                    <GridConfig />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
