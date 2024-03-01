import { GitHub, RestartAltRounded } from '@mui/icons-material'
import { PlayArrow } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { solveGrid } from '../App'
import { useGridConfig } from '../stateStore/gridConfigStore'
import { AnimationPlaybackControls } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'

type FabGroupProps = { animateCellWithStagger: (arr: number[]) => AnimationPlaybackControls[] }

export const FabGroup = (props: FabGroupProps) => {
    const { animateCellWithStagger } = props

    const { setGrid, selectedAlgorithm, grid } = useGridConfig(
        useShallow(s => ({
            grid: s.grid,
            setGrid: s.setGrid,
            selectedAlgorithm: s.selectedAlgorithm,
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
                    setGrid(p =>
                        p.map(c => {
                            const cell = { ...c }
                            if (c.visitedStatus === 'visited') cell.visitedStatus = 'unvisited'
                            if (c.type === 'close') cell.type = 'open'
                            return Object.is(cell, c) ? c : cell
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
                        const { pathTaken, shortestPath } = await solveGrid(grid, selectedAlgorithm)

                        const startingCell = pathTaken.shift()
                        const endingCell = pathTaken.pop()

                        if (startingCell === undefined || endingCell === undefined)
                            throw new Error(
                                'Start/ finish cell not found while evaluating result. This is unexpected behaviour',
                            )

                        const controllers = animateCellWithStagger(pathTaken)

                        controllers.at(-1)?.then(() => {
                            if (shortestPath) {
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
                        })
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
