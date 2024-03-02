import { Grid, GridConfig, GridConfigActions } from '../types'
import { create } from 'zustand'

export const constructGrid = (rows: number, columns: number, startingIndex = 0): Grid => {
    if (rows <= 0 || columns <= 0) throw new Error('incorrect value for rows or columns while constructing grid')

    const grid = []

    for (let i = startingIndex; i < rows * columns; i++) {
        grid.push({
            index: i,
            type: 'open' as const,
            visitedStatus: 'unvisited' as const,
        })
    }

    return grid satisfies Grid
}

export const insertWallsAtRandom = (grid: Grid, randomness = 3.1): Grid => {
    // randomness is inversely proportional to the chances of a wall getting places.
    // Basically, more randomness = less walls

    const randBool = () => Boolean(Math.floor(Math.random() * randomness))

    /*
     * It might seem odd and counter-intuitive to create a function getNewType and variable newType but
     * the reason for not directly using randBool() inside the map like this
     * `type: randBool() ? 'open' : 'close'
     * is to avoid unnecessary re-renders. Directly using randBool() would mean every cell will re-render
     * even if the value 'open'/ 'close' didn't actually change.
     * */
    const getNewType = () => (randBool() ? 'open' : 'close')
    let newType: 'open' | 'close' = 'open'

    return grid.map(c =>
        (c.type === 'open' || c.type === 'close') && c.type !== (newType = getNewType()) ? { ...c, type: newType } : c,
    ) satisfies Grid
}

export const useGridConfig = create<GridConfig & GridConfigActions>()((set, get) => ({
    grid: constructGrid(20, 20),

    setGrid: fn => set(state => ({ grid: fn(state.grid) })),

    resizeGrid: () =>
        set(({ columns, rows, grid }) => {
            const size = rows * columns
            const currLen = grid.length

            if (currLen < size) {
                const newGrid = constructGrid(rows, columns, currLen)
                return { grid: [...grid, ...newGrid] }
            } else if (currLen > size) {
                const grid = get().grid.slice(0, size)
                return { grid }
            }
            return {}
        }),

    rows: 20,
    changeRows: (newVal: number) => set(_ => ({ rows: newVal })),

    columns: 20,
    changeColumns: (newVal: number) => set(_ => ({ columns: newVal })),

    cellSize: 30,
    changeCellSize: (newVal: number) => set(_ => ({ cellSize: newVal })),

    selectedAlgorithm: 'astar',
    changeSelectedAlgorithm: selectedAlgorithm => set(_ => ({ selectedAlgorithm })),

    animationSpeed: 30,
    changeAnimationSpeed: (newVal: number) => set(_ => ({ animationSpeed: newVal })),

    actionOnDrag: 'add wall',
    changeActionOnDrag: () =>
        set(prev => ({ actionOnDrag: prev.actionOnDrag === 'add wall' ? 'remove wall' : 'add wall' })),
}))
