import { PayloadAction, createSlice } from '@reduxjs/toolkit';

//Valores iniciais do recuder
const initialState = { 
    pipelineNome: "",
    pipelineDescricao: "", 
    atividadeNome: "",
    projetoNome: "",
    configuracao: "",
} as ConfigAtividadeTYPE;

//Interface para definir o tipo de objeto do reducer
export interface ConfigAtividadeTYPE {
    pipelineNome: string,
    pipelineDescricao: string,
    atividadeNome: string,
    projetoNome: string,
    configuracao: string,
}

const configAtividade = createSlice({
    name: 'configAtividade',
    initialState,
    reducers: {
        setAtividade: (state, action: PayloadAction<ConfigAtividadeTYPE>) => {
            console.log('[ReducerAtividade] Acionado controlador configPipeline.setAtividade! \n');
            state = action.payload;
            logPiplogAtividade(state);
            return state;
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logPiplogAtividade(atividade: ConfigAtividadeTYPE) {
    const mensagem = '\n'
        + ` - Pipeline Nome: ${atividade.pipelineNome}` + '\n'
        + ` - Pipeline Descricao: ${atividade.pipelineDescricao}` + '\n'
        + ` - Atividade: ${atividade.atividadeNome}` + '\n'
        + ` - Projeto: ${atividade.projetoNome}` + '\n'
        + ` - Configuração: ${atividade.configuracao}`;
    console.log(`[ReducerAtividade] Atividade em memória:` + '\n' + `${mensagem}`);
}

export default configAtividade.reducer;
export const { setAtividade } = configAtividade.actions;