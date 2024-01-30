import { Box } from '@mui/material'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import { motion, useAnimate, useAnimation } from 'framer-motion'
import React, { memo, useEffect, useRef } from 'react'
import { CellType, Cell as TCell } from '../types'
import anime, { AnimeParams } from 'animejs'

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

    const cellRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ref = cellRef.current
        if (!ref) return
        const animation = anime({
            targets: '.div',
            rotate: 250,
            loop: 3,
            backgroundColor: '#000',
        } satisfies AnimeParams[''])
    }, [])

    return (
        <Box
            ref={cellRef}
            component={motion.div}
            animate={cell.visitedStatus === 'visited' ? cell.visitedStatus : cell.type}
            variants={{
                visited: {
                    scale: [0.8, 1],
                    rotate: 45,
                    backgroundColor: ['#fff', '#000000', '#fff'],
                },
                start: { rotate: 1, scale: 1.2, backgroundColor: '#FF5733' },
                finish: { rotate: 1, scale: 1.2, backgroundColor: '#99FF33' },
                close: { rotate: 1, scale: 1, backgroundColor: '#000' },
                open: { rotate: 1, scale: 1, backgroundColor: '#fff' },
            }}
            // whileHover={{
            //     scale: 1.2,
            //     transition: { duration: 0.01 },
            // }}
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
                transition: 'background 1s, transform',
                width: `${cellSize}px`,
                height: `${cellSize}px`,

                borderRadius: '3px',
                cursor: 'pointer',
            }}
        >
            {cell.type === 'close' ? <BlockRoundedIcon fontSize='small' /> : null}
        </Box>
    )
}

export default memo(Cell)
