import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ComandoSQL } from '../../data/ComandoSQL';
import { JobConfig } from '../../data/JobConfigDTO';

//Valores iniciais do recuder
const initialState = {
    mainCliente: "", 
    mainClienteId: -1, 
    mainAmbiente: "",
    mainAmbienteId: -1,
    mainPipeline: "", 
    mainPipelineId: -1,
    mainJobs: [],
} as ReducerAtividadeProps;

//Interface das propriedades deste reducer
export interface ReducerAtividadeProps {
    mainCliente: string,
    mainClienteId: number, 
    mainAmbiente: string;
    mainAmbienteId: number,
    mainPipeline: string,
    mainPipelineId: number,
    mainJobs: JobConfig[],
}

//Interface das propriedades do controlador setMainAmbiente
export interface SetMainAmbienteProps {
    cliente: string;
    clienteId: number, 
    ambiente: string;
    ambienteId: number;
}

export interface SetMainPipelineProps {
    id: number,
    nome: string,
    jobs: JobConfig[]
}

//Configurando ações 'configAtividade' para o reducer ReducerAtividade
const configAtividade = createSlice({
    name: 'configAtividade',
    initialState,
    reducers: {
        setMainAmbiente: (state, action: PayloadAction<SetMainAmbienteProps>) => {
            const { cliente, clienteId,  ambiente,  ambienteId} = action.payload;
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainAmbiente!');
            console.log(`[ReducerAtividade]: Definindo Cliente ID ${clienteId} '${cliente}' ` +
                + `Ambiente ID ${ambienteId} '${ambiente}' `
            );
            state.mainCliente = cliente;
            state.mainClienteId = clienteId;
            state.mainAmbiente = ambiente;
            state.mainAmbienteId = ambienteId;
        },
        setMainPipeline: (state, action: PayloadAction<SetMainPipelineProps>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainPipeline!');
            console.log(`[ReducerAtividade]: Definindo Pipeline: '${action.payload.nome}'.`);
            console.log(`[ReducerAtividade]: Jobs inclusos: '${action.payload.jobs.map((item) => item.nome).join(", ")}'.`);
            state.mainPipelineId = action.payload.id;
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
        removeOneMainJob: (state, action: PayloadAction<number>) => {
            console.log('[ReducerAtividade] Acionado controlador pilhaJobs.updateOneMainJob!');
            const id = action.payload;
            const index = state.mainJobs.findIndex(item => item.id === id);
            if (index !== -1) {
                state.mainJobs.splice(index, 1);
            }
            logItemPilha(state.mainJobs);
        },
    },
});

//Exibe informações dos mainJobs
function logItemPilha(jobs: JobConfig[]) {
    console.log(`[ReducerAtividade] Main-Jobs em memória:` + '\n'
        + JSON.stringify(jobs)
        //+ jobs.map((item) => 
        //    ` - IDº${item.id} - Nº${item.ordem}` + '\n' +
        //    ` - Parametros: (${item.argumentos})` + '\n' +
        //    ` - Queries: (${item.queries.map((comandoSql) => comandoSql.filtros).join(", ")})` + '\n' +
        //    ` - Cargas: (${item.cargas?.map(carga => carga.nome).join(", ")})` + '\n'
        //    //` - Pronto: ${item.pronto}`
        //)
    );
}

export default configAtividade.reducer;
export const { setMainAmbiente, setMainPipeline, setMainJobs, updateOneMainJob, reorderMainJobs, removeOneMainJob } = configAtividade.actions;