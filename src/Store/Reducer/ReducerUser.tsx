import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JwtDTO } from '../../data/JwtDTO';

//Valores iniciais do recuder
const initialState = { 
    value: null,
} as ReducerUserTYPE;

//Interface das propriedades deste reducer
export interface ReducerUserTYPE {
    value: JwtDTO | null;
}

const login = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<ReducerUserTYPE>) => {
            console.log('[ReducerUser] Acionado controlador login.setUser! \n');
            state.value = action.payload.value;
            console.log('[ReducerUser] Usuário atual: ' + JSON.stringify(state.value));
        },
    },
});

export default login.reducer;
export const { setUser } = login.actions;