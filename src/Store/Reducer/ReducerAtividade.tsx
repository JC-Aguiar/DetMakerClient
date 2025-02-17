import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JobConfig, PipelineJobCargaDTO } from '../../data/JobConfig';
import { JobInfoDTO, getIndexParametroComIfxdate } from '../../data/JobInfoDTO';

//Valores iniciais do recuder
const initialState = {
    mainCliente: "", 
    mainClienteId: -1, 
    mainAmbiente: "",
    mainAmbienteId: -1,
    mainPipeline: "", 
    mainPipelineId: -1,
    mainPipelineJobs: [],
    mainIfxdate: "",
    mainMassas: [],
    jobSelecionado: -1,
    meusTickets: [],
    mensagens: [],
} as ReducerAtividadeProps;

//Interface das propriedades deste reducer
export interface ReducerAtividadeProps {
    mainCliente: string,
    mainClienteId: number, 
    mainAmbiente: string;
    mainAmbienteId: number,
    mainPipeline: string,
    mainPipelineId: number,
    mainPipelineJobs: JobConfig[],
    mainIfxdate: string,
    mainMassas: string[],
    jobSelecionado: number,
    meusTickets: string[],
    mensagens: AtividadeMensagemTYPE[],
}

//Interface das mensagens a serem exibidas e armazenadas no ReducerAtividadeProps
export interface AtividadeMensagemTYPE {
    id: string,
    texto: string;
    alvo: string;
    status: "INFO" | "OK" | "ERROR";
    url?: string;
}

//Interface do Reducer 'addMensagem'  
export interface AddMensagemProps {
    id: string,
    texto: string;
    status: "INFO" | "OK" | "ERROR";
    url?: string;
}

//Interface do Reducer 'atualizarMensagemStatus'  
export interface AtualizarMensagemStatusProps {
    id: string,
    complmento?: string,
    status: "INFO" | "OK" | "ERROR"
}

//Interface das propriedades do controlador setMainAmbiente
export interface SetMainAmbienteProps {
    cliente: string,
    clienteId: number, 
    ambiente: string,
    ambienteId: number,
}

//Interface do Reducer 'setMainPipelineProps'
export interface SetMainPipelineProps {
    id: number,
    nome: string,
    jobs: JobConfig[]
}

//Interface do Reducer 'reorderMainJobsProps'
export interface ReorderMainJobsProps {
    ordemAntiga: number,
    ordemNova: number,
}

//Interface do Reducer 'updateMainJobsIfxdate'
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
            const {cliente, clienteId,  ambiente,  ambienteId} = action.payload;
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainAmbiente!');
            console.log(`[ReducerAtividade]: Definindo Cliente [ID ${clienteId}] '${cliente}', `
                + `Ambiente [ID ${ambienteId}] '${ambiente}'.`
            );
            state.mainCliente = cliente;
            state.mainClienteId = clienteId;
            state.mainAmbiente = ambiente;
            state.mainAmbienteId = ambienteId;
        },
        setMainPipeline: (state, action: PayloadAction<SetMainPipelineProps | undefined>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainPipeline!');
            if (!action.payload) {
                action.payload = {
                    id: -1,
                    nome: "",
                    jobs: [],
                };
            }
            console.log(`[ReducerAtividade]: Definindo Pipeline ID ${action.payload.id}: '${action.payload.nome}'.`);
            console.log(`[ReducerAtividade]: Jobs inclusos: '${action.payload.jobs.map((item) => item.nome).join(", ")}'.`);
            state.mainPipelineId = action.payload.id;
            state.mainPipeline = action.payload.nome;
            state.mainPipelineJobs = action.payload.jobs.sort((item1, item2) => item1.ordem - item2.ordem);
            state.jobSelecionado = -1;
            state.mainIfxdate = "";
        },
        setMainJobs: (state, action: PayloadAction<JobConfig[]>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainJobs!');
            state.mainPipelineJobs = action.payload.sort((item1, item2) => item1.ordem - item2.ordem);
            state.jobSelecionado = -1;
            state.mainIfxdate = "";
            //logItemPilha(state.mainJobs);
        },
        reorderMainJobs: (state, action: PayloadAction<ReorderMainJobsProps>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.reorderMainJobs!');
            const {ordemAntiga, ordemNova} = action.payload;
            //state.mainJobs[ordemAntiga].ordem = ordemNova;
            //state.mainJobs[ordemNova].ordem -= 1;
            state.mainPipelineJobs
                .map(item => {
                    if (item.ordem === ordemAntiga) {
                        console.log(`[ReducerAtividade]: Reordenando MainJob [ID ${item.id}] '${item.nome}', `
                            + `do Nº ${ordemAntiga} para Nº ${ordemNova}.`);
                        item.ordem = ordemNova;
                    }
                    else if (item.ordem <= ordemNova && item.ordem > ordemAntiga) item.ordem -= 1;
                    else if (item.ordem >= ordemNova && item.ordem < ordemAntiga) item.ordem += 1;
                    return item;
                });
            //state.mainJobs = state.mainJobs.sort((item1, item2) => item1.ordem - item2.ordem);
        },
        updateMainJobsIfxdate: (state, action: PayloadAction<UpdateMainJobsIfxdateProps>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.updateMainJobsIfxdate!');
            const {jobs, ifxdate} = action.payload;
            state.mainIfxdate = ifxdate; 

            for (let i = 0; i < jobs.length; i++) {
                const jobId = jobs[i].id;
                const jobNewParam = jobs[i].parametro;

                state.mainPipelineJobs = state.mainPipelineJobs.map(mainJob => {
                    if (mainJob.id !== jobId) { 
                        return mainJob;
                    }
                    if (mainJob.argumentos[jobNewParam]  === undefined) {
                        return mainJob;
                    }
                    mainJob.argumentos[jobNewParam] = ifxdate;
                    return mainJob;
                })
            }
            //logItemPilha(state.mainJobs);
        },
        updateOneMainJob: (state, action: PayloadAction<JobConfig>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.updateOneMainJob!');
            const novoJob = action.payload;
            if (state.mainPipelineJobs.length > novoJob.ordem) 
                state.mainPipelineJobs[novoJob.ordem] = novoJob;
            //logItemPilha(state.mainJobs);
        },
        setMainJobCargas: (state, action: PayloadAction<{ index: number, cargas: PipelineJobCargaDTO[] }>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainJobCargas!');
            const {index, cargas} = action.payload;
            const jobAlvo = state.mainPipelineJobs.find((job, jobIndex) => jobIndex === index);
            if(!jobAlvo) return;
            console.log(`[ReducerAtividade]: Definindo ${cargas.length} carga(s) ao MainJob[${index}] '${jobAlvo.nome}'!`);
            state.mainPipelineJobs[index].cargas = cargas;
        },
        addOneMainJob: (state, action: PayloadAction<JobInfoDTO>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.addOneMainJob!'
                + `Adicionando a lsita de MainJobs o Job: [ID ${action.payload.id}] ${action.payload.nome}.`
            );
            //Acionamento deve estar disponível apenas se nenhuma Pipeline estiver selecionada
            if (state.mainPipeline === "") return;

            const novoJobConfig: JobConfig =  JobConfig.parseJobInfo(action.payload, state.mainPipelineJobs.length);
            const paramIndex = getIndexParametroComIfxdate(action.payload);
            if (paramIndex !== -1 && novoJobConfig.argumentos.length > paramIndex) {
                novoJobConfig.argumentos[paramIndex] = state.mainIfxdate;
                console.log(`[ReducerAtividade]: Parametro[${paramIndex}] definido para Data do Ciclo (${state.mainIfxdate}).`);
            }
            state.mainPipelineJobs.push(novoJobConfig);
            //logItemPilha(state.mainJobs);
        },
        removeOneMainJob: (state, action: PayloadAction<number>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.removeOneMainJob!');
            //const index = state.mainJobs.findIndex(job => job.ordem === action.payload);
            //if(index === -1) return;
            const index = action.payload;
            if (state.mainPipelineJobs.length <= index) return; 
            const id = state.mainPipelineJobs[index].id;
            const nome = state.mainPipelineJobs[index].nome;
            const ordem = state.mainPipelineJobs[index].ordem;
            console.log(`[ReducerAtividade]: Removendo MainJob Nº${ordem}: [ID ${id}] '${nome}'.`);
            state.mainPipelineJobs.splice(index, 1);
            state.mainPipelineJobs.map((job, jobIndex) => {
                if (job.ordem >= ordem) job.ordem -= 1;
                return job;
            }).sort((item1, item2) => item1.ordem - item2.ordem);
            //logItemPilha(state.mainJobs);
        },
        setMainMassas: (state, action: PayloadAction<{ massas?: string[] }>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setMainMassas!');
            if (!action.payload.massas) {
                console.log(`[ReducerAtividade]: Usuário removeu as Massas da Pipeline.`);
                state.mainMassas = [];
                return;
            }
            console.log(`[ReducerAtividade]: Usuário selecionou para a Pipeline as Massas: ${action.payload.massas.join(", ")}.`);
            state.mainMassas = action.payload.massas;
        },
        setViewJob: (state, action: PayloadAction<number>) => {
            console.log('[ReducerAtividade]: Acionado controlador configAtividade.setViewJobs!');
            console.log(`[ReducerAtividade]: Usuário informou Jobs IDs: [${action.payload}].`);
            state.jobSelecionado = action.payload;
            console.log(`[ReducerAtividade]: Jobs selecionados em memória: [${state.jobSelecionado}].`);
        },
        addMeuTicket: (state, action: PayloadAction<string>) => {
            console.log('[ReducerAtividade] Acionado controlador configAtividade.addMeuTicket!');
            state.meusTickets.unshift(action.payload);
            if (state.mensagens.length === 31) {
                console.log('[ReducerAtividade] Número de tickets acima de 30. Removendo índice 0!');
                state.mensagens.pop();
            } 
        },
        addMensagem: (state, action: PayloadAction<AddMensagemProps>) => {
            console.log('[ReducerAtividade] Acionado controlador configAtividade.addMensagem!');
            state.mensagens.unshift({
                ...action.payload, alvo: `${state.mainCliente} ${state.mainAmbiente}`
            });
            if (state.mensagens.length === 51) {
                console.log('[ReducerAtividade] Número de mensagens acima de 50. Removendo índice 0!');
                state.mensagens.pop();
            } 
        },
        atualizarMensagem: (state, action: PayloadAction<AtualizarMensagemStatusProps>) => {
            console.log('[ReducerAtividade] Acionado controlador configAtividade.atualizarMensagemStatus!\n' 
                + `Atualizando mensagem ID ${action.payload} para status '${action.payload.status}'.`
            );
            const index = state.mensagens.findIndex(item => item.id === action.payload.id);
            if (index === -1) return;
            
            state.mensagens[index].status = action.payload.status;
            if (action.payload.complmento)
                state.mensagens[index].texto += " " + action.payload.complmento;
        },
        removerMensagem: (state, action: PayloadAction<string>) => {
            console.log('[ReducerAtividade] Acionado controlador configAtividade.removerMensagem!\n' 
                + `Removendo mensagem ID ${action.payload}.`
            );
            const index = state.mensagens.findIndex(item => item.id === action.payload);
            if (index !== -1) state.mensagens.splice(index, 1);
        },
        resetarMensagens: (state, action: PayloadAction) => {
            console.log('[ReducerAtividade] Acionado controlador configAtividade.resetarMensagens!');
            state.mensagens = [];
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
    setMainJobCargas,
    updateMainJobsIfxdate, 
    reorderMainJobs,
    addOneMainJob,
    removeOneMainJob,
    setMainMassas,
    setViewJob,
    addMeuTicket,
    addMensagem, 
    atualizarMensagem, 
    removerMensagem, 
    resetarMensagens
} = configAtividade.actions;