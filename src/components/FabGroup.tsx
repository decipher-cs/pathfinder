import { GitHub, Settings } from '@mui/icons-material'
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
            }}
        >
            <Fab variant='extended'>
                <SolveGrid />
            </Fab>

            <Fab>
                <Settings />
            </Fab>

            <Fab
                variant='circular'
                target='_blank'
                href='https://github.com/decipher-cs/Trailblazer-Pathfinder-Visualizer'
                aria-label='view source code'
            >
                <GitHub />
            </Fab>
        </Box>
    )
}
