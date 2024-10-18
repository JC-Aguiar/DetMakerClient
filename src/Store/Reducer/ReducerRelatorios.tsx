import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RelatorioResumoDTO } from '../../data/RelatorioResumoDTO';
import { Page } from '../../data/Page';

const initialState = { 
    catalogo: Page.empty<RelatorioResumoDTO>(),
    loading: false,
} as ReducerRelatoriosProps;

//Interface para definir o tipo de objeto do reducer
interface ReducerRelatoriosProps {
    catalogo: Page<RelatorioResumoDTO>,
    loading: boolean,
}

//Controlador reducer para os relatórios
const catalogoRelatorios = createSlice({
    name: 'catalogoRelatorios',
    initialState,
    reducers: {
        setRelatorios: (state, action: PayloadAction<Page<RelatorioResumoDTO>>) => {
            if (!Array.isArray(action.payload?.content)) {
                console.log('[ReducerRelatorios] Erro: payload inválido, pois não é um array.');
                return { ...state };
            }
            console.log('[ReducerRelatorios]: Acionado controlador catalogoRelatorios.setRelatorios!');
            state.catalogo = action.payload;
            //logRelatorios(state.catalogo);
        },
        //addRelatorio: (state, action: PayloadAction<RelatorioResumoDTO>) => {
        //    console.log('[ReducerRelatorios]: Acionado controlador catalogoRelatorios.addRelatorio!');
        //    state.catalogo.push(action.payload);
        //    //logRelatorios(state.catalogo);
        //},
        loadingRelatorios: (state, action: PayloadAction<boolean>) => {
            console.log('[ReducerRelatorios]: Acionado controlador catalogoRelatorios.loadingRelatorios!');
            state.loading = action.payload;
            if (state.loading) state.catalogo = Page.empty<RelatorioResumoDTO>();//[];
            console.log(`[ReducerRelatorios]: Catalogo de Relatorios ${state.loading ? 'está carregando..' : 'pronto'}.`);
        },
    },
});

//Exibe informações da item-pilah pelos controladores
function logRelatorios(clientes: RelatorioResumoDTO[]) {
    console.log(`[ReducerRelatorios] Catálogo de Relatorios em memória:` + '\n' + clientes.map(
        (item) => ` - ID: ${item.id}` + '\n' 
                + ` - Projeto: ${item.idProjeto} - ${item.nomeProjeto}`
                + ` - Atividade: ${item.nomeAtividade}`
                + ` - Quantidade de Evidencias: ${item.evidencias}`
                + ` - Evidências Revisadas: ${item.revisados}`
                + ` - Erro: ${item.erro}`
    ));
}

export default catalogoRelatorios.reducer;
export const { setRelatorios, loadingRelatorios } = catalogoRelatorios.actions;