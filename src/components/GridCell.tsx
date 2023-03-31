import { Paper } from '@mui/material'
import {
    CodeOffSharp as EndCellIcon,
    CodeSharp as StartCellIcon,
    CheckBoxSharp as CloseCellIcon,
    CalendarViewWeekSharp,
    CheckBoxOutlineBlankSharp as OpenCellIcon,
    LensBlur,
    Grain,
    BlurCircular,
    Circle,
    Adjust,
    AddOutlined,
    StopRounded,
    CropSquare,
    CheckBoxRounded,
    Square,
    CheckBoxSharp,
    DisabledByDefault,
    IndeterminateCheckBoxSharp,
    DisabledByDefaultSharp,
    CropSquareSharp,
    SquareSharp,
} from '@mui/icons-material'
import { CellReducerActions, Cell, CursorSelectionType } from '../App'
import { animated, SpringRef, SpringValue, useSpring, useSpringRef } from '@react-spring/web'
import { useRef } from 'react'

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
    const api = useSpringRef()
    const cellSpringStyle = useSpring({
        ref: api,
        from: { color: 'grey' },
        to: {
            backgroundColor: getCellColor(props.cellProperties.cellType, props.cellProperties.cellVisited),
            scale: 1,
        },
    })
    api.start(() => ({
        to: {
            backgroundColor: getCellColor(props.cellProperties.cellType, props.cellProperties.cellVisited),
            scale: props.cellProperties.cellVisited ? 0.5 : 1,
            // rotate: props.cellProperties.cellVisited ? '405deg' : '0deg',
        },
    }))
    return (
        <>
            <animated.div
                style={{ ...cellSpringStyle, padding: '0.6em' }}
                onMouseEnter={(e: React.MouseEvent) => {
                    props.isMouseLeftButtonPressed &&
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
                {/* {(() => { */}
                {/*     // return <div>a</div> */}
                {/*     return <SquareSharp fontSize='small' /> */}
                {/*     if (props.cellProperties.cellVisited === true) return <CheckBoxSharp /> */}
                {/*     switch (props.cellProperties.cellType) { */}
                {/*         case 'open': */}
                {/*             return <SquareSharp /> */}
                {/*         case 'close': */}
                {/*             return <SquareSharp /> */}
                {/*         case 'start': */}
                {/*             return <IndeterminateCheckBoxSharp /> */}
                {/*         case 'end': */}
                {/*             return <DisabledByDefaultSharp /> */}
                {/*         default: */}
                {/*             return <CheckBoxSharp /> */}
                {/*     } */}
                {/* })()} */}
            </animated.div>
        </>
    )
}

export default GridCell
