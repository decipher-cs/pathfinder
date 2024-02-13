import { Box, Button, IconButton, Slide } from '@mui/material'
import './App.css'
import Grid from './components/Grid'
import GridConfig from './components/GridConfig'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Settings } from '@mui/icons-material'
import { FabGroup } from './components/FabGroup'

function App() {
    const [areSettingsVisible, setAreSettingsVisible] = useState(true)

    return (
        <Box
            sx={{
                height: '100svh',
                width: '100vw',
                maxWidth: '100vw',
                display: 'flex',
                gap: areSettingsVisible ? 5 : 0,
                overflow: 'visible',
                position: 'relative',
            }}
            className='lattice-bg'
        >
            <Box
                sx={{
                    flexBasis: areSettingsVisible ? '30%' : '0px',
                    overflow: 'hidden',
                    transition: 'flex 0.3s ease-out',
                }}
            >
                <GridConfig />
            </Box>
            <Button
                sx={{
                    position: 'absolute',
                    borderRadius: '0px',
                    zIndex: areSettingsVisible ? 0 : 999,
                    background: '#312E38',
                }}
                onClick={() => setAreSettingsVisible(p => !p)}
                variant='contained'
                size='large'
                startIcon={<Settings />}
            >
                Settings
            </Button>
            <Grid />
            <FabGroup />
        </Box>
    )
}

export default App
