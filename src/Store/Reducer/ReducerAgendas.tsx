import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AgendaDTO } from '../../components/AgendaDTO';

interface AgendaTYPE {
    value: AgendaDTO[]
}

export interface setItemAgendaTYPE {
    index: number,
    checked: boolean;
}

const initialState = {value: []} as AgendaTYPE;

const agendas = createSlice({
    name: 'agendas',
    initialState,
    reducers: {
        setAgenda: (state, action: PayloadAction<AgendaDTO[]>) => {
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerAgendas] Erro: payload inválido.');
                return {...state};
            }
            state.value = action.payload;
            console.log('[ReducerAgendas] Acionado controlador agendas.setAgenda: \n' 
                + `${state.value.map((itemAgenda) => itemAgenda.job).join(", ")}.` + '\n'
                + `Lista de agendas com ${state.value.length} registros.`
            );
        },
        checkItemAgenda: (state, action: PayloadAction<setItemAgendaTYPE>) => {
            console.log('[ReducerAgendas] Acionado controlador agendas.setItemAgenda: \n' + `${action.payload}.`);
            let { index, checked } = action.payload;
            logAgenda(`Definindo check para ${checked}`, state.value[index]);
            state.value = state.value.map((item, idx) => {
                if (idx === index) item.checked = checked;
                return item;
            });
        },
        addItemAgenda: (state, action: PayloadAction<AgendaDTO>) => {
            console.log('[ReducerAgendas] Acionado controlador agendas.addItemAgenda: \n' + `${action.payload}.`);
            logAgenda("Adicionando", action.payload);
            state.value.push(action.payload);
            console.log(`[ReducerAgendas] Pilha[${state.value.length - 1}] = ${state[state.value.length - 1]}.`);
        },
        removeItemAgenda: (state, action: PayloadAction<AgendaDTO>) => {
            console.log('[ReducerAgendas] Acionado controlador agendas.removeItemAgenda: \n' + `${action.payload}.`);
            logAgenda("Removendo", action.payload);
            let agenda = action.payload;
            let removerIndex = -1;
            state.value.map((itemAgenda, index) => {
                if (itemAgenda.id === agenda.id) removerIndex = index;
            });
            if (removerIndex !== -1) {
                console.log(`[ReducerAgendas] Removendo índice Nº${removerIndex} (ID ${agenda.id}) na lista de agendas.`);
                state.value = state.value.splice(removerIndex, 1);
            }
        },
    },
});

function logAgenda(mensagem: string, agenda: AgendaDTO) {
    console.log(`[ReducerAgendas] ${mensagem} agenda ID ${agenda.id} ${agenda.job}:` + '\n'
        + ` - Parametros (${agenda.parametros.length})` + '\n'
        + ` - Tabelas (${agenda.tabelas.length})` + '\n'
        + ` - Entradas (${agenda.mascaraEntrada.length})` + '\n'
        + ` - Saídas (${agenda.mascaraSaida.length})` + '\n'
        + ` - Logs (${agenda.mascaraLog.length})` + '\n'
        + ` - Checked ${agenda.checked}`
    );
}

export default agendas.reducer;
export const { setAgenda, checkItemAgenda: setItemAgenda, addItemAgenda, removeItemAgenda } = agendas.actions;