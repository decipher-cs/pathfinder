import { Box } from '@mui/material'
import './App.css'
import Grid from './components/Grid'
import { FabGroup } from './components/FabGroup'

function App() {
    return (
        <Box
            sx={{
                height: '100svh',
                width: '100vw',
                display: 'grid',
                justifyItems: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                p: 1,
            }}
            className='lattice-bg'
        >
            <FabGroup />
            <Grid />
        </Box>
    )
}

export default App
