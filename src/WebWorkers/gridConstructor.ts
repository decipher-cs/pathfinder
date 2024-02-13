import { Grid } from '../types'

export const constructGrid = (rows: number, columns: number, startingRow = 0, startingColumn = 0): Grid => {
    if (rows <= 0 || columns <= 0) throw new Error('incorrect value for rows or columns while constructing grid')

    const grid = Array(rows * columns)

    for (let i = startingRow; i < rows; i++) {
        for (let j = startingColumn; j < columns; j++) {
            grid[i * columns + j] = {
                index: i * columns + j,
                coordinates: [i, j],
                type: 'open',
                visitedStatus: 'unvisited',
            }
        }
    }

    const randomInt = () => Math.floor(Math.random() * rows * columns)
    grid[randomInt()].type = 'start'
    grid[randomInt()].type = 'finish'

    return grid satisfies Grid
}

onmessage = (e: MessageEvent<{ rows: number; columns: number }>) => {
    postMessage(constructGrid(e.data.rows, e.data.columns))
}
