import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DynamicButtonsAddsOn } from '../../components/DynamicButtons';

//Valores iniciais do recuder
const initialState = { 
    value: [], 
} as ReducerButtonsProps;

//Interface das propriedades deste reducer
export interface ReducerButtonsProps {
    value: DynamicButtonsAddsOn[];
}

const login = createSlice({
    name: 'buttons',
    initialState,
    reducers: {
        setButtons: (state, action: PayloadAction<DynamicButtonsAddsOn[]>) => {
            console.log('[ReducerButtons] Acionado controlador buttons.setButtons! \n');
            state.value = action.payload;
            //console.log('[ReducerButtons] Jwt atual: ' + JSON.stringify(action.payload));
        },
    },
});

export default login.reducer;
export const { setButtons } = login.actions;