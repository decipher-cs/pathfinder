import {
    Box,
    BoxProps,
    Button,
    ButtonGroup,
    MenuItem,
    Slider,
    Switch,
    TextField,
    Typography,
    styled,
} from '@mui/material'
import { CSSProperties, forwardRef, memo } from 'react'
import { SearchAlgorithm, searchAlgorithms } from '../types'
import { constructGrid, insertWallsAtRandom, useGridConfig } from '../stateStore/gridConfigStore'
import { motion } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'

const GridConfig = forwardRef((props: { style?: CSSProperties }, ref) => {
    const [rows, columns, animationSpeed, actionOnDrag, cellSize, selectedAlgorithm, resizeGrid] = useGridConfig(
        useShallow(state => [
            state.rows,
            state.columns,
            state.animationSpeed,
            state.actionOnDrag,
            state.cellSize,
            state.selectedAlgorithm,
            state.resizeGrid,
        ]),
    )

    const {
        changeColumns,
        changeAnimationSpeed,
        changeRows,
        changeActionOnDrag,
        setGrid,
        changeCellSize,
        changeSelectedAlgorithm,
    } = useGridConfig.getState()

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
                    onChangeCommitted={resizeGrid}
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
                    onChangeCommitted={resizeGrid}
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
                            setGrid(p =>
                                p.map(c => (c.visitedStatus === 'visited' ? { ...c, visitedStatus: 'unvisited' } : c)),
                            )
                            setGrid(insertWallsAtRandom)
                        }}
                    >
                        insert walls randomly
                    </Button>
                    <Button
                        onClick={() => {
                            setGrid(p =>
                                p.map(c => (c.visitedStatus === 'visited' ? { ...c, visitedStatus: 'unvisited' } : c)),
                            )
                        }}
                    >
                        reset visited path
                    </Button>
                    <Button
                        onClick={() => {
                            setGrid(p =>
                                p.map(c => (c.visitedStatus === 'visited' ? { ...c, visitedStatus: 'unvisited' } : c)),
                            )
                            setGrid(p => p.map(c => (c.type === 'close' ? { ...c, type: 'open' } : c)))
                        }}
                    >
                        remove walls
                    </Button>
                    <Button
                        onClick={async () => {
                            setGrid(p =>
                                p.map(c => (c.visitedStatus === 'visited' ? { ...c, visitedStatus: 'unvisited' } : c)),
                            )
                            setGrid(() => constructGrid(rows, columns))
                        }}
                    >
                        reset
                    </Button>
                </ButtonGroup>
            </StyledSurface>
        </Box>
    )
})
export default memo(GridConfig)

export const StyledSurface = styled(Box)<BoxProps>(_ => ({}))
