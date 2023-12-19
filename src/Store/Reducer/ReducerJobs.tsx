import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JobInfoDTO } from '../../data/JobInfoDTO';

const initialState = { 
    catalago: [],
    jobsSelecionados: [],
    loading: false,
} as PilhaTYPE;

//Interface para definir o tipo de objeto do reducer
interface PilhaTYPE {
    catalago: JobInfoDTO[],
    jobsSelecionados: number[],
    loading: boolean,
}

//Controlador reducer para item-pilha
const catalogoJobs = createSlice({
    name: 'catalogoJobs',
    initialState,
    reducers: {
        setJobs: (state, action: PayloadAction<JobInfoDTO[]>) => {
            //const jobsPipeline = action.payload.jobsPipeline;
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerJobs] Erro: payload inválido, pois não é um array.');
                return { ...state };
            }
            state.catalago = action.payload;
            logCatalago(state.catalago);
        },
        setViewJobs: (state, action: PayloadAction<number[]>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.setViewJobs! \n');
            console.log(`[ReducerJobs]: Usuário informou Jobs IDs: ${action.payload.join(", ")}.`);
            if (action.payload.length < 1) 
                state.jobsSelecionados = action.payload;
            else { 
                state.jobsSelecionados = action.payload.filter(
                    (id) => state.catalago.findIndex((job) => job.id === id) !== -1
                );
            }
            console.log(`[ReducerJobs] Jobs selecionados em memória: ${state.jobsSelecionados.join(", ")}.`);
        },
        addViewJobs: (state, action: PayloadAction<number>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.addViewJobs! \n');
            console.log(`[ReducerJobs]: Usuário informou Job ID: ${action.payload}.`);
            if (state.catalago.findIndex((job) => job.id === action.payload) !== -1) 
                state.jobsSelecionados.push(action.payload);
            console.log(`[ReducerJobs] Jobs selecionados em memória: ${state.jobsSelecionados.join(", ")}.`);
        },
        removeViewJobs: (state, action: PayloadAction<number>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.removeViewJobs! \n');
            console.log(`[ReducerJobs]: Usuário informou Job ID: ${action.payload}.`);
            const indexToRemove = state.catalago.findIndex((job) => job.id === action.payload);
            if (indexToRemove !== -1) {
                state.jobsSelecionados = state.jobsSelecionados.filter((id) => id !== action.payload);
            }
            console.log(`[ReducerJobs] Jobs selecionados em memória: ${state.jobsSelecionados.join(", ")}.`);
        },
        loadingJobs: (state, action: PayloadAction<boolean>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.loadingJobs!');
            state.loading = action.payload;
            console.log(`[ReducerJobs]: Catalogo de Jobs ${state.loading ? 'está carregando..' : 'pronto'}.`);
        },
    },
});

//Exibe informações 
function logCatalago(jobs: JobInfoDTO[]) {
    console.log(`[ReducerJobs] Catálogo de Jobs em memória:` + '\n'
        + jobs.map((item) => ` - (ID ${item.id}) Nome: ${item.nome}` + '\n')
    );
}

export default catalogoJobs.reducer;
export const { setJobs, setViewJobs, addViewJobs, removeViewJobs, loadingJobs } = catalogoJobs.actions;