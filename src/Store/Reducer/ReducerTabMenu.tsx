import { createSlice } from '@reduxjs/toolkit';

const tabMenu = createSlice({
    name: 'tabMenu',
    initialState: true,
    reducers: {
        show: (state) => {
            console.log('[ReducerTabMenu] Acionado controlador createSlice.show! \n');
            return true;
        },
        hide: (state) => {
            console.log('[ReducerTabMenu] Acionado controlador createSlice.hide! \n');
            return false;
        },
    },
});

export default tabMenu.reducer;
export const { show, hide } = tabMenu.actions;