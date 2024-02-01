export const searchAlgorithms = ['dfs', 'bfs', 'astar', 'dijkstra'] as const

export type SearchAlgorithm = (typeof searchAlgorithms)[number]

export type CellType = 'open' | 'close' | 'start' | 'finish'

export type Cell = {
    readonly index: number
    readonly coordinates: [number, number]
    readonly type: CellType
    readonly visitedStatus: 'visited' | 'unvisited'
}

export type Grid = Cell[]

export type GridConfig = {
    grid: Grid
    animationSpeed: number
    rows: number
    columns: number
    cellSize: number
    density: number // ?? It's like, how many rows and columns in a given grid...idk hard to explain... need to think this through ??
}

export type GridConfigActions = {
    setGrid: (fn: (grid: Grid) => Grid) => void
    changeColumns: (val: number) => void
    changeDensity: (val: number) => void
    changeCellSize: (val: number) => void
    changeAnimationSpeed: (val: number) => void
    changeRows: (val: number) => void
}
