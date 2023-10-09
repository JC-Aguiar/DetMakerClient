import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ItemPilha } from '../../components/ItemPilha';
import { JobDTO } from '../../components/JobDTO';
import { ComandoSQL } from '../../components/ComandoSQL';

const initialState = { value: [] } as PilhaTYPE;

//Interface para definir o tipo de objeto do reducer
interface PilhaTYPE {
    value: ItemPilha[]
}

//Interface para validar o item-pilha
export interface checkItemPilhaTYPE {
    id: number,
    checked: boolean;
}

//Interface para definir status do item-pilha
export interface setItemPilhaStatusTYPE {
    id: number;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
    pronto: boolean;
    ordem: number;
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
        setPilha: (state, action: PayloadAction<JobDTO[]>) => {
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerPilhaJobs] Erro: payload inválido.');
                return { ...state };
            }
            state.value = action.payload.map(
                (item, index) => ({
                    ordem: index,
                    job: item,
                    argumentos: item.parametros.map(e => ""),
                    queries: item.tabelas.map(e =>
                        ({
                            tabela: e,
                            query: ""
                        }) as ComandoSQL),
                    cargas: item.mascaraEntrada.map(e => ""),
                    pronto: false,
                })
            );
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setPilha: \n'
                + `${state.value.map((itemPilha) => itemPilha.job.nome).join(", ")}.` + '\n'
                + `Lista atual com ${state.value.length} agendas registradas.`
            );
        },
        //VALIDANDO O ITEM DA PILHA DE JOBS----------------------------------------------------------------------------
        checkItemPilha: (state, action: PayloadAction<checkItemPilhaTYPE>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.checkItemPilha: \n' + `${action.payload}.`);
            let { id, checked } = action.payload;
            state.value = state.value.map((item) => {
                if (item.job.id === id) item.job.checked = checked;
                return item;
            });
            logItemPilha(`Atualizado check do`, state.value.filter((itemPilha) => itemPilha.job.id === id)[0]);
        },
        //DEFININDO STATUS DO ITEM DA PILHA DE JOBS--------------------------------------------------------------------
        setItemPilhaStatus: (state, action: PayloadAction<setItemPilhaStatusTYPE>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setItemPilhaStatus: \n' + `${action.payload}.`);
            let itemPilhaStatus: setItemPilhaStatusTYPE = action.payload;
            state.value = state.value.map((itemPilha) => {
                if (itemPilha.job.id === itemPilhaStatus.id) {
                    itemPilha.ordem = itemPilhaStatus.ordem;
                    itemPilha.argumentos = itemPilhaStatus.argumentos;
                    itemPilha.queries = itemPilhaStatus.queries;
                    itemPilha.cargas = itemPilhaStatus.cargas;
                    itemPilha.pronto = itemPilhaStatus.pronto;
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
        addItemPilha: (state, action: PayloadAction<ItemPilha>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.addItemPilha: \n' + `${action.payload}.`)
            logItemPilha("Adicionando", action.payload);
            state.value.push(action.payload);
            console.log(`[ReducerPilhaJobs] Pilha[${state.value.length - 1}] = ${state[state.value.length - 1]}.`)
        },
        //REMOVENDO NA PILHA DE JOBS-----------------------------------------------------------------------------------
        removeItemPilha: (state, action: PayloadAction<ItemPilha>) => {
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
function logItemPilha(mensagem: string, item: ItemPilha) {
    console.log(`[ReducerPilhaJobs] ${mensagem} card job ${item.job.nome}:` + '\n'
        + ` - Selecionado (${item.job.checked})` + '\n'
        + ` - Ordem Nº${item.ordem}` + '\n'
        + ` - Parametros (${item.argumentos.join(", ")})` + '\n'
        + ` - Queries (${item.queries.map((comandoSql) => comandoSql.query).join(", ")})` + '\n'
        + ` - Cargas (${item.cargas.join(", ")})` + '\n'
        + ` - Pronto = ${item.pronto}`
    );
}

export default pilhaJobs.reducer;
export const { setPilha, checkItemPilha, setItemPilhaStatus, setItemPilhaArgs, setItemPilhaQuery } = pilhaJobs.actions;