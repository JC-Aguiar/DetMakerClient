import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PipelineInfoDTO } from '../../data/PIpelineInfoDTO';

let checkedPipeline = -1;

//Valores iniciais do recuder
const initialState = { 
    value: [], 
    checkedIndex: -1,
} as ConfigPipelineTYPE;

//Interface das propriedades deste reducer
export interface ConfigPipelineTYPE {
    value: PipelineInfoDTO[];
    checkedIndex: number;
}

//Interface do acionamento 'setMainPipeline', para definir qual pipeline foi selecionada
export interface CheckPipelineTYPE {
    pipelineNome: string,
}

//Configurações do reducer configPipelines
const configPipelines = createSlice({
    name: 'configPipelines',
    initialState,
    reducers: {
        setPipelines: (state, action: PayloadAction<PipelineInfoDTO[]>) => {
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerPipelines]: Erro. payload inválido.');
                return { ...state };
            }
            console.log('[ReducerPipelines]: Acionado controlador configPipelines.setPipeline! \n');
            state.value = action.payload;
            logPipeline(state);
        },
        setMainPipeline: (state, action: PayloadAction<CheckPipelineTYPE>) => {
            console.log('[ReducerPipelines]: Acionado controlador configPipelines.setMainPipeline! \n');
            console.log(`[ReducerPipelines]: Usuário selecionou o nome '${action.payload.pipelineNome}'.` + '\n');
            state.value.forEach((item, index) => {
                if (item.nome === action.payload.pipelineNome) {
                    console.log(`[ReducerPipelines]: Pipeline '${item.nome}' identificada no índice ${index}.` + '\n');
                    checkedPipeline = index;
                }
            });
            console.log(`TESTE INDEX: ${checkedPipeline}`);
            state.checkedIndex = checkedPipeline;
            logPipeline(state);
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logPipeline(state: ConfigPipelineTYPE) {
    const mensagem = state.value.map((item, index) => {
        return `[${index}] ---------------------------- ` + '\n' 
        + ` - Nome: ${item.nome}` + '\n'
        + ` - Descricao: ${item.descricao}` + '\n'
        + ` - Jobs: ${item.jobs.join(", ")}` + '\n'
        + ` - Selecionada: ${item.checked}`
    }).join('\n');
    console.log(`[ReducerPipelines] Total de Pipelines em memória:` + '\n' + mensagem);
}

export default configPipelines.reducer;
export const { setPipelines, setMainPipeline } = configPipelines.actions;