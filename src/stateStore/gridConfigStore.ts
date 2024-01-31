import { GridConfig, GridConfigActions } from '../types'
import { create } from 'zustand'

export const useGridConfig = create<GridConfig & GridConfigActions>()(set => {
    return {
        rows: 20,
        changeRows: (newVal: number) => set(state => ({ rows: newVal })),

        columns: 20,
        changeColumns: (newVal: number) => set(state => ({ columns: newVal })),

        cellSize: 20,
        changeCellSize: (newVal: number) => set(state => ({ cellSize: newVal })),

        density: 3,
        changeDensity: (newVal: number) => set(state => ({ density: newVal })),

        animationSpeed: 30,
        changeAnimationSpeed: (newVal: number) => set(state => ({ animationSpeed: newVal })),
    }
})
