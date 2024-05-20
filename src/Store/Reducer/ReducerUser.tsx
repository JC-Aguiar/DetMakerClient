import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JwtDTO } from '../../data/JwtDTO';
import { UserDTO } from '../../data/UserDTO';

//Valores iniciais do recuder
const initialState = { 
    jwt: null,
    user: null,
    mensagens: []
} as ReducerUserTYPE;

//Interface das propriedades deste reducer
export interface ReducerUserTYPE {
    jwt: JwtDTO | null;
    user: UserDTO | null;
    mensagens: string[];
}

const login = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setJwt: (state, action: PayloadAction<JwtDTO | null>) => {
            console.log('[ReducerUser] Acionado controlador login.setJwt!');
            state.jwt = action.payload;
            //console.log('[ReducerUser] Jwt atual: ' + JSON.stringify(state.jwt));
        },
        setUser: (state, action: PayloadAction<UserDTO | null>) => {
            console.log('[ReducerUser] Acionado controlador login.setUser!');
            state.user = action.payload;
            //console.log('[ReducerUser] User atual: ' + JSON.stringify(state.user));
        },
        addMensagem: (state, action: PayloadAction<string>) => {
            console.log('[ReducerUser] Acionado controlador login.addMensagem!');
            state.mensagens.push(action.payload);
            if (state.mensagens.length > 50) {
                console.log('[ReducerUser] Mensagens acima de 50. Removendo índice 0');
                state.mensagens.splice(0, 1);
            } 
        },
        removerMensagem: (state, action: PayloadAction<number>) => {
            console.log('[ReducerUser] Acionado controlador login.removerMensagem!\n' 
                + `Removendo índice ${action.payload}.`
            );
            if (action.payload >= 0 && action.payload < state.mensagens.length)
                state.mensagens.splice(action.payload, 1);
        },
        resetarMensagens: (state, action: PayloadAction) => {
            console.log('[ReducerUser] Acionado controlador login.resetarMensagens!');
            state.mensagens = [];
        }
    },
});

export default login.reducer;
export const { setJwt, setUser, addMensagem, resetarMensagens } = login.actions;