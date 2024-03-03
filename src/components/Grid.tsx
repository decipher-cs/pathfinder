import { Box } from '@mui/material'
import { useGridConfig } from '../stateStore/gridConfigStore'
import Cell from './Cell'
import { forwardRef, memo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { CellType } from '../types'

const Grid = forwardRef((_, ref) => {
    const { columns, rows } = useGridConfig(useShallow(state => ({ rows: state.rows, columns: state.columns })))
    const arr = Array.from({ length: rows * columns }, (_, i) => i)

    const cellTypeToPlaceOnClick = useRef<Extract<CellType, 'start' | 'finish'>>('start')

    return (
        <Box
            sx={{
                borderImage: 'linear-gradient(45deg, red, blue)',
                borderImageSlice: 1,
                borderStyle: 'solid',
                borderWidth: '8px',

                display: 'grid',
                placeContent: 'center',
                maxWidth: '100%',
                maxHeight: '100%',

                overflow: 'hidden',
                p: 3,
            }}
        >
            <Box
                ref={ref}
                sx={{
                    display: 'grid',

                    p: 1,
                    gap: 0.3,

                    gridTemplateRows: `repeat(${rows}, min-content)`,
                    gridTemplateColumns: `repeat(${columns}, min-content)`,

                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'fit-content',
                    height: 'fit-content',
                    overflow: 'auto',
                }}
            >
                {arr.map(i => (
                    <Cell key={i} index={i} cellTypeToPlaceOnClick={cellTypeToPlaceOnClick} />
                ))}
            </Box>
        </Box>
    )
})

export default memo(Grid)
