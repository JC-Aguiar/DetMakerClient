import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RelatorioHistoricoDTO } from '../../data/RelatorioHistoricoDTO';
import { DetStatusTYPE } from '../../pages/RevisarRelatorio';
import { EvidenciaInfoDTO } from '../../data/EvidenciaInfoDTO';

//Valores iniciais do recuder
const initialState = { 
    value: null,
} as ReducerRevisaoProps;

//Interface das propriedades deste reducer
export interface ReducerRevisaoProps {
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
        addRevisao: (state, action: PayloadAction<ReducerRevisaoProps>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.addRelatorio! \n');
            state.value = action.payload.value;
            logRelatorio(state.value);
        },
        removeRevisao: (state) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.removeRelatorio! \n');
            state.value = null;
            logRelatorio(state.value);
        },
        setTestcaseExpectativa: (state, action: PayloadAction<SetTestcaseExpectativaTYPE>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseExpectativa! \n');
            let {index, valor} = action.payload;
            valor = (valor === null || valor === undefined) ? "" : valor;
            if (state.value) state.value.evidencias[index].comentario = valor;
            logRelatorio(state.value);
        },
        setTestcaseResultado: (state, action: PayloadAction<SetTestcaseResultadoTYPE>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseResultado! \n');
            const {index, valor} = action.payload;
            if (state.value) state.value.evidencias[index].resultado = valor;
            logRelatorio(state.value);
        },
        setTestcaseRevisor: (state, action: PayloadAction<SetTestcaseRevisorTYPE>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseRevisor! \n');
            let {index, valor} = action.payload;
            valor = (valor === null || valor === undefined) ? "" : valor;
            if (state.value) state.value.evidencias[index].revisor = valor;
            logRelatorio(state.value);
        },
        setTestcaseLock: (state, action: PayloadAction<number[]>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseLock! \n');
            action.payload.map((evId) => {
                if (state.value && state.value.evidencias && state.value.evidencias.length > 0) {
                    const index = state.value.evidencias.findIndex((ev) => ev.id === evId);
                    console.log(`[ReducerRevisao]: Travando evidência[${index}] ID ${evId}.`)
                    state.value.evidencias[index].lock = true;
                }
            });
            logRelatorio(state.value);
        },
    },
});

function logRelatorio(body: RelatorioHistoricoDTO | null) {
    if(!body) {
        console.log('[ReducerRevisao] Relatório: null');
        return;
    }
    console.log('[ReducerRevisao] Relatório: \n' 
        + ` - Projeto: ${body.idProjeto} ${body.nomeProjeto}` + '\n'
        + ` - Atividade: ${body.nomeAtividade}` + '\n'
        + ` - Configuração: ${body.configuracao}` + '\n'
        + ` - Evidências: ${logEvidencias(body.evidencias)}`
    );
}

function logEvidencias(evidencias: EvidenciaInfoDTO[]): string {
    return evidencias.map(ev => console.log(
        + ` \t - Revisor: ${ev.revisor}` + '\n'
        + ` \t - Comentário: ${ev.comentario}` + '\n'
        + ` \t - Pronto: ${ev.lock ? "Sim" : "Não"}`
    )).join('\n');
}

export default relatorios.reducer;
export const { addRevisao, removeRevisao, setTestcaseExpectativa, setTestcaseResultado, setTestcaseRevisor, setTestcaseLock } = relatorios.actions;