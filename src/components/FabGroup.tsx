import { GitHub } from '@mui/icons-material'
import { Box, Fab } from '@mui/material'
import { SolveGrid } from './SolveGrid'

export const FabGroup = () => {
    return (
        <Box
            sx={{
                '& > :not(style)': { m: 1, mb: 2 },
                position: 'fixed',
                bottom: 0,
                right: 0,
                zIndex: 999,
                m: 2,
            }}
        >
            <Fab
                variant='circular'
                target='_blank'
                href='https://github.com/decipher-cs/Trailblazer-Pathfinder-Visualizer'
                aria-label='view source code'
            >
                <GitHub />
            </Fab>

            <Fab variant='extended'>
                <SolveGrid />
            </Fab>
        </Box>
    )
}
