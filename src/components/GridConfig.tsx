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
import { memo, useRef, useState } from 'react'
import { AlgorithmReturnType, Grid, SearchAlgorithm, searchAlgorithms } from '../types'
import { constructGrid, useGridConfig } from '../stateStore/gridConfigStore'
import { motion, useAnimate } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'

const GridConfig = () => {
    const [rows, columns, animationSpeed, actionOnDrag, cellSize] = useGridConfig(
        useShallow(state => [state.rows, state.columns, state.animationSpeed, state.actionOnDrag, state.cellSize]),
    )

    const { changeColumns, changeAnimationSpeed, changeRows, changeActionOnDrag, setGrid, getGrid, changeCellSize } =
        useGridConfig.getState()

    const [selectedSearchAlgorithm, setSelectedSearchAlgorithm] = useState<SearchAlgorithm>(searchAlgorithms[2])

    // const timeoutQueue = useRef<ReturnType<typeof setTimeout>[]>([])

    const resetGrid = () => {
        setGrid(() => constructGrid(rows, columns))
        // dismissOngoingAnimation()
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gap: 2,
            }}
        >
            <StyledSurface>
                <TextField
                    fullWidth
                    sx={{ width: '100%' }}
                    select
                    value={selectedSearchAlgorithm}
                    label={'selected algorithm'}
                    onChange={e => setSelectedSearchAlgorithm(e.target.value as SearchAlgorithm)}
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
                Rows: {rows}
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
                <ButtonGroup size='small' variant='text'>
                    <Button onClick={resetGrid}>Reset</Button>
                    <Button onClick={resetGrid}>Create Random</Button>
                </ButtonGroup>
            </StyledSurface>

            <StyledSurface>
                <Typography>Drag action:</Typography>
                add walls
                <Switch value={actionOnDrag === 'add wall'} onChange={changeActionOnDrag} />
                remove walls
            </StyledSurface>
        </Box>
    )
}

export default memo(GridConfig)

export const StyledSurface = styled(Box)<BoxProps>(_ => ({}))
