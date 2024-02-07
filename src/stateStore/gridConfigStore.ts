import { Grid, GridConfig, GridConfigActions, gridStatus } from '../types'
import { create } from 'zustand'

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

export const useGridConfig = create<GridConfig & GridConfigActions>()((set, get) => {
    return {
        grid: constructGrid(20, 20),
        setGrid: fn => set(state => ({ grid: fn(state.grid) })),

        getGrid: () => get().grid,

        status: gridStatus['waiting to start'],
        setGridStatus: status => set(_ => ({ status })),

        rows: 20,
        changeRows: (newVal: number) =>
            set(state => {
                return { rows: newVal, grid: constructGrid(newVal, state.columns) }
            }),

        columns: 20,
        changeColumns: (newVal: number) =>
            set(state => {
                return { columns: newVal, grid: constructGrid(state.rows, newVal) }
            }),

        cellSize: 20,
        changeCellSize: (newVal: number) => set(_ => ({ cellSize: newVal })),

        animationSpeed: 30,
        changeAnimationSpeed: (newVal: number) => set(_ => ({ animationSpeed: newVal })),

        actionOnDrag: 'add wall',
        changeActionOnDrag: () =>
            set(prev => ({ actionOnDrag: prev.actionOnDrag === 'add wall' ? 'remove wall' : 'add wall' })),
    }
})
