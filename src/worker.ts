import { astar } from './algorithms/astar'
import { bfs } from './algorithms/bfs'
import { dfs } from './algorithms/dfs'
import { dijkstra } from './algorithms/dijkstra'
import { Grid, SearchAlgorithm } from './types'

onmessage = (e: MessageEvent<{ grid: Grid; algorithm: SearchAlgorithm }>) => {
    const { grid, algorithm } = e.data

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
