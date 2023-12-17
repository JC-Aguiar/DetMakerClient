import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PipelineInfoDTO } from '../../data/PIpelineInfoDTO';

//Valores iniciais do recuder
const initialState = { 
    value: []
} as ReducerPipelineProps;

//Interface das propriedades deste reducer
export interface ReducerPipelineProps {
    value: PipelineInfoDTO[];
}

//Configurações do reducer catalogoPipelines
const catalogoPipelines = createSlice({
    name: 'catalogoPipelines',
    initialState,
    reducers: {
        setPipelines: (state, action: PayloadAction<PipelineInfoDTO[]>) => {
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerPipelines]: Erro. payload inválido.');
                return { ...state };
            }
            console.log('[ReducerPipelines]: Acionado controlador catalogoPipelines.setPipeline! \n');
            state.value = action.payload;
            logPipeline(state);
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logPipeline(state: ReducerPipelineProps) {
    const mensagem = state.value.map((item, index) => {
        return `[${index}] ---------------------------- ` + '\n' 
        + ` - Nome: ${item.nome}` + '\n'
        + ` - Descricao: ${item.descricao}` + '\n'
        + ` - Jobs: ${item.jobs.join(", ")}` + '\n'
        + ` - Selecionada: ${item.checked}`
    }).join('\n');
    console.log(`[ReducerPipelines] Total de Pipelines em memória:` + '\n' + mensagem);
}

export default catalogoPipelines.reducer;
export const { setPipelines } = catalogoPipelines.actions;