import { Box } from '@mui/material'
import { motion, useAnimate, useAnimation } from 'framer-motion'
import React, { memo, useEffect, useRef } from 'react'
import { CellType, Cell as TCell } from '../types'

type CellProps = {
    cell: TCell
    cellSize: number
    changeCellTypeToStartOrFinish: (index: number, newType: Extract<CellType, 'start' | 'finish'>) => void
    toggleCellTypeBetweenOpenClose: (index: number) => void
    previouslyPlacedCell: React.MutableRefObject<'finish' | 'start'>
}

const Cell = (props: CellProps) => {
    const { toggleCellTypeBetweenOpenClose, previouslyPlacedCell, cell, cellSize, changeCellTypeToStartOrFinish } =
        props

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
            onDrag={() => false}
            onClick={() => {
                const prevCell = previouslyPlacedCell.current
                if (prevCell === 'start') {
                    changeCellTypeToStartOrFinish(cell.index, 'finish')
                    previouslyPlacedCell.current = 'finish'
                } else if (prevCell === 'finish') {
                    changeCellTypeToStartOrFinish(cell.index, 'start')
                    previouslyPlacedCell.current = 'start'
                }
            }}
            onMouseEnter={e => {
                if (e.buttons === 1) toggleCellTypeBetweenOpenClose(cell.index)
            }}
            sx={{
                // background: cell.type === 'close' ? '#000' : '#fff',
                // transform: cell.type === 'close' ? 'scale(1)' : 'scale(1)',
                // transition: 'background 1s, transform',
                width: `${cellSize}px`,
                height: `${cellSize}px`,

                borderRadius: '3px',
                cursor: 'pointer',
            }}
        >
            {/* {cell.type === 'close' ? <BlockRoundedIcon fontSize='small' /> : null} */}
        </Box>
    )
}

export default memo(Cell)
