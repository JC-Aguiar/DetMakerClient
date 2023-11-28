import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RelatorioHistoricoDTO } from '../../data/RelatorioHistoricoDTO';
import { DetStatusTYPE } from '../../pages/Det';

//Valores iniciais do recuder
const initialState = { 
    value: null,
} as ReducerRelatorioTYPE;

//Interface das propriedades deste reducer
export interface ReducerRelatorioTYPE {
    //value: RelatorioHistoricoDTO[],
    value: RelatorioHistoricoDTO | null,
}

//Interface do acionador relatorios.setTestcaseExpectativa
export interface SetTestcaseExpectativaTYPE {
    index: number,
    valor: string | null | undefined,
}

//Interface do acionador relatorios.setTestcaseResultado
export interface SetTestcaseResultadoTYPE {
    index: number,
    valor: DetStatusTYPE,
}

//Interface do acionador relatorios.setTestcaseRevisor
export interface SetTestcaseRevisorTYPE {
    index: number,
    valor: string | null | undefined,
}


const relatorios = createSlice({
    name: 'relatorios',
    initialState,
    reducers: {
        addRelatorio: (state, action: PayloadAction<ReducerRelatorioTYPE>) => {
            console.log('[ReducerRelatorios] Acionado controlador relatorios.addRelatorio! \n');
            state.value = action.payload.value;
            logRelatorio(state.value);
        },
        removeRelatorio: (state) => {
            console.log('[ReducerRelatorios] Acionado controlador relatorios.removeRelatorio! \n');
            state.value = null;
            logRelatorio(state.value);
        },
        setTestcaseExpectativa: (state, action: PayloadAction<SetTestcaseExpectativaTYPE>) => {
            console.log('[ReducerRelatorios] Acionado controlador relatorios.setTestcaseExpectativa! \n');
            let {index, valor} = action.payload;
            valor = (valor === null || valor === undefined) ? "" : valor;
            if (state.value) state.value.evidencias[index].comentario = valor;
            logRelatorio(state.value);
        },
        setTestcaseResultado: (state, action: PayloadAction<SetTestcaseResultadoTYPE>) => {
            console.log('[ReducerRelatorios] Acionado controlador relatorios.setTestcaseResultado! \n');
            const {index, valor} = action.payload;
            if (state.value) state.value.evidencias[index].resultado = valor;
            logRelatorio(state.value);
        },
        setTestcaseRevisor: (state, action: PayloadAction<SetTestcaseRevisorTYPE>) => {
            console.log('[ReducerRelatorios] Acionado controlador relatorios.setTestcaseRevisor! \n');
            let {index, valor} = action.payload;
            valor = (valor === null || valor === undefined) ? "" : valor;
            if (state.value) state.value.evidencias[index].revisor = valor;
            logRelatorio(state.value);
        },
        setTestcaseLock: (state, action: PayloadAction<number[]>) => {
            console.log('[ReducerRelatorios] Acionado controlador relatorios.setTestcaseLock! \n');
            action.payload.map((evId) => {
                if (state.value && state.value.evidencias && state.value.evidencias.length > 0) {
                    const index = state.value.evidencias.findIndex((ev) => ev.id === evId);
                    console.log(`[ReducerRelatorios]: Travando evidência[${index}] ID ${evId}.`)
                    state.value.evidencias[index].lock = true;
                }
            });
            logRelatorio(state.value);
        },
    },
});

function logRelatorio(body: RelatorioHistoricoDTO | null) {
    console.log('[ReducerRelatorios] Payload: ' + JSON.stringify(body));
}

export default relatorios.reducer;
export const { addRelatorio, removeRelatorio, setTestcaseExpectativa, setTestcaseResultado, setTestcaseRevisor, setTestcaseLock } = relatorios.actions;