import { Box, debounce } from '@mui/material'
import './App.css'
import GridConfigComponent from './components/GridConfig'
import Grid from './components/Grid'

function App() {
    return (
        <Box
            sx={{
                height: '100svh',
                width: '100vw',
                display: 'grid',
                justifyItems: 'center',
                alignItems: 'flex-start',
                gridTemplateRows: 'auto fit-content',
                overflow: 'hidden',
                px: 1,
                py: 2,
            }}
            className='lattice-bg'
        >
            <GridConfigComponent />
            <Grid />
        </Box>
    )
}

export default App
