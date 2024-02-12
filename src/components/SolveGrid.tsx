import { PlayArrow } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useRef } from 'react'
import { AlgorithmReturnType, Grid, SearchAlgorithm } from '../types'
import { useGridConfig } from '../stateStore/gridConfigStore'

export const worker = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' })

export const solveGrid = async (grid: Grid, algorithm: SearchAlgorithm): Promise<AlgorithmReturnType> => {
    return new Promise((res, rej) => {
        worker.postMessage({ grid, algorithm } satisfies { grid: Grid; algorithm: SearchAlgorithm })

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

export const SolveGrid = () => {
    const { setGrid, getGrid, animationSpeed, selectedAlgorithm } = useGridConfig(s => ({
        setGrid: s.setGrid,
        getGrid: s.getGrid,
        animationSpeed: s.animationSpeed,
        selectedAlgorithm: s.selectedAlgorithm,
    }))

    const timeoutQueue = useRef<ReturnType<typeof setTimeout>[]>([])

    const animateTakenPathWithDelay = (cellIndexArr: number[], delayInMs = 1000 / animationSpeed) => {
        let timeout = 0

        const animationSequence = cellIndexArr.map(cellIndex => {
            return new Promise(res => {
                const timeoutId = setTimeout(
                    () => {
                        setGrid(p =>
                            p.map(cell => (cell.index === cellIndex ? { ...cell, visitedStatus: 'visited' } : cell)),
                        )
                        res(cellIndex)
                    },
                    (timeout += delayInMs),
                )
                timeoutQueue.current.push(timeoutId)
            })
        })
        return Promise.all(animationSequence)
    }

    const successAnimation = () => {
        // animate(scope.current, { rotate: '360deg' })
    }

    const failureAnimation = () => {
        // animate(scope.current, { background: ['#fff', '#000'] })
    }

    const resetGrid = () => {
        // setGrid(() => constructGrid(rows, columns))
        dismissOngoingAnimation()
    }

    const dismissOngoingAnimation = () => {
        timeoutQueue.current.forEach(timeoutId => clearTimeout(timeoutId))
        timeoutQueue.current = []
    }
    return (
        <Button
            aria-label='solve grid'
            startIcon={<PlayArrow />}
            onClick={async () => {
                try {
                    const { pathTaken, shortestPath } = await solveGrid(getGrid(), selectedAlgorithm)

                    const startingCell = pathTaken.shift()
                    const endingCell = pathTaken.pop()

                    if (!startingCell || !endingCell)
                        throw new Error(
                            'Start/ finish cell not found while evaluating result. This is unexpected behaviour',
                        )

                    const visitedCells = await animateTakenPathWithDelay(pathTaken)

                    if (shortestPath) {
                        visitedCells.forEach(cellIndex => {
                            setGrid(p => {
                                return p.map(cell =>
                                    cell.index === cellIndex ? { ...cell, visitedStatus: 'unvisited' } : cell,
                                )
                            })
                        })
                        shortestPath.shift()
                        shortestPath.pop()
                        await animateTakenPathWithDelay(shortestPath)
                    }

                    const finishCell = getGrid().filter(c => c.type === 'finish')[0].index

                    endingCell === finishCell ? successAnimation() : failureAnimation()
                } catch (err) {
                    alert('caught error: ' + err)
                }
            }}
        >
            Solve {selectedAlgorithm}
        </Button>
    )
}
