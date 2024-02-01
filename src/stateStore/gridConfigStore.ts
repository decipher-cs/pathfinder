import { Grid, GridConfig, GridConfigActions } from '../types'
import { create } from 'zustand'

export const constructGrid = (rows: number, columns: number): Grid => {
    if (rows <= 0 || columns <= 0) throw new Error('incorrect value for rows or columns while constructing grid')

    const grid: Grid = []
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            grid.push({
                index: i * columns + j,
                coordinates: [i, j],
                type: 'open',
                visitedStatus: 'unvisited',
            })
        }
    }

    const getRandom = () => Math.floor(Math.random() * (rows * columns))

    let random = getRandom()
    grid[random] = { ...grid[random], type: 'start' }
    random = getRandom()
    grid[random] = { ...grid[random], type: 'finish' }

    return grid
}

export const useGridConfig = create<GridConfig & GridConfigActions>()(set => {
    return {
        grid: constructGrid(20, 20),
        setGrid: fn => set(state => ({ grid: fn(state.grid) })),

        rows: 20,
        changeRows: (newVal: number) =>
            set(state => {
                const grid = constructGrid(newVal, state.columns)
                return { rows: newVal, grid }
            }),

        columns: 20,
        changeColumns: (newVal: number) =>
            set(state => {
                const grid = constructGrid(state.rows, newVal)
                return { columns: newVal, grid }
            }),

        cellSize: 20,
        changeCellSize: (newVal: number) => set(state => ({ cellSize: newVal })),

        density: 3,
        changeDensity: (newVal: number) => set(state => ({ density: newVal })),

        animationSpeed: 30,
        changeAnimationSpeed: (newVal: number) => set(state => ({ animationSpeed: newVal })),
    }
})
