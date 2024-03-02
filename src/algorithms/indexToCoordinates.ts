export default function indexToCoordinates(index: number, columns: number): [number, number] {
    const i = Math.floor(index / columns)
    const j = index % columns
    return [i, j]
}
