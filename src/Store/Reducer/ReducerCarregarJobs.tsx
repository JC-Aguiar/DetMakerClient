import { createSlice } from '@reduxjs/toolkit';

const carregarJobs = createSlice({
    name: 'carregarJobs',
    initialState: false,
    reducers: {
        on: (state) => {
            console.log('[ReducerCarregarJobs] Acionado controlador abrirSchedule.on! \n');
            return true;
        },
        off: (state) => {
            console.log('[ReducerCarregarJobs] Acionado controlador abrirSchedule.off! \n');
            return false;
        },
    },
});

export default carregarJobs.reducer;
export const { on, off } = carregarJobs.actions;