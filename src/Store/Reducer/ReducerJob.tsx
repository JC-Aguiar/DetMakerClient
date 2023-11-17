import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { JobInfoDTO } from '../../data/JobInfoDTO';

interface JobTYPE {
    value: JobInfoDTO[]
}

export interface setItemJobTYPE {
    index: number,
    checked: boolean;
}

const initialState = {value: []} as JobTYPE;

const jobs = createSlice({
    name: 'Jobs',
    initialState,
    reducers: {
        setJob: (state, action: PayloadAction<JobInfoDTO[]>) => {
            if (!Array.isArray(action.payload)) {
                console.log('[ReducerJobs] Erro: payload inválido.');
                return {...state};
            }
            state.value = action.payload;
            console.log('[ReducerJobs] Acionado controlador Jobs.setAgenda: \n' 
                + `${state.value.map((itemAgenda) => itemAgenda.nome).join(", ")}.` + '\n'
                + `Lista de Jobs com ${state.value.length} registros.`
            );
        },
        checkJob: (state, action: PayloadAction<setItemJobTYPE>) => {
            console.log('[ReducerJobs] Acionado controlador Jobs.setItemAgenda: \n' + `${action.payload}.`);
            let { index, checked } = action.payload;
            logJob(`Definindo check para ${checked}`, state.value[index]);
            state.value = state.value.map((item, idx) => {
                if (idx === index) item.checked = checked;
                return item;
            });
        },
        addJob: (state, action: PayloadAction<JobInfoDTO>) => {
            console.log('[ReducerJobs] Acionado controlador Jobs.addItemAgenda: \n' + `${action.payload}.`);
            logJob("Adicionando", action.payload);
            state.value.push(action.payload);
            console.log(`[ReducerJobs] Pilha[${state.value.length - 1}] = ${state[state.value.length - 1]}.`);
        },
        removeJob: (state, action: PayloadAction<JobInfoDTO>) => {
            console.log('[ReducerJobs] Acionado controlador Jobs.removeItemAgenda: \n' + `${action.payload}.`);
            logJob("Removendo", action.payload);
            let agenda = action.payload;
            let removerIndex = -1;
            state.value.map((itemAgenda, index) => {
                if (itemAgenda.id === agenda.id) removerIndex = index;
            });
            if (removerIndex !== -1) {
                console.log(`[ReducerJobs] Removendo índice Nº${removerIndex} (ID ${agenda.id}) na lista de Jobs.`);
                state.value = state.value.splice(removerIndex, 1);
            }
        },
    },
});

function logJob(mensagem: string, agenda: JobInfoDTO) {
    console.log(`[ReducerJobs] ${mensagem} agenda ID ${agenda.id} ${agenda.nome}:` + '\n'
        + ` - Parametros (${agenda.parametros.length})` + '\n'
        + ` - Tabelas (${agenda.tabelas.length})` + '\n'
        + ` - Entradas (${agenda.mascaraEntrada.length})` + '\n'
        + ` - Saídas (${agenda.mascaraSaida.length})` + '\n'
        + ` - Logs (${agenda.mascaraLog.length})` + '\n'
        + ` - Checked ${agenda.checked}`
    );
}

export default jobs.reducer;
export const { setJob, checkJob, addJob, removeJob } = jobs.actions;