import { PayloadAction, createSlice } from '@reduxjs/toolkit';

//Valores iniciais do recuder
const initialState = { 
    pipelineNome: "",
    pipelineDescricao: "", 
    atividadeNome: "",
    projetoNome: "",
    configuracao: "",
} as ReducerProjetoTYPE;

//Interface para definir o tipo de objeto do reducer
export interface ReducerProjetoTYPE {
    pipelineNome: string,
    pipelineDescricao: string,
    projetoId: string,
    projetoNome: string,
    atividadeNome: string,
    configuracao: string,
}

const projetos = createSlice({
    name: 'projetos',
    initialState,
    reducers: {
        setDadosProjeto: (state, action: PayloadAction<ReducerProjetoTYPE>) => {
            console.log('[ReducerProjetos] Acionado controlador configPipeline.setDadosProjeto! \n');
            state = action.payload;
            logProjeto(state);
            return state;
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logProjeto(projeto: ReducerProjetoTYPE) {
    const mensagem = '\n'
        + ` - Pipeline Nome: ${projeto.pipelineNome}` + '\n'
        + ` - Pipeline Descricao: ${projeto.pipelineDescricao}` + '\n'
        + ` - Projeto: ${projeto.projetoId} - ${projeto.projetoNome}` + '\n'
        + ` - Atividade: ${projeto.atividadeNome}` + '\n'
        + ` - Configuração: ${projeto.configuracao}`;
    console.log(`[ReducerAtividade] Atividade em memória:` + '\n' + `${mensagem}`);
}

export default projetos.reducer;
export const { setDadosProjeto } = projetos.actions;