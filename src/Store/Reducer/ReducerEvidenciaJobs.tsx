import { createSlice } from '@reduxjs/toolkit';

const evidenciaJobs = createSlice({
    name: 'evidenciaJobs',
    initialState: false,
    reducers: {
        on: (state) => {
            console.log('[ReducerEvidenciaJobs] Acionado controlador evidenciaJobs.on! \n');
            return true;
        },
        off: (state) => {
            console.log('[ReducerEvidenciaJobs] Acionado controlador evidenciaJobs.off! \n');
            return false;
        },
    },
});

export default evidenciaJobs.reducer;
export const { on, off } = evidenciaJobs.actions;