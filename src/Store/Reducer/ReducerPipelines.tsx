import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PipelineInfoDTO } from '../../data/PipelineInfoDTO';
import store from '../ReduxStore';

//Valores iniciais do recuder
const initialState = { 
    catalogo: [],
    loading: false,
} as ReducerPipelineProps;

//Interface das propriedades deste reducer
export interface ReducerPipelineProps {
    catalogo: PipelineInfoDTO[];
    loading: boolean;
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
            console.log('[ReducerPipelines]: Acionado controlador catalogoPipelines.setPipeline!');
            state.catalogo = action.payload;
            state.loading = false; 
        },
        removePipeline: (state, action: PayloadAction<number>) => {
            console.log('[ReducerPipelines]: Acionado controlador catalogoPipelines.removePipeline!\n'
                + `Tentando remover Pipeline ID ${action.payload}.`
            );
            state.catalogo = state.catalogo.filter(item => item.id !== action.payload);
        },
        removerJobs: (state, action: PayloadAction<string[]>) => {
            console.log('[ReducerPipelines]: Acionado controlador catalogoPipelines.removeJobs!');
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerPipelines] Erro: payload inválido, pois não é um array.');
                return { ...state };
            }
            const nomes = new Set<string>(action.payload);
            console.log(`[ReducerPipelines]: Removendo os Jobs ${nomes} do fluxo de cada Pipeline.`);
            state.catalogo.forEach(
                pipeline => pipeline.jobs = pipeline.jobs.filter(
                    job => !nomes.has(job)
                )
            );
        },
        loadingPipelines: (state, action: PayloadAction<boolean>) => {
            console.log('[ReducerPipelines]: Acionado controlador catalogoPipelines.loadingPipelines!');
            state.loading = action.payload;
            if (state.loading) state.catalogo = [];
            console.log(`[ReducerPipelines]: Catalogo de Pipelines ${state.loading ? 'está carregando..' : 'pronto'}.`);
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logPipeline(state: ReducerPipelineProps) {
    const mensagem = state.catalogo.map((item, index) => {
        return `[${index}] ---------------------------- ` + '\n' 
        + ` - Nome: ${item.nome}` + '\n'
        + ` - Descricao: ${item.descricao}` + '\n'
        + ` - Jobs: ${item.jobs.join(", ")}` + '\n'
        + ` - Selecionada: ${item.checked}`
    }).join('\n');
    console.log(`[ReducerPipelines] Total de Pipelines em memória:` + '\n' + mensagem);
}

export default catalogoPipelines.reducer;
export const { setPipelines, removerJobs, removePipeline, loadingPipelines } = catalogoPipelines.actions;