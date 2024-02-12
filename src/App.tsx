import { Box, IconButton, Slide } from '@mui/material'
import './App.css'
import Grid from './components/Grid'
import GridConfig from './components/GridConfig'
import { useState } from 'react'
import { DragHandle } from '@mui/icons-material'
import { FabGroup } from './components/FabGroup'

function App() {
    const [areSettingsVisible, setAreSettingsVisible] = useState(true)

    return (
        <Box
            sx={{
                height: '100svh',
                width: '100vw',
                display: 'grid',
                gridAutoFlow: 'column',
                overflow: 'visible',
                position: 'relative',
                gridTemplateColumns: 'max(0px, 30%) 1fr',
            }}
            className='lattice-bg'
        >
            <Slide in={areSettingsVisible} direction='right' unmountOnExit mountOnEnter>
                <Box>
                    <GridConfig />
                </Box>
            </Slide>
            <Box sx={{ position: 'absolute', right: 0, top: 0, background: 'white' }}>
                <IconButton onClick={() => setAreSettingsVisible(p => !p)}>
                    <DragHandle />
                </IconButton>
            </Box>
            <Grid />
            <FabGroup />
        </Box>
    )
}

export default App
