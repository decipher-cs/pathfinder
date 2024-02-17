import {
    Box,
    BoxProps,
    Button,
    ButtonGroup,
    MenuItem,
    Paper,
    PaperProps,
    Slider,
    Switch,
    TextField,
    Typography,
    styled,
} from '@mui/material'
import { CSSProperties, ForwardedRef, forwardRef, memo, useRef, useState } from 'react'
import { AlgorithmReturnType, Grid, SearchAlgorithm, searchAlgorithms } from '../types'
import { constructGrid, useGridConfig } from '../stateStore/gridConfigStore'
import { motion, useAnimate } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'

const GridConfig = forwardRef((props: { style?: CSSProperties }, ref) => {
    const [rows, columns, animationSpeed, actionOnDrag, cellSize, selectedAlgorithm] = useGridConfig(
        useShallow(state => [
            state.rows,
            state.columns,
            state.animationSpeed,
            state.actionOnDrag,
            state.cellSize,
            state.selectedAlgorithm,
        ]),
    )

    const {
        changeColumns,
        changeAnimationSpeed,
        changeRows,
        changeActionOnDrag,
        setGrid,
        getGrid,
        changeCellSize,
        changeSelectedAlgorithm,
    } = useGridConfig.getState()

    // const timeoutQueue = useRef<ReturnType<typeof setTimeout>[]>([])

    const resetGrid = async () => {
        setGrid(() => constructGrid(rows, columns))
        // dismissOngoingAnimation()
    }

    return (
        <Box
            ref={ref}
            component={motion.div}
            sx={{
                height: '100%',
                width: '30vw',
                overflow: 'clip',

                display: 'grid',
                background: 'white',
                gap: 5,
                px: 4,
                py: 7,
                ...props.style,
            }}
        >
            <StyledSurface>
                <TextField
                    fullWidth
                    sx={{ width: '100%' }}
                    select
                    value={selectedAlgorithm}
                    label={'selected algorithm'}
                    onChange={e => {
                        const algo = e.target.value as SearchAlgorithm
                        if (!searchAlgorithms.includes(algo)) throw new Error('Unsupported algorithm selected')
                        changeSelectedAlgorithm(algo)
                    }}
                >
                    {searchAlgorithms.map(name => (
                        <MenuItem key={name} value={name}>
                            {name}
                        </MenuItem>
                    ))}
                </TextField>
            </StyledSurface>

            <StyledSurface>
                Cell size: {cellSize}
                <Slider
                    step={5}
                    marks
                    valueLabelDisplay='auto'
                    min={10}
                    max={50}
                    value={cellSize}
                    onChange={(_, v) => changeCellSize(Array.isArray(v) ? v[0] : v)}
                />
                <Typography>Rows: {rows}</Typography>
                <Slider
                    step={5}
                    marks
                    valueLabelDisplay='auto'
                    min={10}
                    max={50}
                    value={rows}
                    onChange={(_, v) => changeRows(Array.isArray(v) ? v[0] : v)}
                />
                Columns: {columns}
                <Slider
                    step={5}
                    valueLabelDisplay='auto'
                    marks
                    min={10}
                    max={50}
                    value={columns}
                    onChange={(_, v) => changeColumns(Array.isArray(v) ? v[0] : v)}
                />
            </StyledSurface>

            <StyledSurface>
                <TextField
                    fullWidth
                    type='number'
                    InputProps={{ endAdornment: 'X' }}
                    size='small'
                    inputProps={{ min: 0, max: 90 }}
                    required
                    label='animation speed'
                    value={animationSpeed}
                    onChange={e => {
                        const value = Number(e.target.value)
                        if (typeof value === 'number') changeAnimationSpeed(value)
                    }}
                    helperText='Greater value yields faster animation'
                />
            </StyledSurface>

            <StyledSurface>
                <Typography>Drag action:</Typography>
                adds wall
                <Switch value={actionOnDrag === 'add wall'} onChange={changeActionOnDrag} />
                removes wall
            </StyledSurface>

            <StyledSurface>
                <ButtonGroup variant='text' orientation='vertical' fullWidth>
                    <Button
                        onClick={() => {
                            const randBool = () => Boolean(Math.floor(Math.random() * 3.5))
                            setGrid(p =>
                                p.map(c =>
                                    c.type === 'open' || c.type === 'close'
                                        ? { ...c, type: randBool() ? 'open' : 'close' }
                                        : c,
                                ),
                            )
                        }}
                    >
                        insert walls at random location
                    </Button>
                    <Button
                        onClick={() => {
                            setGrid(p =>
                                p.map(c => (c.visitedStatus === 'visited' ? { ...c, visitedStatus: 'unvisited' } : c)),
                            )
                        }}
                    >
                        reset taken paths
                    </Button>
                    <Button
                        onClick={() => {
                            setGrid(p => p.map(c => (c.type === 'close' ? { ...c, type: 'open' } : c)))
                        }}
                    >
                        remove all walls
                    </Button>
                    <Button
                        onClick={async () => {
                            setGrid(() => constructGrid(rows, columns))
                        }}
                    >
                        recreate grid
                    </Button>
                </ButtonGroup>
            </StyledSurface>
        </Box>
    )
})
export default memo(GridConfig)

export const StyledSurface = styled(Box)<BoxProps>(_ => ({}))
