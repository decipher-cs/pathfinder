import { z } from 'zod'

export const searchAlgorithms = ['dfs', 'bfs', 'astar', 'dijkstra'] as const

export type SearchAlgorithm = (typeof searchAlgorithms)[number]

export const cellType = {
    open: 'open',
    close: 'close',
    start: 'start',
    finish: 'finish',
} as const

export type CellType = keyof typeof cellType

export const CellSchema = z
    .object({
        index: z.number(),
        coordinates: z.tuple([z.number(), z.number()]).readonly(),
        visitedStatus: z.union([z.literal('visited'), z.literal('unvisited')]),
        type: z.nativeEnum(cellType),
    })
    .readonly()

export type Cell = z.infer<typeof CellSchema>

export const GridSchema = z.array(CellSchema).readonly()

export type Grid = z.infer<typeof GridSchema>

export const gridStatus = {
    solving: 'solving',
    animating: 'animating',
    'waiting to start': 'waiting to start',
    error: 'error',
} as const

export type GridStatus = keyof typeof gridStatus

export type GridConfig = {
    grid: Grid
    status: GridStatus
    animationSpeed: number
    rows: number
    columns: number
    cellSize: number
    actionOnDrag: 'add wall' | 'remove wall'
    selectedAlgorithm: SearchAlgorithm
}

export type GridConfigActions = {
    setGrid: (fn: (grid: Grid) => Grid) => void
    setGridStatus: (status: GridStatus) => void
    resizeGrid: () => void
    changeColumns: (val: number) => void
    changeCellSize: (val: number) => void
    changeAnimationSpeed: (val: number) => void
    changeRows: (val: number) => void
    changeActionOnDrag: () => void
    changeSelectedAlgorithm: (algorithm: SearchAlgorithm) => void
}

export type AlgorithmReturnType = {
    pathTaken: number[]
    shortestPath: number[] | null
}
