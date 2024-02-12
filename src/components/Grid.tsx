import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { useGridConfig } from '../stateStore/gridConfigStore'
import Cell from './Cell'
import { memo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { CellType } from '../types'

const Grid = () => {
    const { columns, rows } = useGridConfig(useShallow(state => ({ rows: state.rows, columns: state.columns })))
    const arr = Array.from({ length: rows * columns }, (_, i) => i)

    const cellTypeToPlaceOnClick = useRef<Extract<CellType, 'start' | 'finish'>>('start')

    return (
        <Box
            component={motion.div}
            animate={{ scale: [0, 1] }}
            transition={{ delay: 0.2 }}
            sx={{
                display: 'grid',
                gridTemplateRows: `repeat(${rows}, auto)`,
                gridTemplateColumns: `repeat(${columns}, auto)`,
                overflow: 'auto',

                gap: 0.3,
                p: 2,
                borderRadius: 3,
                minWidth: '10%',
                maxWidth: '95%',
                maxHeight: '100%',
            }}
            className='bg-gradient custom-scrollbar'
        >
            {arr.map(i => (
                <Cell key={i} index={i} cellTypeToPlaceOnClick={cellTypeToPlaceOnClick} />
            ))}
        </Box>
    )
}

export default memo(Grid)
