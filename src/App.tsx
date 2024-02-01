import { useCallback, useRef } from 'react'
import { Box } from '@mui/material'
import './App.css'
import { Cell, CellType } from './types'
import GridCell from './components/Cell'
import GridConfigComponent from './components/GridConfig'
import { useGridConfig } from './stateStore/gridConfigStore'

function App() {
    const { grid, columns, rows, cellSize } = useGridConfig()
    const { setGrid } = useGridConfig.getState()

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

                    gap: 0.3,
                    padding: 2,
                    borderRadius: 5,
                    minWidth: '10%',
                    maxWidth: '100%',
                }}
                className='bg-gradient'
            >
                {grid.map(cell => (
                    <GridCell
                        key={cell.index}
                        cellSize={cellSize}
                        cell={cell}
                        toggleCellTypeBetweenOpenClose={toggleCellTypeBetweenOpenClose}
                        changeCellTypeToStartOrFinish={changeCellTypeToStartOrFinish}
                        previouslyPlacedCell={previouslyPlacedCell}
                    />
                ))}
            </Box>
            <GridConfigComponent grid={grid} setGrid={setGrid} rows={rows} columns={columns} />
        </Box>
    )
}

export default App
