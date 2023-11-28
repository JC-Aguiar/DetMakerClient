import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JwtDTO } from '../../data/JwtDTO';
import { UserDTO } from '../../data/UserDTO';

//Valores iniciais do recuder
const initialState = { 
    jwt: null,
    user: null,
} as ReducerUserTYPE;

//Interface das propriedades deste reducer
export interface ReducerUserTYPE {
    jwt: JwtDTO | null;
    user: UserDTO | null;
}

const login = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setJwt: (state, action: PayloadAction<JwtDTO>) => {
            console.log('[ReducerUser] Acionado controlador login.setJwt! \n');
            state.jwt = action.payload;
            console.log('[ReducerUser] Jwt atual: ' + JSON.stringify(state.jwt));
        },
        setUser: (state, action: PayloadAction<UserDTO | null>) => {
            console.log('[ReducerUser] Acionado controlador login.setUser! \n');
            state.user = action.payload;
            console.log('[ReducerUser] User atual: ' + JSON.stringify(state.user));
        },
    },
});

export default login.reducer;
export const { setJwt, setUser } = login.actions;