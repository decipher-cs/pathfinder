import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { useGridConfig } from '../stateStore/gridConfigStore'
import GridCell from './Cell'
import { Cell, CellType } from '../types'
import { memo, useCallback, useRef } from 'react'

const Grid = () => {
    const { grid, columns, rows, cellSize, actionOnDrag } = useGridConfig()
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

    const toggleCellTypeBetweenOpenClose = useCallback(
        (index: number) => {
            setGrid(p => {
                return p.map(cell => {
                    if (cell.index === index) {
                        if (actionOnDrag === 'add wall') return { ...cell, type: 'close' }
                        if (actionOnDrag === 'remove wall') return { ...cell, type: 'open' }
                    }
                    return cell
                })
            })
        },
        [actionOnDrag],
    )

    return (
        <>
            <Box
                component={motion.div}
                animate={{ scale: [0, 1] }}
                transition={{ delay: 1 }}
                sx={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${rows}, auto)`,
                    gridTemplateColumns: `repeat(${columns}, auto)`,
                    overflow: 'auto',

                    gap: 0.3,
                    p: 2,
                    borderRadius: 5,
                    minWidth: '10%',
                    maxWidth: '95%',
                    maxHeight: '100%',
                }}
                className='bg-gradient custom-scrollbar'
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
        </>
    )
}

export default memo(Grid)
