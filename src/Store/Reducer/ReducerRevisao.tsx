import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RelatorioHistoricoDTO } from '../../data/RelatorioHistoricoDTO';
import { DetStatusTYPE } from '../../pages/RevisarRelatorio';
import { EvidenciaInfoDTO } from '../../data/EvidenciaInfoDTO';
import { ResumoEvidenciasRevisadasDTO } from '../../data/AxiosRequest';
import { EvidenciaRevisadaDTO } from '../../data/EvidenciaRevisadaDTO';

//Valores iniciais do recuder
const initialState = { 
    relatorio: null,
    idsLocked: [],
} as ReducerRevisaoProps;

//Interface das propriedades deste reducer
export interface ReducerRevisaoProps {
    //value: RelatorioHistoricoDTO[],
    relatorio: RelatorioHistoricoDTO | null,
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
            state.relatorio = action.payload;
            state.idsLocked = state.relatorio.evidencias
                .filter(EvidenciaInfoDTO.isEvidenciaPronta)
                .map((item) => item.id);
            logRevisao(state);
        },
        removeRevisao: (state) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.removeRelatorio! \n');
            state.relatorio = null;
            state.idsLocked = [];
            logRevisao(state);
        },
        setDadosRevisao: (state, action: PayloadAction<EvidenciaRevisadaDTO[]>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setDadosRevisao! \n');
            state.relatorio?.evidencias.map(item => {
                const dadosRevisao = action.payload.find(dto => dto.evidenciaId === item.id);
                if (!dadosRevisao) return item;
                item.resultado = dadosRevisao.resultado;
                item.revisor = dadosRevisao.resivor;
                item.dataRevisao = dadosRevisao.dataRevisao;
                item.comentario = dadosRevisao.comentario;
                return item;
            });
        },
        setTestcaseExpectativa: (state, action: PayloadAction<SetTestcaseExpectativaTYPE>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseExpectativa! \n');
            let {index, valor} = action.payload;
            valor = (valor === null || valor === undefined) ? "" : valor;
            if (state.relatorio) state.relatorio.evidencias[index].comentario = valor;
            logRevisao(state);
        },
        setTestcaseResultado: (state, action: PayloadAction<SetTestcaseResultadoTYPE>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseResultado! \n');
            const {index, resultado, revisor} = action.payload;
            console.log(`[ReducerRevisao] Atualizando revisão da evidência Nº${index}` + '\n'
                + `Resultado: ${resultado}  (Revisor: ${revisor})`
            );
            if (state.relatorio) {
                state.relatorio.evidencias[index].resultado = resultado;
                state.relatorio.evidencias[index].revisor = revisor;
            }
            logRevisao(state);
        },
        setTestcaseLock: (state, action: PayloadAction<number[]>) => {
            console.log('[ReducerRevisao] Acionado controlador relatorios.setTestcaseLock! \n');
            state.idsLocked = action.payload.filter((evId) => {
                if (state.relatorio && state.relatorio.evidencias && state.relatorio.evidencias.length > 0) {
                    const index = state.relatorio.evidencias.findIndex((ev) => ev.id === evId);
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
    if(!state.relatorio) {
        console.log('[ReducerRevisao] Relatório: null');
        return;
    }
    console.log('[ReducerRevisao] Relatório: \n' 
        + ` - Projeto: ${state.relatorio.idProjeto} ${state.relatorio.nomeProjeto}` + '\n'
        + ` - Atividade: ${state.relatorio.nomeAtividade}` + '\n'
        + ` - Configuração: ${state.relatorio.inconformidades}` + '\n'
        + ` - IdLockeds: ${state.idsLocked.join(", ")}` + '\n'
        + ` - Evidências: ` + '\n' 
        + state.relatorio.evidencias.map((ev, index) => logEvidencias(ev, index))
    );
}

function logEvidencias(evidencia: EvidenciaInfoDTO, index: number): string {
    return ` \t - [${index}] ------------------------------` + '\n'
        +  ` \t - Revisor: ${evidencia.revisor}` + '\n'
        +  ` \t - Resultado: ${evidencia.resultado}` + '\n'
        +  ` \t - Comentário: ${evidencia.comentario}` + '\n'
}

export default relatorios.reducer;
export const { addRevisao, removeRevisao, setDadosRevisao } = relatorios.actions;