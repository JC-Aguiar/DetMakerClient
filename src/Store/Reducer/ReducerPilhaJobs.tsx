import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JobExecute } from '../../data/JobExecute';
import { JobDTO } from '../../data/JobDTO';
import { ComandoSQL } from '../../data/ComandoSQL';

const initialState = { value: [] } as PilhaTYPE;

var pilahExec = 0;

//Interface para definir o tipo de objeto do reducer
interface PilhaTYPE {
    value: JobExecute[]
}

//Interface para definir a pilha de Jobs
export interface setPilhaTYPE {
    jobsBanco: JobDTO[],
    jobsPipeline: string[],
}

//Interface para validar o item-pilha de Jobs
export interface checkItemPilhaTYPE {
    id: number,
    checked: boolean,
    ordem: number;
}

//Interface para definir status do item-pilha
export interface setItemPilhaStatusTYPE {
    id: number;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
    pronto: boolean;
    ordem: number;
    //antigaOrdem: number;
}

//Interface para definir argumentos do item-pilha
export interface setItemPilhaArgsTYPE {
    id: number;
    index: number;
    argumentos: string;
}

//Interface para definir query do item-pilha
export interface setItemPilhaQueryTYPE {
    id: number;
    index: number;
    comandoSql: ComandoSQL;
}

//Controlador reducer para item-pilha
const pilhaJobs = createSlice({
    name: 'pilhaJobs',
    initialState,
    reducers: {
        //DEFININDO TODA A PILHA DE JOBS-------------------------------------------------------------------------------
        setPilha: (state, action: PayloadAction<setPilhaTYPE>) => {
            const jobsBanco = action.payload.jobsBanco;
            const jobsPipeline = action.payload.jobsPipeline;
            if (!Array.isArray(jobsBanco)) {
                console.log('[ReducerPilhaJobs] Erro: payload inválido.');
                return { ...state };
            }
            pilahExec = 0;
            state.value = jobsBanco.map((item) => {
                const ordem = jobsPipeline.findIndex((jobNome) => jobNome === item.nome);
                if (ordem !== -1)  item.checked = true;
                return {
                    ordem: ordem,
                    job: item,
                    argumentos: item.parametros.map(e => ""),
                    queries: item.tabelas.map(e =>
                        ({
                            tabela: e,
                            filtros: ""
                        }) as ComandoSQL
                        ),
                    cargas: item.mascaraEntrada.map(e => ""),
                    pronto: false,
                } as JobExecute;
            });
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setPilha: \n'
                + `${state.value.map((itemPilha) => itemPilha.job.nome).join(", ")}.` + '\n'
                + `Lista atual com ${state.value.length} agendas registradas.`
            );
        },
        //VALIDANDO O ITEM DA PILHA DE JOBS----------------------------------------------------------------------------
        checkItemPilha: (state, action: PayloadAction<checkItemPilhaTYPE>) => {
            let { id, checked, ordem } = action.payload;
            console.log(
                '[ReducerPilhaJobs] Acionado controlador pilhaJobs.checkItemPilha: \n' + 
                `id: ${id}, checked: ${checked}, ordem: ${ordem}.`
            );
            state.value = state.value.map((item) => {
                //Identificando o job alvo para validar
                if (item.job.id === id) {
                    item.job.checked = checked;
                    if (item.job.checked) {
                        pilahExec += 1;
                        item.ordem = pilahExec;
                    }
                    else {
                        pilahExec = state.value.filter((item2) => item2.job.checked).length;
                        item.ordem = -1;
                    }
                    
                }
                //Para todos os demais jobs:
                //Se o comando foi de remoção do job na pilha, atualiza os que são de ordem posterior
                else if (!checked && item.ordem > ordem) {
                    pilahExec = state.value.map((item2) => item2.job.checked).length;
                    item.ordem -= 1;
                }
                return item;
            });
            logItemPilha(`Atualizado check do`, state.value.filter((itemPilha) => itemPilha.job.id === id)[0]);
        },
        //DEFININDO STATUS DO ITEM DA PILHA DE JOBS--------------------------------------------------------------------
        setItemPilhaStatus: (state, action: PayloadAction<setItemPilhaStatusTYPE>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setItemPilhaStatus: \n' + `${action.payload}.`);
            let itemPilhaStatus: setItemPilhaStatusTYPE = action.payload;
            let ordemAntiga = state.value.filter((itemPilha) => itemPilha.job.id === itemPilhaStatus.id)[0].ordem;

            state.value = state.value.map((itemPilha) => {
                //Identificando o job alvo para atualizar o redux
                if (itemPilha.job.id === itemPilhaStatus.id) {
                    itemPilha.ordem = itemPilhaStatus.ordem;
                    itemPilha.argumentos = itemPilhaStatus.argumentos;
                    itemPilha.queries = itemPilhaStatus.queries;
                    itemPilha.cargas = itemPilhaStatus.cargas;
                    itemPilha.pronto = itemPilhaStatus.pronto;
                }
                //Validando se a ordem do job atualziado já consta em uso
                else if (itemPilhaStatus.ordem === itemPilha.ordem) {
                    itemPilha.ordem = ordemAntiga;
                }
                return itemPilha;
            });
            logItemPilha(`Redefinindo item do`, state.value.filter((itemPilha) => itemPilha.job.id === itemPilhaStatus.id)[0]);
        },
        //DEFININDO ARGUMENTOS DO ITEM DA PILHA DE JOBS----------------------------------------------------------------
        setItemPilhaArgs: (state, action: PayloadAction<setItemPilhaArgsTYPE>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setItemPilhaStatus: \n' + `${action.payload}.`);
            let itemPilhaArgs: setItemPilhaArgsTYPE = action.payload;
            state.value = state.value.map((itemPilha) => {
                if (itemPilha.job.id === itemPilhaArgs.id) {
                    itemPilha.argumentos[itemPilhaArgs.index] = itemPilhaArgs.argumentos;
                }
                return itemPilha;
            });
            logItemPilha(`Redefinindo item do`, state.value.filter((itemPilha) => itemPilha.job.id === itemPilhaArgs.id)[0]);
        },
        //DEFININDO QUERY DO ITEM DA PILHA DE JOBS---------------------------------------------------------------------
        setItemPilhaQuery: (state, action: PayloadAction<setItemPilhaQueryTYPE>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setItemPilhaStatus: \n' + `${action.payload}.`);
            let itemPilhaQuery: setItemPilhaQueryTYPE = action.payload;
            state.value = state.value.map((itemPilha) => {
                if (itemPilha.job.id === itemPilhaQuery.id) {
                    itemPilha.queries[itemPilhaQuery.index] = itemPilhaQuery.comandoSql;
                }
                return itemPilha;
            });
            logItemPilha(`Redefinindo item do`, state.value.filter((itemPilha) => itemPilha.job.id === itemPilhaQuery.id)[0]);
        },
        //ADICIONANDO NA PILHA DE JOBS---------------------------------------------------------------------------------
        addItemPilha: (state, action: PayloadAction<JobExecute>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.addItemPilha: \n' + `${action.payload}.`)
            logItemPilha("Adicionando", action.payload);
            state.value.push(action.payload);
            console.log(`[ReducerPilhaJobs] Pilha[${state.value.length - 1}] = ${state[state.value.length - 1]}.`)
        },
        //REMOVENDO NA PILHA DE JOBS-----------------------------------------------------------------------------------
        removeItemPilha: (state, action: PayloadAction<JobExecute>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setItemPilha: \n' + `${action.payload}.`)
            logItemPilha("Removendo", action.payload);
            const agenda = action.payload.job;
            let removerIndex = -1;
            state.value.map((itemPronto, index) => {
                if (itemPronto.job.id === agenda.id) removerIndex = index;
            });
            if (removerIndex !== -1) {
                console.log(`[ReducerPilhaJobs] Removendo índice Nº${removerIndex} (ID ${agenda.id}) na pilha de jobs.`);
                state.value = state.value.splice(removerIndex, 1);
            }
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logItemPilha(mensagem: string, item: JobExecute) {
    console.log(`[ReducerPilhaJobs] ${mensagem} card job ${item.job.nome}:` + '\n'
        + ` - Selecionado = ${item.job.checked}` + '\n'
        + ` - Ordem Nº${item.ordem}` + '\n'
        + ` - Parametros (${item.argumentos.join(", ")})` + '\n'
        + ` - Queries (${item.queries.map((comandoSql) => comandoSql.filtros).join(", ")})` + '\n'
        + ` - Cargas (${item.cargas.join(", ")})` + '\n'
        + ` - Pronto = ${item.pronto}`
    );
}

export default pilhaJobs.reducer;
export const { setPilha, checkItemPilha, setItemPilhaStatus, setItemPilhaArgs, setItemPilhaQuery } = pilhaJobs.actions;