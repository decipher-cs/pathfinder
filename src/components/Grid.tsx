import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { useGridConfig } from '../stateStore/gridConfigStore'
import Cell from './Cell'
import { MutableRefObject, forwardRef, memo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { CellType } from '../types'

const Grid = forwardRef((props, ref) => {
    const { columns, rows } = useGridConfig(useShallow(state => ({ rows: state.rows, columns: state.columns })))
    const arr = Array.from({ length: rows * columns }, (_, i) => i)

    const cellTypeToPlaceOnClick = useRef<Extract<CellType, 'start' | 'finish'>>('start')

    return (
        <Box
            ref={ref}
            component={motion.div}
            animate={{ scale: [0, 1] }}
            transition={{ delay: 0.2 }}
            sx={{
                flexGrow: 1,

                justifyContent: 'center',
                // justifyItems: 'center',
                alignItems: 'center',
                alignContent: 'center',

                display: 'grid',
                gridTemplateRows: `repeat(${rows}, auto)`,
                gridTemplateColumns: `repeat(${columns}, auto)`,
                overflow: 'auto',

                gap: 0.3,
                p: 3,
                borderRadius: 3,
                minWidth: '10%',
                maxHeight: '100%',
            }}
            // className='bg-gradient custom-scrollbar'
            className='custom-scrollbar'
        >
            {arr.map(i => (
                <Cell key={i} index={i} cellTypeToPlaceOnClick={cellTypeToPlaceOnClick} />
            ))}
        </Box>
    )
})

export default memo(Grid)
