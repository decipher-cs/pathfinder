import { Paper } from '@mui/material'
import {} from '@mui/icons-material'
import { CellReducerActions, Cell, CursorSelectionType } from '../App'
import { animated, SpringRef, SpringValue, useSpring, useSpringRef } from '@react-spring/web'
import { memo, useRef } from 'react'

interface GridCellProps {
    cellProperties: Cell
    cellId: number
    dispatch: React.Dispatch<CellReducerActions>
    cellProps: { [key: string]: SpringValue<number> | SpringValue<string> }
    isMouseLeftButtonPressed: boolean
    cursorClickActionMode: CursorSelectionType
}

const getCellColor = (cellType: Cell['cellType'], isCellVisited: Cell['cellVisited']) => {
    if (isCellVisited === true) return 'cyan'
    switch (cellType) {
        case 'open':
            return 'grey'
        case 'close':
            return 'blue'
        case 'start':
            return 'green'
        case 'end':
            return 'red'
    }
}

const AnimatedPaper = animated(Paper)

const GridCell = (props: GridCellProps) => {
    // const [cellSpringStyle, api] = useSpring(() => ({
    //     to: {
    //         backgroundColor: getCellColor(props.cellProperties.cellType, props.cellProperties.cellVisited),
    //         scale: 1,
    //     },
    // }))
    // api.start({
    //     to: {
    //         backgroundColor: getCellColor(props.cellProperties.cellType, props.cellProperties.cellVisited),
    //         scale: props.cellProperties.cellVisited ? 0.5 : 1,
    //     },
    // })
    return (
        <>
            <animated.div
                style={{
                    backgroundColor: getCellColor(props.cellProperties.cellType, props.cellProperties.cellVisited),
                    padding: '0.6em',
                }}
                // style={{ ...cellSpringStyle, padding: '0.3em' }}
                onMouseEnter={(e: React.MouseEvent) => {
                    if (props.isMouseLeftButtonPressed)
                        props.dispatch({ type: 'flipCellOpenCloseStatus', payload: { cellId: props.cellId } })
                }}
                onClick={(e: React.MouseEvent) => {
                    switch (props.cursorClickActionMode) {
                        case 'open/close':
                            props.dispatch({
                                type: 'flipCellOpenCloseStatus',
                                payload: { cellId: props.cellId },
                            })
                            break
                        case 'start':
                            props.dispatch({ type: 'changeCellTypeToStart', payload: { cellId: props.cellId } })
                            break
                        case 'end':
                            props.dispatch({ type: 'changeCellTypeToEnd', payload: { cellId: props.cellId } })
                            break
                    }
                }}
            >
            </animated.div>
        </>
    )
}

export default memo(GridCell)
