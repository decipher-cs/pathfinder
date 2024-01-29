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
