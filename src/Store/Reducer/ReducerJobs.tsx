import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JobInfoDTO } from '../../data/JobInfoDTO';

const initialState = { 
    catalago: [],
    loading: false,
} as PilhaTYPE;

//Interface para definir o tipo de objeto do reducer
interface PilhaTYPE {
    catalago: JobInfoDTO[],
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
export const { setJobs, loadingJobs } = catalogoJobs.actions;