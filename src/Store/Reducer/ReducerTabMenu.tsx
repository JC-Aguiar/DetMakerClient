import { createSlice } from '@reduxjs/toolkit';


const tabMenu = createSlice({
    name: 'tabMenu',
    initialState: true,
    reducers: {
        show: (state) => {
            console.log('[ReducerTabMenu] Acionado controlador tabMenu.show! \n');
            return true;
        },
        hide: (state) => {
            console.log('[ReducerTabMenu] Acionado controlador tabMenu.hide! \n');
            return false;
        },
    },
});

export default tabMenu.reducer;
export const { show, hide } = tabMenu.actions;