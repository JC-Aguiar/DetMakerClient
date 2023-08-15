import { createSlice } from '@reduxjs/toolkit';

const configurarJobs = createSlice({
    name: 'configurarJobs',
    initialState: false,
    reducers: {
        on: (state) => {
            console.log('[ReducerConfigurarJobs] Acionado controlador configurarJobs.on! \n');
            return true;
        },
        off: (state) => {
            console.log('[ReducerConfigurarJobs] Acionado controlador configurarJobs.off! \n');
            return false;
        },
    },
});

export default configurarJobs.reducer;
export const { on, off } = configurarJobs.actions;