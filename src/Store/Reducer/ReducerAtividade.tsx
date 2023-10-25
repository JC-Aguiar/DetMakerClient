import { PayloadAction, createSlice } from '@reduxjs/toolkit';

//Valores iniciais do recuder
const initialState = { 
    nome: "",
    descricao: "", 
} as ConfigAtividadeTYPE;

//Interface para definir o tipo de objeto do reducer
interface ConfigAtividadeTYPE {
    nome: string,
    descricao: string,
}

const configAtividade = createSlice({
    name: 'configAtividade',
    initialState,
    reducers: {
        setAtividade: (state, action: PayloadAction<ConfigAtividadeTYPE>) => {
            console.log('[ReducerAtividade] Acionado controlador configPipeline.setAtividade! \n');
            state = action.payload;
        },
    },
});

export default configAtividade.reducer;
export const { setAtividade } = configAtividade.actions;