import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JobInfoDTO } from '../../data/JobInfoDTO';
import { QueryInfoDTO } from '../../data/QueryInfoDTO';

const initialState = { 
    catalogo: [],
    loading: false,
} as PilhaTYPE;

//Interface para definir o tipo de objeto do reducer
interface PilhaTYPE {
    catalogo: JobInfoDTO[],
    loading: boolean,
}

//Controlador reducer para item-pilha
const catalogoJobs = createSlice({
    name: 'catalogoJobs',
    initialState,
    reducers: {
        setJobs: (state, action: PayloadAction<JobInfoDTO[]>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.setJobs!');
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerJobs] Erro: payload inválido, pois não é um array.');
                return { ...state };
            }
            state.catalogo = action.payload;
        },
        updateJob: (state, action: PayloadAction<JobInfoDTO>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.updateJob!');
            const index = state.catalogo.findIndex(job => job.id === action.payload.id);
            if(index !== -1) state.catalogo[index] = action.payload;
        },
        setJobQuerys: (state, action: PayloadAction<{ jobId: number, queries: QueryInfoDTO[] }>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.setJobQuerys!');
            const index = state.catalogo.findIndex(job => job.id === action.payload.jobId);
            if(index !== -1) state.catalogo[index].queries = action.payload.queries;
        },
        loadingJobs: (state, action: PayloadAction<boolean>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.loadingJobs!');
            state.loading = action.payload;
            if (state.loading) state.catalogo = [];
            console.log(`[ReducerJobs]: Catalogo de Jobs ${state.loading ? 'está carregando..' : 'pronto'}.`);
        },
    },
});


export default catalogoJobs.reducer;
export const { setJobs, updateJob, setJobQuerys, loadingJobs } = catalogoJobs.actions;