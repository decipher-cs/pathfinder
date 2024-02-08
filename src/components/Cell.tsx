import { Box } from '@mui/material'
import { motion, useAnimate, useAnimation } from 'framer-motion'
import { memo } from 'react'
import { Cell } from '../types'
import { useGridConfig } from '../stateStore/gridConfigStore'
import { useShallow } from 'zustand/react/shallow'

type CellProps = {
    index: number
}

const Cell = (props: CellProps) => {
    const { index } = props

    const { cell, cellSize, getGrid, actionOnDrag, setGrid } = useGridConfig(
        useShallow(state => ({
            cell: state.grid[props.index],
            cellSize: state.cellSize,
            getGrid: state.getGrid,
            actionOnDrag: state.actionOnDrag,
            setGrid: state.setGrid,
        })),
    )

    const changeCellTypeToStartOrFinish = (index: number, newType: Extract<Cell['type'], 'start' | 'finish'>) => {
        setGrid(prevGrid => {
            return prevGrid.map(cell => {
                if (cell.type === newType && cell.index !== index) return { ...cell, type: 'open' }
                if (cell.type !== newType && cell.index === index) return { ...cell, type: newType }
                return cell
            })
        })
    }

    return (
        <Box
            component={motion.div}
            animate={cell.visitedStatus === 'visited' ? cell.visitedStatus : cell.type}
            variants={{
                visited: {
                    backgroundColor: ['#FFFAE3', '#312E38', '#FFFAE3'],
                    scale: [1, 0.5, 1],
                },
                start: { backgroundColor: '#23d5ab' },
                finish: { backgroundColor: '#F41549' },
                close: { backgroundColor: '#312E38' },
                open: { backgroundColor: '#FFFAE3' },
            }}
            whileHover={{
                scale: 1.3,
                transition: { duration: 0.01 },
            }}
            onClick={() => {
                const c = getGrid().find(c => c.type === 'start' || c.type === 'finish')
                if (!c) changeCellTypeToStartOrFinish(index, 'start')
                else if (c.type === 'start') changeCellTypeToStartOrFinish(index, 'finish')
                else if (c.type === 'finish') changeCellTypeToStartOrFinish(index, 'start')
            }}
            onMouseDown={e => e.preventDefault()}
            onDrag={e => e.preventDefault()}
            onMouseEnter={e => {
                if (e.buttons === 1)
                    setGrid(p => {
                        return p.map(cell => {
                            if (cell.index === index) {
                                if (actionOnDrag === 'add wall') return { ...cell, type: 'close' }
                                if (actionOnDrag === 'remove wall') return { ...cell, type: 'open' }
                            }
                            return cell
                        })
                    })
            }}
            sx={{
                // background: cell.type === 'close' ? '#000' : '#fff',
                background: '#fff',
                // transform: cell.type === 'close' ? 'scale(1)' : 'scale(1)',
                // transition: 'background 1s, transform',
                width: `${cellSize}px`,
                height: `${cellSize}px`,

                borderRadius: '3px',
                cursor: 'pointer',
            }}
        ></Box>
    )
}

export default memo(Cell)
