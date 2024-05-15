import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RelatorioHistoricoDTO } from '../../data/RelatorioHistoricoDTO';
import { DetStatusTYPE } from '../../pages/RevisarRelatorio';
import { EvidenciaInfoDTO, checkEvidenciaPronta } from '../../data/EvidenciaInfoDTO';

//Valores iniciais do recuder
const initialState = { 
    value: null,
    idsLocked: [],
} as ReducerRevisaoProps;

//Interface das propriedades deste reducer
export interface ReducerRevisaoProps {
    //value: RelatorioHistoricoDTO[],
    value: RelatorioHistoricoDTO | null,
    idsLocked: number[],
}

//Interface do acionador relatorios.setTestcaseExpectativa
export interface SetTestcaseExpectativaTYPE {
    index: number,
    valor: string,
}

//Interface do acionador relatorios.setTestcaseResultado
export interface SetTestcaseResultadoTYPE {
    index: number,
    revisor: string,
    resultado: DetStatusTYPE,
}

const relatorios = createSlice({
    name: 'relatorios',
    initialState,
    reducers: {
        addRevisao: (state, action: PayloadAction<RelatorioHistoricoDTO>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.addRelatorio! \n');
            state.value = action.payload;
            state.idsLocked = state.value.evidencias.filter((item) => checkEvidenciaPronta(item))
                .map((item) => item.id);
            logRevisao(state);
        },
        removeRevisao: (state) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.removeRelatorio! \n');
            state.value = null;
            state.idsLocked = [];
            logRevisao(state);
        },
        setTestcaseExpectativa: (state, action: PayloadAction<SetTestcaseExpectativaTYPE>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseExpectativa! \n');
            let {index, valor} = action.payload;
            valor = (valor === null || valor === undefined) ? "" : valor;
            if (state.value) state.value.evidencias[index].comentario = valor;
            logRevisao(state);
        },
        setTestcaseResultado: (state, action: PayloadAction<SetTestcaseResultadoTYPE>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseResultado! \n');
            const {index, resultado, revisor} = action.payload;
            console.log(`[ReducerRevisao] Atualizando revisão da evidência Nº${index}` + '\n'
                + `Resultado: ${resultado}  (Revisor: ${revisor})`
            );
            if (state.value) {
                state.value.evidencias[index].resultado = resultado;
                state.value.evidencias[index].revisor = revisor;
            }
            logRevisao(state);
        },
        setTestcaseLock: (state, action: PayloadAction<number[]>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseLock! \n');
            state.idsLocked = action.payload.filter((evId) => {
                if (state.value && state.value.evidencias && state.value.evidencias.length > 0) {
                    const index = state.value.evidencias.findIndex((ev) => ev.id === evId);
                    console.log(`[ReducerRevisao]: Travando evidência[${index}] ID ${evId}.`)
                    return index !== -1;
                }
                return false;
            });
            logRevisao(state);
        },
    },
});

function logRevisao(state: ReducerRevisaoProps) {
    if(!state.value) {
        console.log('[ReducerRevisao] Relatório: null');
        return;
    }
    console.log('[ReducerRevisao] Relatório: \n' 
        + ` - Projeto: ${state.value.idProjeto} ${state.value.nomeProjeto}` + '\n'
        + ` - Atividade: ${state.value.nomeAtividade}` + '\n'
        + ` - Configuração: ${state.value.configuracao}` + '\n'
        + ` - IdLockeds: ${state.idsLocked.join(", ")}` + '\n'
        + ` - Evidências: ` + '\n' 
        + state.value.evidencias.map((ev, index) => logEvidencias(ev, index))
    );
}

function logEvidencias(evidencia: EvidenciaInfoDTO, index: number): string {
    return ` \t - [${index}] ------------------------------` + '\n'
        +  ` \t - Revisor: ${evidencia.revisor}` + '\n'
        +  ` \t - Resultado: ${evidencia.resultado}` + '\n'
        +  ` \t - Comentário: ${evidencia.comentario}` + '\n'
}

export default relatorios.reducer;
export const { addRevisao, removeRevisao, setTestcaseExpectativa, setTestcaseResultado, setTestcaseLock } = relatorios.actions;