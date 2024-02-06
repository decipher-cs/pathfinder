import { astar } from './algorithms/astar'
import { bfs } from './algorithms/bfs'
import { dfs } from './algorithms/dfs'
import { dijkstra } from './algorithms/dijkstra'
import { Grid, GridSchema, SearchAlgorithm, searchAlgorithms } from './types'

onmessage = (e: MessageEvent<{ grid: Grid; algorithm: SearchAlgorithm }>) => {
    const { grid, algorithm } = e.data

    if (!searchAlgorithms.includes(algorithm) || !GridSchema.safeParse(grid))
        throw new Error('Incorrect grid layout or unsupported algorithm')

    switch (algorithm) {
        case 'dfs':
            return postMessage(dfs(grid))
        case 'astar':
            return postMessage(astar(grid))
        case 'bfs':
            return postMessage(bfs(grid))
        case 'dijkstra':
            return postMessage(dijkstra(grid))
        default:
            throw new Error('Unsupported Algorithm')
    }
}
