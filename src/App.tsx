import { Box, Button } from '@mui/material'
import './App.css'
import Grid from './components/Grid'
import GridConfig from './components/GridConfig'
import { useState } from 'react'
import { Settings } from '@mui/icons-material'
import { FabGroup } from './components/FabGroup'
import { AnimationPlaybackControls, motion, useAnimate } from 'framer-motion'
import { AlgorithmReturnType, Grid as TGrid, SearchAlgorithm } from './types'
import { useGridConfig } from './stateStore/gridConfigStore'

export const worker = new Worker(new URL('./WebWorkers/gridSolver.ts', import.meta.url), { type: 'module' })

export const solveGrid = async (grid: TGrid, algorithm: SearchAlgorithm): Promise<AlgorithmReturnType> => {
    return new Promise((res, rej) => {
        worker.postMessage({ grid, algorithm } satisfies { grid: TGrid; algorithm: SearchAlgorithm })

        const handleResult = (e: MessageEvent<AlgorithmReturnType>) => {
            res(e.data)
            worker.removeEventListener('message', handleResult)
        }
        const handleError = (e: ErrorEvent) => {
            rej(e.message)
            worker.removeEventListener('error', handleError)
        }

        worker.onmessage = handleResult
        worker.onerror = handleError
    })
}

function App() {
    const [areSettingsVisible, setAreSettingsVisible] = useState(true)

    const animationSpeed = useGridConfig(s => s.animationSpeed)

    const [scope, animate] = useAnimate<HTMLDivElement>()

    const animateCellWithStagger = (arr: number[]): AnimationPlaybackControls[] => {
        if (!scope.current) return []

        let delay = 0
        return arr.map(v => {
            const controller = animate('div.cellIndex' + v, { scale: [null, 0.3, 1, null] }, { delay })
            delay += animationSpeed / 1000
            return controller
        })
    }

    return (
        <Box
            component={motion.div}
            animate={{ gridTemplateColumns: areSettingsVisible ? '30% 1fr' : '0% 1fr' }}
            sx={{
                height: '100svh',
                width: '100vw',
                maxWidth: '100vw',
                display: 'grid',
                overflow: 'hidden',
                position: 'relative',
            }}
            className='lattice-bg'
        >
            <Box sx={{ overflow: 'hidden' }}>
                <GridConfig />
            </Box>

            <Grid ref={scope} />
            <FabGroup animateCellWithStagger={animateCellWithStagger} />
            <Button
                sx={{
                    position: 'absolute',
                    borderRadius: '0px',
                    zIndex: areSettingsVisible ? 0 : 999,
                    background: '#312E38',
                }}
                onClick={() => {
                    setAreSettingsVisible(p => !p)
                }}
                variant='contained'
                size='large'
                startIcon={<Settings />}
            >
                Settings
            </Button>
        </Box>
    )
}

export default App
