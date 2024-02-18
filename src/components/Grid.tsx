import { Box } from '@mui/material'
import { useGridConfig } from '../stateStore/gridConfigStore'
import Cell from './Cell'
import { forwardRef, memo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { CellType } from '../types'

const Grid = forwardRef((props, ref) => {
    const { columns, rows } = useGridConfig(useShallow(state => ({ rows: state.rows, columns: state.columns })))
    const arr = Array.from({ length: rows * columns }, (_, i) => i)

    const cellTypeToPlaceOnClick = useRef<Extract<CellType, 'start' | 'finish'>>('start')

    return (
        <Box
            ref={ref}
            sx={{
                borderImage: 'linear-gradient(45deg, red, blue)',
                borderImageSlice: 1,
                borderStyle: 'solid',
                borderWidth: '3px',

                justifyContent: 'center',
                justifyItems: 'center',
                alignItems: 'center',
                alignContent: 'center',

                display: 'grid',
                gridTemplateRows: `repeat(${rows}, auto)`,
                gridTemplateColumns: `repeat(${columns}, auto)`,
                overflow: 'auto',

                gap: 0.3,
                p: 3,
                minWidth: '10%',
                maxHeight: '100%',
            }}
            // className='custom-scrollbar'
        >
            {arr.map(i => (
                <Cell key={i} index={i} cellTypeToPlaceOnClick={cellTypeToPlaceOnClick} />
            ))}
        </Box>
    )
})

export default memo(Grid)
