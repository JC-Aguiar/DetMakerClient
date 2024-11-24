import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JobInfoDTO } from '../../data/JobInfoDTO';
import { QueryInfoDTO } from '../../data/QueryInfoDTO';

const initialState: ReducerCatalogoJobsProps = { 
    catalogo: [],
    loading: false,
};

//Interface para definir o tipo de objeto do reducer
interface ReducerCatalogoJobsProps {
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
            state.loading = false;
        },
        removerJobs: (state, action: PayloadAction<string[]>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.removerJobs!');
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerJobs] Erro: payload inválido, pois não é um array.');
                return { ...state };
            }
            const nomes = new Set<string>(action.payload);
            console.log(`[ReducerJobs]: Removerndo do catálogo os Jobs: ${nomes}.`);
            state.catalogo = state.catalogo.filter(job => !nomes.has(job.nome));
        },
        updateJob: (state, action: PayloadAction<JobInfoDTO>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.updateJob!');
            const index = state.catalogo.findIndex(job => job.id === action.payload.id);
            if(index !== -1) state.catalogo[index] = action.payload;
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
export const { setJobs, removerJobs, updateJob, loadingJobs } = catalogoJobs.actions;