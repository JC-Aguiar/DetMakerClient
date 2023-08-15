import { createSlice } from '@reduxjs/toolkit';

const escolherJobs = createSlice({
    name: 'escolherJobs',
    initialState: false,
    reducers: {
        on: (state) => {
            console.log('[ReducerEscolherJobs] Acionado controlador escolherJobs.on! \n');
            return true;
        },
        off: (state) => {
            console.log('[ReducerEscolherJobs] Acionado controlador escolherJobs.off! \n');
            return false;
        },
    },
});

export default escolherJobs.reducer;
export const { on, off } = escolherJobs.actions;