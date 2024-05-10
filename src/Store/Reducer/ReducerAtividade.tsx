import { PayloadAction, createSlice } from '@reduxjs/toolkit';
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
    mainIfxdate: "",
    jobsSelecionados: [],
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
    mainIfxdate: string,
    jobsSelecionados: number[],
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

export interface ReorderMainJobsProps {
    ordemAntiga: number,
    ordemNova: number,
}

export interface UpdateMainJobsIfxdateProps {
    jobs: { id: number, parametro: number }[],
    ifxdate: string,  
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
            state.jobsSelecionados = [];
        },
        setMainJobs: (state, action: PayloadAction<JobConfig[]>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainJobs!');
            state.mainJobs = action.payload.sort((item1, item2) => item1.ordem - item2.ordem);
            logItemPilha(state.mainJobs);
            state.jobsSelecionados = [];
        },
        reorderMainJobs: (state, action: PayloadAction<ReorderMainJobsProps>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.reorderMainJobs!');
            const {ordemAntiga, ordemNova} = action.payload;
            console.log(`[ReducerAtividade]: Reordenando índice ${action.payload.ordemAntiga} para ${action.payload.ordemNova}.`);
            console.log(`[ReducerAtividade]: Reordenando índice ${action.payload.ordemNova} para ${action.payload.ordemAntiga}.`);
            //state.mainJobs[ordemAntiga].ordem = ordemNova;
            //state.mainJobs[ordemNova].ordem -= 1;
            state.mainJobs
                .map(item => {
                    if (item.ordem === ordemAntiga) item.ordem = ordemNova;
                    else if (item.ordem <= ordemNova && item.ordem > ordemAntiga) item.ordem -= 1;
                    else if (item.ordem >= ordemNova && item.ordem < ordemAntiga) item.ordem += 1;
                    return item;
                }).sort((item1, item2) => item1.ordem - item2.ordem);
        },
        updateMainJobsIfxdate: (state, action: PayloadAction<UpdateMainJobsIfxdateProps>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.updateMainJobsIfxdate!');
            const {jobs, ifxdate} = action.payload;
            state.mainIfxdate = ifxdate; 

            state.mainJobs.map(mainJob => {
                let jobIndex = -1;
                for (let i = 0; i < jobs.length; i++) {
                    if (jobs[i].id === mainJob.id) {
                        jobIndex = i;
                        break;
                    }
                }
                if (jobIndex === -1) return mainJob;

                const parametroIndex = jobs[jobIndex].parametro;
                if (mainJob.argumentos.length < parametroIndex) return mainJob;
                mainJob.argumentos[parametroIndex] = ifxdate;
            });

            logItemPilha(state.mainJobs);
        },
        updateOneMainJob: (state, action: PayloadAction<JobConfig>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.updateOneMainJob!');
            const novoJob = action.payload;
            if (state.mainJobs.length >= novoJob.ordem) 
                state.mainJobs[novoJob.ordem] = novoJob;
            logItemPilha(state.mainJobs);
        },
        addOneMainJob: (state, action: PayloadAction<JobConfig>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.addOneMainJob!');
            state.mainJobs.push(action.payload);
            logItemPilha(state.mainJobs);
        },
        removeOneMainJob: (state, action: PayloadAction<number>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.removeOneMainJob!');
            state.mainJobs.splice(action.payload, 1);
            logItemPilha(state.mainJobs);
        },
        setViewJobs: (state, action: PayloadAction<number[]>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setViewJobs!');
            console.log(`[ReducerAtividade]: Usuário informou Jobs IDs: [${action.payload.join(", ")}].`);
            state.jobsSelecionados = action.payload;
            console.log(`[ReducerAtividade]: Jobs selecionados em memória: [${state.jobsSelecionados.join(", ")}].`);
        },
        addViewJobs: (state, action: PayloadAction<number>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.addViewJobs!');
            console.log(`[ReducerAtividade]: Usuário informou Job ID: [${action.payload}].`);
            state.jobsSelecionados.push(action.payload);
            console.log(`[ReducerAtividade]: Jobs selecionados em memória: [${state.jobsSelecionados.join(", ")}].`);
        },
        removeViewJobs: (state, action: PayloadAction<number>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.removeViewJobs!');
            console.log(`[ReducerAtividade]: Usuário informou Job ID: [${action.payload}].`);
            state.jobsSelecionados = state.jobsSelecionados.filter((id) => id !== action.payload);
            console.log(`[ReducerAtividade]: Jobs selecionados em memória: [${state.jobsSelecionados.join(", ")}].`);
        },
    },
});

//Exibe informações dos mainJobs
function logItemPilha(jobs: JobConfig[]) {
    console.log(`[ReducerAtividade]: Main-Jobs em memória:` + '\n'
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
export const { 
    setMainAmbiente, 
    setMainPipeline, 
    setMainJobs, 
    updateOneMainJob,
    updateMainJobsIfxdate, 
    reorderMainJobs,
    addOneMainJob,
    removeOneMainJob,
    setViewJobs,
    addViewJobs,
    removeViewJobs,
} = configAtividade.actions;