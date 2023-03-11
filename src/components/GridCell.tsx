import { Paper } from '@mui/material'
import {
    CodeOffSharp as EndCellIcon,
    CodeSharp as StartCellIcon,
    CheckBoxSharp as CloseCellIcon,
    CalendarViewWeekSharp,
    CheckBoxOutlineBlankSharp as OpenCellIcon,
} from '@mui/icons-material'
import { Action, Cell } from '../App'

interface GridCellProps {
    cellProperties: Cell
    cellId: number
    dispatch: React.Dispatch<Action>
    isMouseLeftButtonPressed: boolean
}

// const GridCell = (props: React.PropsWithChildren<GridCellProps>) => {
const GridCell = ({ cellId, cellProperties, dispatch, isMouseLeftButtonPressed, ...props }: GridCellProps) => {
    return (
        <>
            <div
                onMouseEnter={(e: React.MouseEvent) => {
                    isMouseLeftButtonPressed &&
                        dispatch({ type: 'flipCellOpenCloseStatus', payload: { cellId: cellId } })
                }}
                onClick={(e: React.MouseEvent) => {
                    console.log(cellId)
                    switch (e.detail) {
                        case 1:
                            dispatch({ type: 'flipCellOpenCloseStatus', payload: { cellId: cellId } })
                            break
                        case 2:
                            dispatch({ type: 'changeCellTypeToStart', payload: { cellId: cellId } })
                            break
                        case 3:
                            dispatch({ type: 'changeCellTypeToEnd', payload: { cellId: cellId } })
                            break
                    }
                }}
            >
                {(() => {
                    switch (cellProperties.cellType) {
                        case 'open':
                            return <OpenCellIcon />
                        case 'close':
                            return <CloseCellIcon />
                        case 'start':
                            return <StartCellIcon />
                        case 'end':
                            return <EndCellIcon />
                        default:
                            return <CalendarViewWeekSharp />
                    }
                })()}
            </div>
        </>
    )
}

export default GridCell
