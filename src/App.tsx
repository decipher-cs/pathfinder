import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, ButtonGroup, CssBaseline, MenuItem, Paper, TextField } from '@mui/material'
import './App.css'
import { Cell, CellType, Grid, SearchAlgorithm, searchAlgorithms } from './types'
import GridCell from './components/Cell'
import GridConfig from './components/GridConfig'

const rows = 20
const columns = 20
const cellSize = 20

export const constructGrid = (rows: number, columns: number): Grid => {
    if (rows <= 0 || columns <= 0) throw new Error('incorrect value for rows or columns while constructing grid')

    const grid: Grid = []
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            grid.push({
                index: i * columns + j,
                coordinates: [i, j],
                type: 'open',
                visitedStatus: 'unvisited',
            })
        }
    }

    const getRandom = () => Math.floor(Math.random() * (rows * columns))

    let random = getRandom()
    grid[random] = { ...grid[random], type: 'start' }
    random = getRandom()
    grid[random] = { ...grid[random], type: 'finish' }

    return grid
}

function App() {
    const [grid, setGrid] = useState(() => constructGrid(rows, columns))

    const previouslyPlacedCell = useRef<Extract<CellType, 'start' | 'finish'>>('start')

    const changeCellTypeToStartOrFinish = useCallback(
        (index: number, newType: Extract<Cell['type'], 'start' | 'finish'>) => {
            setGrid(prevGrid => {
                return prevGrid.map(cell => {
                    if (cell.type === newType && cell.index !== index) return { ...cell, type: 'open' }
                    if (cell.type !== newType && cell.index === index) return { ...cell, type: newType }
                    return cell
                })
            })
        },
        [],
    )

    const toggleCellTypeBetweenOpenClose = useCallback((index: number) => {
        setGrid(p => {
            return p.map(cell => {
                if (cell.index === index) {
                    if (cell.type === 'open') return { ...cell, type: 'close' }
                    if (cell.type === 'close') return { ...cell, type: 'open' }
                }
                return cell
            })
        })
    }, [])

    return (
        <Box sx={{ height: '100svh', width: '100vw', display: 'grid', placeItems: 'center' }} className='lattice-bg'>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${rows}, auto)`,
                    gridTemplateColumns: `repeat(${columns}, auto)`,

                    gap: 0.1,
                    padding: 2,
                    borderRadius: 5,
                }}
                className='bg-gradient'
            >
                {grid.map(cell => (
                    <CellComponent
                        key={cell.index}
                        cellSize={cellSize}
                        cell={cell}
                        toggleCellTypeBetweenOpenClose={toggleCellTypeBetweenOpenClose}
                        changeCellTypeToStartOrFinish={changeCellTypeToStartOrFinish}
                        previouslyPlacedCell={previouslyPlacedCell}
                    />
                ))}
            </Box>
            <GridConfig grid={grid} setGrid={setGrid} rows={rows} columns={columns} />
        </Box>
    )
}

export default App
