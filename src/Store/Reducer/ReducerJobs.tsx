import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JobInfoDTO } from '../../data/JobInfoDTO';

const initialState = { 
    catalago: [],
    jobsSelecionados: [],
} as PilhaTYPE;

//Interface para definir o tipo de objeto do reducer
interface PilhaTYPE {
    catalago: JobInfoDTO[],
    jobsSelecionados: number[],
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
        viewJobs: (state, action: PayloadAction<number[]>) => {
            console.log('[ReducerJobs]: Acionado controlador catalogoJobs.viewJobs! \n');
            console.log(`[ReducerJobs]: Usuário informou Jobs IDs: ${action.payload.join(", ")}.`);
            state.jobsSelecionados = action.payload.filter(
                (id) => state.catalago.findIndex((job) => job.id === id) !== -1
            );
            console.log(`[ReducerJobs] Jobs selecionados em memória: ${state.jobsSelecionados.join(", ")}.`);
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logCatalago(jobs: JobInfoDTO[]) {
    console.log(`[ReducerJobs] Catálogo de Jobs em memória:` + '\n'
        + jobs.map((item) => ` - (ID ${item.id}) Nome: ${item.nome}` + '\n')
    );
}

export default catalogoJobs.reducer;
export const { setJobs, viewJobs } = catalogoJobs.actions;