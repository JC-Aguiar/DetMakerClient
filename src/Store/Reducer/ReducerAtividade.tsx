import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ComandoSQL } from '../../data/ComandoSQL';
import { JobConfig } from '../../data/JobConfigDTO';

//Valores iniciais do recuder
const initialState = {
    mainCliente: "", 
    mainAmbiente: "",
    mainPipeline: "", 
    mainJobs: [],
} as ReducerAtividadeProps;

//Interface das propriedades deste reducer
export interface ReducerAtividadeProps {
    mainCliente: string;
    mainAmbiente: string;
    mainPipeline: string;
    mainJobs: JobConfig[];
}

//Configurando ações 'configAtividade' para o reducer ReducerAtividade
const configAtividade = createSlice({
    name: 'configAtividade',
    initialState,
    reducers: {
        setMainAmbiente: (state, action: PayloadAction<{ cliente: string, ambiente: string }>) => {
            const {cliente, ambiente} = action.payload;
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainAmbiente!');
            console.log(`[ReducerAtividade]: Definindo Cliente: '${cliente}', Ambiente: '${ambiente}'.`);
            state.mainCliente = cliente;
            state.mainAmbiente = ambiente;
        },
        setMainPipeline: (state, action: PayloadAction<{ nome: string, jobs: JobConfig[] }>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainPipeline!');
            console.log(`[ReducerAtividade]: Definindo Pipeline: '${action.payload.nome}'.`);
            console.log(`[ReducerAtividade]: Jobs inclusos: '${action.payload.jobs.map((item) => item.nome).join(", ")}'.`);
            state.mainPipeline = action.payload.nome;
            state.mainJobs = action.payload.jobs.sort((item1, item2) => item1.ordem - item2.ordem);
        },
        setMainJobs: (state, action: PayloadAction<JobConfig[]>) => {
            console.log('[ReducerAtividade] Acionado controlador pilhaJobs.setMainJobs!');
            state.mainJobs = action.payload.sort((item1, item2) => item1.ordem - item2.ordem);
            logItemPilha(state.mainJobs);
        },
        reorderMainJobs: (state, action: PayloadAction<{ ids: number[]} >) => {
            console.log('[ReducerAtividade] Acionado controlador pilhaJobs.reorderMainJobs! \n' 
                + `IDs dos Jobs a definir: ${action.payload.ids.join(", ")}.`
            );
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
            console.log('[ReducerAtividade] Acionado controlador pilhaJobs.updateOneMainJob!');
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
export const { setMainAmbiente, setMainPipeline, setMainJobs, updateOneMainJob, reorderMainJobs } = configAtividade.actions;