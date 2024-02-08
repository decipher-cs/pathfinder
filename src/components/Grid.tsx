import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { useGridConfig } from '../stateStore/gridConfigStore'
import Cell from './Cell'
import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'

const Grid = () => {
    const { columns, rows } = useGridConfig(useShallow(state => ({ rows: state.rows, columns: state.columns })))
    const arr = Array.from({ length: rows * columns }, (_, i) => i)

    return (
        <>
            <Box
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
                {arr.map(i => (
                    <Cell key={i} index={i} />
                ))}
            </Box>
        </>
    )
}

export default memo(Grid)
