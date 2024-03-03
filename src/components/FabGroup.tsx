import { GitHub, RestartAltRounded } from '@mui/icons-material'
import { PlayArrow } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { solveGrid } from '../App'
import { useGridConfig } from '../stateStore/gridConfigStore'
import { AnimationPlaybackControls } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'

type FabGroupProps = {
    animateCellWithStagger: (arr: number[], onComplete: () => void) => AnimationPlaybackControls[]
    cancelAnimations: () => void
}

export const FabGroup = (props: FabGroupProps) => {
    const { animateCellWithStagger, cancelAnimations } = props

    const { setGrid, selectedAlgorithm, grid, columns } = useGridConfig(
        useShallow(s => ({
            grid: s.grid,
            setGrid: s.setGrid,
            selectedAlgorithm: s.selectedAlgorithm,
            columns: s.columns,
        })),
    )

    return (
        <Box
            sx={{
                '& > :not(style)': { ml: 1 },
                position: 'fixed',
                bottom: 0,
                right: 0,
                zIndex: 999,
                m: 2,
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
                onClick={() => {
                    cancelAnimations()
                    setGrid(p =>
                        p.map(c => {
                            if (c.visitedStatus === 'visited' || c.type === 'close')
                                return {
                                    ...c,
                                    visitedStatus: 'unvisited',
                                    type: 'open',
                                }

                            return c
                        }),
                    )
                }}
            >
                <RestartAltRounded sx={{ mr: 0 }} />
            </Fab>

            <Fab
                variant='extended'
                onClick={async () => {
                    try {
                        setGrid(p =>
                            p.map(c => {
                                return c.visitedStatus === 'visited' ? { ...c, visitedStatus: 'unvisited' } : c
                            }),
                        )

                        const { pathTaken, shortestPath } = await solveGrid(grid, columns, selectedAlgorithm)

                        const startingCell = pathTaken.shift()
                        const lastVisitedCell = pathTaken.pop()
                        const finishCell = grid.find(c => c.type === 'finish')

                        if (startingCell === undefined) {
                            throw new Error(
                                'Start cell not found while evaluating result. This is unexpected behaviour',
                            )
                        }

                        if (pathTaken.length < 1) {
                            alert('Could not react the finishing cell. No paths lead it.')
                        }

                        const onComplete = () => {
                            if (finishCell?.index !== lastVisitedCell || pathTaken.length < 1) {
                                alert('Could not react the finishing cell. No path leads it.')
                            } else if (shortestPath) {
                                shortestPath.shift()
                                shortestPath.pop()
                                setGrid(p =>
                                    p.map(cell =>
                                        shortestPath.includes(cell.index)
                                            ? { ...cell, visitedStatus: 'visited' }
                                            : cell,
                                    ),
                                )
                            } else {
                                setGrid(p =>
                                    p.map(cell =>
                                        pathTaken.includes(cell.index) ? { ...cell, visitedStatus: 'visited' } : cell,
                                    ),
                                )
                            }
                        }

                        animateCellWithStagger(pathTaken, onComplete)
                    } catch (err) {
                        alert('caught error: ' + err)
                    }
                }}
            >
                <PlayArrow sx={{ mr: 1 }} />
                Solve
            </Fab>
        </Box>
    )
}
