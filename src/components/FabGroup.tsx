import { GitHub } from '@mui/icons-material'
import { PlayArrow } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { solveGrid } from '../App'
import { useGridConfig } from '../stateStore/gridConfigStore'
import { AnimationPlaybackControls } from 'framer-motion'

type FabGroupProps = { animateCellWithStagger: (arr: number[]) => AnimationPlaybackControls[] }

export const FabGroup = (props: FabGroupProps) => {
    const { animateCellWithStagger } = props

    const { setGrid, getGrid, animationSpeed, selectedAlgorithm } = useGridConfig(s => ({
        setGrid: s.setGrid,
        getGrid: s.getGrid,
        animationSpeed: s.animationSpeed,
        selectedAlgorithm: s.selectedAlgorithm,
    }))

    return (
        <Box
            sx={{
                '& > :not(style)': { m: 1, mb: 2 },
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
                variant='extended'
                onClick={async () => {
                    try {
                        const grid = getGrid()
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
