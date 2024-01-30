import { Button, ButtonGroup, MenuItem, Paper, TextField } from '@mui/material'
import { memo, useRef, useState } from 'react'
import { Grid, SearchAlgorithm, searchAlgorithms } from '../types'
import { constructGrid } from '../App'
import { dfs } from '../algorithms/dfs'
import { astar } from '../algorithms/astar'
import { dijkstra } from '../algorithms/dijkstra'
import { bfs } from '../algorithms/bfs'

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
    setGrid: React.Dispatch<React.SetStateAction<Grid>>
    rows: number
    columns: number
}

const GridConfig = (props: GridConfigProps) => {
    const { grid, setGrid, rows, columns } = props

    const [selectedSearchAlgorithm, setSelectedSearchAlgorithm] = useState<SearchAlgorithm>(searchAlgorithms[0])

    const timeoutQueue = useRef<ReturnType<typeof setTimeout>[]>([])

    const resetGrid = () => {
        setGrid(constructGrid(rows, columns))
        dismissOngoingAnimation()
    }

    const dismissOngoingAnimation = () => {
        timeoutQueue.current.forEach(timeoutId => clearTimeout(timeoutId))
        timeoutQueue.current = []
    }

    const animatePathWithDelay = (cellIndexArr: number[], delayInMs = 50): void => {
        let timeout = 0
        cellIndexArr.forEach(cellIndex => {
            const timeoutId = setTimeout(
                () => {
                    setGrid(p => {
                        return p.map(cell => {
                            if (cell.index === cellIndex) return { ...cell, visitedStatus: 'visited' }
                            return cell
                        })
                    })
                },
                (timeout += delayInMs),
            )
            timeoutQueue.current.push(timeoutId)
        })
    }

    return (
        <Paper sx={{ display: 'grid', p: 2, justifyContent: 'center' }}>
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
    )
}

export default memo(GridConfig)
