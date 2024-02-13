import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { memo } from 'react'
import { Cell } from '../types'
import { useGridConfig } from '../stateStore/gridConfigStore'
import { useShallow } from 'zustand/react/shallow'

type CellProps = {
    index: number
    cellTypeToPlaceOnClick: React.MutableRefObject<'start' | 'finish'>
}

const Cell = (props: CellProps) => {
    const { cellTypeToPlaceOnClick, index } = props

    const { cell, cellSize, actionOnDrag, setGrid } = useGridConfig(
        useShallow(state => ({
            cell: state.grid[props.index],
            cellSize: state.cellSize,
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
            animate={cell.visitedStatus === 'visited' ? 'visited' : cell.type}
            variants={{
                visited: { scale: 1.3 },
                start: { scale: 1.0 },
                finish: { scale: 1.0 },
                close: { scale: 1.3, transition: { duration: 0.2, delay: 0 } },
                open: { scale: 1.0, transition: { duration: 0.2, delay: 0 } },
            }}
            whileHover={{
                scale: 1.2,
            }}
            onClick={() => {
                changeCellTypeToStartOrFinish(index, cellTypeToPlaceOnClick.current)
                cellTypeToPlaceOnClick.current = cellTypeToPlaceOnClick.current === 'start' ? 'finish' : 'start'
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
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: () => {
                    if (cell.visitedStatus === 'visited') return 'white'
                    switch (cell.type) {
                        case 'open':
                            return '#FFFAE3'
                        case 'close':
                            return '#312E38'
                        case 'start':
                            return '#23d5ab'
                        case 'finish':
                            return '#F41549'
                        default:
                            return 'yellow'
                    }
                },

                borderRadius: 0.6,
                cursor: 'pointer',
            }}
        ></Box>
    )
}

export default memo(Cell)
