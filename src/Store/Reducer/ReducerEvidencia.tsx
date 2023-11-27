import { createSlice } from '@reduxjs/toolkit';

const evidencia = createSlice({
    name: 'evidencia',
    initialState: false,
    reducers: {
        on: (state) => {
            console.log('[ReducerEvidencia] Acionado controlador evidencia.on! \n');
            return true;
        },
        off: (state) => {
            console.log('[ReducerEvidencia] Acionado controlador evidencia.off! \n');
            return false;
        },
    },
});

export default evidencia.reducer;
export const { on, off } = evidencia.actions;