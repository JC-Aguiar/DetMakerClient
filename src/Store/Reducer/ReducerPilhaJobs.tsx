import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ItemPilhaDTO } from '../../components/ItemPilha';
import { AgendaDTO } from '../../components/AgendaDTO';
import { ComandoSQL } from '../../components/ComandoSQL';

const initialState = { value: [] } as PilhaTYPE;

interface PilhaTYPE {
    value: ItemPilhaDTO[]
}

export interface checkItemPilhaTYPE {
    id: number,
    checked: boolean;
}

export interface setItemPilhaStatusTYPE {
    id: number;
    argumentos: string[];
    queries: ComandoSQL[];
    cargas: string[];
    pronto: boolean;
    ordem: number;
}

const pilhaJobs = createSlice({
    name: 'pilhaJobs',
    initialState,
    reducers: {
        setPilha: (state, action: PayloadAction<AgendaDTO[]>) => {
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerPilhaJobs] Erro: payload inválido.');
                return { ...state };
            }
            state.value = action.payload.map(
                (itemAgenda, index) => ({
                    argumentos: [],
                    agenda: itemAgenda,
                    queries: [],
                    cargas: [],
                    pronto: false,
                    ordem: index
                })
            );
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setPilha: \n'
                + `${state.value.map((itemPilha) => itemPilha.agenda.job).join(", ")}.` + '\n'
                + `Lista atual com ${state.value.length} agendas registradas.`
            );
        },
        checkItemPilha: (state, action: PayloadAction<checkItemPilhaTYPE>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.checkItemPilha: \n' + `${action.payload}.`);
            let { id, checked } = action.payload;
            state.value = state.value.map((item) => {
                if (item.agenda.id === id) item.agenda.checked = checked;
                return item;
            });
            logItemPilha(`Atualizado check do`, state.value.filter((itemPilha) => itemPilha.agenda.id === id)[0]);
        },
        setItemPilhaStatus: (state, action: PayloadAction<setItemPilhaStatusTYPE>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setItemPilhaStatus: \n' + `${action.payload}.`);
            let itemPilhaStatus: setItemPilhaStatusTYPE = action.payload;
            state.value = state.value.map((itemPilha) => {
                if (itemPilha.agenda.id === itemPilhaStatus.id) {
                    itemPilha.ordem = itemPilhaStatus.ordem;
                    itemPilha.argumentos = itemPilhaStatus.argumentos;
                    itemPilha.queries = itemPilhaStatus.queries;
                    itemPilha.cargas = itemPilhaStatus.cargas;
                    itemPilha.pronto = itemPilhaStatus.pronto;
                }
                return itemPilha;
            });
            logItemPilha(`Redefinindo item do`, state.value.filter((itemPilha) => itemPilha.agenda.id === itemPilhaStatus.id)[0]);
        },
        addItemPilha: (state, action: PayloadAction<ItemPilhaDTO>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.addItemPilha: \n' + `${action.payload}.`)
            logItemPilha("Adicionando", action.payload);
            state.value.push(action.payload);
            console.log(`[ReducerPilhaJobs] Pilha[${state.value.length - 1}] = ${state[state.value.length - 1]}.`)
        },
        removeItemPilha: (state, action: PayloadAction<ItemPilhaDTO>) => {
            console.log('[ReducerPilhaJobs] Acionado controlador pilhaJobs.setItemPilha: \n' + `${action.payload}.`)
            logItemPilha("Removendo", action.payload);
            const agenda = action.payload.agenda;
            let removerIndex = -1;
            state.value.map((itemPronto, index) => {
                if (itemPronto.agenda.id === agenda.id) removerIndex = index;
            });
            if (removerIndex !== -1) {
                console.log(`[ReducerPilhaJobs] Removendo índice Nº${removerIndex} (ID ${agenda.id}) na pilha de jobs.`);
                state.value = state.value.splice(removerIndex, 1);
            }
        },
    },
});

function logItemPilha(mensagem: string, item: ItemPilhaDTO) {
    console.log(`[ReducerPilhaJobs] ${mensagem} card job ${item.agenda.job}:` + '\n'
        + ` - Selecionado (${item.agenda.checked})` + '\n'
        + ` - Ordem Nº${item.ordem}` + '\n'
        + ` - Parametros (${item.argumentos.join(", ")})` + '\n'
        + ` - Queries (${item.queries.map((comandoSql) => comandoSql.query).join(", ")})` + '\n'
        + ` - Cargas (${item.cargas.join(", ")})` + '\n'
        + ` - Pronto = ${item.pronto}`
    );
}

export default pilhaJobs.reducer;
export const { setPilha, checkItemPilha, setItemPilhaStatus } = pilhaJobs.actions;