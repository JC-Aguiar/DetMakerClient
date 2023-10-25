import { PayloadAction, createSlice } from '@reduxjs/toolkit';

//Valores iniciais do recuder
const initialState = { 
    nome: "",
    descricao: "", 
} as ConfigPipelineTYPE;

//Interface para definir o tipo de objeto do reducer
interface ConfigPipelineTYPE {
    nome: string,
    descricao: string,
}

const configPipeline = createSlice({
    name: 'configPipeline',
    initialState,
    reducers: {
        setPipeline: (state, action: PayloadAction<ConfigPipelineTYPE>) => {
            console.log('[ReducerPipeline] Acionado controlador configPipeline.setPipeline! \n');
            state = action.payload;
        },
    },
});

export default configPipeline.reducer;
export const { setPipeline } = configPipeline.actions;