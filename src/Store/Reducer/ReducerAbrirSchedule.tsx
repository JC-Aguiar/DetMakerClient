import { createSlice } from '@reduxjs/toolkit';

const abrirSchedule = createSlice({
    name: 'abrirSchedule',
    initialState: false,
    reducers: {
        on: (state) => {
            console.log('[ReducerAbrirSchedule] Acionado controlador abrirSchedule.on! \n');
            return true;
        },
        off: (state) => {
            console.log('[ReducerAbrirSchedule] Acionado controlador abrirSchedule.off! \n');
            return false;
        },
    },
});

export default abrirSchedule.reducer;
export const { on, off } = abrirSchedule.actions;