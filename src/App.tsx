import { Box, Button } from '@mui/material'
import './App.css'
import Grid from './components/Grid'
import GridConfig from './components/GridConfig'
import {  useRef, useState } from 'react'
import { Settings } from '@mui/icons-material'
import { FabGroup } from './components/FabGroup'
import { AnimationPlaybackControls, motion, useAnimate } from 'framer-motion'
import { AlgorithmReturnType, Grid as TGrid, SearchAlgorithm } from './types'
import { useGridConfig } from './stateStore/gridConfigStore'

export const worker = new Worker(new URL('./WebWorkers/gridSolver.ts', import.meta.url), { type: 'module' })

export const solveGrid = async (
    grid: TGrid,
    columns: number,
    algorithm: SearchAlgorithm,
): Promise<AlgorithmReturnType> => {
    return new Promise((res, rej) => {
        worker.postMessage({ grid, algorithm, columns })

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

    const { animationSpeed } = useGridConfig(s => ({ animationSpeed: s.animationSpeed }))

    const [scope, animate] = useAnimate<HTMLDivElement>()

    const ongoingAnimationControllers = useRef<AnimationPlaybackControls[]>([])

    const cancelAnimations = () => {
        ongoingAnimationControllers.current.forEach(controller => controller.cancel())
        ongoingAnimationControllers.current = []
    }

    const animateCellWithStagger = (arr: number[], postAnimation: () => void): AnimationPlaybackControls[] => {
        if (!scope.current) return []
        if (ongoingAnimationControllers.current.length > 0) cancelAnimations()

        let delay = 0
        const controllers = arr.map((v, i) => {
            const controller = animate(
                'div.cellIndex' + v,
                { scale: [null, 0.3, 1, null] },
                {
                    delay,
                    onComplete() {
                        if (i === arr.length - 1) {
                            postAnimation()
                            ongoingAnimationControllers.current = []
                        }
                    },
                },
            )
            delay += animationSpeed / 1000
            return controller
        })

        ongoingAnimationControllers.current.push(...controllers)

        return controllers
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
            <FabGroup animateCellWithStagger={animateCellWithStagger} cancelAnimations={cancelAnimations} />
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
