import { astar } from '../algorithms/astar'
import { bfs } from '../algorithms/bfs'
import { dfs } from '../algorithms/dfs'
import { dijkstra } from '../algorithms/dijkstra'
import { Grid, GridSchema, SearchAlgorithm, searchAlgorithms } from '../types'

onmessage = (e: MessageEvent<{ grid: Grid; algorithm: SearchAlgorithm; columns: number }>) => {
    const { grid, algorithm, columns } = e.data

    if (!searchAlgorithms.includes(algorithm) || !GridSchema.safeParse(grid) || typeof columns !== 'number')
        throw new Error('Incorrect grid layout or unsupported parameters in worker')

    switch (algorithm) {
        case 'dfs':
            return postMessage(dfs(grid, columns))
        case 'astar':
            return postMessage(astar(grid, columns))
        case 'bfs':
            return postMessage(bfs(grid, columns))
        case 'dijkstra':
            return postMessage(dijkstra(grid, columns))
        default:
            throw new Error('Unsupported Algorithm')
    }
}
