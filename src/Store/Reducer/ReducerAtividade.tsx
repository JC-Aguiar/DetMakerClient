import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ComandoSQL } from '../../data/ComandoSQL';
import { JobConfig } from '../../data/JobConfigDTO';

//Valores iniciais do recuder
const initialState = { 
    mainPipeline: "", 
    mainJobs: [],
} as ReducerAtividadeProps;

//Interface das propriedades deste reducer
export interface ReducerAtividadeProps {
    mainPipeline: string;
    mainJobs: JobConfig[];
}

//Configurando ações 'configAtividade' para o reducer ReducerAtividade
const configAtividade = createSlice({
    name: 'configAtividade',
    initialState,
    reducers: {
        setMainPipeline: (state, action: PayloadAction<{ nome: string, jobs: JobConfig[] }>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainPipeline! \n');
            console.log(`[ReducerAtividade]: Usuário informou Pipeline nome '${action.payload.nome}'.` + '\n');
            console.log(`[ReducerAtividade]: Jobs informados para essa Pipeline: '${action.payload.jobs.join(", ")}'.` + '\n');
            state.mainPipeline = action.payload.nome;
            state.mainJobs = action.payload.jobs.sort((item1, item2) => item1.ordem - item2.ordem);
            console.log(`[ReducerAtividade] Main-Pipeline em memória: ${state.mainPipeline}`);
        },
        setMainJobs: (state, action: PayloadAction<JobConfig[]>) => {
            console.log('[ReducerAtividade] Acionado controlador pilhaJobs.setMainJobs: \n' + `${action.payload}.`);
            state.mainJobs = action.payload.sort((item1, item2) => item1.ordem - item2.ordem);
            logItemPilha(state.mainJobs);
        },
        reorderMainJobs: (state, action: PayloadAction<{ ids: number[]} >) => {
            console.log('[ReducerAtividade] Acionado controlador pilhaJobs.reorderMainJobs: \n' + `${action.payload.ids}.`);
            state.mainJobs = state.mainJobs.map((item) => {
                const novaOrdem = action.payload.ids.findIndex((id) => id === item.id);
                if (novaOrdem === -1) {
                    console.log(`[ReducerAtividade] ID ${item.id} não encontrado dentre os IDs reordenados.`);
                    return item
                };
                item.ordem = novaOrdem;
                console.log(`[ReducerAtividade] ID ${item.id} com nova ordenação: Nº${item.ordem}.`);
                return item;
            });
            //.sort((item1, item2) => item1.ordem - item2.ordem);
            logItemPilha(state.mainJobs);
        },
        updateOneMainJob: (state, action: PayloadAction<JobConfig>) => {
            console.log('[ReducerAtividade] Acionado controlador pilhaJobs.updateOneMainJob: \n' + `${action.payload}.`);
            const novoJob = action.payload;
            state.mainJobs = state.mainJobs.map((item) => {
                if (item.id === novoJob.id) return novoJob;
                return item;
            });
            logItemPilha(state.mainJobs);
        },
    },
});

//Exibe informações dos mainJobs
function logItemPilha(jobs: JobConfig[]) {
    console.log(`[ReducerAtividade] Main-Jobs em memória:` + '\n'
        + jobs.map((item) => 
            ` - IDº${item.id} - Nº${item.ordem}` + '\n' +
            ` - Parametros: (${item.argumentos})` + '\n' +
            ` - Queries: (${item.queries.map((comandoSql) => comandoSql.filtros).join(", ")})` + '\n' +
            ` - Cargas: (${item.cargas.join(", ")})` + '\n'
            //` - Pronto: ${item.pronto}`
        )
    );
}

export default configAtividade.reducer;
export const { setMainPipeline, setMainJobs, updateOneMainJob, reorderMainJobs } = configAtividade.actions;